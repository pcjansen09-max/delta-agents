/**
 * Moneybird OAuth + REST API client.
 * Tokens worden encrypted at rest opgeslagen (zie lib/crypto.ts).
 *
 * Docs: https://developer.moneybird.com
 */

import { getAdminClient } from "../supabase-admin";
import { encrypt, decrypt } from "../crypto";
import { audit } from "../audit";
import type {
  MoneybirdAdministration,
  MoneybirdContact,
  MoneybirdProduct,
  MoneybirdSalesInvoice,
  MoneybirdInvoiceLine,
  MoneybirdTokenResponse,
} from "@/types/moneybird";

const MB_API_BASE = "https://moneybird.com/api/v2";
const MB_OAUTH_BASE = "https://moneybird.com/oauth";

// ─────────────────────────────────────────────────────────────────
// OAuth helpers
// ─────────────────────────────────────────────────────────────────

export function buildAuthorizationUrl(state: string): string {
  const clientId = process.env.MONEYBIRD_CLIENT_ID;
  if (!clientId) throw new Error("MONEYBIRD_CLIENT_ID ontbreekt");

  const url = new URL(`${MB_OAUTH_BASE}/authorize`);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri());
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "sales_invoices documents settings");
  url.searchParams.set("state", state);
  return url.toString();
}

function redirectUri(): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://deltaagents.nl";
  return `${base}/api/moneybird/callback`;
}

export async function exchangeCodeForToken(code: string): Promise<MoneybirdTokenResponse> {
  const clientId = process.env.MONEYBIRD_CLIENT_ID;
  const clientSecret = process.env.MONEYBIRD_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("MONEYBIRD client credentials ontbreken");
  }

  const res = await fetch(`${MB_OAUTH_BASE}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri(),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Moneybird token exchange faalde (${res.status}): ${body.slice(0, 200)}`);
  }

  return (await res.json()) as MoneybirdTokenResponse;
}

export async function refreshToken(currentRefreshToken: string): Promise<MoneybirdTokenResponse> {
  const clientId = process.env.MONEYBIRD_CLIENT_ID;
  const clientSecret = process.env.MONEYBIRD_CLIENT_SECRET;

  const res = await fetch(`${MB_OAUTH_BASE}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId!,
      client_secret: clientSecret!,
      refresh_token: currentRefreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    throw new Error(`Moneybird token refresh faalde (${res.status})`);
  }

  return (await res.json()) as MoneybirdTokenResponse;
}

// ─────────────────────────────────────────────────────────────────
// Token storage (encrypted)
// ─────────────────────────────────────────────────────────────────

export async function saveToken(input: {
  companyId: string;
  token: MoneybirdTokenResponse;
  administrationId: string;
}): Promise<void> {
  const admin = getAdminClient();
  const expiresAt = new Date(Date.now() + input.token.expires_in * 1000).toISOString();

  const { error } = await admin
    .from("deltaagents_oauth_tokens")
    .upsert({
      company_id: input.companyId,
      provider: "moneybird",
      access_token: encrypt(input.token.access_token),
      refresh_token: encrypt(input.token.refresh_token),
      expires_at: expiresAt,
      scope: input.token.scope,
      administration_id: input.administrationId,
    }, { onConflict: "company_id,provider" });

  if (error) throw new Error(`Token opslaan faalde: ${error.message}`);

  await audit({
    companyId: input.companyId,
    actorType: "system",
    action: "oauth.connected",
    resourceType: "oauth_token",
    payload: { provider: "moneybird", administration_id: input.administrationId },
  });
}

async function getValidAccessToken(companyId: string): Promise<{ token: string; administrationId: string }> {
  const admin = getAdminClient();
  const { data } = await admin
    .from("deltaagents_oauth_tokens")
    .select("access_token, refresh_token, expires_at, administration_id")
    .eq("company_id", companyId)
    .eq("provider", "moneybird")
    .single();

  if (!data) throw new Error("Moneybird is nog niet gekoppeld voor dit bedrijf");

  // Refresh als <5 min over
  const expiresAt = new Date(data.expires_at);
  const willExpireSoon = expiresAt.getTime() - Date.now() < 5 * 60 * 1000;

  if (willExpireSoon && data.refresh_token) {
    const refreshed = await refreshToken(decrypt(data.refresh_token));
    await admin
      .from("deltaagents_oauth_tokens")
      .update({
        access_token: encrypt(refreshed.access_token),
        refresh_token: encrypt(refreshed.refresh_token),
        expires_at: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
      })
      .eq("company_id", companyId)
      .eq("provider", "moneybird");

    await audit({
      companyId,
      actorType: "system",
      action: "oauth.refreshed",
      resourceType: "oauth_token",
      payload: { provider: "moneybird" },
    });

    return { token: refreshed.access_token, administrationId: data.administration_id };
  }

  return { token: decrypt(data.access_token), administrationId: data.administration_id };
}

// ─────────────────────────────────────────────────────────────────
// REST API helpers
// ─────────────────────────────────────────────────────────────────

async function mbFetch<T>(
  companyId: string,
  path: string,
  init?: RequestInit
): Promise<T> {
  const { token, administrationId } = await getValidAccessToken(companyId);
  const url = `${MB_API_BASE}/${administrationId}${path}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Moneybird ${init?.method ?? "GET"} ${path} faalde (${res.status}): ${body.slice(0, 200)}`);
  }

  return (await res.json()) as T;
}

export async function listAdministrations(accessToken: string): Promise<MoneybirdAdministration[]> {
  const res = await fetch(`${MB_API_BASE}/administrations`, {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Kan administraties niet ophalen (${res.status})`);
  return (await res.json()) as MoneybirdAdministration[];
}

export async function listContacts(companyId: string): Promise<MoneybirdContact[]> {
  return mbFetch<MoneybirdContact[]>(companyId, "/contacts.json?per_page=100");
}

export async function listProducts(companyId: string): Promise<MoneybirdProduct[]> {
  return mbFetch<MoneybirdProduct[]>(companyId, "/products.json?per_page=100");
}

export async function createSalesInvoice(
  companyId: string,
  payload: { contact_id: string; details: MoneybirdInvoiceLine[] }
): Promise<MoneybirdSalesInvoice> {
  return mbFetch<MoneybirdSalesInvoice>(companyId, "/sales_invoices.json", {
    method: "POST",
    body: JSON.stringify({ sales_invoice: payload }),
  });
}

export async function sendSalesInvoice(
  companyId: string,
  invoiceId: string,
  via: "email" | "manual" = "email"
): Promise<MoneybirdSalesInvoice> {
  return mbFetch<MoneybirdSalesInvoice>(
    companyId,
    `/sales_invoices/${invoiceId}/send_invoice.json`,
    {
      method: "PATCH",
      body: JSON.stringify({
        sales_invoice_sending: { delivery_method: via, sending_scheduled: false },
      }),
    }
  );
}

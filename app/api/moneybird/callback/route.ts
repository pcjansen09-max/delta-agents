/**
 * Moneybird OAuth callback.
 * Verwerkt: code exchange → administraties ophalen → token opslaan (encrypted).
 *
 * Bij meerdere administraties: voor MVP nemen we de eerste. Volgende sessie:
 * UI om administratie te kiezen.
 */

import { NextResponse } from "next/server";
import {
  exchangeCodeForToken,
  listAdministrations,
  saveToken,
} from "@/lib/moneybird/client";
import { auditError } from "@/lib/audit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  const errorParam = url.searchParams.get("error");

  if (errorParam) {
    return redirectError(request, `oauth_${errorParam}`);
  }

  if (!code || !returnedState) {
    return redirectError(request, "missing_code_or_state");
  }

  // Validate state cookie
  const cookieState = request.headers
    .get("cookie")
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("mb_oauth_state="))
    ?.split("=")[1];

  if (!cookieState || cookieState !== returnedState) {
    return redirectError(request, "state_mismatch");
  }

  const [, companyId] = returnedState.split(".");
  if (!companyId) {
    return redirectError(request, "invalid_state_format");
  }

  // Exchange code for token
  let token;
  try {
    token = await exchangeCodeForToken(code);
  } catch (err) {
    await auditError({
      companyId,
      action: "oauth.failed",
      error: err,
      resourceType: "moneybird",
    });
    return redirectError(request, "token_exchange_failed");
  }

  // List administraties — kies eerste
  let administrations;
  try {
    administrations = await listAdministrations(token.access_token);
  } catch (err) {
    await auditError({
      companyId,
      action: "oauth.failed",
      error: err,
      resourceType: "moneybird",
    });
    return redirectError(request, "admin_list_failed");
  }

  if (administrations.length === 0) {
    return redirectError(request, "no_administrations");
  }

  // Voor MVP: pak de eerste. Volgende sessie: laat user kiezen.
  const administration = administrations[0];

  try {
    await saveToken({
      companyId,
      token,
      administrationId: administration.id,
    });
  } catch (err) {
    await auditError({
      companyId,
      action: "oauth.failed",
      error: err,
      resourceType: "moneybird",
    });
    return redirectError(request, "save_failed");
  }

  // Success — clear cookie + redirect naar dashboard
  const successUrl = new URL("/dashboard?moneybird=connected", request.url);
  const res = NextResponse.redirect(successUrl);
  res.cookies.delete("mb_oauth_state");
  return res;
}

function redirectError(request: Request, code: string): NextResponse {
  const url = new URL("/dashboard?moneybird_error=" + encodeURIComponent(code), request.url);
  return NextResponse.redirect(url);
}

/**
 * Moneybird OAuth — start de authorization flow.
 * User wordt redirected naar Moneybird, kiest administratie, autoriseert,
 * en komt terug bij /api/moneybird/callback.
 *
 * State token: random + bevat company_id, gevalideerd in callback om
 * CSRF + cross-company misuse te voorkomen.
 */

import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { createClient } from "@/lib/supabase-server";
import { buildAuthorizationUrl } from "@/lib/moneybird/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Vind company by owner_email
  const { data: company } = await supabase
    .from("deltaagents_companies")
    .select("id")
    .eq("owner_email", user.email)
    .single();

  if (!company) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // State: random nonce + company_id, gescheiden door punt
  const nonce = randomBytes(16).toString("hex");
  const state = `${nonce}.${company.id}`;

  const authUrl = buildAuthorizationUrl(state);

  // Sla state op in een cookie voor verificatie in callback
  const res = NextResponse.redirect(authUrl);
  res.cookies.set("mb_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/api/moneybird",
    maxAge: 600, // 10 min
  });
  return res;
}

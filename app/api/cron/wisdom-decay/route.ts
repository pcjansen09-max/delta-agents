/**
 * Cron: wisdom rule decay.
 * Runs dagelijks via Vercel cron. Roept de SQL helper aan die alle rules
 * decayed die >90 dagen niet gebruikt zijn (confidence × 0.9).
 *
 * Vercel cron protectie: header x-vercel-cron-signature wordt automatisch
 * gevalideerd door Vercel. Extra defensieve check via CRON_SECRET als
 * fallback voor lokaal testen.
 *
 * Configureer in vercel.json:
 *   { "crons": [{ "path": "/api/cron/wisdom-decay", "schedule": "0 3 * * *" }] }
 */

import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  // Vercel cron header check
  const authHeader = request.headers.get("authorization");
  const expected = process.env.CRON_SECRET;
  if (expected && authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getAdminClient();

  const { data, error } = await admin.rpc("deltaagents_decay_unused_rules", {
    p_days_threshold: 90,
    p_decay_factor: 0.9,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    rules_decayed: data ?? 0,
    timestamp: new Date().toISOString(),
  });
}

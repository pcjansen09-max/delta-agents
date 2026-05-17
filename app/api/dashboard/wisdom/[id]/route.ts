/**
 * Wisdom Rules — single endpoint.
 * PATCH  → update (rule_text, category, confidence, active, expires_at)
 * DELETE → remove
 *
 * Eigenaarschap verifieerd voor elke action via session.company.id.
 */

import { NextResponse } from "next/server";
import { requireSession, AuthError } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase-admin";
import { updateRule, deleteRule } from "@/lib/wisdom/store";
import type { WisdomCategory } from "@/types/database";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function verifyOwnership(ruleId: string, companyId: string): Promise<boolean> {
  const admin = getAdminClient();
  const { data } = await admin
    .from("deltaagents_wisdom_rules")
    .select("company_id")
    .eq("id", ruleId)
    .single();
  return data?.company_id === companyId;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession();
    const { id } = await params;

    if (!(await verifyOwnership(id, session.company.id))) {
      return NextResponse.json({ error: "Rule niet gevonden" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const patch: Parameters<typeof updateRule>[1] = {};

    if (typeof body.rule_text === "string") {
      const t = body.rule_text.trim();
      if (t.length === 0 || t.length > 500) {
        return NextResponse.json({ error: "rule_text moet 1-500 tekens zijn" }, { status: 400 });
      }
      patch.rule_text = t;
    }
    if (typeof body.category === "string") patch.category = body.category as WisdomCategory;
    if (typeof body.confidence === "number") {
      if (body.confidence < 0 || body.confidence > 1) {
        return NextResponse.json({ error: "confidence moet 0-1 zijn" }, { status: 400 });
      }
      patch.confidence = body.confidence;
    }
    if (typeof body.active === "boolean") patch.active = body.active;
    if (body.expires_at === null || typeof body.expires_at === "string") {
      patch.expires_at = body.expires_at;
    }

    const updated = await updateRule(id, patch, session.email);
    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    const message = err instanceof Error ? err.message : "Onbekende fout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession();
    const { id } = await params;

    if (!(await verifyOwnership(id, session.company.id))) {
      return NextResponse.json({ error: "Rule niet gevonden" }, { status: 404 });
    }

    await deleteRule(id, session.email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    const message = err instanceof Error ? err.message : "Onbekende fout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

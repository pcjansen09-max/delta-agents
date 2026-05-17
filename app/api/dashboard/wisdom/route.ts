/**
 * Wisdom Rules CRUD — collection endpoint.
 * GET  → list (alle rules van session.company)
 * POST → create nieuwe rule
 */

import { NextResponse } from "next/server";
import { requireSession, AuthError } from "@/lib/auth";
import { listRules, createRule } from "@/lib/wisdom/store";
import type { WisdomCategory } from "@/types/database";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VALID_CATEGORIES: WisdomCategory[] = [
  "pricing", "customer", "communication", "workflow", "security", "general",
];

export async function GET() {
  try {
    const session = await requireSession();
    const rules = await listRules(session.company.id, { activeOnly: false });
    return NextResponse.json(rules);
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    return NextResponse.json({ error: "Onbekende fout" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const body = await request.json().catch(() => ({}));

    const ruleText = String(body?.rule_text ?? "").trim();
    if (!ruleText) {
      return NextResponse.json({ error: "rule_text is verplicht" }, { status: 400 });
    }
    if (ruleText.length > 500) {
      return NextResponse.json({ error: "rule_text mag max 500 tekens zijn" }, { status: 400 });
    }

    const category = VALID_CATEGORIES.includes(body?.category) ? body.category : "general";

    const rule = await createRule({
      companyId: session.company.id,
      ruleText,
      category,
      source: "user-correction",
      confidence: 1.0,
      actorId: session.email,
    });

    return NextResponse.json(rule, { status: 201 });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    const message = err instanceof Error ? err.message : "Onbekende fout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

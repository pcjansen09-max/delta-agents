import { NextResponse } from "next/server";
import { requireSession, AuthError } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase-admin";
import { audit } from "@/lib/audit";
import type { UserRole } from "@/types/database";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VALID_ROLES: UserRole[] = ["directie", "voorman", "monteur"];

/** Normalize NL phone: "06 12 34 56 78" → "31612345678" */
function normalizePhone(input: string): string | null {
  const digits = input.replace(/[^\d+]/g, "").replace(/^\+/, "");
  if (digits.startsWith("31") && digits.length === 11) return digits;
  if (digits.startsWith("0") && digits.length === 10) return "31" + digits.slice(1);
  if (digits.length === 9) return "31" + digits;
  return null;
}

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const body = await request.json().catch(() => ({}));

    const name = String(body?.name ?? "").trim();
    const phoneRaw = String(body?.phone ?? "").trim();
    const role = body?.role as UserRole;

    if (!name) return NextResponse.json({ error: "naam is verplicht" }, { status: 400 });
    if (!VALID_ROLES.includes(role)) return NextResponse.json({ error: "ongeldige rol" }, { status: 400 });

    const phone = normalizePhone(phoneRaw);
    if (!phone) return NextResponse.json({ error: "ongeldig 06-nummer (verwacht NL formaat)" }, { status: 400 });

    const admin = getAdminClient();
    const { data, error } = await admin
      .from("deltaagents_users")
      .insert({
        company_id: session.company.id,
        name,
        phone,
        role,
      })
      .select()
      .single();

    if (error) {
      // 23505 = unique violation (phone bestaat al voor deze company)
      if (error.code === "23505") {
        return NextResponse.json({ error: "Dit 06-nummer is al toegevoegd" }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await audit({
      companyId: session.company.id,
      actorType: "user",
      actorId: session.email,
      action: "auth.invite.sent",
      resourceType: "user",
      resourceId: data.id,
      payload: { role },
    });

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    const message = err instanceof Error ? err.message : "Onbekende fout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

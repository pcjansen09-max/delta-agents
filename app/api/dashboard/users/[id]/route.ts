import { NextResponse } from "next/server";
import { requireSession, AuthError } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase-admin";
import { audit } from "@/lib/audit";
import type { UserRole } from "@/types/database";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VALID_ROLES: UserRole[] = ["directie", "voorman", "monteur"];

async function verifyOwnership(userId: string, companyId: string): Promise<boolean> {
  const admin = getAdminClient();
  const { data } = await admin
    .from("deltaagents_users")
    .select("company_id")
    .eq("id", userId)
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
      return NextResponse.json({ error: "Medewerker niet gevonden" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const patch: Record<string, unknown> = {};

    if (typeof body.name === "string") patch.name = body.name.trim();
    if (typeof body.role === "string" && VALID_ROLES.includes(body.role as UserRole)) {
      patch.role = body.role;
    }
    if (typeof body.active === "boolean") patch.active = body.active;

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "Geen wijzigingen" }, { status: 400 });
    }

    const admin = getAdminClient();
    const { data, error } = await admin
      .from("deltaagents_users")
      .update(patch)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    return NextResponse.json({ error: "Onbekende fout" }, { status: 500 });
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
      return NextResponse.json({ error: "Medewerker niet gevonden" }, { status: 404 });
    }

    const admin = getAdminClient();
    await admin.from("deltaagents_users").delete().eq("id", id);

    await audit({
      companyId: session.company.id,
      actorType: "user",
      actorId: session.email,
      action: "auth.logout",
      resourceType: "user",
      resourceId: id,
      payload: { reason: "deleted_by_admin" },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    return NextResponse.json({ error: "Onbekende fout" }, { status: 500 });
  }
}

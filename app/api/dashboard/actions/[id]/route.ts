/**
 * Dashboard approval API — POST /api/dashboard/actions/[id]
 * Body: { decision: "approve" | "reject" }
 *
 * Manual approval vanuit UI (alternatief voor WhatsApp "JA").
 * Vereist een ingelogde sessie + company-eigenaarschap van de action.
 */

import { NextResponse } from "next/server";
import { requireSession, AuthError } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase-admin";
import { executeApprovedAction } from "@/lib/agent/executor";
import { audit } from "@/lib/audit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let session;
  try {
    session = await requireSession();
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    throw err;
  }

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as { decision?: string };
  const decision = body.decision;

  if (decision !== "approve" && decision !== "reject") {
    return NextResponse.json({ error: "decision moet 'approve' of 'reject' zijn" }, { status: 400 });
  }

  const admin = getAdminClient();

  // Verifieer dat de action toebehoort aan deze company
  const { data: action } = await admin
    .from("deltaagents_actions")
    .select("*")
    .eq("id", id)
    .eq("company_id", session.company.id)
    .single();

  if (!action) {
    return NextResponse.json({ error: "Action niet gevonden" }, { status: 404 });
  }
  if (action.status !== "pending") {
    return NextResponse.json({ error: `Action is al ${action.status}` }, { status: 409 });
  }

  if (decision === "reject") {
    const { data: updated } = await admin
      .from("deltaagents_actions")
      .update({ status: "rejected" })
      .eq("id", id)
      .select()
      .single();
    await audit({
      companyId: session.company.id,
      actorType: "user",
      actorId: session.email,
      action: "action.rejected",
      resourceType: "action",
      resourceId: id,
      payload: { via: "dashboard" },
    });
    return NextResponse.json(updated);
  }

  // approve → mark approved, then execute
  await admin
    .from("deltaagents_actions")
    .update({ status: "approved" })
    .eq("id", id);

  await audit({
    companyId: session.company.id,
    actorType: "user",
    actorId: session.email,
    action: "action.approved",
    resourceType: "action",
    resourceId: id,
    payload: { via: "dashboard" },
  });

  const result = await executeApprovedAction(id);

  const { data: final } = await admin
    .from("deltaagents_actions")
    .select("*")
    .eq("id", id)
    .single();

  if (!result.ok) {
    return NextResponse.json({ ...final, error: result.error }, { status: 502 });
  }
  return NextResponse.json(final);
}

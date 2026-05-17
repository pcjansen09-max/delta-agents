/**
 * Settings — update bedrijfsinfo + persona velden + agent_config.
 * Single PATCH endpoint dat companies + agent_config tegelijk bijwerkt.
 */

import { NextResponse } from "next/server";
import { requireSession, AuthError } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase-admin";
import { audit } from "@/lib/audit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VALID_REPLY_STYLES = ["kort_bondig", "standaard", "uitgebreid", "informeel"] as const;

export async function PATCH(request: Request) {
  try {
    const session = await requireSession();
    const body = await request.json().catch(() => ({}));
    const admin = getAdminClient();

    // Build patches
    const companyPatch: Record<string, unknown> = {};
    const configPatch: Record<string, unknown> = {};

    if (typeof body.company_name === "string") {
      companyPatch.company_name = body.company_name.trim();
    }
    if (typeof body.industry === "string") {
      companyPatch.industry = body.industry.trim();
    }
    if (typeof body.persona_voice === "string") {
      companyPatch.persona_voice = body.persona_voice.trim().slice(0, 500) || null;
    }
    if (typeof body.persona_avoid === "string") {
      companyPatch.persona_avoid = body.persona_avoid.trim().slice(0, 500) || null;
    }
    if (typeof body.reply_style === "string" && (VALID_REPLY_STYLES as readonly string[]).includes(body.reply_style)) {
      companyPatch.reply_style = body.reply_style;
    }

    if (typeof body.bedrijfsinfo === "string") {
      configPatch.bedrijfsinfo = body.bedrijfsinfo.slice(0, 3000);
    }
    if (typeof body.werkwijze === "string") {
      configPatch.werkwijze = body.werkwijze.slice(0, 3000);
    }

    if (Object.keys(companyPatch).length === 0 && Object.keys(configPatch).length === 0) {
      return NextResponse.json({ error: "Geen wijzigingen om op te slaan" }, { status: 400 });
    }

    // Updates parallel
    const ops: Promise<unknown>[] = [];
    if (Object.keys(companyPatch).length > 0) {
      ops.push(
        admin
          .from("deltaagents_companies")
          .update(companyPatch)
          .eq("id", session.company.id)
      );
    }
    if (Object.keys(configPatch).length > 0) {
      ops.push(
        admin
          .from("deltaagents_agent_config")
          .upsert(
            { company_id: session.company.id, agent_type: "digital_employee", ...configPatch },
            { onConflict: "company_id" }
          )
      );
    }
    await Promise.all(ops);

    await audit({
      companyId: session.company.id,
      actorType: "user",
      actorId: session.email,
      action: "wisdom.rule.updated",
      resourceType: "settings",
      payload: {
        fields_changed: [...Object.keys(companyPatch), ...Object.keys(configPatch)],
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    const message = err instanceof Error ? err.message : "Onbekende fout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

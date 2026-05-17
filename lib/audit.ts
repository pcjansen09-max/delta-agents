/**
 * Audit logging — gestructureerd, multi-tenant veilig.
 * Vervangt eenvoudige activity.ts voor gevoelige acties.
 *
 * Schrijft naar `deltaagents_audit` tabel via service role (geen user session nodig
 * voor system-events zoals webhook handlers).
 *
 * Zie ARCHITECTURE.md §4.6.
 */

import { getAdminClient } from "./supabase-admin";
import type { AuditEntry } from "@/types/database";

type AuditInput = Omit<AuditEntry, "id" | "created_at">;

const KNOWN_ACTIONS = [
  // Agent
  "agent.run.started",
  "agent.run.completed",
  "agent.run.failed",
  "agent.action.proposed",
  "agent.tool.called",
  // Approval flow
  "action.approved",
  "action.rejected",
  "action.executed",
  "action.failed",
  // OAuth
  "oauth.connected",
  "oauth.refreshed",
  "oauth.revoked",
  "oauth.failed",
  // WhatsApp
  "wa.webhook.received",
  "wa.message.sent",
  "wa.message.failed",
  // Wisdom
  "wisdom.rule.added",
  "wisdom.rule.updated",
  "wisdom.rule.decayed",
  "wisdom.rule.deleted",
  "wisdom.conflict.detected",
  // Auth
  "auth.login",
  "auth.logout",
  "auth.invite.sent",
] as const;

export type AuditAction = (typeof KNOWN_ACTIONS)[number] | (string & {});

export async function audit(entry: {
  companyId: string;
  actorType: AuditEntry["actor_type"];
  actorId?: string;
  action: AuditAction;
  resourceType?: string;
  resourceId?: string;
  payload?: Record<string, unknown>;
}): Promise<void> {
  const admin = getAdminClient();

  const row: AuditInput = {
    company_id: entry.companyId,
    actor_type: entry.actorType,
    actor_id: entry.actorId ?? null,
    action: entry.action,
    resource_type: entry.resourceType ?? null,
    resource_id: entry.resourceId ?? null,
    payload: redactPII(entry.payload ?? {}),
  };

  const { error } = await admin.from("deltaagents_audit").insert(row);

  if (error) {
    // Audit failure mag nooit een primaire flow blokkeren, maar moet wel
    // zichtbaar zijn in de logs zodat we het kunnen onderzoeken.
    console.error("[audit] failed to log entry", { error, action: entry.action });
  }
}

/**
 * Redact bekende PII-velden uit audit payload.
 * We loggen wel STRUCTUUR (welke velden gewijzigd) maar niet inhoud van
 * gevoelige strings als email/phone/IBAN/etc.
 */
function redactPII(payload: Record<string, unknown>): Record<string, unknown> {
  const REDACT_KEYS = new Set([
    "email",
    "phone",
    "iban",
    "bsn",
    "password",
    "access_token",
    "refresh_token",
    "api_key",
    "client_secret",
  ]);

  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(payload)) {
    if (REDACT_KEYS.has(k.toLowerCase())) {
      out[k] = typeof v === "string" ? `[redacted:${v.length}chars]` : "[redacted]";
    } else if (v && typeof v === "object" && !Array.isArray(v)) {
      out[k] = redactPII(v as Record<string, unknown>);
    } else {
      out[k] = v;
    }
  }
  return out;
}

/** Convenience: log een fout zodat het in audit terechtkomt voor company-isolation. */
export async function auditError(params: {
  companyId: string;
  action: AuditAction;
  error: unknown;
  resourceType?: string;
  resourceId?: string;
}): Promise<void> {
  const err = params.error;
  await audit({
    companyId: params.companyId,
    actorType: "system",
    action: params.action,
    resourceType: params.resourceType,
    resourceId: params.resourceId,
    payload: {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error && err.stack ? err.stack.split("\n").slice(0, 5) : undefined,
    },
  });
}

/**
 * Wisdom Rules — CRUD operations.
 * Zie ARCHITECTURE.md §5.
 */

import { getAdminClient } from "../supabase-admin";
import { audit } from "../audit";
import { embedText } from "./embedding";
import type {
  WisdomRule,
  WisdomCategory,
  WisdomSource,
} from "@/types/database";

export interface CreateRuleInput {
  companyId: string;
  ruleText: string;
  category?: WisdomCategory;
  source?: WisdomSource;
  confidence?: number;
  scopeType?: string;
  scopeId?: string;
  expiresAt?: string;
  actorId?: string;       // user phone of "system"
}

export async function createRule(input: CreateRuleInput): Promise<WisdomRule> {
  const admin = getAdminClient();

  // Embed eerst — als embedding faalt willen we de rule niet opslaan
  // want dan wordt hij nooit retrieved.
  const embedding = await embedText(input.ruleText);

  const { data, error } = await admin
    .from("deltaagents_wisdom_rules")
    .insert({
      company_id: input.companyId,
      rule_text: input.ruleText,
      category: input.category ?? "general",
      source: input.source ?? "user-correction",
      confidence: input.confidence ?? 1.0,
      scope_type: input.scopeType ?? null,
      scope_id: input.scopeId ?? null,
      expires_at: input.expiresAt ?? null,
      embedding,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Wisdom rule kon niet worden opgeslagen: ${error?.message ?? "unknown"}`);
  }

  await audit({
    companyId: input.companyId,
    actorType: input.source === "system" ? "system" : "user",
    actorId: input.actorId,
    action: "wisdom.rule.added",
    resourceType: "wisdom_rule",
    resourceId: data.id,
    payload: {
      category: data.category,
      source: data.source,
      confidence: data.confidence,
      text_length: input.ruleText.length,
    },
  });

  return data as WisdomRule;
}

export async function updateRule(
  ruleId: string,
  patch: Partial<{
    rule_text: string;
    category: WisdomCategory;
    confidence: number;
    active: boolean;
    expires_at: string | null;
  }>,
  actorId?: string
): Promise<WisdomRule> {
  const admin = getAdminClient();

  // Bij wijziging van rule_text: opnieuw embedden
  let embedding: number[] | undefined;
  if (patch.rule_text) {
    embedding = await embedText(patch.rule_text);
  }

  const { data, error } = await admin
    .from("deltaagents_wisdom_rules")
    .update({ ...patch, ...(embedding ? { embedding } : {}) })
    .eq("id", ruleId)
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Wisdom rule kon niet worden bijgewerkt: ${error?.message ?? "unknown"}`);
  }

  await audit({
    companyId: data.company_id,
    actorType: "user",
    actorId,
    action: "wisdom.rule.updated",
    resourceType: "wisdom_rule",
    resourceId: ruleId,
    payload: { fields_changed: Object.keys(patch) },
  });

  return data as WisdomRule;
}

export async function deleteRule(ruleId: string, actorId?: string): Promise<void> {
  const admin = getAdminClient();

  // Haal eerst company_id op voor audit
  const { data: rule } = await admin
    .from("deltaagents_wisdom_rules")
    .select("company_id")
    .eq("id", ruleId)
    .single();

  const { error } = await admin
    .from("deltaagents_wisdom_rules")
    .delete()
    .eq("id", ruleId);

  if (error) {
    throw new Error(`Wisdom rule kon niet worden verwijderd: ${error.message}`);
  }

  if (rule) {
    await audit({
      companyId: rule.company_id,
      actorType: "user",
      actorId,
      action: "wisdom.rule.deleted",
      resourceType: "wisdom_rule",
      resourceId: ruleId,
    });
  }
}

export async function listRules(
  companyId: string,
  opts?: { category?: WisdomCategory; activeOnly?: boolean }
): Promise<WisdomRule[]> {
  const admin = getAdminClient();
  let q = admin
    .from("deltaagents_wisdom_rules")
    .select("*")
    .eq("company_id", companyId)
    .order("confidence", { ascending: false })
    .order("last_applied_at", { ascending: false, nullsFirst: false });

  if (opts?.category) q = q.eq("category", opts.category);
  if (opts?.activeOnly !== false) q = q.eq("active", true);

  const { data, error } = await q;
  if (error) throw new Error(`Kan rules niet ophalen: ${error.message}`);
  return (data ?? []) as WisdomRule[];
}

/** Increment applied_count + update last_applied_at via atomic RPC (migration 005). */
export async function markRuleApplied(ruleIds: string[]): Promise<void> {
  if (ruleIds.length === 0) return;
  const admin = getAdminClient();

  await Promise.allSettled(
    ruleIds.map((id) => admin.rpc("deltaagents_increment_rule_applied", { p_rule_id: id }))
  );
}

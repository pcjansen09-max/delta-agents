/**
 * Wisdom retrieval — semantische search over rules.
 * Gebruikt de SQL helper `deltaagents_find_relevant_rules` uit migration 004.
 */

import { getAdminClient } from "../supabase-admin";
import { embedText } from "./embedding";

export interface RetrievedRule {
  id: string;
  rule_text: string;
  category: string;
  confidence: number;
  similarity: number;
  scope_type: string | null;
  scope_id: string | null;
}

export interface RetrievalOptions {
  companyId: string;
  query: string;
  topK?: number;
  minConfidence?: number;
  minSimilarity?: number;     // filter na DB call (cosine sim threshold)
  /** Voor scoped rules — match alleen rules zonder scope of met deze waardes. */
  scope?: {
    customerId?: string;
    userPhone?: string;
  };
}

export async function retrieveRelevantRules(
  opts: RetrievalOptions
): Promise<RetrievedRule[]> {
  const admin = getAdminClient();
  const queryEmbedding = await embedText(opts.query);

  const { data, error } = await admin.rpc("deltaagents_find_relevant_rules", {
    p_company_id: opts.companyId,
    p_query_embedding: queryEmbedding,
    p_top_k: opts.topK ?? 10,
    p_min_confidence: opts.minConfidence ?? 0.3,
  });

  if (error) {
    throw new Error(`Wisdom retrieval faalde: ${error.message}`);
  }

  const rules = (data ?? []) as RetrievedRule[];

  // Filter op similarity threshold (Postgres geeft alles terug, sorted)
  const minSim = opts.minSimilarity ?? 0.3;
  const filtered = rules.filter((r) => r.similarity >= minSim);

  // Scope filter: include global rules + matching scoped rules
  if (opts.scope) {
    return filtered.filter((r) => {
      if (!r.scope_type) return true; // global rule
      if (r.scope_type === "customer" && r.scope_id === opts.scope?.customerId) return true;
      if (r.scope_type === "user" && r.scope_id === opts.scope?.userPhone) return true;
      return false;
    });
  }

  return filtered;
}

/**
 * Format rules als bullet list voor injection in agent system prompt.
 * Houdt het kort: alleen rule_text, geen metadata in de prompt (zou tokens kosten).
 */
export function formatRulesForPrompt(rules: RetrievedRule[]): string {
  if (rules.length === 0) return "";
  const items = rules.map((r) => `- ${r.rule_text}`).join("\n");
  return `<bedrijfsregels>\n${items}\n</bedrijfsregels>`;
}

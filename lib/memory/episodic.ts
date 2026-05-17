/**
 * Episodic memory — observaties over klanten/medewerkers die de agent
 * onthoudt zonder dat het expliciete regels zijn.
 *
 * Verschil met Wisdom Layer:
 *   Wisdom = "Facturen voor Boskalis altijd naar adres X" (rule)
 *   Episodic = "Boskalis betaalt vaak op 't laatste moment" (observation)
 *
 * Beide samen geven de agent context die voelt als een collega die
 * iemand goed kent.
 */

import { getAdminClient } from "../supabase-admin";
import { embedText } from "../wisdom/embedding";

export interface EpisodicMemory {
  id: string;
  observation: string;
  category: string;
  confidence: number;
  similarity?: number;
  observation_count: number;
  last_observed_at: string;
}

export interface RecordObservationInput {
  companyId: string;
  subjectType: "customer" | "user" | "company";
  subjectId: string;
  observation: string;
  category?: "communication" | "preference" | "pattern" | "context" | "relationship" | "general";
  confidence?: number;
  sourceConversationId?: string;
}

/**
 * Sla een nieuwe observatie op of bump observation_count van een
 * vergelijkbare bestaande observatie.
 */
export async function recordObservation(input: RecordObservationInput): Promise<EpisodicMemory> {
  const admin = getAdminClient();
  const embedding = await embedText(input.observation);

  // Check of er al een sterk vergelijkbare observatie bestaat
  const { data: existing } = await admin.rpc("deltaagents_find_episodic", {
    p_company_id: input.companyId,
    p_subject_type: input.subjectType,
    p_subject_id: input.subjectId,
    p_query_embedding: embedding,
    p_top_k: 1,
  });

  const closeMatch = existing?.[0];
  if (closeMatch && closeMatch.similarity > 0.92) {
    // Bestaande observatie bumpen
    const { data: updated } = await admin
      .from("deltaagents_episodic_memory")
      .update({
        observation_count: (closeMatch.observation_count ?? 1) + 1,
        last_observed_at: new Date().toISOString(),
        confidence: Math.min(1.0, (closeMatch.confidence ?? 0.7) + 0.05),
      })
      .eq("id", closeMatch.id)
      .select()
      .single();
    return updated as EpisodicMemory;
  }

  // Nieuwe observatie
  const { data, error } = await admin
    .from("deltaagents_episodic_memory")
    .insert({
      company_id: input.companyId,
      subject_type: input.subjectType,
      subject_id: input.subjectId,
      observation: input.observation,
      category: input.category ?? "general",
      confidence: input.confidence ?? 0.7,
      embedding,
      source_conversation_id: input.sourceConversationId ?? null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Episodic memory opslaan faalde: ${error.message}`);
  }

  return data as EpisodicMemory;
}

/**
 * Haal relevante episodic memories op voor een subject.
 * Optionele query string voor semantic search; zonder query = meest geobserveerd.
 */
export async function getRelevantMemories(input: {
  companyId: string;
  subjectType: "customer" | "user" | "company";
  subjectId: string;
  query?: string;
  topK?: number;
}): Promise<EpisodicMemory[]> {
  const admin = getAdminClient();

  let queryEmbedding: number[] | null = null;
  if (input.query && input.query.length > 0) {
    queryEmbedding = await embedText(input.query);
  }

  const { data, error } = await admin.rpc("deltaagents_find_episodic", {
    p_company_id: input.companyId,
    p_subject_type: input.subjectType,
    p_subject_id: input.subjectId,
    p_query_embedding: queryEmbedding,
    p_top_k: input.topK ?? 5,
  });

  if (error) {
    console.error("[episodic] retrieval failed", error);
    return [];
  }

  return (data ?? []) as EpisodicMemory[];
}

/**
 * Format episodic memories voor prompt injection.
 * Returns een korte bulleted lijst.
 */
export function formatMemoriesForPrompt(memories: EpisodicMemory[]): string {
  if (memories.length === 0) return "";
  const items = memories
    .filter((m) => m.confidence >= 0.5)
    .slice(0, 5)
    .map((m) => `- ${m.observation} (${m.observation_count}× geobserveerd)`)
    .join("\n");
  if (!items) return "";
  return `<wat_ik_weet_over_deze_persoon>\n${items}\n</wat_ik_weet_over_deze_persoon>`;
}

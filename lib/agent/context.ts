/**
 * Build context voor een agent-run: company, user, wisdom rules, history.
 */

import { getAdminClient } from "../supabase-admin";
import { retrieveRelevantRules } from "../wisdom/retrieval";
import type { AgentPromptContext } from "@/types/agent";
import type { User, UserRole } from "@/types/database";

const HISTORY_LIMIT = 8;          // laatste N messages letterlijk
const SUMMARY_AFTER = 20;         // boven deze threshold: gesprekssamenvatting + laatste 8

export async function buildAgentContext(input: {
  companyId: string;
  conversationId: string;
  userPhone: string;
  userMessage: string;
}): Promise<AgentPromptContext | { error: string }> {
  const admin = getAdminClient();

  // Company
  const { data: company } = await admin
    .from("deltaagents_companies")
    .select("id, company_name, industry")
    .eq("id", input.companyId)
    .single();

  if (!company) return { error: "Company niet gevonden" };

  // Agent config (bedrijfsinfo, werkwijze)
  const { data: config } = await admin
    .from("deltaagents_agent_config")
    .select("bedrijfsinfo, werkwijze")
    .eq("company_id", input.companyId)
    .single();

  // User uit phone — autoriseert ook
  const { data: user } = await admin
    .from("deltaagents_users")
    .select("id, name, phone, role, active")
    .eq("company_id", input.companyId)
    .eq("phone", input.userPhone)
    .eq("active", true)
    .single();

  if (!user) {
    return {
      error:
        "Dit telefoonnummer is niet geregistreerd bij dit bedrijf. Vraag uw beheerder om u toe te voegen.",
    };
  }

  // Relevante wisdom rules
  const rules = await retrieveRelevantRules({
    companyId: input.companyId,
    query: input.userMessage,
    topK: 8,
    minSimilarity: 0.4,
    scope: { userPhone: input.userPhone },
  });

  // Recent message history
  const { data: recentMessages, count } = await admin
    .from("deltaagents_wa_messages")
    .select("direction, text, transcript, created_at", { count: "exact" })
    .eq("conversation_id", input.conversationId)
    .order("created_at", { ascending: false })
    .limit(HISTORY_LIMIT);

  const messagesAsc = [...(recentMessages ?? [])].reverse();
  const formattedMessages = messagesAsc.map((m) => ({
    direction: m.direction as "in" | "out",
    text: m.text ?? m.transcript ?? "[bericht zonder tekst]",
    created_at: m.created_at,
  }));

  // Conversation summary indien lang
  let summary: string | null = null;
  if ((count ?? 0) > SUMMARY_AFTER) {
    const { data: conv } = await admin
      .from("deltaagents_wa_conversations")
      .select("context_summary")
      .eq("id", input.conversationId)
      .single();
    summary = conv?.context_summary ?? null;
  }

  return {
    company: {
      name: company.company_name ?? "Uw bedrijf",
      industry: company.industry,
      bedrijfsinfo: config?.bedrijfsinfo ?? "",
      werkwijze: config?.werkwijze ?? "",
    },
    user: {
      name: (user as User).name,
      role: (user as User).role as UserRole,
      phone: (user as User).phone,
    },
    rules: rules.map((r) => ({
      id: r.id,
      rule_text: r.rule_text,
      category: r.category as AgentPromptContext["rules"][number]["category"],
      confidence: r.confidence,
    })),
    conversationSummary: summary,
    recentMessages: formattedMessages,
  };
}

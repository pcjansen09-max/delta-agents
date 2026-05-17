/**
 * Agent runtime types — tools, actions, context.
 * Zie ARCHITECTURE.md §6.
 */

import type { UserRole, WisdomRule } from "./database";

/** Classification van tools — bepaalt of approval nodig is. */
export type ToolClassification = "read" | "write" | "execute";

export interface ToolDefinition<Args = unknown, Result = unknown> {
  name: string;
  description: string;
  classification: ToolClassification;
  /** Welke rollen mogen dit aanroepen. */
  allowedRoles: UserRole[];
  /** Zod schema serialized to JSON Schema (voor Anthropic tool calling). */
  input_schema: Record<string, unknown>;
  /** De executor. Voor `write`-tools wordt het result opgeslagen in `actions` tabel ipv direct uitgevoerd. */
  execute: (args: Args, ctx: ToolContext) => Promise<Result>;
}

export interface ToolContext {
  companyId: string;
  userPhone: string;
  userRole: UserRole;
  conversationId: string;
}

export interface AgentRunInput {
  companyId: string;
  conversationId: string;
  userPhone: string;
  userMessage: string;
  /** Voor audio messages: transcript wordt gebruikt als userMessage, audio_url voor referentie. */
  audioUrl?: string;
}

export interface AgentRunResult {
  /** Tekst die naar de gebruiker wordt gestuurd via WhatsApp. */
  reply: string;
  /** Voorgestelde actie die op approval wacht (typ JA). */
  proposedAction?: {
    actionId: string;
    type: string;
    summary: string;
  };
  /** Tokens used, voor cost tracking. */
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_read_tokens?: number;
    cache_creation_tokens?: number;
  };
  /** Welke wisdom rules zijn toegepast — voor audit traceability. */
  appliedRules: Array<{ ruleId: string; similarity: number }>;
}

/** Het volledige system + user prompt context, opgebouwd door context.ts. */
export interface AgentPromptContext {
  company: {
    name: string;
    industry: string | null;
    bedrijfsinfo: string;
    werkwijze: string;
  };
  user: {
    name: string;
    role: UserRole;
    phone: string;
  };
  /** Top-N relevante wisdom rules na semantic search. */
  rules: Array<Pick<WisdomRule, "id" | "rule_text" | "category" | "confidence">>;
  /** Recent conversation summary + last messages. */
  conversationSummary: string | null;
  recentMessages: Array<{
    direction: "in" | "out";
    text: string;
    created_at: string;
  }>;
}

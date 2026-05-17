/**
 * Agent runtime — orchestreert Claude calls met tools, wisdom, en safety guards.
 *
 * Flow:
 *   1. buildAgentContext() → company/user/rules/history
 *   2. Auth check: user bestaat + active?
 *   3. Construct system prompt + tool list voor user rol
 *   4. Loop: Claude call → tool_use? → execute (read autonoom, write via approval queue)
 *   5. Stop bij text_only response of na N iteraties
 *   6. Track applied rules, audit run
 */

import Anthropic from "@anthropic-ai/sdk";
import { buildAgentContext } from "./context";
import { buildSystemPrompt } from "./prompts";
import { getToolsForRole, findTool } from "./tools";
import { audit, auditError } from "../audit";
import { markRuleApplied } from "../wisdom/store";
import type { AgentRunInput, AgentRunResult } from "@/types/agent";

const MODEL = "claude-sonnet-4-6";
const MAX_ITERATIONS = 6;
const MAX_TOKENS = 2048;

const anthropic = new Anthropic();

export async function runAgent(input: AgentRunInput): Promise<AgentRunResult> {
  const startedAt = Date.now();

  // 1. Build context
  const ctx = await buildAgentContext({
    companyId: input.companyId,
    conversationId: input.conversationId,
    userPhone: input.userPhone,
    userMessage: input.userMessage,
  });

  if ("error" in ctx) {
    await audit({
      companyId: input.companyId,
      actorType: "agent",
      actorId: input.userPhone,
      action: "agent.run.failed",
      payload: { reason: ctx.error },
    });
    return {
      reply: ctx.error,
      usage: { input_tokens: 0, output_tokens: 0 },
      appliedRules: [],
    };
  }

  await audit({
    companyId: input.companyId,
    actorType: "agent",
    actorId: input.userPhone,
    action: "agent.run.started",
    resourceType: "conversation",
    resourceId: input.conversationId,
    payload: { message_length: input.userMessage.length, rules_loaded: ctx.rules.length },
  });

  // 2. Construct system prompt
  const systemPrompt = buildSystemPrompt(ctx);

  // 3. Tool list voor deze rol
  const allowedTools = getToolsForRole(ctx.user.role);
  const toolDeclarations = allowedTools.map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: t.input_schema as Anthropic.Tool["input_schema"],
  }));

  // 4. Conversation messages
  type AnthropicMessage = Anthropic.MessageParam;
  const messages: AnthropicMessage[] = [
    { role: "user", content: input.userMessage },
  ];

  let usage = {
    input_tokens: 0,
    output_tokens: 0,
    cache_read_tokens: 0,
    cache_creation_tokens: 0,
  };
  let proposedAction: AgentRunResult["proposedAction"];
  let replyText = "";

  // 5. Tool-use loop
  for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
    let response: Anthropic.Message;
    try {
      response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: [
          {
            type: "text",
            text: systemPrompt,
            cache_control: { type: "ephemeral" },
          },
        ],
        tools: toolDeclarations.length > 0 ? toolDeclarations : undefined,
        messages,
      });
    } catch (err) {
      await auditError({
        companyId: input.companyId,
        action: "agent.run.failed",
        error: err,
        resourceType: "conversation",
        resourceId: input.conversationId,
      });
      return {
        reply: "Sorry, ik kon uw bericht nu niet verwerken. Probeer het over een minuut opnieuw, of bel +31 6 83 41 77 23.",
        usage,
        appliedRules: ctx.rules.map((r) => ({ ruleId: r.id, similarity: 1 })),
      };
    }

    usage.input_tokens += response.usage.input_tokens;
    usage.output_tokens += response.usage.output_tokens;
    usage.cache_read_tokens += response.usage.cache_read_input_tokens ?? 0;
    usage.cache_creation_tokens += response.usage.cache_creation_input_tokens ?? 0;

    // Check for tool calls
    const toolUses = response.content.filter(
      (c): c is Anthropic.ToolUseBlock => c.type === "tool_use"
    );
    const textBlocks = response.content.filter(
      (c): c is Anthropic.TextBlock => c.type === "text"
    );

    if (toolUses.length === 0) {
      // Final answer
      replyText = textBlocks.map((b) => b.text).join("\n").trim();
      break;
    }

    // Execute tools, collect results
    messages.push({ role: "assistant", content: response.content });

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const tu of toolUses) {
      const tool = findTool(tu.name);
      if (!tool) {
        toolResults.push({
          type: "tool_result",
          tool_use_id: tu.id,
          content: `Onbekende tool: ${tu.name}`,
          is_error: true,
        });
        continue;
      }

      // Permissie check (defensive — prompts.ts vermeldt het al, maar dubbel check)
      if (!tool.allowedRoles.includes(ctx.user.role)) {
        toolResults.push({
          type: "tool_result",
          tool_use_id: tu.id,
          content: `Geweigerd: rol '${ctx.user.role}' mag tool '${tu.name}' niet aanroepen.`,
          is_error: true,
        });
        continue;
      }

      try {
        const result = await tool.execute(tu.input, {
          companyId: input.companyId,
          userPhone: input.userPhone,
          userRole: ctx.user.role,
          conversationId: input.conversationId,
        });

        toolResults.push({
          type: "tool_result",
          tool_use_id: tu.id,
          content: JSON.stringify(result),
        });

        // Track proposed action voor return value
        if (tool.classification === "write" && typeof result === "object" && result !== null && "action_id" in result) {
          const r = result as { action_id: string; summary: string };
          proposedAction = {
            actionId: r.action_id,
            type: tu.name,
            summary: r.summary,
          };
        }
      } catch (err) {
        toolResults.push({
          type: "tool_result",
          tool_use_id: tu.id,
          content: err instanceof Error ? err.message : "Tool fout",
          is_error: true,
        });
      }
    }

    messages.push({ role: "user", content: toolResults });
    // Loop verder zodat Claude een eindantwoord kan formuleren op basis van tool results
  }

  if (!replyText) {
    replyText = "Ik heb uw bericht ontvangen maar kon nog geen volledig antwoord formuleren. Probeer het anders te formuleren of stel een specifieke vraag.";
  }

  // 6. Track applied rules + audit completion
  const appliedRuleIds = ctx.rules.map((r) => r.id);
  if (appliedRuleIds.length > 0) {
    await markRuleApplied(appliedRuleIds).catch(() => undefined);
  }

  await audit({
    companyId: input.companyId,
    actorType: "agent",
    actorId: input.userPhone,
    action: "agent.run.completed",
    resourceType: "conversation",
    resourceId: input.conversationId,
    payload: {
      duration_ms: Date.now() - startedAt,
      reply_length: replyText.length,
      rules_applied: appliedRuleIds.length,
      proposed_action: proposedAction?.type ?? null,
      tokens: usage,
    },
  });

  return {
    reply: replyText,
    proposedAction,
    usage,
    appliedRules: ctx.rules.map((r) => ({ ruleId: r.id, similarity: 1 })),
  };
}

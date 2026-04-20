import { NextRequest, NextResponse } from "next/server";
import { getAgentById, UPSELL_RESPONSE } from "@/lib/agents";

export const runtime = "edge";

const MAX_FREE_MESSAGES = 5;
// Random delay 1500–2500ms to simulate human typing before responding
const MIN_DELAY_MS = 1500;
const MAX_DELAY_MS = 2500;

export async function POST(req: NextRequest) {
  try {
    const { agentId, messages } = await req.json();

    if (!agentId || !messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const agent = getAgentById(agentId);
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const userMessageCount = messages.filter(
      (m: { role: string }) => m.role === "user"
    ).length;

    // Upsell after limit — return immediately, no delay needed
    if (userMessageCount >= MAX_FREE_MESSAGES) {
      return NextResponse.json({ content: UPSELL_RESPONSE, isUpsell: true });
    }

    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Realistic typing delay + Claude call in parallel so total wait = max(delay, apiTime)
    const delayMs =
      MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
    const delay = new Promise<void>((resolve) =>
      setTimeout(resolve, delayMs)
    );

    const claudeCall = fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: agent.systemPrompt,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role === "agent" ? "assistant" : "user",
          content: m.content,
        })),
      }),
    });

    // Wait for both — ensures minimum typing delay is always visible
    const [, response] = await Promise.all([delay, claudeCall]);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", response.status, errorText);
      return NextResponse.json(
        { error: "Claude API error", detail: response.status },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content =
      data.content?.[0]?.text ?? "Er ging iets mis. Probeer het opnieuw.";

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

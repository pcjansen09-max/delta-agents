import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { messages: Array<{ role: string; content: string }>; companyId: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { messages, companyId } = body;
  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { data: agentConfig } = await supabase
    .from("deltaagents_agent_config")
    .select("bedrijfsinfo, prijslijst, werkwijze, faq")
    .eq("company_id", companyId)
    .single();

  const hasBedrijfsinfo =
    agentConfig?.bedrijfsinfo && agentConfig.bedrijfsinfo.trim().length > 20;

  const systemPrompt = hasBedrijfsinfo
    ? [
        "Je bent een professionele AI-assistent. Gebruik onderstaande bedrijfsinformatie om klanten te helpen. Wees vriendelijk, concreet en spreek Nederlands.",
        "",
        "=== BEDRIJFSINFO ===",
        agentConfig!.bedrijfsinfo,
        agentConfig!.prijslijst ? `\n=== PRIJSLIJST ===\n${agentConfig!.prijslijst}` : "",
        agentConfig!.werkwijze ? `\n=== WERKWIJZE ===\n${agentConfig!.werkwijze}` : "",
        agentConfig!.faq ? `\n=== FAQ ===\n${agentConfig!.faq}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    : "Je bent een professionele AI-klantenservice assistent voor een MKB-bedrijf. Beantwoord vragen vriendelijk en professioneel in het Nederlands. De eigenaar heeft nog geen bedrijfsinfo ingevuld — geef generieke maar nuttige antwoorden over producten, diensten en afspraken.";

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API not configured" }, { status: 500 });
  }

  // Log user message to activity
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
  if (lastUserMsg && companyId) {
    await supabase.from("deltaagents_activity").insert({
      company_id: companyId,
      type: "chat_bericht",
      beschrijving: String(lastUserMsg.content).slice(0, 100),
      metadata: {},
    });
  }

  const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      stream: true,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role === "agent" ? "assistant" : "user",
        content: m.content,
      })),
    }),
  });

  if (!claudeRes.ok) {
    return NextResponse.json({ error: "Claude API error" }, { status: 502 });
  }

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      const reader = claudeRes.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") continue;
          try {
            const parsed = JSON.parse(raw) as {
              type: string;
              delta?: { type: string; text?: string };
            };
            if (
              parsed.type === "content_block_delta" &&
              parsed.delta?.type === "text_delta" &&
              parsed.delta.text
            ) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ text: parsed.delta.text })}\n\n`
                )
              );
            }
          } catch {
            // skip malformed lines
          }
        }
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

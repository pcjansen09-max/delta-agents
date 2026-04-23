import { NextRequest } from "next/server";

const SYSTEM = `Je bent de digitale werknemer van Jansen Hoveniers, een hoveniersbedrijf in Haarlem en omgeving.

Bedrijfsinfo:
- Naam: Jansen Hoveniers
- Diensten: tuinonderhoud, tuinaanleg, snoeien, maaien, borders onderhoud, beplanting
- Tarieven: tuinonderhoud €45/u, snoeien & maaien €55/u, tuinaanleg op offerte, materiaal inbegrepen
- Werkgebied: Haarlem, Heemstede, Bloemendaal, Zandvoort en omgeving
- Beschikbaarheid: maandag t/m vrijdag 08:00-17:00, zaterdagochtend op aanvraag
- Responstijd offertes: binnen 2 uur na aanvraag

Gedragsregels:
- Spreek klanten aan met "u" (formeel maar vriendelijk)
- Beantwoord vragen direct en bondig, maximaal 2-3 zinnen
- Bij offerteaanvraag: vraag naar oppervlakte, type werkzaamheden en adres
- Bij afspraakaanvraag: geef beschikbare tijdslots door
- Stel nooit meer dan één vraag tegelijk
- Schrijf geen emoji's in je antwoorden
- Verwijs bij complexe vragen naar een persoonlijk gesprek`;

interface Message {
  from: string;
  text: string;
}

export async function POST(req: NextRequest) {
  let body: { messages: Message[] };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { messages } = body;
  if (!messages || !Array.isArray(messages) || messages.length > 20) {
    return new Response("Invalid request", { status: 400 });
  }

  const apiMessages = messages
    .filter((m) => m.from === "user" || m.from === "agent")
    .filter((m) => m.text && m.text.trim())
    .map((m) => ({
      role: m.from === "user" ? "user" : "assistant",
      content: m.text,
    }));

  if (apiMessages.length === 0) {
    return new Response("No messages", { status: 400 });
  }

  const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: SYSTEM,
      messages: apiMessages,
      stream: true,
    }),
  });

  if (!claudeRes.ok) {
    return new Response("Claude API error", { status: 502 });
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
                  `data: ${JSON.stringify({ delta: parsed.delta.text })}\n\n`
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

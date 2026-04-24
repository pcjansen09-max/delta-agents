import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM = `Je bent de digitale medewerker van Jansen Hoveniers, een professioneel hovenier bedrijf in Alkmaar.

BEDRIJFSINFO:
- Tuinonderhoud: €45 per uur
- Snoeiwerk: €55 per uur
- Tuinaanleg: op offerte (gratis)
- Borders opruimen: €40 per uur
- Bereikbaar: ma-vr 08:00-18:00
- Spoedgevallen: 06-12345678 (altijd)
- Werkgebied: Noord-Holland, 30km van Alkmaar

REGELS:
- Altijd vriendelijk in het Nederlands
- Gebruik "u" bij nieuwe klanten
- Max 2-3 zinnen per antwoord
- Sluit af met een vraag of actie
- Bij offerte: vraag adres en omschrijving
- Bij afspraak: vraag dag en tijdstip
- Noem nooit dat je AI bent
- Spreek namens "wij"`

export async function POST(req: NextRequest) {
  const { messages, count } = await req.json()

  if (count >= 8) {
    return Response.json({
      done: true,
      text: "Dit was een demo van DeltaAgents. Wil jij ook zo'n werknemer voor jouw bedrijf? Start vandaag gratis → deltaagents.nl",
    })
  }

  const stream = await client.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 150,
    system: SYSTEM,
    messages,
  })

  const encoder = new TextEncoder()
  const body = new ReadableStream({
    async start(ctrl) {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          ctrl.enqueue(encoder.encode(`data: ${JSON.stringify({ t: chunk.delta.text })}\n\n`))
        }
      }
      ctrl.enqueue(encoder.encode('data: [DONE]\n\n'))
      ctrl.close()
    },
  })

  return new Response(body, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  })
}

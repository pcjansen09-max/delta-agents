import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM = `Je bent de digitale werknemer van de ondernemer die je deze instructie geeft. Je werkt als kantoorassistent op de achtergrond terwijl de ondernemer buiten werkt.

DEMO CONTEXT — Jansen Hoveniers (hovenier, Alkmaar):
- Tuinonderhoud: €45/u · Snoeiwerk: €55/u · Borders opruimen: €40/u
- Boekhouden via Moneybird · Agenda via Google Calendar
- Klanten zijn lokale particulieren en bedrijven in Noord-Holland

Je taken:
- Facturen aanmaken als de ondernemer meldt dat een klus klaar is
- Offertes opstellen op basis van de beschrijving
- Afspraken inplannen in de agenda
- Herinneringen sturen naar klanten
- Betalingen opvolgen
- Administratieve taken afhandelen

Regels:
- Maximaal 2-3 zinnen per bericht
- Vraag altijd om bevestiging voordat je iets verstuurt
- Gebruik bedragen en details die logisch zijn (€45/u hovenier)
- Reageer als een behulpzame collega, niet als een chatbot
- Spreek de ondernemer aan met 'je/jij'
- Stel altijd een concrete vervolgvraag of actie voor
- Noem nooit dat je AI bent`

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

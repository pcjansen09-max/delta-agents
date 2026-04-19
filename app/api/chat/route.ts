import { NextRequest, NextResponse } from "next/server";
import { getAgentById, UPSELL_RESPONSE } from "@/lib/agents";

export const runtime = "edge";

const MAX_FREE_MESSAGES = 5;

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

    // Count user messages to enforce demo limit
    const userMessageCount = messages.filter((m: { role: string }) => m.role === "user").length;

    if (userMessageCount >= MAX_FREE_MESSAGES) {
      return NextResponse.json({ content: UPSELL_RESPONSE, isUpsell: true });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    // If no API key configured, return a realistic demo response
    if (!apiKey) {
      const demoResponse = getDemoResponse(agentId, userMessageCount);
      return NextResponse.json({ content: demoResponse });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 600,
        system: agent.systemPrompt,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role === "agent" ? "assistant" : "user",
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Anthropic API error:", error);
      const demoResponse = getDemoResponse(agentId, userMessageCount);
      return NextResponse.json({ content: demoResponse });
    }

    const data = await response.json();
    const content = data.content?.[0]?.text ?? "Er ging iets mis. Probeer het opnieuw.";

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function getDemoResponse(agentId: string, messageCount: number): string {
  const responses: Record<string, string[]> = {
    "real-estate": [
      "Goed om kennis te maken! Ik ben Nova, jouw Digitale Makelaarsassistent. Ik regel bezichtigingen, schrijf woningbeschrijvingen en beantwoord vragen van kopers — 24/7. Wat is jouw grootste uitdaging op dit moment?",
      "Een bezichtiging inplannen doe ik zo: de koper stuurt me een WhatsApp, ik check jouw agenda en bevestig direct. Geen heen-en-weer meer. Wil je dat ik een voorbeeld laat zien?",
      "Ik schrijf ook woningbeschrijvingen. Geef me de kenmerken (oppervlak, kamers, ligging) en ik lever je binnen 2 minuten een professionele tekst. Hoeveel woningen staan er momenteel bij jullie in de verkoop?",
      "Jij bespaart gemiddeld 10 uur per week met mij aan jouw zijde. Dat zijn facturen die ik stuur, afspraken die ik inplan, vragen die ik beantwoord. Voor €239/maand heb je een fulltime assistent. Wil je starten?",
    ],
    "hoveniers": [
      "Hey! Ik ben Finn. Stuur mij gewoon een WhatsApp na een klus en ik stuur de factuur direct. 'Klus klaar bij Pietersen, 4 uur' — meer hoef je niet te typen. Hoe lang ben je al hovenier?",
      "Ik maak ook offertes. Geef me de details (oppervlak, soort werk, materialen) en ik genereer een professionele PDF met jouw logo en prijzen. Klaar om te versturen in 60 seconden.",
      "Voor onderhoudsbeurten stuur ik automatisch herinneringen naar je vaste klanten. Zij reageren, ik plan het in jouw agenda. Jij hoeft er niks voor te doen. Hoeveel vaste klanten heb jij?",
      "Voor €239/maand heb je een assistent die nooit ziek is en altijd beschikbaar is. Hoeveel uur ben je nu kwijt aan administratie? Ik goede dat terug naar 0.",
    ],
    "klantenservice": [
      "Hoi! Ik ben Lisa. Ik beantwoord klantvragen via WhatsApp, e-mail en chat — ook 's nachts. Ik leer van jouw FAQ en productinfo. Vertel me over jouw bedrijf, dan laat ik zien wat ik kan.",
      "Een klacht van een klant? Ik registreer hem, bevestig de ontvangst naar de klant en plan een terugbelverzoek in. Jij krijgt een nette samenvatting. Nooit meer een klant die zich niet gehoord voelt.",
      "Ik handel 80% van de vragen zelfstandig af. Alleen de complexe gevallen komen bij jou terecht — met een samenvatting zodat jij direct weet wat er speelt. Hoeveel klantvragen krijgen jullie per dag?",
      "€239/maand voor 24/7 klantenservice. Dat is minder dan één dag inhuurkracht. Wil je zien hoe de Inwerkfase werkt? Ik ben in 1 week volledig ingewerkt.",
    ],
    "boekhouding": [
      "Hoi, ik ben Max! Stuur me een foto van je bon via WhatsApp en ik boek het direct in. Ik herinner je aan BTW-aangiften en maak maandelijkse overzichten. Met welk boekhoudpakket werk jij?",
      "BTW-aangifte vergeten is nooit meer een probleem. Ik stuur je 2 weken van tevoren een herinnering met een overzicht van alles wat er bij staat. Klik op 'Akkoord' en ik dien het in.",
      "Ik koppel met Moneybird, Exact Online en andere paketten. Inkoopfacturen, verkoopfacturen, bonnetjes — ik verwerk alles netjes. Hoeveel transacties heb je gemiddeld per maand?",
      "Voor €239/maand heb je een boekhouder die nooit fouten maakt en altijd beschikbaar is. Een goede start is de Inwerkfase (€299 eenmalig) waarbij ik jouw prijslijsten en regels leer.",
    ],
    "email": [
      "Hoi! Ik ben Sophie. Ik sorteer je inbox dagelijks: urgent bovenaan, spam weg, nieuwsbrieven apart. Jij hoeft alleen de echte mails te lezen. Welke e-mailclient gebruik jij?",
      "Voor elke mail die een antwoord nodig heeft, schrijf ik een concept in jouw stijl. Jij leest het, klikt op 'Versturen' — of je laat mij het volledig regelen. Hoeveel e-mails krijg je gemiddeld per dag?",
      "Opvolgherinneringen zet ik automatisch in als je iets stuurt maar geen antwoord terugkrijgt. Nooit meer een lead vergeten. Ik doe dit voor Gmail en Outlook.",
      "€239/maand voor een lege inbox en nooit meer een kans missen. Wil je starten? De Inwerkfase duurt 1 week — daarna werk ik volledig autonoom.",
    ],
    "social-media": [
      "Hi! Ik ben Luna. Ik schrijf 5 posts per week in jouw stijl, plan ze in en reageer op comments. Jij hoeft er niks voor te doen. Op welke platforms ben jij actief?",
      "Vertel me over je bedrijf en doelgroep, dan schrijf ik een content kalender voor de komende maand. Inclusief captions, hashtags en timing. Wil je een voorbeeld zien?",
      "Ik reageer ook op comments en DM's namens jou — vriendelijk en in jouw toon. Zo bouw je een community zonder er zelf tijd aan kwijt te zijn. Wat is jullie meest populaire product of dienst?",
      "Voor €239/maand ben ik jouw fulltime Social Media Manager. Geen freelancer die te duur is, geen stagiair die je moet begeleiden. Wil je starten met de Inwerkfase?",
    ],
    "inventory": [
      "Hoi! Ik ben Lars. Ik bewake je voorraad 24/7. Als iets onder het minimum komt, sla ik alarm en stuur automatisch een bestelling naar je leverancier. Welke producten beheer jij?",
      "Ik maak wekelijkse voorraadrapportages: wat loopt goed, wat staat te lang, wat moet nabesteld worden. Jij krijgt een overzicht op maandag zodat je de week goed start.",
      "Ik werk met Excel, Google Sheets of jouw ERP-systeem. Leverancierscommunicatie doe ik ook — bestellingen bevestigen, levertijden opvolgen. Hoeveel SKU's heb jij in assortiment?",
      "€239/maand voor nooit meer voorraadproblemen. De Inwerkfase kost €299 eenmalig — dan laad ik jouw producten en leveranciers in en ga ik direct aan de slag.",
    ],
    "hr": [
      "Goedemiddag! Ik ben Emma. Ik verwerk verlofaanvragen, plan sollicitatiegesprekken in en begeleid de onboarding van nieuwe medewerkers. Hoeveel medewerkers heeft jouw bedrijf?",
      "Een verlofaanvraag? De medewerker stuurt mij een WhatsApp, ik check het verlofoverzicht en bevestig of weiger met de reden. Jij wordt alleen betrokken bij bijzondere situaties.",
      "Sollicitatiegesprekken plan ik volledig in: ik stuur uitnodigingen, bevestig de locatie en herinner beide partijen de dag van tevoren. Jij hoeft alleen op te komen dagen. Zoek je momenteel personeel?",
      "Voor €239/maand heb je een complete HR-afdeling. Geen dure HR-adviseur nodig voor de routinetaken. Wil je starten met de Inwerkfase van €299 eenmalig?",
    ],
  };

  const agentResponses = responses[agentId] ?? responses["klantenservice"];
  const index = Math.min(messageCount - 1, agentResponses.length - 1);
  return agentResponses[Math.max(0, index)];
}

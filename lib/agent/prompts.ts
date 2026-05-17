/**
 * System prompts voor de agent.
 * Bewust ZONDER emoji of "vlot" Engels. Premium-zakelijk Nederlands.
 * Persona-laag (per-bedrijf voice + per-user style) maakt de agent menselijker
 * dan een generieke assistant.
 */

import type { AgentPromptContext } from "@/types/agent";
import { formatRulesForPrompt } from "../wisdom/retrieval";
import { buildPersonaBlock, buildExamplesBlock } from "./persona";
import type { RetrievedRule } from "../wisdom/retrieval";

const CORE_IDENTITY = `Je bent de Digitale Werknemer van een Nederlands MKB-bedrijf. Je gedraagt je als een ervaren administratief collega: precies, oplettend, behulpzaam, en altijd onder controle van de ondernemer.

Kernregels — overschrijd deze NOOIT:
1. Je voert nooit zelfstandig externe acties uit (facturen versturen, e-mail naar klanten, betalingen, etc). Je BEREIDT VOOR en VRAAGT BEVESTIGING via WhatsApp met "Typ JA om door te gaan".
2. Je verzint geen feiten. Als je een klant, prijs of document niet kan vinden, vraag je het na bij de gebruiker.
3. Je houdt je strikt aan de toegangsrechten van de berichtschrijver. Vraagt iemand om informatie die niet bij zijn rol hoort: vriendelijk weigeren en doorverwijzen naar de directie.
4. Je past de bedrijfsregels (zie <bedrijfsregels>) consequent toe. Bij conflict tussen regel en gebruikersverzoek: vraag bevestiging.
5. Je communiceert zoals een ervaren MKB-administratief medewerker zou doen. Geen ChatGPT-clichés ("Met genoegen!", "Geweldig!", "Absoluut!"). Geen overdaad aan beleefdheid. Geen filler.
6. Je herhaalt niet wat de gebruiker net zei. Je gaat direct ter zake of stelt 1 gerichte vervolgvraag.

Toolgebruik:
- Lees-tools (search_customer, get_prices) gebruik je vrij om context op te bouwen.
- Voorstel-tools (propose_invoice) maken een entry in de approval-queue. Direct daarna vraag je de gebruiker via tekstantwoord om "JA" te typen.
- Gebruik altijd echte data uit tools — fictieve bedragen of klantnamen zijn verboden.

Menselijkheidsregels:
- Vermeld bij elke factuur-voorstel: bedrag, klantnaam, en wat de gebruiker moet typen.
- Bij incomplete info: stel één gerichte vervolgvraag, niet drie tegelijk.
- Erken correcties zonder uitleg te geven waarom je het verkeerd had ("Aangepast." > "Sorry, mijn fout, ik had ..."). Korter is menselijker.
- Wissel formuleringen af. Niet steeds "Begrepen, ik ..." — soms direct de actie melden zonder ack.`;

export function buildSystemPrompt(ctx: AgentPromptContext): string {
  const rulesBlock = ctx.rules.length > 0
    ? formatRulesForPrompt(ctx.rules as RetrievedRule[])
    : "<bedrijfsregels>\n(geen specifieke regels geconfigureerd — gebruik standaard zakelijke logica)\n</bedrijfsregels>";

  const bedrijfsBlock = `<bedrijf>
Naam: ${ctx.company.name}
Branche: ${ctx.company.industry ?? "niet opgegeven"}
${ctx.company.bedrijfsinfo ? `\nBedrijfsinfo:\n${ctx.company.bedrijfsinfo}` : ""}
${ctx.company.werkwijze ? `\nWerkwijze:\n${ctx.company.werkwijze}` : ""}
</bedrijf>`;

  const userBlock = `<huidige_gebruiker>
Naam: ${ctx.user.name}
Rol: ${ctx.user.role}
Telefoon: ${ctx.user.phone}

Rol-permissies:
${rolePermissions(ctx.user.role)}
</huidige_gebruiker>`;

  // Persona + voorbeelden — alleen als de uitgebreide company/user shapes
  // beschikbaar zijn in ctx. We gebruiken defensieve casts omdat de
  // AgentPromptContext type een lighter shape heeft dan de DB row.
  const fullCompany = ctx.company as unknown as Parameters<typeof buildPersonaBlock>[0]["company"];
  const fullUser = ctx.user as unknown as Parameters<typeof buildPersonaBlock>[0]["user"];
  const personaBlock = buildPersonaBlock({ company: fullCompany, user: fullUser });
  const examplesBlock = buildExamplesBlock(fullCompany);

  const memoryBlock = (ctx as unknown as { episodicMemory?: string }).episodicMemory ?? "";

  const historyBlock = buildHistoryBlock(ctx);

  return [
    CORE_IDENTITY,
    "",
    bedrijfsBlock,
    "",
    rulesBlock,
    "",
    personaBlock,
    "",
    examplesBlock,
    "",
    userBlock,
    memoryBlock ? "\n" + memoryBlock : "",
    "",
    historyBlock,
  ].filter(Boolean).join("\n");
}

function rolePermissions(role: AgentPromptContext["user"]["role"]): string {
  switch (role) {
    case "directie":
      return "- Mag alle informatie inzien (prijzen, marges, financiële rapportages)\n- Mag offertes en facturen goedkeuren\n- Mag nieuwe regels aan u dicteren";
    case "voorman":
      return "- Mag werkbonnen, planningen en klantgegevens inzien\n- Mag GEEN financiële marges of inkoopprijzen opvragen\n- Voorstellen voor facturen worden ter goedkeuring naar de directie gestuurd, niet uitgevoerd";
    case "monteur":
      return "- Mag eigen uren doorgeven en werkbonnen invoeren\n- Mag technische handleidingen en documenten opvragen\n- Mag GEEN prijzen, marges, klantgegevens van anderen, of planningen inzien";
  }
}

function buildHistoryBlock(ctx: AgentPromptContext): string {
  if (ctx.recentMessages.length === 0 && !ctx.conversationSummary) {
    return "";
  }
  const parts: string[] = ["<gesprek_context>"];
  if (ctx.conversationSummary) {
    parts.push(`Eerder in dit gesprek:\n${ctx.conversationSummary}\n`);
  }
  if (ctx.recentMessages.length > 0) {
    parts.push("Recente berichten:");
    for (const m of ctx.recentMessages) {
      const who = m.direction === "in" ? ctx.user.name : "Agent";
      parts.push(`- ${who}: ${m.text}`);
    }
  }
  parts.push("</gesprek_context>");
  return parts.join("\n");
}

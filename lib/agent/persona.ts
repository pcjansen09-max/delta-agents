/**
 * Persona builder — bouwt de "menselijkheid" van de agent op per call.
 *
 * Drie lagen:
 *  1. Company persona (tone-of-voice, examples, avoid)
 *  2. User style notes (per-medewerker schrijfstijl)
 *  3. Variatie (random subtle phrasing zodat antwoorden niet template-achtig zijn)
 */

import type { Company, User } from "@/types/database";

interface PersonaExample {
  trigger: string;
  response: string;
}

interface CompanyWithPersona extends Company {
  persona_voice: string | null;
  persona_examples: PersonaExample[];
  persona_avoid: string | null;
  reply_style: "kort_bondig" | "standaard" | "uitgebreid" | "informeel";
}

interface UserWithStyle extends User {
  style_notes: string | null;
  preferred_reply_length: "kort" | "auto" | "uitgebreid";
}

/** Format reply-length guidance op basis van company default + user preference. */
function lengthGuidance(company: CompanyWithPersona, user: UserWithStyle): string {
  // Priority: user preference > company default
  const effective = user.preferred_reply_length === "auto"
    ? company.reply_style
    : user.preferred_reply_length;

  switch (effective) {
    case "kort":
    case "kort_bondig":
      return "Antwoord in maximaal twee korte zinnen. Geen tussenkopjes, geen opsommingen.";
    case "uitgebreid":
      return "Maximaal vier zinnen. Geef context indien helpful, maar blijf to-the-point.";
    case "informeel":
      return "Gebruik een ietwat losse toon, mag in u-vorm maar met luchtige formulering. Max drie zinnen.";
    case "standaard":
    default:
      return "Drie zinnen of korter. Direct ter zake, geen filler.";
  }
}

/**
 * Build het persona-block dat in de system prompt komt.
 * Returns een string die direct in buildSystemPrompt geinjecteerd wordt.
 */
export function buildPersonaBlock(input: {
  company: CompanyWithPersona;
  user: UserWithStyle;
}): string {
  const { company, user } = input;
  const lines: string[] = ["<schrijfstijl>"];

  // 1. Company tone-of-voice
  if (company.persona_voice) {
    lines.push(`Tone-of-voice van het bedrijf: ${company.persona_voice}`);
  }

  // 2. Reply length
  lines.push(`Lengte: ${lengthGuidance(company, user)}`);

  // 3. Per-user style
  if (user.style_notes) {
    lines.push(`Specifiek voor ${user.name}: ${user.style_notes}`);
  }

  // 4. Avoid
  if (company.persona_avoid) {
    lines.push(`NOOIT: ${company.persona_avoid}`);
  } else {
    lines.push("NOOIT: emoji, Engelse woorden, gepriegel, 'graag gedaan!', 'super!', 'helemaal top!', uitroeptekens.");
  }

  // 5. Variatie-instructie (cruciaal tegen template-feel)
  lines.push(
    "Varieer formulering: gebruik niet steeds dezelfde openingszin. Soms begin direct met de actie, soms met een korte bevestiging. Wissel af tussen 'Klopt — ik ...', 'Doe ik. ...', 'Begrepen. ...' en gewoon direct ter zake gaan."
  );

  lines.push("</schrijfstijl>");
  return lines.join("\n");
}

/**
 * Build few-shot examples block. Toont concrete voorbeelden van hoe
 * dit specifieke bedrijf antwoordt — krachtiger dan abstract beschreven tone.
 */
export function buildExamplesBlock(company: CompanyWithPersona): string {
  if (!company.persona_examples || company.persona_examples.length === 0) {
    // Default examples voor wanneer onboarding ze nog niet heeft gevuld —
    // schaalt nog steeds menselijk in een MKB-zakelijke toon.
    return [
      "<voorbeelden_van_menselijke_replies>",
      "Voorbeeld 1:",
      "  Vraag: 'Klus bij Jansen klaar, 4 uur, 2 kuub zand'",
      "  Reactie: 'Genoteerd. Concept-factuur: €487,50. Typ JA om te versturen.'",
      "",
      "Voorbeeld 2 (correctie):",
      "  Vraag: 'Nee, factuur naar Hoofdstraat 5 ipv Vredehof'",
      "  Reactie: 'Aangepast. Voortaan voor deze klant naar Hoofdstraat 5. Bevestigen?'",
      "",
      "Voorbeeld 3 (geen autonome actie):",
      "  Vraag: 'Stuur offerte voor 3u graafwerk'",
      "  Reactie: 'Tegen welk uurtarief — standaard €65 of anders? En welke klant precies?'",
      "</voorbeelden_van_menselijke_replies>",
    ].join("\n");
  }

  const parts: string[] = ["<voorbeelden_van_menselijke_replies>"];
  for (let i = 0; i < Math.min(company.persona_examples.length, 6); i++) {
    const ex = company.persona_examples[i];
    parts.push(`Voorbeeld ${i + 1}:`);
    parts.push(`  Vraag: '${ex.trigger}'`);
    parts.push(`  Reactie: '${ex.response}'`);
    parts.push("");
  }
  parts.push("</voorbeelden_van_menselijke_replies>");
  return parts.join("\n");
}

/**
 * Genereer een acknowledgment-zin in stijl. Wordt gebruikt bij langlopende
 * acties (transcribe + agent kan 10-20s duren) — agent stuurt ack zodat
 * gebruiker niet denkt dat zijn bericht weg is.
 */
const ACK_VARIATIONS = [
  "Even kijken.",
  "Ben er mee bezig.",
  "Moment.",
  "Kijk er naar.",
  "Doe ik, sec.",
];

export function pickAck(): string {
  return ACK_VARIATIONS[Math.floor(Math.random() * ACK_VARIATIONS.length)];
}

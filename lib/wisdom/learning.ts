/**
 * Wisdom learning — detect user corrections in WhatsApp replies,
 * propose new rules, and confirm before saving.
 *
 * Strategy: na elke "execute" agent-actie, scan eerstvolgende inkomende
 * messages voor correctie-signalen ("nee, dat moet zo"). Als gedetecteerd:
 * gebruik Claude Haiku om een regel-zin te formuleren en stuur naar user
 * voor bevestiging. Bij JA: opslaan met source='user-correction'.
 */

import Anthropic from "@anthropic-ai/sdk";
import { createRule } from "./store";
import type { WisdomCategory } from "@/types/database";

const CORRECTION_KEYWORDS = [
  "nee",
  "niet",
  "fout",
  "verkeerd",
  "moet zijn",
  "moet zo",
  "altijd",
  "voortaan",
  "in plaats van",
  "ipv",
];

/** Snelle heuristiek of een message een correctie zou kunnen zijn. */
export function looksLikeCorrection(text: string): boolean {
  const lower = text.toLowerCase();
  return CORRECTION_KEYWORDS.some((kw) => lower.includes(kw));
}

const anthropic = new Anthropic();

interface ExtractInput {
  /** Wat de agent deed of voorstelde. */
  agentAction: string;
  /** Wat de user terugzei. */
  userMessage: string;
}

interface ExtractedRule {
  shouldCreate: boolean;
  category: WisdomCategory;
  ruleText: string;
  /** Bevestigingsvraag voor de user. */
  confirmation: string;
}

/**
 * Roep Haiku aan om uit de user-correctie een herbruikbare regel te extraheren.
 * Returns shouldCreate=false als de user gewoon iets persoonlijks zegt
 * dat geen generieke regel rechtvaardigt.
 */
export async function extractRuleFromCorrection(
  input: ExtractInput
): Promise<ExtractedRule | null> {
  const systemPrompt = `Je bent een hulpmiddel dat bedrijfsregels extraheert uit feedback van een ondernemer aan zijn AI-assistent. Je doel: bepalen of de feedback een herbruikbare regel impliceert die de agent in de toekomst moet toepassen.

Geef terug in JSON:
{
  "should_create": boolean,
  "category": "pricing" | "customer" | "communication" | "workflow" | "security" | "general",
  "rule_text": "korte, declaratieve zin in Nederlands (max 200 chars)",
  "confirmation": "bevestigingsvraag voor de ondernemer in 'u'-vorm"
}

Geef should_create=false als de feedback geen generieke regel impliceert (bv. eenmalig, persoonlijk gevoel, off-topic).

Voorbeelden:
- "Nee, factuur naar de Hoofdstraat 5 ipv Vredehof 12" → should_create=true, category=customer, rule_text="Facturen voor deze klant altijd naar Hoofdstraat 5", confirmation="Begrepen — vanaf nu stuur ik facturen voor deze klant naar Hoofdstraat 5. Klopt dat?"
- "Hmm bedankt" → should_create=false
- "Voortaan na 18:00 €120 per uur ipv €85" → should_create=true, category=pricing, rule_text="Uurtarief na 18:00 is €120/uur ipv €85/uur", confirmation="Genoteerd — uurtarief na 18:00 is voortaan €120/uur. Klopt dat?"`;

  const userPrompt = `Agent deed/stelde voor:\n${input.agentAction}\n\nGebruiker antwoordde:\n${input.userMessage}\n\nGeef JSON terug.`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  // Strip markdown code fence indien aanwezig
  const jsonStr = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();

  let parsed: {
    should_create?: boolean;
    category?: string;
    rule_text?: string;
    confirmation?: string;
  };
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    console.error("[learning] Haiku gaf geen geldige JSON terug:", text.slice(0, 200));
    return null;
  }

  if (!parsed.should_create) return null;
  if (!parsed.rule_text || !parsed.confirmation) return null;

  const category: WisdomCategory =
    (["pricing", "customer", "communication", "workflow", "security", "general"] as const).includes(
      parsed.category as WisdomCategory
    )
      ? (parsed.category as WisdomCategory)
      : "general";

  return {
    shouldCreate: true,
    category,
    ruleText: parsed.rule_text.slice(0, 500),
    confirmation: parsed.confirmation,
  };
}

/**
 * Sla bevestigde regel op met confidence=1.0.
 * Wordt aangeroepen NA user JA op de confirmation message.
 */
export async function commitConfirmedRule(input: {
  companyId: string;
  ruleText: string;
  category: WisdomCategory;
  userPhone: string;
  scopeType?: string;
  scopeId?: string;
}): Promise<string> {
  const rule = await createRule({
    companyId: input.companyId,
    ruleText: input.ruleText,
    category: input.category,
    source: "user-correction",
    confidence: 1.0,
    scopeType: input.scopeType,
    scopeId: input.scopeId,
    actorId: input.userPhone,
  });
  return rule.id;
}

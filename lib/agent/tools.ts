/**
 * Agent tools — Anthropic tool definitions + executors.
 *
 * Classificatie:
 *   - read    → autonoom uitvoerbaar
 *   - write   → maakt entry in `actions` tabel, wacht op approval
 *   - execute → mag pas draaien als bijbehorende action.status === 'approved'
 *
 * Permissies per rol worden gecheckt door runtime.ts vóór de execute.
 */

import { getAdminClient } from "../supabase-admin";
import { audit } from "../audit";
import type { ToolDefinition, ToolContext } from "@/types/agent";
import type { UserRole } from "@/types/database";

// ─────────────────────────────────────────────────────────────────
// READ TOOLS
// ─────────────────────────────────────────────────────────────────

interface SearchCustomerArgs {
  query: string;
}
interface SearchCustomerResult {
  matches: Array<{ id: string; name: string; address: string | null; phone: string | null }>;
  count: number;
}

const search_customer: ToolDefinition<SearchCustomerArgs, SearchCustomerResult> = {
  name: "search_customer",
  description:
    "Zoek een klant op naam of (deel van) telefoonnummer. Gebruik bij elke factuur of klantvraag. Geeft max 5 matches terug.",
  classification: "read",
  allowedRoles: ["directie", "voorman"] as UserRole[],
  input_schema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Naam of telefoon, minimaal 2 tekens" },
    },
    required: ["query"],
  },
  async execute(args, ctx) {
    const admin = getAdminClient();
    const q = args.query.trim().toLowerCase();
    const { data } = await admin
      .from("deltaagents_customers")
      .select("id, name, address, phone")
      .eq("company_id", ctx.companyId)
      .or(`name.ilike.%${q}%,phone.ilike.%${q}%`)
      .limit(5);

    await audit({
      companyId: ctx.companyId,
      actorType: "agent",
      actorId: ctx.userPhone,
      action: "agent.tool.called",
      resourceType: "tool",
      resourceId: "search_customer",
      payload: { query_length: q.length, result_count: data?.length ?? 0 },
    });

    return {
      matches: (data ?? []) as SearchCustomerResult["matches"],
      count: data?.length ?? 0,
    };
  },
};

interface GetPricesArgs {
  query?: string;
}
interface GetPricesResult {
  products: Array<{
    id: string;
    name: string;
    unit: string;
    unit_price: number;
    vat_rate: number;
  }>;
}

const get_prices: ToolDefinition<GetPricesArgs, GetPricesResult> = {
  name: "get_prices",
  description:
    "Haal prijslijst op. Optioneel filteren op naam (substring). Zonder query: alle actieve producten/uurtarieven.",
  classification: "read",
  // Monteurs mogen GEEN prijzen zien (zie rol-permissies in prompts.ts)
  allowedRoles: ["directie", "voorman"] as UserRole[],
  input_schema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Optionele zoekterm" },
    },
  },
  async execute(args, ctx) {
    const admin = getAdminClient();
    let q = admin
      .from("deltaagents_products")
      .select("id, name, unit, unit_price, vat_rate")
      .eq("company_id", ctx.companyId)
      .eq("active", true)
      .order("name");

    if (args.query) {
      q = q.ilike("name", `%${args.query}%`);
    }

    const { data } = await q.limit(50);

    await audit({
      companyId: ctx.companyId,
      actorType: "agent",
      actorId: ctx.userPhone,
      action: "agent.tool.called",
      resourceType: "tool",
      resourceId: "get_prices",
      payload: { query: args.query ?? null, result_count: data?.length ?? 0 },
    });

    return { products: (data ?? []) as GetPricesResult["products"] };
  },
};

// ─────────────────────────────────────────────────────────────────
// WRITE TOOLS (maken proposed action — wachten op JA)
// ─────────────────────────────────────────────────────────────────

interface ProposeInvoiceArgs {
  customer_id: string;
  line_items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    vat_rate: number;
  }>;
  notes?: string;
}
interface ProposeInvoiceResult {
  action_id: string;
  total_excl_vat: number;
  total_incl_vat: number;
  summary: string;
}

const propose_invoice: ToolDefinition<ProposeInvoiceArgs, ProposeInvoiceResult> = {
  name: "propose_invoice",
  description:
    "Maak een concept-factuur aan voor approval. Deze tool VERSTUURT NIETS. Na deze tool moet u de gebruiker via tekstantwoord vragen om 'JA' te typen ter bevestiging. De factuur wordt pas verstuurd nadat de approval-handler 'JA' detecteert.",
  classification: "write",
  // Voorman mag voorstellen, alleen directie kan goedkeuren — dat wordt in
  // approval-flow gecheckt, niet hier.
  allowedRoles: ["directie", "voorman"] as UserRole[],
  input_schema: {
    type: "object",
    properties: {
      customer_id: { type: "string", description: "UUID uit search_customer" },
      line_items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            description: { type: "string" },
            quantity: { type: "number" },
            unit_price: { type: "number", description: "Prijs per stuk excl BTW" },
            vat_rate: { type: "number", description: "BTW % (typisch 21 of 9)" },
          },
          required: ["description", "quantity", "unit_price", "vat_rate"],
        },
      },
      notes: { type: "string" },
    },
    required: ["customer_id", "line_items"],
  },
  async execute(args, ctx) {
    const admin = getAdminClient();

    // Bereken totalen
    const totalExcl = args.line_items.reduce(
      (sum, l) => sum + l.quantity * l.unit_price,
      0
    );
    const totalIncl = args.line_items.reduce(
      (sum, l) => sum + l.quantity * l.unit_price * (1 + l.vat_rate / 100),
      0
    );

    // Customer name ophalen voor summary
    const { data: customer } = await admin
      .from("deltaagents_customers")
      .select("name")
      .eq("id", args.customer_id)
      .eq("company_id", ctx.companyId)
      .single();

    if (!customer) {
      throw new Error("Klant niet gevonden of behoort niet tot dit bedrijf");
    }

    const { data: action, error } = await admin
      .from("deltaagents_actions")
      .insert({
        company_id: ctx.companyId,
        conversation_id: ctx.conversationId,
        type: "create_invoice",
        payload: args as unknown as Record<string, unknown>,
        status: "pending",
      })
      .select("id")
      .single();

    if (error || !action) {
      throw new Error(`Kon concept-factuur niet opslaan: ${error?.message}`);
    }

    const summary = `Concept-factuur €${totalIncl.toFixed(2)} incl BTW voor ${customer.name}`;

    await audit({
      companyId: ctx.companyId,
      actorType: "agent",
      actorId: ctx.userPhone,
      action: "agent.action.proposed",
      resourceType: "action",
      resourceId: action.id,
      payload: {
        type: "create_invoice",
        customer_id: args.customer_id,
        line_count: args.line_items.length,
        total_incl_vat: totalIncl,
      },
    });

    return {
      action_id: action.id,
      total_excl_vat: round2(totalExcl),
      total_incl_vat: round2(totalIncl),
      summary,
    };
  },
};

// ─────────────────────────────────────────────────────────────────
// REGISTRY
// ─────────────────────────────────────────────────────────────────

export const ALL_TOOLS: ToolDefinition[] = [
  search_customer as ToolDefinition,
  get_prices as ToolDefinition,
  propose_invoice as ToolDefinition,
];

export function getToolsForRole(role: UserRole): ToolDefinition[] {
  return ALL_TOOLS.filter((t) => t.allowedRoles.includes(role));
}

export function findTool(name: string): ToolDefinition | undefined {
  return ALL_TOOLS.find((t) => t.name === name);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

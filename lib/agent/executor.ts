/**
 * Action executor — voert een approved action uit (Moneybird, WhatsApp, etc).
 *
 * Aangeroepen vanuit:
 *   - webhook handler na "JA" reply
 *   - dashboard UI bij manual approve
 *
 * Idempotent: dezelfde action.id twee keer executen is veilig — checks status
 * eerst en faalt netjes als al uitgevoerd.
 */

import { getAdminClient } from "../supabase-admin";
import { audit, auditError } from "../audit";
import { createSalesInvoice, sendSalesInvoice } from "../moneybird/client";
import type { AgentAction } from "@/types/database";
import type { MoneybirdInvoiceLine } from "@/types/moneybird";

interface InvoicePayload {
  customer_id: string;
  line_items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    vat_rate: number;
  }>;
  notes?: string;
}

export interface ExecuteResult {
  ok: boolean;
  externalId?: string;
  externalUrl?: string;
  error?: string;
}

export async function executeApprovedAction(actionId: string): Promise<ExecuteResult> {
  const admin = getAdminClient();

  // 1. Haal action op + lock-achtige guard via status check
  const { data: action } = await admin
    .from("deltaagents_actions")
    .select("*")
    .eq("id", actionId)
    .single();

  if (!action) {
    return { ok: false, error: "Action niet gevonden" };
  }
  const a = action as AgentAction;

  if (a.status === "executed") {
    return { ok: true, error: "Reeds uitgevoerd" };
  }
  if (a.status !== "approved") {
    return { ok: false, error: `Action heeft status '${a.status}' — niet uitvoerbaar` };
  }

  // 2. Dispatch op type
  try {
    if (a.type === "create_invoice") {
      return await executeInvoice(a);
    }
    return { ok: false, error: `Action type '${a.type}' nog niet ondersteund` };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Onverwachte fout";
    await admin
      .from("deltaagents_actions")
      .update({ status: "failed", error_message: message })
      .eq("id", a.id);
    await auditError({
      companyId: a.company_id,
      action: "action.failed",
      error: err,
      resourceType: "action",
      resourceId: a.id,
    });
    return { ok: false, error: message };
  }
}

async function executeInvoice(action: AgentAction): Promise<ExecuteResult> {
  const admin = getAdminClient();
  const payload = action.payload as unknown as InvoicePayload;

  // Map naar Moneybird klant + product IDs
  const { data: customer } = await admin
    .from("deltaagents_customers")
    .select("moneybird_contact_id, name")
    .eq("id", payload.customer_id)
    .eq("company_id", action.company_id)
    .single();

  if (!customer?.moneybird_contact_id) {
    throw new Error(`Klant '${customer?.name ?? "onbekend"}' is niet gekoppeld aan Moneybird`);
  }

  // Bouw factuur-regels. Per regel proberen we het Moneybird product te matchen
  // op naam zodat Moneybird zelf belasting/grootboek koppelt.
  const details: MoneybirdInvoiceLine[] = [];
  for (const item of payload.line_items) {
    const { data: product } = await admin
      .from("deltaagents_products")
      .select("moneybird_product_id")
      .eq("company_id", action.company_id)
      .ilike("name", item.description)
      .maybeSingle();

    details.push({
      description: item.description,
      amount: String(item.quantity),
      price: item.unit_price.toFixed(2),
      product_id: product?.moneybird_product_id ?? null,
    });
  }

  // Maak factuur in Moneybird
  const invoice = await createSalesInvoice(action.company_id, {
    contact_id: customer.moneybird_contact_id,
    details,
  });

  // Verstuur direct via email (Moneybird mailt naar klant)
  const sent = await sendSalesInvoice(action.company_id, invoice.id, "email");

  // Update action status
  await admin
    .from("deltaagents_actions")
    .update({
      status: "executed",
      executed_at: new Date().toISOString(),
      payload: {
        ...action.payload,
        moneybird_invoice_id: sent.id,
        moneybird_invoice_url: sent.url,
        moneybird_invoice_state: sent.state,
      },
    })
    .eq("id", action.id);

  await audit({
    companyId: action.company_id,
    actorType: "system",
    action: "action.executed",
    resourceType: "action",
    resourceId: action.id,
    payload: {
      type: "create_invoice",
      moneybird_invoice_id: sent.id,
      total_incl_vat: sent.total_price_incl_tax,
    },
  });

  return {
    ok: true,
    externalId: sent.id,
    externalUrl: sent.url,
  };
}

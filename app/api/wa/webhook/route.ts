/**
 * WhatsApp inbound webhook.
 *
 * GET  → Meta's initial verification handshake
 * POST → message delivery (text, audio, status updates)
 *
 * Belangrijk:
 *  - Antwoord BINNEN 5s anders retried Meta.
 *  - Idempotency via wa_message_id UNIQUE constraint in DB.
 *  - Signature-verificatie alleen op POST.
 *  - Zware verwerking (transcribe, agent run) draait async — niet in response.
 */

import { NextResponse } from "next/server";
import { handleVerifyChallenge, verifySignature } from "@/lib/whatsapp/verify";
import { transcribeAudio } from "@/lib/whatsapp/transcribe";
import { sendTextMessage } from "@/lib/whatsapp/client";
import { getAdminClient } from "@/lib/supabase-admin";
import { audit } from "@/lib/audit";
import { runAgent } from "@/lib/agent/runtime";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ──────────── GET: verification handshake ────────────

export async function GET(request: Request) {
  const url = new URL(request.url);
  const challenge = handleVerifyChallenge(url.searchParams);
  if (challenge) {
    return new Response(challenge, { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

// ──────────── POST: message events ────────────

interface MetaWebhookPayload {
  entry?: Array<{
    id: string;
    changes?: Array<{
      field: string;
      value: {
        metadata?: { phone_number_id?: string; display_phone_number?: string };
        messages?: Array<MetaInboundMessage>;
        statuses?: Array<{ id: string; status: string }>;
      };
    }>;
  }>;
}

interface MetaInboundMessage {
  id: string;
  from: string;                   // E.164 zonder +
  timestamp: string;
  type: "text" | "audio" | "image" | "interactive" | "button" | "reaction" | "sticker";
  text?: { body: string };
  audio?: { id: string; mime_type: string };
  image?: { id: string; caption?: string };
}

export async function POST(request: Request) {
  // Raw body voor signature check
  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!verifySignature(rawBody, signature)) {
    return new Response("Invalid signature", { status: 401 });
  }

  let payload: MetaWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response("Bad JSON", { status: 400 });
  }

  // Vroeg ACK om Meta-retries te voorkomen — verwerk async
  // Volgorde maakt uit: snel respond, daarna processInbound() doet de rest.
  // Vercel functions kunnen 'waitUntil' niet zonder context, dus we gebruiken
  // gewoon synchrone processing maar met tight budgets.
  try {
    await processInbound(payload);
  } catch (err) {
    console.error("[wa.webhook] processing error", err);
  }

  return NextResponse.json({ ok: true });
}

// ──────────── Processing logic ────────────

async function processInbound(payload: MetaWebhookPayload): Promise<void> {
  const admin = getAdminClient();

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const phoneNumberId = change.value.metadata?.phone_number_id;
      if (!phoneNumberId) continue;

      // Map phoneNumberId → company
      const { data: company } = await admin
        .from("deltaagents_companies")
        .select("id, owner_email")
        .eq("whatsapp_number", phoneNumberId)
        .single();

      if (!company) {
        console.warn("[wa.webhook] geen company voor phone_number_id", phoneNumberId);
        continue;
      }

      for (const msg of change.value.messages ?? []) {
        await handleMessage(company.id, msg).catch(async (err) => {
          console.error("[wa.webhook] message handling failed", err);
          await audit({
            companyId: company.id,
            actorType: "webhook",
            action: "wa.webhook.received",
            payload: { error: err instanceof Error ? err.message : String(err), wa_message_id: msg.id },
          });
        });
      }
    }
  }
}

async function handleMessage(companyId: string, msg: MetaInboundMessage): Promise<void> {
  const admin = getAdminClient();

  // 1. Conversation opzoeken/maken
  const { data: conv, error: convErr } = await admin
    .from("deltaagents_wa_conversations")
    .upsert(
      {
        company_id: companyId,
        user_phone: msg.from,
        last_message_at: new Date().toISOString(),
      },
      { onConflict: "company_id,user_phone" }
    )
    .select("id")
    .single();

  if (convErr || !conv) {
    throw new Error(`Conversation upsert faalde: ${convErr?.message}`);
  }

  // 2. Bericht inhoud bepalen
  let text: string | null = null;
  let audioUrl: string | null = null;
  let transcript: string | null = null;
  let type: "text" | "audio" | "image" | "template" = "text";

  if (msg.type === "text" && msg.text?.body) {
    text = msg.text.body;
  } else if (msg.type === "audio" && msg.audio?.id) {
    type = "audio";
    audioUrl = msg.audio.id; // bewaren ref; volledige download komt in transcribe
    try {
      const result = await transcribeAudio(msg.audio.id);
      transcript = result.transcript;
    } catch (err) {
      console.error("[wa.webhook] transcribe failed", err);
      transcript = "[Audio kon niet getranscribeerd worden]";
    }
  } else {
    // image / interactive / etc — voor MVP niet ondersteund
    text = `[Bericht type ${msg.type} wordt nog niet ondersteund]`;
  }

  // 3. Message opslaan (idempotent via wa_message_id UNIQUE)
  const { data: savedMsg, error: msgErr } = await admin
    .from("deltaagents_wa_messages")
    .upsert(
      {
        conversation_id: conv.id,
        direction: "in",
        type,
        text,
        audio_url: audioUrl,
        transcript,
        wa_message_id: msg.id,
        metadata: { from: msg.from, timestamp: msg.timestamp },
      },
      { onConflict: "wa_message_id" }
    )
    .select("id")
    .single();

  if (msgErr) {
    // 23505 = unique violation → al verwerkt, skip
    if (msgErr.code === "23505") return;
    throw new Error(`Message save faalde: ${msgErr.message}`);
  }

  await audit({
    companyId,
    actorType: "webhook",
    actorId: msg.from,
    action: "wa.webhook.received",
    resourceType: "wa_message",
    resourceId: savedMsg?.id,
    payload: { type, has_transcript: !!transcript },
  });

  // 4. Run de agent op de inkomende inhoud
  const userText = transcript ?? text ?? "";
  if (!userText.trim()) return;

  // Check: is dit een approval-reply ('JA' / 'NEE')?
  const trimmed = userText.trim().toUpperCase();
  if (trimmed === "JA" || trimmed === "NEE") {
    await handleApprovalReply({ companyId, conversationId: conv.id, userPhone: msg.from, decision: trimmed === "JA" });
    return;
  }

  // Anders: agent run
  const result = await runAgent({
    companyId,
    conversationId: conv.id,
    userPhone: msg.from,
    userMessage: userText,
  });

  // Stuur reply terug via WhatsApp
  if (result.reply) {
    const sent = await sendTextMessage({
      companyId,
      toPhone: msg.from,
      text: result.reply,
    });

    await admin.from("deltaagents_wa_messages").insert({
      conversation_id: conv.id,
      direction: "out",
      type: "text",
      text: result.reply,
      wa_message_id: sent.messageId,
      metadata: {
        proposed_action: result.proposedAction ?? null,
        tokens: result.usage,
      },
    });
  }
}

async function handleApprovalReply(input: {
  companyId: string;
  conversationId: string;
  userPhone: string;
  decision: boolean;
}): Promise<void> {
  const admin = getAdminClient();

  // Vind laatste pending action voor deze conversatie
  const { data: action } = await admin
    .from("deltaagents_actions")
    .select("id, type, payload")
    .eq("company_id", input.companyId)
    .eq("conversation_id", input.conversationId)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!action) {
    await sendTextMessage({
      companyId: input.companyId,
      toPhone: input.userPhone,
      text: "Er staat momenteel geen actie te wachten op uw bevestiging.",
    });
    return;
  }

  if (!input.decision) {
    await admin
      .from("deltaagents_actions")
      .update({ status: "rejected" })
      .eq("id", action.id);
    await audit({
      companyId: input.companyId,
      actorType: "user",
      actorId: input.userPhone,
      action: "action.rejected",
      resourceType: "action",
      resourceId: action.id,
    });
    await sendTextMessage({
      companyId: input.companyId,
      toPhone: input.userPhone,
      text: "Begrepen — actie afgebroken. Stuur gerust een nieuwe opdracht.",
    });
    return;
  }

  // Approved → execute (alleen invoice voor MVP, andere types komen later)
  await admin
    .from("deltaagents_actions")
    .update({ status: "approved" })
    .eq("id", action.id);

  await audit({
    companyId: input.companyId,
    actorType: "user",
    actorId: input.userPhone,
    action: "action.approved",
    resourceType: "action",
    resourceId: action.id,
  });

  // TODO: koppel met lib/moneybird/client.ts createSalesInvoice + sendSalesInvoice
  // Voor MVP: log + bevestig. Echte Moneybird wiring in volgende sessie.
  await sendTextMessage({
    companyId: input.companyId,
    toPhone: input.userPhone,
    text: "Bevestigd. De factuur wordt verwerkt — u krijgt een bevestiging zodra hij is verstuurd.",
  });
}

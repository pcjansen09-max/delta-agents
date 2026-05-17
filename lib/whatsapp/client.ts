/**
 * WhatsApp Business Platform client — Meta direct (Graph API).
 * Geen Twilio-overhead. Gebruikt PHONE_NUMBER_ID + ACCESS_TOKEN uit env.
 *
 * 24-uur conversation window: free-form text alleen toegestaan als laatste
 * inbound message binnen 24u was. Daarbuiten: alleen approved templates.
 */

import { audit } from "../audit";

const GRAPH_BASE = "https://graph.facebook.com/v22.0";

interface SendTextParams {
  companyId: string;
  toPhone: string;            // E.164 zonder +
  text: string;
  /** Reageer in een conversation thread (Meta features context preserveren). */
  replyToMessageId?: string;
}

export async function sendTextMessage(params: SendTextParams): Promise<{ messageId: string }> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!phoneNumberId || !accessToken) {
    throw new Error("WhatsApp env vars ontbreken (PHONE_NUMBER_ID / ACCESS_TOKEN)");
  }

  const body: Record<string, unknown> = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: params.toPhone.replace(/^\+/, ""),
    type: "text",
    text: { body: params.text, preview_url: false },
  };

  if (params.replyToMessageId) {
    body.context = { message_id: params.replyToMessageId };
  }

  const res = await fetch(`${GRAPH_BASE}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    await audit({
      companyId: params.companyId,
      actorType: "system",
      action: "wa.message.failed",
      payload: { status: res.status, response: txt.slice(0, 300) },
    });
    throw new Error(`WhatsApp send faalde (${res.status}): ${txt.slice(0, 200)}`);
  }

  const json = (await res.json()) as {
    messages?: Array<{ id: string }>;
  };
  const messageId = json.messages?.[0]?.id;
  if (!messageId) throw new Error("WhatsApp respons miste message id");

  await audit({
    companyId: params.companyId,
    actorType: "system",
    action: "wa.message.sent",
    resourceType: "wa_message",
    resourceId: messageId,
    payload: { length: params.text.length },
  });

  return { messageId };
}

/**
 * Download een media file uit WhatsApp (audio, image).
 * Twee stappen: GET /media-id voor URL, dan GET URL voor binary.
 */
export async function downloadMedia(mediaId: string): Promise<{ buffer: ArrayBuffer; mimeType: string }> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!accessToken) throw new Error("WHATSAPP_ACCESS_TOKEN ontbreekt");

  const metaRes = await fetch(`${GRAPH_BASE}/${mediaId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!metaRes.ok) throw new Error(`Media metadata ophalen faalde (${metaRes.status})`);

  const meta = (await metaRes.json()) as { url: string; mime_type: string };

  const fileRes = await fetch(meta.url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!fileRes.ok) throw new Error(`Media download faalde (${fileRes.status})`);

  return {
    buffer: await fileRes.arrayBuffer(),
    mimeType: meta.mime_type,
  };
}

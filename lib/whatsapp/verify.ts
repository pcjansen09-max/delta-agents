/**
 * WhatsApp webhook signature verification.
 * Meta stuurt X-Hub-Signature-256: sha256=<hex digest>
 * Geverifieerd met de App Secret (NIET access token).
 */

import { createHmac, timingSafeEqual } from "node:crypto";

export function verifySignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  if (!signatureHeader) return false;

  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret) {
    console.error("[wa.verify] WHATSAPP_APP_SECRET ontbreekt — signature kan niet gevalideerd worden");
    return false;
  }

  const expectedSig = "sha256=" + createHmac("sha256", appSecret).update(rawBody).digest("hex");

  const a = Buffer.from(signatureHeader);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}

/**
 * GET-verificatie tijdens initial webhook setup.
 * Meta stuurt: ?hub.mode=subscribe&hub.verify_token=...&hub.challenge=...
 * Wij echoën challenge terug als verify_token matcht.
 */
export function handleVerifyChallenge(params: URLSearchParams): string | null {
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  const expected = process.env.WHATSAPP_VERIFY_TOKEN;
  if (mode === "subscribe" && expected && token === expected) {
    return challenge;
  }
  return null;
}

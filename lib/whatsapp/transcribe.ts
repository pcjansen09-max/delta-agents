/**
 * Audio transcription via Anthropic Claude (native audio input).
 * Wordt aangeroepen direct na audio-download in webhook handler.
 */

import Anthropic from "@anthropic-ai/sdk";
import { downloadMedia } from "./client";

const anthropic = new Anthropic();
const TRANSCRIBE_MODEL = "claude-haiku-4-5-20251001";

/**
 * Transcribeer een WhatsApp audio bericht naar Nederlandse tekst.
 *
 * Strategie: gebruik Haiku met audio input. Goedkoper dan Sonnet, snel,
 * kwaliteit ruim voldoende voor MKB-Nederlandse spreektekst.
 */
export async function transcribeAudio(mediaId: string): Promise<{
  transcript: string;
  durationHint?: string;
}> {
  const { buffer, mimeType } = await downloadMedia(mediaId);

  // Anthropic native audio: pas op formaat. WhatsApp audio is ogg/opus.
  // Haiku 4.5 ondersteunt: mp3, wav, ogg, flac, m4a, aac, webm.
  const supportedTypes = ["audio/ogg", "audio/mpeg", "audio/wav", "audio/mp4", "audio/webm", "audio/aac", "audio/flac"];
  const normalizedMime = mimeType.split(";")[0].trim();
  if (!supportedTypes.includes(normalizedMime)) {
    throw new Error(`Audio formaat niet ondersteund door transcriber: ${mimeType}`);
  }

  const base64Audio = Buffer.from(buffer).toString("base64");

  const response = await anthropic.messages.create({
    model: TRANSCRIBE_MODEL,
    max_tokens: 1024,
    system:
      "Je transcribeert een gesproken WhatsApp-bericht in het Nederlands. Geef alleen de gesproken tekst terug, woordelijk, zonder commentaar of opmaak. Behoud naamen van bedrijven en plaatsen. Cijfers schrijf je als cijfers (bv 'vier kuub' → '4 kuub', 'tweehonderd euro' → '€200').",
    messages: [
      {
        role: "user",
        content: [
          {
            // @ts-expect-error — Anthropic audio block type beschikbaar via SDK 0.91+
            type: "audio",
            source: {
              type: "base64",
              media_type: normalizedMime,
              data: base64Audio,
            },
          },
          {
            type: "text",
            text: "Transcribeer dit bericht in het Nederlands.",
          },
        ],
      },
    ],
  });

  const transcript = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join(" ")
    .trim();

  if (!transcript) {
    throw new Error("Transcriptie leverde lege string");
  }

  return { transcript };
}

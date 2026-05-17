/**
 * AES-256-GCM encryption voor OAuth tokens at rest.
 *
 * Encrypted payload format: `v1:base64(iv):base64(ciphertext):base64(authTag)`
 * - v1 prefix laat key rotation toe in de toekomst (v2, v3, ...)
 * - IV is 12 bytes random per encryptie (GCM standard)
 * - authTag is 16 bytes, verifieert integrity bij decrypt
 *
 * Master key: TOKEN_ENCRYPTION_KEY env var. 32 bytes, base64-encoded.
 * Generate met: `openssl rand -base64 32`
 *
 * Zie ARCHITECTURE.md §4.2.
 */

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const VERSION = "v1";

function getMasterKey(): Buffer {
  const raw = process.env.TOKEN_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error(
      "TOKEN_ENCRYPTION_KEY ontbreekt — genereer met `openssl rand -base64 32` en zet in Vercel env"
    );
  }
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error(
      `TOKEN_ENCRYPTION_KEY moet 32 bytes zijn (base64-encoded). Huidige lengte: ${key.length}`
    );
  }
  return key;
}

export function encrypt(plaintext: string): string {
  const key = getMasterKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    VERSION,
    iv.toString("base64"),
    ciphertext.toString("base64"),
    authTag.toString("base64"),
  ].join(":");
}

export function decrypt(payload: string): string {
  const parts = payload.split(":");
  if (parts.length !== 4) {
    throw new Error("Encrypted payload heeft ongeldig formaat (verwacht 4 onderdelen)");
  }
  const [version, ivB64, cipherB64, tagB64] = parts;

  if (version !== VERSION) {
    throw new Error(`Onbekende encryption version: ${version}. Verwacht: ${VERSION}`);
  }

  const key = getMasterKey();
  const iv = Buffer.from(ivB64, "base64");
  const ciphertext = Buffer.from(cipherB64, "base64");
  const authTag = Buffer.from(tagB64, "base64");

  if (iv.length !== IV_LENGTH) {
    throw new Error(`IV heeft ongeldig formaat (${iv.length} bytes, verwacht ${IV_LENGTH})`);
  }
  if (authTag.length !== AUTH_TAG_LENGTH) {
    throw new Error(`AuthTag heeft ongeldig formaat (${authTag.length} bytes, verwacht ${AUTH_TAG_LENGTH})`);
  }

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return plaintext.toString("utf8");
}

/** Helper voor optionele encryptie (null/undefined doorlaten). */
export function encryptOptional(plaintext: string | null | undefined): string | null {
  if (!plaintext) return null;
  return encrypt(plaintext);
}

export function decryptOptional(payload: string | null | undefined): string | null {
  if (!payload) return null;
  return decrypt(payload);
}

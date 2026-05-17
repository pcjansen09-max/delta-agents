/**
 * Tekst → embedding voor semantische rule retrieval.
 *
 * Voor MVP gebruiken we Voyage AI (Anthropic's aanbevolen partner) via
 * een directe HTTP call — voyage-3-lite is goedkoop en goed genoeg voor
 * zakelijke Nederlandse rules.
 *
 * Vector dimension: 1536 (matcht migration 004).
 * Bij ander model: pas vector(1536) in migration én deze module aan.
 */

const VOYAGE_ENDPOINT = "https://api.voyageai.com/v1/embeddings";
const VOYAGE_MODEL = "voyage-3-lite";
const EXPECTED_DIM = 1536;

export async function embedText(text: string): Promise<number[]> {
  const apiKey = process.env.VOYAGE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "VOYAGE_API_KEY ontbreekt — embeddings nodig voor wisdom retrieval. " +
        "Maak gratis account op voyageai.com en voeg key toe aan Vercel env."
    );
  }

  const res = await fetch(VOYAGE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      input: text,
      model: VOYAGE_MODEL,
      input_type: "document",
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Voyage embedding faalde (${res.status}): ${body.slice(0, 200)}`);
  }

  const json = (await res.json()) as {
    data?: Array<{ embedding: number[] }>;
  };

  const embedding = json.data?.[0]?.embedding;
  if (!embedding || embedding.length !== EXPECTED_DIM) {
    throw new Error(
      `Voyage gaf onverwachte embedding (lengte ${embedding?.length ?? 0}, verwacht ${EXPECTED_DIM})`
    );
  }

  return embedding;
}

/** Batch-versie voor sync van veel rules tegelijk (bv. tijdens onboarding). */
export async function embedBatch(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  const apiKey = process.env.VOYAGE_API_KEY;
  if (!apiKey) {
    throw new Error("VOYAGE_API_KEY ontbreekt");
  }

  const res = await fetch(VOYAGE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      input: texts,
      model: VOYAGE_MODEL,
      input_type: "document",
    }),
  });

  if (!res.ok) {
    throw new Error(`Voyage batch embedding faalde (${res.status})`);
  }

  const json = (await res.json()) as {
    data?: Array<{ embedding: number[]; index: number }>;
  };

  if (!json.data || json.data.length !== texts.length) {
    throw new Error("Voyage batch gaf onvolledige results terug");
  }

  // Voyage garandeert order via `index` veld
  const sorted = [...json.data].sort((a, b) => a.index - b.index);
  return sorted.map((d) => d.embedding);
}

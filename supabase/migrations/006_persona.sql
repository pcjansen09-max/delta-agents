-- DeltaAgents Persona Layer (006)
-- Maakt de agent menselijk: per-bedrijf tone-of-voice + per-medewerker
-- schrijfstijl-notities + episodisch geheugen ("klant Boskalis betaalt
-- traag", "Jan vraagt vaak op vrijdag om planning").
--
-- Onderscheid:
--   Wisdom Rules (004)   = EXPLICIETE regels (factuur naar X, BTW 21%, etc)
--   Episodic Memory (006) = IMPLICIETE observaties + patterns over mensen
--   Persona (006)        = SCHRIJFSTIJL — hoe spreek je tot wie

-- ============================================================
-- COMPANY PERSONA — extends deltaagents_companies
-- ============================================================
ALTER TABLE deltaagents_companies
  ADD COLUMN IF NOT EXISTS persona_voice TEXT,
  ADD COLUMN IF NOT EXISTS persona_examples JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS persona_avoid TEXT,
  ADD COLUMN IF NOT EXISTS reply_style TEXT DEFAULT 'standaard'
    CHECK (reply_style IN ('kort_bondig', 'standaard', 'uitgebreid', 'informeel'));

COMMENT ON COLUMN deltaagents_companies.persona_voice IS
  'Eigen tone-of-voice in 1-3 zinnen. Bv: "Wij zijn altijd direct en zakelijk, geen overdaad, lichte humor bij vaste klanten."';
COMMENT ON COLUMN deltaagents_companies.persona_examples IS
  'Array van { trigger: "wat de klant zegt", response: "hoe wij antwoorden" } voor few-shot prompting.';
COMMENT ON COLUMN deltaagents_companies.persona_avoid IS
  'Wat de agent NOOIT mag doen of zeggen. Bv: "geen emoji, geen Engelse woorden, niet over politiek".';

-- ============================================================
-- USER STYLE NOTES — extends deltaagents_users
-- ============================================================
ALTER TABLE deltaagents_users
  ADD COLUMN IF NOT EXISTS style_notes TEXT,
  ADD COLUMN IF NOT EXISTS preferred_reply_length TEXT DEFAULT 'auto'
    CHECK (preferred_reply_length IN ('kort', 'auto', 'uitgebreid'));

COMMENT ON COLUMN deltaagents_users.style_notes IS
  'Korte aantekening hoe de agent met deze medewerker spreekt. Bv: "Jan houdt van korte berichten, gebruikt veel afkortingen, geen tussenkopjes."';

-- ============================================================
-- EPISODIC MEMORY — impliciete observaties over klanten/medewerkers
-- Niet voor regels (die zijn explicit in wisdom), maar voor PATTERNS
-- en historische context.
-- ============================================================
CREATE TABLE IF NOT EXISTS deltaagents_episodic_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES deltaagents_companies(id) ON DELETE CASCADE,

  -- Over wie gaat dit geheugen
  subject_type TEXT NOT NULL CHECK (subject_type IN ('customer', 'user', 'company')),
  subject_id TEXT NOT NULL,

  -- De observatie zelf
  observation TEXT NOT NULL,

  -- Categorisering voor filter/retrieval
  category TEXT DEFAULT 'general' CHECK (category IN (
    'communication',  -- "Jan antwoordt altijd binnen 5 min"
    'preference',     -- "Klant De Vries wil facturen op de 1e"
    'pattern',        -- "Bestelt elke maandag onderdelen"
    'context',        -- "Bedrijf heeft brand gehad in 2024"
    'relationship',   -- "Voorman is broer van directie"
    'general'
  )),

  -- Embedding voor retrieval bij relevant gesprek
  embedding vector(1536),

  -- Confidence + decay (alleen geobserveerde patterns, niet bevestigd)
  confidence NUMERIC(3, 2) DEFAULT 0.70 CHECK (confidence BETWEEN 0 AND 1),
  observation_count INT DEFAULT 1,
  last_observed_at TIMESTAMPTZ DEFAULT NOW(),

  -- Origin
  source_conversation_id UUID REFERENCES deltaagents_wa_conversations(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE deltaagents_episodic_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "eigen data" ON deltaagents_episodic_memory FOR ALL USING (
  company_id IN (
    SELECT id FROM deltaagents_companies WHERE owner_email = auth.jwt()->>'email'
  )
);

CREATE INDEX idx_deltaagents_episodic_subject
  ON deltaagents_episodic_memory(company_id, subject_type, subject_id);
CREATE INDEX idx_deltaagents_episodic_embedding
  ON deltaagents_episodic_memory USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE TRIGGER deltaagents_episodic_updated_at
  BEFORE UPDATE ON deltaagents_episodic_memory
  FOR EACH ROW EXECUTE FUNCTION deltaagents_set_updated_at();

-- Retrieval helper voor episodic memory rond een specifiek subject
CREATE OR REPLACE FUNCTION deltaagents_find_episodic(
  p_company_id UUID,
  p_subject_type TEXT,
  p_subject_id TEXT,
  p_query_embedding vector(1536) DEFAULT NULL,
  p_top_k INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  observation TEXT,
  category TEXT,
  confidence NUMERIC,
  similarity NUMERIC,
  observation_count INT,
  last_observed_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_query_embedding IS NULL THEN
    -- Geen query → return meest-recent + meest-geobserveerd
    RETURN QUERY
    SELECT
      m.id, m.observation, m.category, m.confidence,
      1.0::NUMERIC AS similarity,
      m.observation_count, m.last_observed_at
    FROM deltaagents_episodic_memory m
    WHERE m.company_id = p_company_id
      AND m.subject_type = p_subject_type
      AND m.subject_id = p_subject_id
      AND m.confidence >= 0.3
    ORDER BY m.observation_count DESC, m.last_observed_at DESC
    LIMIT p_top_k;
  ELSE
    -- Met query → semantic search
    RETURN QUERY
    SELECT
      m.id, m.observation, m.category, m.confidence,
      (1 - (m.embedding <=> p_query_embedding))::NUMERIC AS similarity,
      m.observation_count, m.last_observed_at
    FROM deltaagents_episodic_memory m
    WHERE m.company_id = p_company_id
      AND m.subject_type = p_subject_type
      AND m.subject_id = p_subject_id
      AND m.confidence >= 0.3
      AND m.embedding IS NOT NULL
    ORDER BY m.embedding <=> p_query_embedding
    LIMIT p_top_k;
  END IF;
END;
$$;

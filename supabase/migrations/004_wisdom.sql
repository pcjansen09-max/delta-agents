-- DeltaAgents Wisdom Layer (004)
-- De zelflerende kern: expliciete regels per company die de agent toepast.
-- Geen 'vage AI-magie' — concrete regels die de ondernemer kan inzien en bewerken.

-- ============================================================
-- ENABLE PGVECTOR (voor semantische rule retrieval)
-- ============================================================
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================
-- WISDOM RULES — per-company knowledge base
-- ============================================================
CREATE TABLE IF NOT EXISTS deltaagents_wisdom_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES deltaagents_companies(id) ON DELETE CASCADE,

  -- De regel zelf, in natuurlijke taal
  rule_text TEXT NOT NULL,

  -- Categorie voor filter/sort in dashboard
  category TEXT NOT NULL DEFAULT 'general' CHECK (
    category IN ('pricing', 'customer', 'communication', 'workflow', 'security', 'general')
  ),

  -- Waar komt de regel vandaan?
  source TEXT NOT NULL DEFAULT 'user-correction' CHECK (
    source IN ('onboarding', 'user-correction', 'auto-detected', 'system')
  ),

  -- 0.0 - 1.0; rules onder threshold (0.3) zijn inactief
  confidence NUMERIC(3, 2) DEFAULT 1.00 CHECK (confidence BETWEEN 0 AND 1),

  -- Tracking: hoe vaak en wanneer toegepast
  applied_count INT DEFAULT 0,
  last_applied_at TIMESTAMPTZ,

  -- Optioneel: scope (per-klant, per-medewerker, etc.)
  scope_type TEXT,                        -- 'customer', 'user', 'global'
  scope_id TEXT,                          -- customer.id, user.phone, of NULL voor global

  -- Embedding voor semantic search (1536 = OpenAI text-embedding-3-small dim,
  -- of Voyage/Anthropic equivalent — kies bij implementatie)
  embedding vector(1536),

  -- Soft-delete via active flag; ondernemer kan rules pauzeren
  active BOOLEAN DEFAULT true,

  -- Verloopdatum optioneel (bv. tijdelijke korting tot eind kwartaal)
  expires_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE deltaagents_wisdom_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "eigen data" ON deltaagents_wisdom_rules FOR ALL USING (
  company_id IN (
    SELECT id FROM deltaagents_companies WHERE owner_email = auth.jwt()->>'email'
  )
);

-- Indexen
CREATE INDEX idx_deltaagents_wisdom_active ON deltaagents_wisdom_rules(company_id, active, confidence DESC);
CREATE INDEX idx_deltaagents_wisdom_category ON deltaagents_wisdom_rules(company_id, category);
CREATE INDEX idx_deltaagents_wisdom_scope ON deltaagents_wisdom_rules(company_id, scope_type, scope_id) WHERE scope_type IS NOT NULL;

-- Vector index (IVFFlat — sneller dan HNSW voor MKB-volume, kleinere index)
CREATE INDEX idx_deltaagents_wisdom_embedding ON deltaagents_wisdom_rules
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Trigger: updated_at auto-update
CREATE TRIGGER deltaagents_wisdom_updated_at
  BEFORE UPDATE ON deltaagents_wisdom_rules
  FOR EACH ROW EXECUTE FUNCTION deltaagents_set_updated_at();

-- ============================================================
-- WISDOM APPLICATIONS — log van welke rules zijn toegepast per agent-call
-- Voor "Why did the agent do X?" traceability
-- ============================================================
CREATE TABLE IF NOT EXISTS deltaagents_wisdom_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID NOT NULL REFERENCES deltaagents_wisdom_rules(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES deltaagents_wa_conversations(id) ON DELETE SET NULL,
  action_id UUID REFERENCES deltaagents_actions(id) ON DELETE SET NULL,
  similarity_score NUMERIC(4, 3),         -- cosine similarity bij retrieval
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE deltaagents_wisdom_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "eigen data" ON deltaagents_wisdom_applications FOR ALL USING (
  rule_id IN (
    SELECT id FROM deltaagents_wisdom_rules
    WHERE company_id IN (
      SELECT id FROM deltaagents_companies WHERE owner_email = auth.jwt()->>'email'
    )
  )
);

CREATE INDEX idx_deltaagents_wisdom_app_rule ON deltaagents_wisdom_applications(rule_id, created_at DESC);
CREATE INDEX idx_deltaagents_wisdom_app_conv ON deltaagents_wisdom_applications(conversation_id, created_at DESC);

-- ============================================================
-- WISDOM CONFLICTS — gedetecteerde tegenstrijdigheden, voor user resolution
-- ============================================================
CREATE TABLE IF NOT EXISTS deltaagents_wisdom_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES deltaagents_companies(id) ON DELETE CASCADE,
  rule_a_id UUID NOT NULL REFERENCES deltaagents_wisdom_rules(id) ON DELETE CASCADE,
  rule_b_id UUID NOT NULL REFERENCES deltaagents_wisdom_rules(id) ON DELETE CASCADE,
  resolution TEXT,                        -- 'kept_a', 'kept_b', 'kept_both', 'pending'
  resolved_at TIMESTAMPTZ,
  resolved_by_email TEXT,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(rule_a_id, rule_b_id)
);

ALTER TABLE deltaagents_wisdom_conflicts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "eigen data" ON deltaagents_wisdom_conflicts FOR ALL USING (
  company_id IN (
    SELECT id FROM deltaagents_companies WHERE owner_email = auth.jwt()->>'email'
  )
);

-- ============================================================
-- HELPER FUNCTION: vector similarity search met RLS-respect
-- ============================================================
CREATE OR REPLACE FUNCTION deltaagents_find_relevant_rules(
  p_company_id UUID,
  p_query_embedding vector(1536),
  p_top_k INT DEFAULT 10,
  p_min_confidence NUMERIC DEFAULT 0.3
)
RETURNS TABLE (
  id UUID,
  rule_text TEXT,
  category TEXT,
  confidence NUMERIC,
  similarity NUMERIC,
  scope_type TEXT,
  scope_id TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    r.rule_text,
    r.category,
    r.confidence,
    (1 - (r.embedding <=> p_query_embedding))::NUMERIC AS similarity,
    r.scope_type,
    r.scope_id
  FROM deltaagents_wisdom_rules r
  WHERE r.company_id = p_company_id
    AND r.active = true
    AND r.confidence >= p_min_confidence
    AND (r.expires_at IS NULL OR r.expires_at > NOW())
    AND r.embedding IS NOT NULL
  ORDER BY r.embedding <=> p_query_embedding
  LIMIT p_top_k;
END;
$$;

-- ============================================================
-- HELPER FUNCTION: confidence decay (run periodiek via cron)
-- ============================================================
CREATE OR REPLACE FUNCTION deltaagents_decay_unused_rules(
  p_days_threshold INT DEFAULT 90,
  p_decay_factor NUMERIC DEFAULT 0.9
)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_affected INT;
BEGIN
  UPDATE deltaagents_wisdom_rules
  SET confidence = confidence * p_decay_factor,
      updated_at = NOW()
  WHERE (last_applied_at IS NULL OR last_applied_at < NOW() - (p_days_threshold || ' days')::interval)
    AND active = true
    AND confidence > 0.3;

  GET DIAGNOSTICS v_affected = ROW_COUNT;
  RETURN v_affected;
END;
$$;

-- ============================================================
-- COMMENT op tabel voor toekomstige maintainers
-- ============================================================
COMMENT ON TABLE deltaagents_wisdom_rules IS
  'De Wisdom Layer: expliciete regels per company. De agent past deze toe op elke '
  'interactie. Inspecteerbaar door de ondernemer via dashboard. Zie ARCHITECTURE.md §5.';

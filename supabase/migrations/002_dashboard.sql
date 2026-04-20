-- DeltaAgents Dashboard Schema (prefix: deltaagents_)
-- Toegevoegd aan bestaand Supabase project
-- Alle tabellen gebruiken RLS voor multi-tenant isolatie

CREATE TABLE IF NOT EXISTS deltaagents_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_email TEXT UNIQUE NOT NULL,
  company_name TEXT,
  industry TEXT,
  subscription_tier TEXT DEFAULT 'basis',
  whatsapp_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deltaagents_agent_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES deltaagents_companies(id) ON DELETE CASCADE,
  agent_type TEXT NOT NULL,
  bedrijfsinfo TEXT DEFAULT '',
  prijslijst TEXT DEFAULT '',
  werkwijze TEXT DEFAULT '',
  faq TEXT DEFAULT '',
  actief BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deltaagents_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES deltaagents_companies(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  beschrijving TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deltaagents_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES deltaagents_companies(id) ON DELETE CASCADE,
  service TEXT NOT NULL,
  status TEXT DEFAULT 'disconnected',
  connected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, service)
);

-- RLS op alle tabellen
ALTER TABLE deltaagents_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE deltaagents_agent_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE deltaagents_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE deltaagents_integrations ENABLE ROW LEVEL SECURITY;

-- Policies: gebruiker ziet alleen zijn eigen data via email match
CREATE POLICY "eigen data" ON deltaagents_companies
  FOR ALL USING (owner_email = auth.jwt()->>'email');

CREATE POLICY "eigen data" ON deltaagents_agent_config
  FOR ALL USING (
    company_id IN (
      SELECT id FROM deltaagents_companies WHERE owner_email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "eigen data" ON deltaagents_activity
  FOR ALL USING (
    company_id IN (
      SELECT id FROM deltaagents_companies WHERE owner_email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "eigen data" ON deltaagents_integrations
  FOR ALL USING (
    company_id IN (
      SELECT id FROM deltaagents_companies WHERE owner_email = auth.jwt()->>'email'
    )
  );

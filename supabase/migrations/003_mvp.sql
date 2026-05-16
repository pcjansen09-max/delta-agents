-- DeltaAgents MVP Schema (003)
-- Scenario: voicebericht via WhatsApp -> agent maakt conceptfactuur ->
-- directie typt 'JA' -> factuur via Moneybird verstuurd.
--
-- Prefix: deltaagents_* (consistent met 002_dashboard)
-- Multi-tenant via RLS op company_id, met email-match in auth.jwt().

-- ============================================================
-- USERS (medewerkers van de klant, met WhatsApp toegang)
-- Rolgebaseerde permissies via 06-nummer matching
-- ============================================================
CREATE TABLE IF NOT EXISTS deltaagents_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES deltaagents_companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,                    -- E.164 format (+31...)
  role TEXT NOT NULL CHECK (role IN ('directie', 'voorman', 'monteur')),
  permissions JSONB DEFAULT '{}',         -- override per-permissie
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, phone)
);

ALTER TABLE deltaagents_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "eigen data" ON deltaagents_users FOR ALL USING (
  company_id IN (SELECT id FROM deltaagents_companies WHERE owner_email = auth.jwt()->>'email')
);
CREATE INDEX idx_deltaagents_users_company_phone ON deltaagents_users(company_id, phone);

-- ============================================================
-- CUSTOMERS (klanten van de klant — gesynct uit Moneybird contacts)
-- ============================================================
CREATE TABLE IF NOT EXISTS deltaagents_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES deltaagents_companies(id) ON DELETE CASCADE,
  moneybird_contact_id TEXT,              -- nullable tijdens handmatige invoer
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  notes TEXT,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, moneybird_contact_id)
);

ALTER TABLE deltaagents_customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "eigen data" ON deltaagents_customers FOR ALL USING (
  company_id IN (SELECT id FROM deltaagents_companies WHERE owner_email = auth.jwt()->>'email')
);
CREATE INDEX idx_deltaagents_customers_company_name ON deltaagents_customers(company_id, lower(name));

-- ============================================================
-- PRODUCTS (prijslijst materialen + uurtarieven — uit Moneybird products)
-- ============================================================
CREATE TABLE IF NOT EXISTS deltaagents_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES deltaagents_companies(id) ON DELETE CASCADE,
  moneybird_product_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  unit TEXT DEFAULT 'stuk',               -- 'stuk', 'uur', 'kuub', 'meter', etc
  unit_price NUMERIC(10, 2) NOT NULL,     -- excl BTW
  vat_rate NUMERIC(4, 2) DEFAULT 21.00,
  active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, moneybird_product_id)
);

ALTER TABLE deltaagents_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "eigen data" ON deltaagents_products FOR ALL USING (
  company_id IN (SELECT id FROM deltaagents_companies WHERE owner_email = auth.jwt()->>'email')
);
CREATE INDEX idx_deltaagents_products_company_name ON deltaagents_products(company_id, lower(name));

-- ============================================================
-- WHATSAPP CONVERSATIONS — per gebruiker een doorlopende thread
-- ============================================================
CREATE TABLE IF NOT EXISTS deltaagents_wa_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES deltaagents_companies(id) ON DELETE CASCADE,
  user_phone TEXT NOT NULL,
  user_id UUID REFERENCES deltaagents_users(id) ON DELETE SET NULL,
  context_summary TEXT,                   -- comprimeerd geheugen voor lange threads
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, user_phone)
);

ALTER TABLE deltaagents_wa_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "eigen data" ON deltaagents_wa_conversations FOR ALL USING (
  company_id IN (SELECT id FROM deltaagents_companies WHERE owner_email = auth.jwt()->>'email')
);
CREATE INDEX idx_deltaagents_wa_conv_last ON deltaagents_wa_conversations(company_id, last_message_at DESC);

-- ============================================================
-- WHATSAPP MESSAGES — ruwe inbound/outbound, met transcript voor audio
-- ============================================================
CREATE TABLE IF NOT EXISTS deltaagents_wa_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES deltaagents_wa_conversations(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('in', 'out')),
  type TEXT NOT NULL CHECK (type IN ('text', 'audio', 'image', 'template')),
  text TEXT,                               -- tekstbericht of caption
  audio_url TEXT,                          -- voor in-bound audio (Supabase storage)
  transcript TEXT,                         -- voor audio messages na transcribe
  wa_message_id TEXT,                      -- Meta's message id (idempotency)
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE deltaagents_wa_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "eigen data" ON deltaagents_wa_messages FOR ALL USING (
  conversation_id IN (
    SELECT id FROM deltaagents_wa_conversations
    WHERE company_id IN (SELECT id FROM deltaagents_companies WHERE owner_email = auth.jwt()->>'email')
  )
);
CREATE INDEX idx_deltaagents_wa_msg_conv ON deltaagents_wa_messages(conversation_id, created_at);
CREATE UNIQUE INDEX idx_deltaagents_wa_msg_wa_id ON deltaagents_wa_messages(wa_message_id) WHERE wa_message_id IS NOT NULL;

-- ============================================================
-- AGENT ACTIONS — queue van acties die wachten op approval ('typ JA')
-- ============================================================
CREATE TABLE IF NOT EXISTS deltaagents_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES deltaagents_companies(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES deltaagents_wa_conversations(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('create_invoice', 'send_invoice', 'create_quote', 'send_message')),
  payload JSONB NOT NULL,                 -- bv {customer_id, line_items[], total, vat}
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'executed', 'failed')),
  approved_by_user_id UUID REFERENCES deltaagents_users(id) ON DELETE SET NULL,
  approval_message_id UUID REFERENCES deltaagents_wa_messages(id) ON DELETE SET NULL,
  executed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE deltaagents_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "eigen data" ON deltaagents_actions FOR ALL USING (
  company_id IN (SELECT id FROM deltaagents_companies WHERE owner_email = auth.jwt()->>'email')
);
CREATE INDEX idx_deltaagents_actions_status ON deltaagents_actions(company_id, status, created_at DESC);

-- ============================================================
-- OAUTH TOKENS — Moneybird access/refresh per company
-- service_role only access (server-side). Geen RLS policy = niemand mag lezen.
-- ============================================================
CREATE TABLE IF NOT EXISTS deltaagents_oauth_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES deltaagents_companies(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('moneybird', 'google', 'exact')),
  access_token TEXT NOT NULL,             -- versleuteld opslaan in app-laag
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  scope TEXT,
  administration_id TEXT,                 -- voor Moneybird specifiek
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, provider)
);

ALTER TABLE deltaagents_oauth_tokens ENABLE ROW LEVEL SECURITY;
-- Geen public policy: alleen service_role key kan lezen (server-side OAuth flows).

-- ============================================================
-- AUDIT LOG — alle agent-acties + user-approvals, voor AVG en debugging
-- ============================================================
CREATE TABLE IF NOT EXISTS deltaagents_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES deltaagents_companies(id) ON DELETE CASCADE,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('agent', 'user', 'system', 'webhook')),
  actor_id TEXT,                          -- user phone, agent name, etc
  action TEXT NOT NULL,                   -- 'invoice.created', 'invoice.sent', 'login', etc
  resource_type TEXT,                     -- 'invoice', 'customer', 'message'
  resource_id TEXT,
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE deltaagents_audit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "eigen data" ON deltaagents_audit FOR ALL USING (
  company_id IN (SELECT id FROM deltaagents_companies WHERE owner_email = auth.jwt()->>'email')
);
CREATE INDEX idx_deltaagents_audit_company_time ON deltaagents_audit(company_id, created_at DESC);

-- ============================================================
-- TRIGGERS: updated_at auto-update
-- ============================================================
CREATE OR REPLACE FUNCTION deltaagents_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER deltaagents_oauth_tokens_updated_at
  BEFORE UPDATE ON deltaagents_oauth_tokens
  FOR EACH ROW EXECUTE FUNCTION deltaagents_set_updated_at();

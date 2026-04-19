-- DeltaAgents — Initial Database Schema
-- Multi-tenant architecture with Row-Level Security (RLS)
--
-- IMPORTANT: RLS ensures complete data isolation between tenants.
-- Even if application code has a bug, the database layer prevents
-- cross-tenant data leaks. Every table with company data MUST have
-- a company_id column and an RLS policy.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- COMPANIES (Tenants)
-- Each company is a separate tenant with their own agent config
-- ============================================================
CREATE TABLE companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_name TEXT NOT NULL,
  industry TEXT,
  subscription_tier TEXT DEFAULT 'trial' CHECK (subscription_tier IN ('trial', 'basis', 'premium', 'all-round')),
  twilio_phone_number TEXT,
  whatsapp_number TEXT,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Only authenticated users belonging to this company can read/write
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies: owner access only"
  ON companies
  FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- AGENT MEMORY RULES
-- Long-term memory for each company's digital employee.
-- E.g., pricing rules, communication preferences, blacklisted topics.
-- ============================================================
CREATE TABLE agent_memory_rules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  rule_text TEXT NOT NULL,
  rule_category TEXT DEFAULT 'general' CHECK (rule_category IN ('pricing', 'communication', 'workflow', 'customer', 'general')),
  added_by TEXT DEFAULT 'system', -- 'system', 'onboarding', 'user-correction'
  is_active BOOLEAN DEFAULT true,
  confidence_score FLOAT DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE agent_memory_rules ENABLE ROW LEVEL SECURITY;

-- RLS: Users can only access memory rules for their own company
CREATE POLICY "Memory rules: company isolation"
  ON agent_memory_rules
  FOR ALL
  USING (
    company_id IN (
      SELECT id FROM companies WHERE auth.uid() = id
    )
  );

-- Index for fast retrieval of active rules per company
CREATE INDEX idx_memory_rules_company_active
  ON agent_memory_rules(company_id, is_active);

-- ============================================================
-- COMPANY TASKS
-- Log of all tasks executed by the agent. Used for:
-- - Auditing and debugging
-- - Training data collection (with consent)
-- - Monthly usage reports
-- ============================================================
CREATE TABLE company_tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL CHECK (task_type IN (
    'invoice', 'quote', 'appointment', 'email',
    'whatsapp', 'voice', 'report', 'reminder', 'other'
  )),
  raw_input TEXT,
  processed_input TEXT, -- Cleaned/normalized version
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'requires_approval')),
  claude_response TEXT,
  tool_calls JSONB, -- Record of which tools were invoked
  error_message TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE company_tasks ENABLE ROW LEVEL SECURITY;

-- RLS: Complete task isolation per company
CREATE POLICY "Tasks: company isolation"
  ON company_tasks
  FOR ALL
  USING (
    company_id IN (
      SELECT id FROM companies WHERE auth.uid() = id
    )
  );

-- Performance indexes
CREATE INDEX idx_tasks_company_status
  ON company_tasks(company_id, status, created_at DESC);
CREATE INDEX idx_tasks_type
  ON company_tasks(company_id, task_type, created_at DESC);

-- ============================================================
-- AGENT CONVERSATIONS
-- Chat history per company. Used for context window management.
-- ============================================================
CREATE TABLE agent_conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'web', 'email', 'voice')),
  messages JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE agent_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Conversations: company isolation"
  ON agent_conversations
  FOR ALL
  USING (
    company_id IN (
      SELECT id FROM companies WHERE auth.uid() = id
    )
  );

-- ============================================================
-- FUTURE EXTENSIONS (documented for maintainability)
--
-- 1. APP STORE INTEGRATIONS
--    Table: company_integrations (company_id, integration_type, config_encrypted, is_active)
--    Integrations: Google Calendar, Moneybird, Exact Online, Mollie, Twilio, Vapi.ai
--
-- 2. VECTOR MEMORY (pgvector)
--    ALTER TABLE agent_memory_rules ADD COLUMN embedding vector(1536);
--    CREATE INDEX ON agent_memory_rules USING ivfflat (embedding vector_cosine_ops);
--    Used with Mem0 or direct OpenAI embeddings for semantic memory retrieval.
--
-- 3. WEBHOOKS
--    Table: webhook_endpoints (company_id, url, events[], secret_hash, is_active)
--    Events: task.completed, invoice.sent, appointment.booked
--
-- 4. AUDIT LOG
--    Table: audit_log (company_id, actor, action, resource_type, resource_id, metadata)
--    Required for GDPR compliance and EU AI Act transparency obligations.
-- ============================================================

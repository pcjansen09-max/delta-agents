/**
 * Database row types — mirror van `deltaagents_*` tabellen in Supabase.
 * Bij schema-wijzigingen: hier ook bijwerken.
 * Verwijst naar migrations 002, 003, 004.
 */

export type SubscriptionTier = "trial" | "pilot" | "basis" | "premium" | "all-round";
export type UserRole = "directie" | "voorman" | "monteur";
export type WisdomCategory =
  | "pricing"
  | "customer"
  | "communication"
  | "workflow"
  | "security"
  | "general";
export type WisdomSource =
  | "onboarding"
  | "user-correction"
  | "auto-detected"
  | "system";
export type ActionType =
  | "create_invoice"
  | "send_invoice"
  | "create_quote"
  | "send_message";
export type ActionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "executed"
  | "failed";
export type WaDirection = "in" | "out";
export type WaMessageType = "text" | "audio" | "image" | "template";
export type OAuthProvider = "moneybird" | "google" | "exact";

export interface Company {
  id: string;
  owner_email: string;
  company_name: string | null;
  industry: string | null;
  subscription_tier: SubscriptionTier;
  whatsapp_number: string | null;
  created_at: string;
}

export interface AgentConfig {
  id: string;
  company_id: string;
  agent_type: string;
  bedrijfsinfo: string;
  prijslijst: string;
  werkwijze: string;
  faq: string;
  actief: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  company_id: string;
  type: string;
  beschrijving: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface User {
  id: string;
  company_id: string;
  name: string;
  phone: string;
  role: UserRole;
  permissions: Record<string, boolean>;
  active: boolean;
  created_at: string;
}

export interface Customer {
  id: string;
  company_id: string;
  moneybird_contact_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  last_synced_at: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  company_id: string;
  moneybird_product_id: string | null;
  name: string;
  description: string | null;
  unit: string;
  unit_price: number;
  vat_rate: number;
  active: boolean;
  last_synced_at: string | null;
  created_at: string;
}

export interface WaConversation {
  id: string;
  company_id: string;
  user_phone: string;
  user_id: string | null;
  context_summary: string | null;
  last_message_at: string;
  created_at: string;
}

export interface WaMessage {
  id: string;
  conversation_id: string;
  direction: WaDirection;
  type: WaMessageType;
  text: string | null;
  audio_url: string | null;
  transcript: string | null;
  wa_message_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface AgentAction {
  id: string;
  company_id: string;
  conversation_id: string | null;
  type: ActionType;
  payload: Record<string, unknown>;
  status: ActionStatus;
  approved_by_user_id: string | null;
  approval_message_id: string | null;
  executed_at: string | null;
  error_message: string | null;
  created_at: string;
}

export interface OAuthToken {
  id: string;
  company_id: string;
  provider: OAuthProvider;
  access_token: string;        // encrypted at rest
  refresh_token: string | null; // encrypted at rest
  expires_at: string | null;
  scope: string | null;
  administration_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditEntry {
  id: string;
  company_id: string;
  actor_type: "agent" | "user" | "system" | "webhook";
  actor_id: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  payload: Record<string, unknown>;
  created_at: string;
}

export interface WisdomRule {
  id: string;
  company_id: string;
  rule_text: string;
  category: WisdomCategory;
  source: WisdomSource;
  confidence: number;
  applied_count: number;
  last_applied_at: string | null;
  scope_type: string | null;
  scope_id: string | null;
  embedding: number[] | null;
  active: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WisdomApplication {
  id: string;
  rule_id: string;
  conversation_id: string | null;
  action_id: string | null;
  similarity_score: number | null;
  created_at: string;
}

export interface WisdomConflict {
  id: string;
  company_id: string;
  rule_a_id: string;
  rule_b_id: string;
  resolution: "kept_a" | "kept_b" | "kept_both" | "pending" | null;
  resolved_at: string | null;
  resolved_by_email: string | null;
  detected_at: string;
}

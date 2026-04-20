export interface Company {
  id: string;
  owner_email: string;
  company_name: string | null;
  industry: string | null;
  subscription_tier: string;
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

export interface Activity {
  id: string;
  company_id: string;
  type: string;
  beschrijving: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Integration {
  id: string;
  company_id: string;
  service: string;
  status: string;
  connected_at: string | null;
  created_at: string;
}

export const ACTIVITY_ICONS: Record<string, string> = {
  whatsapp: "💬",
  factuur: "🧾",
  offerte: "📄",
  afspraak: "📅",
  email: "📧",
  telefoon: "📞",
  geheugen: "🧠",
  default: "⚡",
};

export const TIER_LABELS: Record<string, string> = {
  basis: "Basis Werknemer",
  premium: "Premium Werknemer",
  "all-round": "All-Round Werknemer",
};

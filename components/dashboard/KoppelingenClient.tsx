"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Plug } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { logActivity } from "@/lib/activity";

interface Integration {
  id: string;
  name: string;
  domain: string;
  description: string;
  category: string;
  available: boolean; // false = "Binnenkort"
}

const INTEGRATIONS: Integration[] = [
  // COMMUNICATIE
  { id: "whatsapp", name: "WhatsApp Business", domain: "whatsapp.com", description: "Klanten communiceren via WhatsApp met je werknemer", category: "Communicatie", available: true },
  { id: "gmail", name: "Gmail", domain: "gmail.com", description: "E-mails lezen, beantwoorden en versturen", category: "Communicatie", available: false },
  { id: "outlook", name: "Outlook", domain: "microsoft.com", description: "Microsoft e-mail integratie", category: "Communicatie", available: false },
  { id: "slack", name: "Slack", domain: "slack.com", description: "Interne berichten en notificaties", category: "Communicatie", available: false },
  { id: "telegram", name: "Telegram", domain: "telegram.org", description: "Berichten via Telegram", category: "Communicatie", available: false },
  { id: "teams", name: "Microsoft Teams", domain: "microsoft.com", description: "Microsoft Teams integratie", category: "Communicatie", available: false },
  { id: "twilio", name: "Twilio", domain: "twilio.com", description: "SMS en WhatsApp nummers", category: "Communicatie", available: false },
  { id: "vapi", name: "Vapi.ai", domain: "vapi.ai", description: "AI telefoonservice", category: "Communicatie", available: false },
  // BOEKHOUDING
  { id: "moneybird", name: "Moneybird", domain: "moneybird.nl", description: "Facturen en boekhouding", category: "Boekhouding", available: false },
  { id: "exact", name: "Exact Online", domain: "exact.com", description: "ERP en boekhouding", category: "Boekhouding", available: false },
  { id: "twinfield", name: "Twinfield", domain: "twinfield.com", description: "Online boekhouden", category: "Boekhouding", available: false },
  { id: "afas", name: "AFAS", domain: "afas.nl", description: "ERP software", category: "Boekhouding", available: false },
  { id: "snelstart", name: "Snelstart", domain: "snelstart.nl", description: "Boekhoudpakket voor MKB", category: "Boekhouding", available: false },
  { id: "informer", name: "Informer", domain: "informer.eu", description: "Boekhoudsoftware", category: "Boekhouding", available: false },
  { id: "visma", name: "Visma", domain: "visma.nl", description: "Boekhouden en salarisadministratie", category: "Boekhouding", available: false },
  { id: "stripe", name: "Stripe", domain: "stripe.com", description: "Online betalingen", category: "Boekhouding", available: false },
  { id: "mollie", name: "Mollie", domain: "mollie.com", description: "Nederlandse betalingsprovider", category: "Boekhouding", available: false },
  { id: "paypal", name: "PayPal", domain: "paypal.com", description: "Online betalingen", category: "Boekhouding", available: false },
  // PLANNING
  { id: "google-calendar", name: "Google Calendar", domain: "google.com", description: "Agenda en afspraken", category: "Planning", available: true },
  { id: "outlook-calendar", name: "Outlook Calendar", domain: "microsoft.com", description: "Microsoft agenda", category: "Planning", available: false },
  { id: "calendly", name: "Calendly", domain: "calendly.com", description: "Afspraken inplannen", category: "Planning", available: false },
  { id: "cal", name: "Cal.com", domain: "cal.com", description: "Open source afspraken", category: "Planning", available: false },
  { id: "acuity", name: "Acuity Scheduling", domain: "acuityscheduling.com", description: "Afspraken beheer", category: "Planning", available: false },
  { id: "simplybook", name: "Simplybook", domain: "simplybook.me", description: "Reserveringen", category: "Planning", available: false },
  // CRM
  { id: "hubspot", name: "HubSpot", domain: "hubspot.com", description: "CRM en marketing", category: "CRM", available: false },
  { id: "salesforce", name: "Salesforce", domain: "salesforce.com", description: "Enterprise CRM", category: "CRM", available: false },
  { id: "pipedrive", name: "Pipedrive", domain: "pipedrive.com", description: "Sales CRM", category: "CRM", available: false },
  { id: "zoho", name: "Zoho CRM", domain: "zoho.com", description: "CRM platform", category: "CRM", available: false },
  { id: "activecampaign", name: "ActiveCampaign", domain: "activecampaign.com", description: "E-mail marketing en CRM", category: "CRM", available: false },
  { id: "mailchimp", name: "Mailchimp", domain: "mailchimp.com", description: "E-mail marketing", category: "CRM", available: false },
  // E-COMMERCE
  { id: "shopify", name: "Shopify", domain: "shopify.com", description: "Webshop platform", category: "E-commerce", available: false },
  { id: "woocommerce", name: "WooCommerce", domain: "woocommerce.com", description: "WordPress webshop", category: "E-commerce", available: false },
  { id: "bol", name: "Bol.com", domain: "bol.com", description: "Nederlands e-commerce platform", category: "E-commerce", available: false },
  { id: "lightspeed", name: "Lightspeed", domain: "lightspeedhq.com", description: "Kassasysteem en webshop", category: "E-commerce", available: false },
  { id: "magento", name: "Magento", domain: "magento.com", description: "E-commerce platform", category: "E-commerce", available: false },
  { id: "wix", name: "Wix", domain: "wix.com", description: "Website builder", category: "E-commerce", available: false },
  // OPSLAG
  { id: "gdrive", name: "Google Drive", domain: "google.com", description: "Bestanden opslaan en delen", category: "Overig", available: false },
  { id: "dropbox", name: "Dropbox", domain: "dropbox.com", description: "Cloud opslag", category: "Overig", available: false },
  { id: "onedrive", name: "OneDrive", domain: "microsoft.com", description: "Microsoft cloud opslag", category: "Overig", available: false },
  { id: "notion", name: "Notion", domain: "notion.so", description: "Notities en documenten", category: "Overig", available: false },
  { id: "confluence", name: "Confluence", domain: "atlassian.com", description: "Team documentatie", category: "Overig", available: false },
  { id: "sharepoint", name: "SharePoint", domain: "microsoft.com", description: "Microsoft documenten", category: "Overig", available: false },
  // PROJECTMANAGEMENT
  { id: "trello", name: "Trello", domain: "trello.com", description: "Taakbeheer", category: "Overig", available: false },
  { id: "asana", name: "Asana", domain: "asana.com", description: "Project management", category: "Overig", available: false },
  { id: "monday", name: "Monday.com", domain: "monday.com", description: "Werkbeheer", category: "Overig", available: false },
  { id: "jira", name: "Jira", domain: "atlassian.com", description: "Projecten en issues", category: "Overig", available: false },
  { id: "clickup", name: "ClickUp", domain: "clickup.com", description: "Alles-in-één werkplek", category: "Overig", available: false },
  { id: "basecamp", name: "Basecamp", domain: "basecamp.com", description: "Projectmanagement", category: "Overig", available: false },
  // AUTOMATISERING
  { id: "zapier", name: "Zapier", domain: "zapier.com", description: "Automatiseringen koppelen", category: "Overig", available: false },
  { id: "make", name: "Make", domain: "make.com", description: "Automatiseringsplatform", category: "Overig", available: false },
  { id: "n8n", name: "n8n", domain: "n8n.io", description: "Open source automatisering", category: "Overig", available: false },
  { id: "airtable", name: "Airtable", domain: "airtable.com", description: "Database en spreadsheets", category: "Overig", available: false },
  { id: "gsheets", name: "Google Sheets", domain: "google.com", description: "Online spreadsheets", category: "Overig", available: false },
  { id: "typeform", name: "Typeform", domain: "typeform.com", description: "Formulieren", category: "Overig", available: false },
  { id: "sendgrid", name: "Twilio SendGrid", domain: "sendgrid.com", description: "E-mail delivery", category: "Overig", available: false },
];

const CATEGORIES = ["Alle", "Communicatie", "Boekhouding", "Planning", "CRM", "E-commerce", "Overig"];

interface Props {
  companyId: string;
  connectedServices: string[];
}

export default function KoppelingenClient({ companyId, connectedServices }: Props) {
  const [activeCategory, setActiveCategory] = useState("Alle");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return INTEGRATIONS.filter((i) => {
      const matchCat = activeCategory === "Alle" || i.category === activeCategory;
      const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="pt-16 md:pt-0 space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-700 text-white mb-1">Koppelingen</h1>
        <p className="text-slate-400 text-sm">
          Verbind jouw Digitale Werknemer met de tools die jij al gebruikt.
        </p>
      </motion.div>

      {/* Search + filters */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoek een koppeling..."
            className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-blue-500/40 transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat
                  ? "bg-blue-600 text-white"
                  : "glass text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((integration, i) => {
          const isConnected = connectedServices.includes(integration.id);
          return (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.4) }}
              className="glass rounded-2xl p-4 flex flex-col gap-3 hover:bg-white/[0.04] transition-colors"
            >
              {/* Logo + name */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://logo.clearbit.com/${integration.domain}`}
                    alt={integration.name}
                    className="w-7 h-7 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                  <Plug className="w-4 h-4 text-slate-500 hidden" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{integration.name}</p>
                  <p className="text-slate-500 text-xs">{integration.category}</p>
                </div>
              </div>

              <p className="text-slate-400 text-xs leading-relaxed flex-1">{integration.description}</p>

              {/* Status button */}
              {isConnected ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-green-400 text-xs font-medium">Verbonden</span>
                </div>
              ) : integration.available ? (
                <button
                  onClick={async () => {
                    const supabase = createClient();
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) return;
                    const { data: company } = await supabase
                      .from("deltaagents_companies")
                      .select("id")
                      .eq("owner_email", user.email!)
                      .single();
                    if (company) {
                      await logActivity(supabase, company.id, "integratie_interesse", `${integration.name} integratie aangevraagd`);
                    }
                  }}
                  className="w-full py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 text-xs font-semibold transition-all"
                >
                  Verbinden
                </button>
              ) : (
                <div className="w-full py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-slate-600 text-xs font-medium text-center">
                  Binnenkort beschikbaar
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <Plug className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p>Geen koppelingen gevonden voor &quot;{search}&quot;</p>
        </div>
      )}
    </div>
  );
}

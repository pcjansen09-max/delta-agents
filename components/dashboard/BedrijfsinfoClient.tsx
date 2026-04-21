"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Check } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { logActivity } from "@/lib/activity";
import type { AgentConfig } from "@/lib/dashboard";

const TABS = [
  {
    key: "bedrijfsinfo" as const,
    label: "Algemeen",
    placeholder: `Beschrijf je bedrijf volledig. Bijvoorbeeld:
Wij zijn [naam], een [sector] bedrijf gevestigd in [plaats].
Wij zijn bereikbaar op [tel] en [email].
Onze openingstijden zijn [...]
Wij werken voor [doelgroep] en onderscheiden ons door [USP's].`,
  },
  {
    key: "prijslijst" as const,
    label: "Prijslijst",
    placeholder: `Vermeld al je diensten en prijzen. Bijvoorbeeld:
- Standaard inspectie: €150 ex btw
- Maandelijks onderhoud: €299/maand
- Spoedservice: €75 toeslag
Geef ook aan welke betalingsmethoden je accepteert.`,
  },
  {
    key: "werkwijze" as const,
    label: "Werkwijze",
    placeholder: `Beschrijf hoe je werkt. Bijvoorbeeld:
1. Klant neemt contact op via WhatsApp of website
2. Wij plannen een gratis kennismaking
3. Wij sturen een offerte binnen 24 uur
4. Na akkoord starten we binnen [X] werkdagen`,
  },
  {
    key: "faq" as const,
    label: "FAQ",
    placeholder: `Voeg veelgestelde vragen toe. Bijvoorbeeld:
V: Wat kost een [dienst]?
A: Dat hangt af van [factoren]. Gemiddeld rekenen we [prijs].

V: Hoe snel kunnen jullie starten?
A: Wij starten doorgaans binnen [X] werkdagen na akkoord.`,
  },
] as const;

type TabKey = (typeof TABS)[number]["key"];

interface Props {
  companyId: string;
  initialConfig: AgentConfig | null;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

function progressColor(pct: number): string {
  if (pct < 50) return "from-red-500 to-red-400";
  if (pct < 80) return "from-amber-500 to-orange-400";
  return "from-emerald-500 to-green-400";
}

export default function BedrijfsinfoClient({ companyId, initialConfig }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("bedrijfsinfo");
  const [values, setValues] = useState({
    bedrijfsinfo: initialConfig?.bedrijfsinfo ?? "",
    prijslijst: initialConfig?.prijslijst ?? "",
    werkwijze: initialConfig?.werkwijze ?? "",
    faq: initialConfig?.faq ?? "",
  });
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedValuesRef = useRef(values);

  const filled = Object.values(values).filter((v) => v.trim().length > 0).length;
  const pct = Math.round((filled / 4) * 100);

  const saveToSupabase = useCallback(async (vals: typeof values) => {
    setSaveStatus("saving");
    const supabase = createClient();
    try {
      if (initialConfig?.id) {
        await supabase
          .from("deltaagents_agent_config")
          .update(vals)
          .eq("id", initialConfig.id);
      } else {
        await supabase
          .from("deltaagents_agent_config")
          .insert({ company_id: companyId, agent_type: "klantenservice", ...vals });
      }
      await logActivity(supabase, companyId, "bedrijfsinfo_update", "Bedrijfsinfo bijgewerkt");
      savedValuesRef.current = vals;
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("error");
    }
  }, [companyId, initialConfig?.id]);

  function handleChange(key: TabKey, value: string) {
    const next = { ...values, [key]: value };
    setValues(next);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveToSupabase(next);
    }, 2000);
  }

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const currentTab = TABS.find((t) => t.key === activeTab)!;
  const charCount = values[activeTab].trim().length;

  return (
    <div className="pt-16 md:pt-0 space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-700 text-white mb-1">Bedrijfsinfo</h1>
        <p className="text-slate-400 text-sm">
          Hoe meer je invult, hoe beter jouw Digitale Werknemer presteert.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Editor kolom */}
        <div className="lg:col-span-2 space-y-4">
          {/* Voortgang */}
          <div className="glass rounded-2xl px-4 py-3">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Je werknemer is <span className={pct >= 80 ? "text-emerald-400" : pct >= 50 ? "text-amber-400" : "text-red-400"} style={{fontWeight:600}}>{pct}%</span> ingewerkt</span>
              <span className="text-slate-300">{filled}/4 secties ingevuld</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${progressColor(pct)} transition-all duration-500`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Tabs + editor */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="flex border-b border-white/[0.06]">
              {TABS.map((tab) => {
                const isFilled = values[tab.key].trim().length > 0;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 px-2 py-3 text-xs sm:text-sm font-medium transition-colors relative ${
                      activeTab === tab.key ? "text-white" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {tab.label}
                    {isFilled && (
                      <span className="ml-1 w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    )}
                    {activeTab === tab.key && (
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-blue-500" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-4">
              <textarea
                value={values[activeTab]}
                onChange={(e) => handleChange(activeTab, e.target.value)}
                placeholder={currentTab.placeholder}
                style={{ minHeight: "200px" }}
                className="w-full bg-transparent text-white text-sm placeholder-slate-600 outline-none resize-none leading-relaxed"
              />
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04]">
                <span className="text-slate-600 text-xs">{charCount} tekens</span>
                <span className={`text-xs flex items-center gap-1.5 transition-opacity ${
                  saveStatus === "idle" ? "opacity-0" : "opacity-100"
                }`}>
                  {saveStatus === "saving" && (
                    <><div className="w-3 h-3 border border-slate-500/30 border-t-slate-400 rounded-full animate-spin" /><span className="text-slate-500">Opslaan...</span></>
                  )}
                  {saveStatus === "saved" && (
                    <><Check className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">Opgeslagen ✓</span></>
                  )}
                  {saveStatus === "error" && (
                    <span className="text-red-400">Opslaan mislukt, probeer opnieuw</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tip kolom */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5 border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent">
            <div className="flex items-center gap-2 text-amber-400 mb-3">
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm font-semibold">Tip van DeltaAgents</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              Hoe meer je invult, hoe beter je werknemer presteert.
            </p>
            <ul className="space-y-2">
              {[
                "Je exacte tarieven en prijzen",
                "Vaste klanten en hun voorkeuren",
                "Veelgestelde vragen en antwoorden",
                "Hoe jij wil dat hij communiceert",
                "Uitzonderingen en speciale regels",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-xs text-slate-400">
                  <Check className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Tab-specifieke tip */}
          <div className="glass rounded-2xl p-5">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              {currentTab.label} — tips
            </p>
            <p className="text-slate-400 text-xs leading-relaxed">
              {activeTab === "bedrijfsinfo" && "Beschrijf je bedrijf alsof je een nieuwe medewerker inwerkt. Wie zijn jullie klanten? Wat maakt jouw aanpak uniek?"}
              {activeTab === "prijslijst" && "Geef duidelijke prijzen per dienst. Je werknemer gebruikt deze voor offertes en facturen. Hoe specifieker, hoe beter."}
              {activeTab === "werkwijze" && "Beschrijf je betalingstermijnen, garanties en werkgebied. Dit voorkomt misverstanden met klanten."}
              {activeTab === "faq" && "Schrijf de vragen die je het vaakst krijgt. Je werknemer geeft dan direct het juiste antwoord."}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

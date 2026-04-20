"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Lightbulb, Check } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import type { AgentConfig } from "@/lib/dashboard";

const TABS = [
  { key: "bedrijfsinfo", label: "Algemeen", placeholder: "Beschrijf je bedrijf: wat doe je, voor wie, in welk gebied? Bijv. 'Ik ben een hovenier in Noord-Holland, actief since 2015, gespecialiseerd in onderhoud van zakelijke tuinen...'" },
  { key: "prijslijst", label: "Prijslijst", placeholder: "Vul hier je tarieven in. Bijv.:\n- Tuinonderhoud: €45/uur\n- Gazon maaien (tot 100m2): €60 per keer\n- Snoeien hagen: €55/uur\n- Voorrijkosten: €25" },
  { key: "werkwijze", label: "Werkwijze", placeholder: "Hoe werk je? Bijv.:\n- Betaling: binnen 14 dagen na factuur\n- Betalingsmethoden: iDEAL, bank\n- Garantie: 1 maand op geleverd werk\n- Werkgebied: 40km rondom Amsterdam" },
  { key: "faq", label: "FAQ", placeholder: "Veelgestelde vragen van jouw klanten. Bijv.:\nV: Werk je ook in het weekend?\nA: Ja, tegen een toeslag van 25%\n\nV: Hoe snel kan je komen?\nA: Spoed binnen 3 werkdagen mogelijk" },
] as const;

type TabKey = typeof TABS[number]["key"];

interface Props {
  companyId: string;
  initialConfig: AgentConfig | null;
}

export default function BedrijfsinfoClient({ companyId, initialConfig }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("bedrijfsinfo");
  const [values, setValues] = useState({
    bedrijfsinfo: initialConfig?.bedrijfsinfo ?? "",
    prijslijst: initialConfig?.prijslijst ?? "",
    werkwijze: initialConfig?.werkwijze ?? "",
    faq: initialConfig?.faq ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const currentTab = TABS.find((t) => t.key === activeTab)!;
  const filled = Object.values(values).filter((v) => v.trim().length > 0).length;

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();

    if (initialConfig?.id) {
      await supabase
        .from("deltaagents_agent_config")
        .update(values)
        .eq("id", initialConfig.id);
    } else {
      await supabase
        .from("deltaagents_agent_config")
        .insert({ company_id: companyId, agent_type: "klantenservice", ...values });
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

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
        {/* Main editor */}
        <div className="lg:col-span-2 space-y-4">
          {/* Progress */}
          <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>Profiel compleetheid</span>
                <span className="text-slate-300">{filled}/4 secties ingevuld</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500"
                  style={{ width: `${(filled / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="flex border-b border-white/[0.06]">
              {TABS.map((tab) => {
                const isFilled = values[tab.key].trim().length > 0;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 px-3 py-3 text-sm font-medium transition-colors relative ${
                      activeTab === tab.key
                        ? "text-white"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {tab.label}
                    {isFilled && (
                      <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
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
                onChange={(e) => setValues((v) => ({ ...v, [activeTab]: e.target.value }))}
                placeholder={currentTab.placeholder}
                rows={12}
                className="w-full bg-transparent text-white text-sm placeholder-slate-600 outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-all"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                Opgeslagen!
              </>
            ) : saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Opslaan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Opslaan
              </>
            )}
          </button>
        </div>

        {/* Tip box */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5 border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent">
            <div className="flex items-center gap-2 text-amber-400 mb-3">
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm font-semibold">Tip van DeltaAgents</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Hoe meer je invult, hoe beter je werknemer presteert. Voeg toe:
            </p>
            <ul className="mt-3 space-y-1.5">
              {[
                "Je exacte tarieven en prijzen",
                "Vaste klanten en hun voorkeuren",
                "Veelgestelde vragen",
                "Hoe jij wil dat hij communiceert",
                "Uitzonderingen en speciale regels",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-xs text-slate-400">
                  <span className="text-amber-400 mt-0.5">→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Tab tips */}
          <div className="glass rounded-2xl p-5">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">
              {currentTab.label} — tips
            </p>
            {activeTab === "bedrijfsinfo" && (
              <p className="text-slate-400 text-xs leading-relaxed">
                Beschrijf je bedrijf alsof je een nieuwe medewerker inwerkt. Wie zijn jullie klanten? Wat maakt jouw aanpak uniek?
              </p>
            )}
            {activeTab === "prijslijst" && (
              <p className="text-slate-400 text-xs leading-relaxed">
                Geef duidelijke prijzen per dienst. Je werknemer gebruikt deze voor offertes en facturen. Hoe specifieker, hoe beter.
              </p>
            )}
            {activeTab === "werkwijze" && (
              <p className="text-slate-400 text-xs leading-relaxed">
                Beschrijf je betalingstermijnen, garanties en werkgebied. Dit voorkomt misverstanden met klanten.
              </p>
            )}
            {activeTab === "faq" && (
              <p className="text-slate-400 text-xs leading-relaxed">
                Schrijf de vragen die je het vaakst krijgt. Je werknemer geeft dan direct het juiste antwoord.
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

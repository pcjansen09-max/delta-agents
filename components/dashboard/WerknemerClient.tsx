"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Phone, BookOpen, MessageSquare, Rocket, Power, Copy, Check, AlertTriangle, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { logActivity } from "@/lib/activity";
import Link from "next/link";

interface Props {
  companyId: string;
  industry: string | null;
  actief: boolean;
  whatsappNumber: string | null;
}

const INDUSTRY_LABELS: Record<string, string> = {
  makelaar: "Makelaar Agent",
  hovenier: "Hovenier Agent",
  installateur: "Installateur Agent",
  kapper: "Kapper Agent",
  bakker: "Bakker Agent",
  restaurant: "Restaurant Agent",
  webshop: "Webshop Agent",
  advies: "Advies Agent",
  overig: "Klantenservice Agent",
};

const STEPS = [
  {
    icon: "📝",
    title: "Bedrijfsinfo invoeren",
    desc: "Hoe meer details, hoe beter de antwoorden. Voeg je tarieven, FAQ en werkwijze toe.",
    color: "text-blue-400",
    bg: "from-blue-500/15 to-blue-600/5",
    border: "border-blue-500/20",
  },
  {
    icon: "🔍",
    title: "Eerste week actief corrigeren",
    desc: "Stuur correcties via WhatsApp: \"Niet zo zeggen, zeg liever...\" — hij onthoudt het.",
    color: "text-violet-400",
    bg: "from-violet-500/15 to-violet-600/5",
    border: "border-violet-500/20",
  },
  {
    icon: "🚀",
    title: "Autonoom werken",
    desc: "Na de inwerkfase werkt hij zelfstandig 24/7. Jij hoeft er niks meer aan te doen.",
    color: "text-emerald-400",
    bg: "from-emerald-500/15 to-emerald-600/5",
    border: "border-emerald-500/20",
  },
];

export default function WerknemerClient({ companyId, industry, actief: initialActief, whatsappNumber }: Props) {
  const [actief, setActief] = useState(initialActief);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const agentLabel = INDUSTRY_LABELS[industry ?? "overig"] ?? "Klantenservice Agent";

  async function toggleActief() {
    setSaving(true);
    const supabase = createClient();
    const newActief = !actief;

    const { data: existing } = await supabase
      .from("deltaagents_agent_config")
      .select("id")
      .eq("company_id", companyId)
      .single();

    if (existing) {
      await supabase
        .from("deltaagents_agent_config")
        .update({ actief: newActief })
        .eq("company_id", companyId);
    } else {
      await supabase
        .from("deltaagents_agent_config")
        .insert({ company_id: companyId, agent_type: "klantenservice", actief: newActief });
    }

    await logActivity(supabase, companyId, "agent_status",
      newActief ? "Agent geactiveerd" : "Agent gepauzeerd"
    );

    setActief(newActief);
    setSaving(false);
  }

  function copyNumber() {
    if (!whatsappNumber) return;
    navigator.clipboard.writeText(whatsappNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="pt-16 md:pt-0 space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-700 text-white mb-1">Mijn Werknemer</h1>
        <p className="text-slate-400 text-sm">Beheer en monitor jouw Digitale Werknemer.</p>
      </motion.div>

      {/* Gepauzeerd banner */}
      {!actief && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 glass rounded-xl p-4 border border-amber-500/20 bg-amber-500/5"
        >
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <p className="text-amber-300 text-sm">
            Je werknemer is gepauzeerd. Bezoekers krijgen momenteel geen antwoord.
          </p>
        </motion.div>
      )}

      {/* Agent card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-2xl flex-shrink-0">
              🤖
            </div>
            <div>
              <h2 className="font-display text-xl font-700 text-white">Jouw Digitale Werknemer</h2>
              <p className="text-slate-400 text-sm">{agentLabel}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className={`w-2 h-2 rounded-full ${actief ? "bg-green-400 animate-pulse" : "bg-amber-400"}`} />
                <span className={`text-xs font-medium ${actief ? "text-green-400" : "text-amber-400"}`}>
                  {actief ? "Actief" : "Gepauzeerd"}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={toggleActief}
            disabled={saving}
            aria-label={actief ? "Werknemer pauzeren" : "Werknemer activeren"}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${
              actief
                ? "glass border border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            <Power className="w-4 h-4" />
            {saving ? "Opslaan..." : actief ? "Pauzeren" : "Activeren"}
          </button>
        </div>

        {/* WhatsApp sectie */}
        <div className="mt-5 pt-5 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 mb-3">
            <Phone className="w-4 h-4 text-slate-500" />
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">WhatsApp</span>
          </div>
          {whatsappNumber ? (
            <div className="flex items-center gap-3">
              <span className="text-white text-lg font-semibold">{whatsappNumber}</span>
              <button
                onClick={copyNumber}
                aria-label="Kopieer WhatsApp nummer"
                className="glass rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Gekopieerd!" : "Kopiëren"}
              </button>
            </div>
          ) : (
            <div className="glass rounded-xl p-4 bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/10">
              <p className="text-slate-300 text-sm leading-relaxed">
                <span className="text-green-400 font-semibold">WhatsApp Business koppeling</span> wordt voor jou ingesteld tijdens de inwerkfase.
                Je ontvangt een eigen WhatsApp-nummer waarop klanten 24/7 terecht kunnen.
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Inwerkfase uitleg */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
          <Bot className="w-4 h-4 text-blue-400" />
          Zo haal je het meeste uit je Digitale Werknemer
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[22px] top-8 bottom-8 w-px bg-white/[0.06] hidden sm:block" />

          <div className="space-y-4">
            {STEPS.map((s, i) => (
              <div key={i} className="flex gap-4 relative">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 z-10 bg-gradient-to-br ${s.bg} border ${s.border}`}>
                  {s.icon}
                </div>
                <div className="flex-1 pt-1">
                  <h4 className={`font-semibold text-sm ${s.color} mb-0.5`}>{s.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-5 glass rounded-xl p-4 border border-amber-500/15 bg-amber-500/5">
          <p className="text-slate-400 text-xs leading-relaxed">
            <span className="text-amber-400 font-semibold">Let op:</span> De eerste 3–7 werkdagen is begeleiding essentieel.
            Je werknemer leert snel maar heeft jouw input nodig. Corrigeer direct als hij iets verkeerd zegt — hij onthoudt het voor altijd.
          </p>
        </div>

        <Link
          href="/dashboard/bedrijfsinfo"
          className="mt-4 inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Bedrijfsinfo aanvullen
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </motion.div>
    </div>
  );
}

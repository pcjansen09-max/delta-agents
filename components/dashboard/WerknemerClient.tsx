"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Phone, BookOpen, MessageSquare, Sparkles, Power } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { agents } from "@/lib/agents";
import { TIER_LABELS } from "@/lib/dashboard";

interface Props {
  companyId: string;
  agentType: string;
  actief: boolean;
  whatsappNumber: string | null;
  tier: string;
}

const STEPS = [
  {
    icon: <BookOpen className="w-5 h-5" />,
    step: "Stap 1",
    title: "Bedrijfsinfo invoeren",
    desc: "Voed je werknemer met jouw prijzen, producten, klanten en werkwijze.",
    color: "text-blue-400",
    bg: "from-blue-500/15 to-blue-600/5",
    border: "border-blue-500/20",
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    step: "Stap 2",
    title: "Eerste week corrigeren",
    desc: "Corrigeer hem direct via WhatsApp — hij onthoudt het voor altijd.",
    color: "text-violet-400",
    bg: "from-violet-500/15 to-violet-600/5",
    border: "border-violet-500/20",
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    step: "Stap 3",
    title: "Volledig autonoom",
    desc: "Na de eerste week werkt hij zelfstandig. Jij hoeft er niks meer aan te doen.",
    color: "text-emerald-400",
    bg: "from-emerald-500/15 to-emerald-600/5",
    border: "border-emerald-500/20",
  },
];

export default function WerknemerClient({ companyId, agentType, actief: initialActief, whatsappNumber, tier }: Props) {
  const [actief, setActief] = useState(initialActief);
  const [saving, setSaving] = useState(false);

  const agent = agents.find((a) => a.id === agentType) ?? agents[2];

  async function toggleActief() {
    setSaving(true);
    const supabase = createClient();

    const { data: existing } = await supabase
      .from("deltaagents_agent_config")
      .select("id")
      .eq("company_id", companyId)
      .single();

    if (existing) {
      await supabase
        .from("deltaagents_agent_config")
        .update({ actief: !actief })
        .eq("company_id", companyId);
    } else {
      await supabase
        .from("deltaagents_agent_config")
        .insert({ company_id: companyId, agent_type: agentType, actief: !actief });
    }

    setActief(!actief);
    setSaving(false);
  }

  return (
    <div className="pt-16 md:pt-0 space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-700 text-white mb-1">Mijn Werknemer</h1>
        <p className="text-slate-400 text-sm">Beheer en monitor jouw Digitale Werknemer.</p>
      </motion.div>

      {/* Agent card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: `${agent.colorFrom}22`, border: `1px solid ${agent.colorFrom}33` }}
            >
              {agent.icon}
            </div>
            <div>
              <h2 className="font-display text-xl font-700 text-white">{agent.name}</h2>
              <p className="text-slate-400 text-sm">{TIER_LABELS[tier] ?? tier}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className={`w-2 h-2 rounded-full ${actief ? "bg-green-400 animate-pulse" : "bg-amber-400"}`} />
                <span className={`text-xs font-medium ${actief ? "text-green-400" : "text-amber-400"}`}>
                  {actief ? "Actief" : "Gepauzeerd"}
                </span>
              </div>
            </div>
          </div>

          {/* Toggle */}
          <button
            onClick={toggleActief}
            disabled={saving}
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

        {/* WhatsApp nummer */}
        <div className="mt-5 pt-5 border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <div>
              <p className="text-slate-400 text-xs mb-0.5">WhatsApp nummer</p>
              {whatsappNumber ? (
                <p className="text-white text-sm font-medium">{whatsappNumber}</p>
              ) : (
                <p className="text-slate-500 text-sm italic">
                  Wordt gekoppeld tijdens inwerkfase
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Inwerkfase uitleg */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
          <Bot className="w-4 h-4 text-blue-400" />
          Zo werkt de inwerkfase
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {STEPS.map((s, i) => (
            <div
              key={s.step}
              className={`rounded-2xl p-4 bg-gradient-to-br ${s.bg} border ${s.border}`}
            >
              <div className={`${s.color} mb-2.5 flex items-center gap-2`}>
                {s.icon}
                <span className="text-xs font-bold uppercase tracking-wider">{s.step}</span>
              </div>
              <h4 className="font-semibold text-white text-sm mb-1">{s.title}</h4>
              <p className="text-slate-400 text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="glass rounded-xl p-3.5 text-xs text-slate-400 leading-relaxed">
          <span className="text-amber-400 font-semibold">Let op:</span> De eerste 3–7 dagen is begeleiding belangrijk.
          Corrigeer je werknemer direct als hij iets fout doet — hij onthoudt het voor altijd.
        </div>
      </motion.div>
    </div>
  );
}

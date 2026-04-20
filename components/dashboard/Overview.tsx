"use client";

import { motion } from "framer-motion";
import { MessageSquare, FileText, Clock, Zap, Bot } from "lucide-react";
import type { Activity } from "@/lib/dashboard";

interface Props {
  companyName: string | null;
  tier: string;
  berichtenVandaag: number;
  facturenDezesMaand: number;
  urenBespaard: string;
  agentActief: boolean;
  activities: Activity[];
  activityIcons: Record<string, string>;
}

const STATS = (p: Props) => [
  {
    label: "Berichten beantwoord",
    sub: "vandaag",
    value: p.berichtenVandaag,
    icon: <MessageSquare className="w-5 h-5" />,
    color: "text-blue-400",
    bg: "from-blue-500/15 to-blue-600/5",
  },
  {
    label: "Facturen verstuurd",
    sub: "deze maand",
    value: p.facturenDezesMaand,
    icon: <FileText className="w-5 h-5" />,
    color: "text-violet-400",
    bg: "from-violet-500/15 to-violet-600/5",
  },
  {
    label: "Uren bespaard",
    sub: "totaal",
    value: p.urenBespaard,
    icon: <Clock className="w-5 h-5" />,
    color: "text-emerald-400",
    bg: "from-emerald-500/15 to-emerald-600/5",
  },
  {
    label: "Status agent",
    sub: p.tier,
    value: p.agentActief ? "Actief" : "Gepauzeerd",
    icon: <Zap className="w-5 h-5" />,
    color: p.agentActief ? "text-green-400" : "text-amber-400",
    bg: p.agentActief ? "from-green-500/15 to-green-600/5" : "from-amber-500/15 to-amber-600/5",
  },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Zojuist";
  if (mins < 60) return `${mins} min geleden`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} uur geleden`;
  return `${Math.floor(hrs / 24)} dagen geleden`;
}

export default function DashboardOverview(props: Props) {
  const stats = STATS(props);

  return (
    <div className="pt-16 md:pt-0 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display text-2xl font-700 text-white mb-1">
          {props.companyName ? `Welkom, ${props.companyName}` : "Welkom bij jouw dashboard"}
        </h1>
        <p className="text-slate-400 text-sm">
          Hier zie je alles wat jouw Digitale Werknemer vandaag heeft gedaan.
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className={`glass rounded-2xl p-5 bg-gradient-to-br ${s.bg}`}
          >
            <div className={`${s.color} mb-3`}>{s.icon}</div>
            <div className="font-display text-2xl font-700 text-white mb-0.5">{s.value}</div>
            <div className="text-slate-300 text-sm font-medium">{s.label}</div>
            <div className="text-slate-500 text-xs">{s.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Activity feed */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-400" />
          Recente activiteit
        </h2>

        {props.activities.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm font-medium mb-1">
              Jouw werknemer staat klaar
            </p>
            <p className="text-slate-600 text-xs max-w-xs mx-auto">
              Zodra jouw Digitale Werknemer actief is, zie je hier alle acties die hij voor je uitvoert — van berichten tot facturen.
            </p>
            <a
              href="/dashboard/bedrijfsinfo"
              className="mt-4 inline-block text-blue-400 hover:text-blue-300 text-xs transition-colors"
            >
              Start met bedrijfsinfo invoeren →
            </a>
          </div>
        ) : (
          <div className="space-y-2">
            {props.activities.map((a) => (
              <div
                key={a.id}
                className="flex items-start gap-3 py-2.5 border-b border-white/[0.04] last:border-0"
              >
                <span className="text-base flex-shrink-0 mt-0.5">
                  {props.activityIcons[a.type] ?? props.activityIcons.default}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-sm">{a.beschrijving}</p>
                </div>
                <span className="text-slate-600 text-xs flex-shrink-0 mt-0.5">
                  {timeAgo(a.created_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

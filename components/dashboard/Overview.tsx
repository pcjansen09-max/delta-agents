"use client";

import { motion } from "framer-motion";
import { MessageSquare, Zap, Clock, Bot, AlertTriangle } from "lucide-react";
import Link from "next/link";
import type { Activity } from "@/lib/dashboard";

interface Props {
  companyName: string | null;
  berichtenVandaag: number;
  actiesDezeWeek: number;
  urenBespaard: string;
  agentActief: boolean;
  activities: Activity[];
  activityIcons: Record<string, string>;
  daysSinceCreation: number | null;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Goedemorgen";
  if (h < 18) return "Goedemiddag";
  return "Goedenavond";
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Zojuist";
  if (mins < 60) return `${mins} min geleden`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} uur geleden`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Gisteren";
  return `${days} dagen geleden`;
}

export default function DashboardOverview({
  companyName, berichtenVandaag, actiesDezeWeek, urenBespaard,
  agentActief, activities, activityIcons, daysSinceCreation,
}: Props) {
  const stats = [
    {
      label: "Berichten beantwoord",
      sub: "vandaag",
      value: berichtenVandaag,
      icon: <MessageSquare className="w-5 h-5" />,
      color: "text-blue-400",
      bg: "from-blue-500/15 to-blue-600/5",
    },
    {
      label: "Acties uitgevoerd",
      sub: "afgelopen 7 dagen",
      value: actiesDezeWeek,
      icon: <Zap className="w-5 h-5" />,
      color: "text-violet-400",
      bg: "from-violet-500/15 to-violet-600/5",
    },
    {
      label: "Uren bespaard",
      sub: "totaal geschat",
      value: urenBespaard,
      icon: <Clock className="w-5 h-5" />,
      color: "text-emerald-400",
      bg: "from-emerald-500/15 to-emerald-600/5",
    },
    {
      label: "Status agent",
      sub: agentActief ? "Online en actief" : "Niet actief",
      value: agentActief ? "Actief" : "Gepauzeerd",
      icon: <Bot className="w-5 h-5" />,
      color: agentActief ? "text-green-400" : "text-amber-400",
      bg: agentActief ? "from-green-500/15 to-green-600/5" : "from-amber-500/15 to-amber-600/5",
    },
  ];

  return (
    <div className="pt-16 md:pt-0 space-y-6">
      {/* Inwerkfase banner */}
      {daysSinceCreation !== null && daysSinceCreation < 7 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 glass rounded-xl p-4 border border-amber-500/20 bg-amber-500/5"
        >
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <span className="text-amber-300 font-semibold">
              Je werknemer is pas {daysSinceCreation} {daysSinceCreation === 1 ? "dag" : "dagen"} in dienst.
            </span>{" "}
            <span className="text-amber-400/80">Corrigeer hem actief de eerste week!</span>
          </div>
          <Link
            href="/dashboard/bedrijfsinfo"
            className="text-amber-400 hover:text-amber-300 text-xs font-semibold whitespace-nowrap transition-colors"
          >
            Info aanvullen →
          </Link>
        </motion.div>
      )}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-700 text-white mb-1">
          {getGreeting()}{companyName ? `, ${companyName}` : ""}
        </h1>
        <p className="text-slate-400 text-sm">
          Hier is een overzicht van wat jouw Digitale Werknemer vandaag heeft gedaan.
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

        {activities.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-sm font-medium mb-1">
              Je werknemer is nog stil.
            </p>
            <p className="text-slate-600 text-xs max-w-xs mx-auto mb-4">
              Stuur hem een bericht en kijk hoe hij reageert op klantvragen.
            </p>
            <Link
              href="/dashboard/chat"
              className="inline-flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
            >
              Test je werknemer →
            </Link>
          </div>
        ) : (
          <div className="space-y-1">
            {activities.map((a) => (
              <div
                key={a.id}
                className="flex items-start gap-3 py-2.5 border-b border-white/[0.04] last:border-0"
              >
                <span className="text-base flex-shrink-0 mt-0.5">
                  {activityIcons[a.type] ?? activityIcons.default}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-sm leading-snug truncate">
                    {a.beschrijving ?? a.type}
                  </p>
                </div>
                <span className="text-slate-600 text-xs flex-shrink-0 mt-0.5 whitespace-nowrap">
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

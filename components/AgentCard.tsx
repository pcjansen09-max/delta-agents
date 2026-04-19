"use client";

import { motion } from "framer-motion";
import { MessageSquare, Check } from "lucide-react";
import type { Agent } from "@/lib/agents";
import { useChatStore } from "@/lib/store";

interface AgentCardProps {
  agent: Agent;
  index: number;
}

export default function AgentCard({ agent, index }: AgentCardProps) {
  const openChat = useChatStore((s) => s.openChat);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      whileHover={{ y: -4 }}
      className="group glow-border glass rounded-3xl p-6 flex flex-col gap-4 cursor-default transition-all hover:shadow-card"
    >
      {/* Icon + badge */}
      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
          style={{
            background: `linear-gradient(135deg, ${agent.colorFrom}22, ${agent.colorTo}11)`,
            border: `1px solid ${agent.colorFrom}33`,
          }}
        >
          {agent.icon}
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{
            background: `${agent.colorFrom}18`,
            color: agent.colorFrom,
            border: `1px solid ${agent.colorFrom}30`,
          }}
        >
          Beschikbaar
        </span>
      </div>

      {/* Content */}
      <div>
        <h3 className="font-display font-700 text-white text-lg mb-1">{agent.name}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{agent.description}</p>
      </div>

      {/* Tasks */}
      <ul className="space-y-1.5">
        {agent.tasks.map((task) => (
          <li key={task} className="flex items-center gap-2 text-sm text-slate-400">
            <Check
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{ color: agent.colorFrom }}
            />
            {task}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-auto pt-2">
        <button
          onClick={() => openChat(agent)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
          style={{
            background: `linear-gradient(135deg, ${agent.colorFrom}cc, ${agent.colorTo}bb)`,
            color: "#fff",
          }}
        >
          <MessageSquare className="w-4 h-4" />
          Test nu gratis
        </button>
      </div>
    </motion.div>
  );
}

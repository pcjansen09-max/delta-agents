"use client";

import { motion } from "framer-motion";
import { agents } from "@/lib/agents";
import AgentCard from "./AgentCard";

export default function AgentsGrid() {
  return (
    <section id="agents" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4 block">
            Digitale Werknemers
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-700 tracking-tight mb-4">
            Kies jouw{" "}
            <span className="gradient-text">specialist</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            8 gespecialiseerde AI-werknemers, elk getraind op hun vakgebied.
            Test ze direct — geen account nodig.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {agents.map((agent, i) => (
            <AgentCard key={agent.id} agent={agent} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

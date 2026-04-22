"use client";

import { motion } from "framer-motion";

const SECTORS = [
  { emoji: "🏡", label: "Makelaars" },
  { emoji: "🌿", label: "Hoveniers" },
  { emoji: "🔧", label: "Installateurs" },
  { emoji: "🏗️", label: "Aannemers" },
  { emoji: "💇", label: "Kappers" },
  { emoji: "🍕", label: "Horeca" },
  { emoji: "🚗", label: "Garagebedrijven" },
  { emoji: "🏥", label: "Zorgverleners" },
  { emoji: "📦", label: "Webshops" },
  { emoji: "⚡", label: "Elektriciëns" },
];

export default function SectorBar() {
  return (
    <section className="py-10 px-6 border-y border-border bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-text-secondary text-sm font-medium mb-6"
        >
          Werkt voor elke branche in het MKB
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {SECTORS.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2 text-sm text-text-secondary hover:border-accent hover:text-accent transition-colors cursor-default"
            >
              <span>{s.emoji}</span>
              <span className="font-medium">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

const ITEMS = [
  "Beschikbaar buiten werktijden",
  "Antwoordt binnen seconden",
  "Vergeet nooit een klant op te volgen",
  "Spreekt meerdere talen",
  "Genereert offertes direct",
  "Leert van elke correctie",
  "Vast maandelijks tarief",
  "Geen vakanties of ziekmeldingen",
];

export default function Comparison() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-accent text-sm font-semibold uppercase tracking-widest mb-4 bg-accent-light px-3 py-1 rounded-full">
            Vergelijking
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-text-primary mb-4">
            Echte assistent vs. Digitale Werknemer
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Zelfde taken. Betere beschikbaarheid. Lager tarief.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card overflow-hidden"
        >
          {/* Header */}
          <div className="grid grid-cols-3 bg-gray-50 border-b border-border">
            <div className="px-6 py-4 text-sm font-semibold text-text-secondary">Eigenschap</div>
            <div className="px-6 py-4 text-sm font-semibold text-text-secondary text-center border-l border-border">
              Echte assistent
            </div>
            <div className="px-6 py-4 text-sm font-semibold text-accent text-center border-l border-border bg-accent-light">
              Digitale Werknemer
            </div>
          </div>

          {ITEMS.map((item, i) => (
            <div
              key={item}
              className={`grid grid-cols-3 border-b border-border last:border-b-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
            >
              <div className="px-6 py-4 text-sm text-text-primary font-medium">{item}</div>
              <div className="px-6 py-4 flex justify-center items-center border-l border-border">
                <X className="w-5 h-5 text-red-400" />
              </div>
              <div className="px-6 py-4 flex justify-center items-center border-l border-border bg-accent-light/30">
                <Check className="w-5 h-5 text-green-600" />
              </div>
            </div>
          ))}

          {/* Price row */}
          <div className="grid grid-cols-3 border-t-2 border-accent/20 bg-white">
            <div className="px-6 py-5 text-sm font-semibold text-text-primary">Prijs</div>
            <div className="px-6 py-5 text-center border-l border-border">
              <span className="text-base font-bold text-text-primary">€2.500+</span>
              <p className="text-xs text-text-secondary">per maand</p>
            </div>
            <div className="px-6 py-5 text-center border-l border-border bg-accent-light/30">
              <span className="text-base font-bold text-accent">Vanaf €149</span>
              <p className="text-xs text-accent/70">per maand</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

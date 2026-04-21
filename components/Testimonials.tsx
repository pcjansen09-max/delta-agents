"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Jan de Vries",
    role: "Hovenier",
    city: "Alkmaar",
    initials: "JV",
    color: "from-green-500 to-emerald-600",
    quote:
      "Mijn digitale werknemer beantwoordt WhatsApps terwijl ik aan het snoeien ben. Ik mis geen enkele aanvraag meer.",
  },
  {
    name: "Sandra Bakker",
    role: "Makelaar",
    city: "Utrecht",
    initials: "SB",
    color: "from-blue-500 to-cyan-600",
    quote:
      "Klanten krijgen direct antwoord op bezichtigingsvragen. Mijn agenda loopt vol automatisch.",
  },
  {
    name: "Mark van den Berg",
    role: "Installateur",
    city: "Rotterdam",
    initials: "MB",
    color: "from-violet-500 to-purple-600",
    quote:
      "Offerteaanvragen worden meteen professioneel bevestigd. Voelt als een echte collega.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4 block">
            Wat klanten zeggen
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-700 tracking-tight">
            MKB-ondernemers{" "}
            <span className="gradient-text">aan het woord</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-2xl p-6 flex flex-col gap-4"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400" fill="currentColor" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-300 text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-slate-500 text-xs">
                    {t.role} · {t.city}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

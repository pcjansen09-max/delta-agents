"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Jan de Vries",
    role: "Hovenier",
    city: "Alkmaar",
    initials: "JV",
    bg: "#DCFCE7",
    fg: "#16A34A",
    quote:
      "Mijn digitale werknemer beantwoordt WhatsApps terwijl ik aan het snoeien ben. Ik mis geen enkele aanvraag meer.",
  },
  {
    name: "Sandra Bakker",
    role: "Makelaar",
    city: "Utrecht",
    initials: "SB",
    bg: "#EEF2FF",
    fg: "#1B4FD8",
    quote:
      "Klanten krijgen direct antwoord op bezichtigingsvragen. Mijn agenda loopt vol automatisch.",
  },
  {
    name: "Mark van den Berg",
    role: "Installateur",
    city: "Rotterdam",
    initials: "MB",
    bg: "#FAF5FF",
    fg: "#7C3AED",
    quote:
      "Offerteaanvragen worden meteen professioneel bevestigd. Voelt als een echte collega.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-accent text-sm font-semibold uppercase tracking-widest mb-4 bg-accent-light px-3 py-1 rounded-full">
            Klantervaring
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-text-primary mb-4">
            MKB-ondernemers aan het woord
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="card p-7 flex flex-col gap-5"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-accent-warm" fill="currentColor" />
                ))}
              </div>

              {/* Quote */}
              <p className="font-display text-xl text-text-primary leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: t.bg, color: t.fg }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-text-primary text-sm font-semibold">{t.name}</p>
                  <p className="text-text-secondary text-xs">{t.role} · {t.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

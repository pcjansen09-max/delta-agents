"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    number: "01",
    title: "Aanmelden & inrichten",
    description:
      "Maak een account aan en vul je bedrijfsinfo in: tarieven, diensten, werkwijze en veelgestelde vragen. Duurt minder dan 20 minuten.",
    color: "#EEF2FF",
    accent: "#1B4FD8",
  },
  {
    number: "02",
    title: "Werknemer inwerken",
    description:
      "De eerste week corrigeer je je werknemer direct via WhatsApp. Zeg hoe hij moet antwoorden — hij onthoudt het voor altijd.",
    color: "#FFFBEB",
    accent: "#D97706",
  },
  {
    number: "03",
    title: "Volledig autonoom",
    description:
      "Na de inwerkfase werkt hij zelfstandig. Klanten krijgen direct antwoord, offertes worden verstuurd, afspraken worden ingepland.",
    color: "#F0FDF4",
    accent: "#16A34A",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-accent text-sm font-semibold uppercase tracking-widest mb-4 bg-accent-light px-3 py-1 rounded-full">
            Hoe het werkt
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-text-primary mb-4">
            Van aanmelding tot autonoom werknemer
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Drie stappen. Geen technische kennis nodig.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative"
            >
              {/* Connector line */}
              {i < 2 && (
                <div className="hidden md:block absolute top-10 left-[calc(100%+4px)] w-8 border-t-2 border-dashed border-border z-10" />
              )}

              <div className="card p-7 h-full">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-2xl font-display font-bold"
                  style={{ background: step.color, color: step.accent }}
                >
                  {step.number}
                </div>
                <h3 className="font-semibold text-text-primary text-lg mb-3">{step.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Check, Zap, Shield, Clock, ArrowRight } from "lucide-react";

const SETUP_FEATURES = [
  "WhatsApp & telefoon koppeling instellen",
  "Jouw prijslijsten & bedrijfsinfo inladen",
  "4 weken actieve training & bijsturing",
  "Persoonlijke onboarding via WhatsApp",
  "Garantie: werkt of geld terug",
];

const MONTHLY_FEATURES = [
  "24/7 bereikbaar via WhatsApp",
  "Onbeperkt offertes & facturen genereren",
  "Zelflerend geheugen — leert van elke interactie",
  "Integratie met jouw bestaande software",
  "Maandelijks opzegbaar",
  "Prioritaire ondersteuning",
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-32 px-6 relative">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(59,130,246,0.06), transparent)",
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4 block">
            Transparante Prijzen
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-700 tracking-tight mb-4">
            Jouw werknemer,{" "}
            <span className="gradient-text">jouw tarief</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Geen verborgen kosten. Geen lange contracten. Gewoon een betrouwbare
            werknemer voor een vaste maandprijs.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Setup card */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-3xl p-8 flex flex-col gap-6"
          >
            <div>
              <div className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-3">
                Stap 1 · Eenmalig
              </div>
              <h3 className="font-display text-2xl font-700 text-white mb-2">
                De Inwerkfase
              </h3>
              <p className="text-slate-400 text-sm">
                Jouw digitale werknemer leren kennen. We stellen alles in, laden
                jouw bedrijfsinfo in en trainen hem 4 weken intensief.
              </p>
            </div>

            <div className="flex items-end gap-2">
              <span className="font-display text-5xl font-800 text-white">€299</span>
              <span className="text-slate-400 mb-2 text-lg">eenmalig</span>
            </div>

            <ul className="space-y-3 flex-1">
              {SETUP_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="glass rounded-xl p-3 text-center text-xs text-slate-500">
              Wordt automatisch gecombineerd met het maandabonnement
            </div>
          </motion.div>

          {/* Monthly card — highlighted */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-3xl p-[1px] relative"
            style={{
              background:
                "linear-gradient(135deg, rgba(59,130,246,0.5), rgba(99,102,241,0.3), rgba(59,130,246,0.1))",
            }}
          >
            {/* Best value badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
              Meest populair
            </div>

            <div
              className="rounded-3xl p-8 flex flex-col gap-6 h-full"
              style={{ background: "#0d1526" }}
            >
              <div>
                <div className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-3">
                  Stap 2 · Maandelijks
                </div>
                <h3 className="font-display text-2xl font-700 text-white mb-2">
                  De Digitale Werknemer
                </h3>
                <p className="text-slate-400 text-sm">
                  Jouw vaste digitale werknemer. Altijd beschikbaar, nooit ziek,
                  leert elke dag bij.
                </p>
              </div>

              <div className="flex items-end gap-2">
                <span className="font-display text-5xl font-800 text-white">€239</span>
                <span className="text-slate-400 mb-2 text-lg">/ maand</span>
              </div>

              <ul className="space-y-3 flex-1">
                {MONTHLY_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all hover:shadow-glow text-base group">
                Start de Inwerkfase
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            {
              icon: <Shield className="w-5 h-5 text-blue-400" />,
              title: "GDPR-compliant",
              desc: "Jouw data blijft in Nederland. Volledig AVG-proof.",
            },
            {
              icon: <Clock className="w-5 h-5 text-violet-400" />,
              title: "Maandelijks opzegbaar",
              desc: "Geen jaarcontract. Stop wanneer je wil.",
            },
            {
              icon: <Zap className="w-5 h-5 text-amber-400" />,
              title: "In 1 week actief",
              desc: "Inwerkfase duurt maximaal 7 dagen.",
            },
          ].map((item) => (
            <div key={item.title} className="glass rounded-2xl p-5 text-center">
              <div className="flex justify-center mb-3">{item.icon}</div>
              <h4 className="font-semibold text-white text-sm mb-1">{item.title}</h4>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

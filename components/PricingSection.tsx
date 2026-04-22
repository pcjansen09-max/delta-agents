"use client";

import { motion } from "framer-motion";
import { Check, Shield, Clock, Zap } from "lucide-react";

const PLANS = [
  {
    name: "Basis Werknemer",
    price: "€149",
    period: "/ maand",
    description: "De perfecte start. Jouw digitale werknemer regelt communicatie en administratie.",
    highlight: false,
    badge: null,
    features: [
      "WhatsApp communicatie met klanten",
      "E-mail afhandeling",
      "Offertes & facturen genereren",
      "24/7 beschikbaar",
    ],
  },
  {
    name: "Premium Werknemer",
    price: "€239",
    period: "/ maand",
    description: "De meeste MKB-ondernemers kiezen dit. Inclusief telefoon en zelflerend geheugen.",
    highlight: true,
    badge: "Meest gekozen",
    features: [
      "Alles van Basis",
      "Inkomende gesprekken via AI telefoon",
      "CRM-integratie",
      "Zelflerend geheugen",
      "Maandelijkse rapportage",
    ],
  },
  {
    name: "All-Round Werknemer",
    price: "€499",
    period: "/ maand",
    description: "Volledige automatisering. De werknemer werkt proactief en belt zelf terug.",
    highlight: false,
    badge: null,
    features: [
      "Alles van Premium",
      "Voice outbound (agent belt zelf terug)",
      "Volledige automatisering bedrijfsprocessen",
      "Prioritaire ondersteuning",
      "Dedicated setup begeleiding",
    ],
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-accent text-sm font-semibold uppercase tracking-widest mb-4 bg-accent-light px-3 py-1 rounded-full">
            Transparante Prijzen
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-text-primary mb-4">
            Kies jouw Digitale Werknemer
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Geen verborgen kosten. Geen lange contracten. Maandelijks opzegbaar.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex flex-col ${plan.highlight ? "md:-mt-4" : ""}`}
            >
              {plan.highlight ? (
                <div
                  className="rounded-2xl flex flex-col flex-1 h-full relative"
                  style={{
                    background: "#1A1A2E",
                    boxShadow: "0 8px 32px rgba(27,79,216,0.18), 0 2px 8px rgba(0,0,0,0.12)",
                  }}
                >
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 font-bold text-xs px-4 py-1.5 rounded-full whitespace-nowrap z-10"
                      style={{ background: "#E8B84B", color: "#1A1A2E" }}>
                      {plan.badge}
                    </div>
                  )}
                  <div className="p-7 flex flex-col gap-5 flex-1">
                    <div>
                      <h3 className="font-semibold text-white text-lg mb-1">{plan.name}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{plan.description}</p>
                    </div>
                    <div className="flex items-end gap-1.5">
                      <span className="font-display text-4xl text-white">{plan.price}</span>
                      <span className="text-gray-400 mb-1">{plan.period}</span>
                    </div>
                    <ul className="space-y-2.5 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
                          <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent-warm" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="/login"
                      className="w-full flex items-center justify-center py-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
                      style={{ background: "#E8B84B", color: "#1A1A2E" }}
                    >
                      Start vandaag
                    </a>
                  </div>
                </div>
              ) : (
                <div className="card p-7 flex flex-col gap-5 flex-1 h-full">
                  <div>
                    <h3 className="font-semibold text-text-primary text-lg mb-1">{plan.name}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{plan.description}</p>
                  </div>
                  <div className="flex items-end gap-1.5">
                    <span className="font-display text-4xl text-text-primary">{plan.price}</span>
                    <span className="text-text-secondary mb-1">{plan.period}</span>
                  </div>
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-text-secondary">
                        <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/login"
                    className="w-full flex items-center justify-center py-3.5 rounded-xl font-semibold text-sm border border-border hover:border-accent hover:bg-accent-light hover:text-accent transition-all active:scale-[0.98] text-text-primary"
                  >
                    Start vandaag
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            {
              icon: <Shield className="w-5 h-5 text-accent" />,
              title: "GDPR-compliant",
              desc: "Jouw data blijft in Nederland. Volledig AVG-proof.",
            },
            {
              icon: <Clock className="w-5 h-5 text-amber-600" />,
              title: "Maandelijks opzegbaar",
              desc: "Geen jaarcontract. Stop wanneer je wil.",
            },
            {
              icon: <Zap className="w-5 h-5 text-green-600" />,
              title: "In 1 week actief",
              desc: "Inwerkfase duurt maximaal 7 dagen.",
            },
          ].map((item) => (
            <div key={item.title} className="card p-5 text-center">
              <div className="flex justify-center mb-3">{item.icon}</div>
              <h4 className="font-semibold text-text-primary text-sm mb-1">{item.title}</h4>
              <p className="text-text-secondary text-xs">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

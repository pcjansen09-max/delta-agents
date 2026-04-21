"use client";

import { motion } from "framer-motion";
import { Check, Shield, Clock, Zap, BookOpen, MessageSquare, Sparkles } from "lucide-react";

const ONBOARDING_STEPS = [
  {
    icon: <BookOpen className="w-5 h-5" />,
    step: "Stap 1",
    title: "Bedrijfsinfo invoeren",
    desc: "Voed je werknemer met jouw prijzen, producten, klanten en werkwijze. Hoe meer hij weet, hoe beter hij presteert.",
    color: "text-blue-400",
    bg: "from-blue-500/15 to-blue-600/5",
    border: "border-blue-500/20",
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    step: "Stap 2",
    title: "Eerste week corrigeren",
    desc: "Net als een echte nieuwe werknemer maakt hij soms fouten. Corrigeer hem direct via WhatsApp — hij onthoudt het voor altijd.",
    color: "text-violet-400",
    bg: "from-violet-500/15 to-violet-600/5",
    border: "border-violet-500/20",
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    step: "Stap 3",
    title: "Volledig autonoom",
    desc: "Na de eerste week werkt hij zelfstandig. Jij hoeft er niks meer aan te doen.",
    color: "text-emerald-400",
    bg: "from-emerald-500/15 to-emerald-600/5",
    border: "border-emerald-500/20",
  },
];

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
    color: "text-blue-400",
    gradientFrom: "rgba(59,130,246,0.4)",
    gradientTo: "rgba(59,130,246,0.1)",
    buttonStyle: "glass hover:bg-white/[0.08] text-white border border-white/10",
  },
  {
    name: "Premium Werknemer",
    price: "€239",
    period: "/ maand",
    description: "De meeste MKB-ondernemers kiezen dit. Inclusief telefoon en zelflerend geheugen.",
    highlight: true,
    badge: "Meest populair",
    features: [
      "Alles van Basis",
      "Inkomende gesprekken via AI telefoon",
      "CRM-integratie",
      "Zelflerend geheugen",
      "Maandelijkse rapportage",
    ],
    color: "text-blue-400",
    gradientFrom: "rgba(59,130,246,0.5)",
    gradientTo: "rgba(99,102,241,0.3)",
    buttonStyle: "bg-blue-600 hover:bg-blue-500 text-white",
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
    color: "text-violet-400",
    gradientFrom: "rgba(99,102,241,0.4)",
    gradientTo: "rgba(139,92,246,0.1)",
    buttonStyle: "glass hover:bg-white/[0.08] text-white border border-white/10",
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-32 px-6 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(59,130,246,0.06), transparent)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">

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
            Kies jouw{" "}
            <span className="gradient-text">Digitale Werknemer</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Geen verborgen kosten. Geen lange contracten. Maandelijks opzegbaar.
          </p>
        </motion.div>

        {/* Onboarding steps */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass rounded-3xl p-8 mb-12"
        >
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl font-700 text-white mb-2">
              De Inwerkfase — zo leert jouw Digitale Werknemer jouw bedrijf kennen
            </h3>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Elke nieuwe werknemer heeft een opstarttijd nodig. Jouw digitale werknemer ook.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {ONBOARDING_STEPS.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                className={`rounded-2xl p-5 bg-gradient-to-br ${s.bg} border ${s.border} relative`}
              >
                {/* Connector line between steps */}
                {i < 2 && (
                  <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-4 h-px bg-gradient-to-r from-white/20 to-transparent" />
                  </div>
                )}
                <div className={`${s.color} mb-3 flex items-center gap-2`}>
                  {s.icon}
                  <span className="text-xs font-bold uppercase tracking-wider">{s.step}</span>
                </div>
                <h4 className="font-semibold text-white text-sm mb-1.5">{s.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-slate-500 text-xs">
            De inwerkfase is geen extra kosten — het is de normale opstarttijd van jouw Digitale Werknemer.
            Plan op <span className="text-slate-400">3–7 dagen actief begeleiden</span>.
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
              className={`relative flex flex-col ${plan.highlight ? "md:-mt-4 md:mb-0" : ""}`}
            >
              {/* Gradient border wrapper for highlighted card */}
              {plan.highlight ? (
                <div
                  className="rounded-3xl p-[1px] flex flex-col flex-1"
                  style={{
                    background: `linear-gradient(135deg, ${plan.gradientFrom}, ${plan.gradientTo})`,
                  }}
                >
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap z-10">
                      {plan.badge}
                    </div>
                  )}
                  <CardInner plan={plan} />
                </div>
              ) : (
                <div className="glass rounded-3xl flex flex-col flex-1 h-full">
                  <CardInner plan={plan} />
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

function CardInner({ plan }: { plan: (typeof PLANS)[number] }) {
  return (
    <div
      className="rounded-3xl p-7 flex flex-col gap-5 flex-1 h-full"
      style={plan.highlight ? { background: "#0d1526" } : undefined}
    >
      {/* Name + description */}
      <div>
        <h3 className="font-display text-xl font-700 text-white mb-1">{plan.name}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{plan.description}</p>
      </div>

      {/* Price */}
      <div className="flex items-end gap-1.5">
        <span className="font-display text-4xl font-800 text-white">{plan.price}</span>
        <span className="text-slate-400 mb-1">{plan.period}</span>
      </div>

      {/* Features */}
      <ul className="space-y-2.5 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
            <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.color}`} />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="/login"
        className={`w-full flex items-center justify-center py-3.5 rounded-2xl font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98] ${plan.buttonStyle}`}
      >
        Start vandaag
      </a>
    </div>
  );
}

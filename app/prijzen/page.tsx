import type { Metadata } from "next";
import { Check, X, Shield, Clock, Zap } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Prijzen — DeltaAgents",
  description: "Transparante prijzen voor jouw Digitale Werknemer. Vanaf €149/maand, geen setup fee, maandelijks opzegbaar.",
};

const PLANS = [
  {
    name: "Basis",
    price: "€149",
    description: "De perfecte start voor jouw digitale werknemer.",
    highlight: false,
    badge: null,
    features: [
      { text: "1 Digitale Werknemer", included: true },
      { text: "WhatsApp Business koppeling", included: true },
      { text: "Onbeperkte berichten", included: true },
      { text: "Dashboard toegang", included: true },
      { text: "Inwerkfase begeleiding", included: true },
      { text: "Meerdere kanalen", included: false },
      { text: "Koppelingen (boekhouding etc.)", included: false },
      { text: "Prioriteit support", included: false },
    ],
  },
  {
    name: "Premium",
    price: "€239",
    description: "De meeste MKB-ondernemers kiezen dit pakket.",
    highlight: true,
    badge: "Meest gekozen",
    features: [
      { text: "Alles uit Basis", included: true },
      { text: "Email integratie (Gmail/Outlook)", included: true },
      { text: "Google Calendar koppeling", included: true },
      { text: "3 boekhouding koppelingen", included: true },
      { text: "Maandelijkse performance rapportage", included: true },
      { text: "Prioriteit support binnen 4 uur", included: true },
      { text: "Custom agent training", included: false },
      { text: "Meerdere werknemers", included: false },
    ],
  },
  {
    name: "All-Round",
    price: "€499",
    description: "Volledige automatisering voor ambitieuze ondernemers.",
    highlight: false,
    badge: null,
    features: [
      { text: "Alles uit Premium", included: true },
      { text: "Onbeperkte koppelingen", included: true },
      { text: "3 Digitale Werknemers", included: true },
      { text: "Custom agent training sessie", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Telefonische support", included: true },
      { text: "API toegang", included: true },
    ],
  },
];

const COMPARISON_FEATURES = [
  { label: "Digitale Werknemers", basis: "1", premium: "1", allround: "3" },
  { label: "WhatsApp Business", basis: true, premium: true, allround: true },
  { label: "Onbeperkte berichten", basis: true, premium: true, allround: true },
  { label: "Email integratie", basis: false, premium: true, allround: true },
  { label: "Google Calendar", basis: false, premium: true, allround: true },
  { label: "Boekhouding koppelingen", basis: false, premium: "3", allround: "Onbeperkt" },
  { label: "Performance rapportage", basis: false, premium: true, allround: true },
  { label: "Support reactietijd", basis: "24 uur", premium: "4 uur", allround: "1 uur" },
  { label: "Custom agent training", basis: false, premium: false, allround: true },
  { label: "Account manager", basis: false, premium: false, allround: true },
  { label: "API toegang", basis: false, premium: false, allround: true },
];

const FAQ_PRICING = [
  {
    q: "Is er een setup fee?",
    a: "Nee. Je betaalt alleen het maandelijkse abonnement. Geen eenmalige kosten, geen verborgen kosten.",
  },
  {
    q: "Kan ik tussentijds upgraden?",
    a: "Ja, je kunt op elk moment upgraden. Het verschil wordt naar rato verrekend.",
  },
  {
    q: "Hoe werkt opzeggen?",
    a: "Je kunt maandelijks opzeggen via je dashboard of via email. Geen opzegtermijn, geen gedoe.",
  },
  {
    q: "Wat als ik meer dan 3 werknemers nodig heb?",
    a: "Neem contact met ons op voor een maatwerk offerte. We werken ook met grotere organisaties.",
  },
];

function Cell({ val }: { val: string | boolean }) {
  if (typeof val === "boolean") {
    return val
      ? <Check className="w-4 h-4 text-emerald-400 mx-auto" />
      : <X className="w-4 h-4 text-slate-700 mx-auto" />;
  }
  return <span className="text-slate-300 text-sm">{val}</span>;
}

export default function PrijzenPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-32 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4 block">
              Transparante Prijzen
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-700 tracking-tight mb-4">
              Kies jouw{" "}
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-sky-400 bg-clip-text text-transparent">
                Digitale Werknemer
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Geen installatiekosten. Geen verborgen kosten. Opzegbaar per maand.
            </p>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col ${plan.highlight ? "md:-mt-4" : ""}`}
              >
                {plan.highlight ? (
                  <div className="rounded-3xl p-[1px] flex flex-col flex-1"
                    style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.6), rgba(99,102,241,0.3))" }}>
                    {plan.badge && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap z-10">
                        {plan.badge}
                      </div>
                    )}
                    <PlanCard plan={plan} />
                  </div>
                ) : (
                  <div className="glass rounded-3xl flex flex-col flex-1">
                    <PlanCard plan={plan} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-20">
            {[
              { icon: <Shield className="w-5 h-5 text-blue-400" />, title: "GDPR-compliant", desc: "Data blijft in Nederland. Volledig AVG-proof." },
              { icon: <Clock className="w-5 h-5 text-violet-400" />, title: "Maandelijks opzegbaar", desc: "Geen jaarcontract. Stop wanneer je wil." },
              { icon: <Zap className="w-5 h-5 text-amber-400" />, title: "In 1 week actief", desc: "Inwerkfase duurt maximaal 7 dagen." },
            ].map((item) => (
              <div key={item.title} className="glass rounded-2xl p-5 text-center">
                <div className="flex justify-center mb-3">{item.icon}</div>
                <h4 className="font-semibold text-white text-sm mb-1">{item.title}</h4>
                <p className="text-slate-400 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="mb-20">
            <h2 className="font-display text-2xl font-700 text-white text-center mb-8">
              Vergelijkingstabel
            </h2>
            <div className="glass rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left px-5 py-4 text-slate-400 font-medium">Feature</th>
                      <th className="px-5 py-4 text-slate-300 font-semibold text-center">Basis<br /><span className="text-slate-500 text-xs font-normal">€149/m</span></th>
                      <th className="px-5 py-4 text-blue-400 font-semibold text-center">Premium<br /><span className="text-slate-500 text-xs font-normal">€239/m</span></th>
                      <th className="px-5 py-4 text-violet-400 font-semibold text-center">All-Round<br /><span className="text-slate-500 text-xs font-normal">€499/m</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_FEATURES.map((row, i) => (
                      <tr key={i} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                        <td className="px-5 py-3.5 text-slate-400">{row.label}</td>
                        <td className="px-5 py-3.5 text-center"><Cell val={row.basis} /></td>
                        <td className="px-5 py-3.5 text-center"><Cell val={row.premium} /></td>
                        <td className="px-5 py-3.5 text-center"><Cell val={row.allround} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-20 max-w-2xl mx-auto">
            <h2 className="font-display text-2xl font-700 text-white text-center mb-8">
              Vragen over prijzen
            </h2>
            <div className="space-y-4">
              {FAQ_PRICING.map((item, i) => (
                <div key={i} className="glass rounded-2xl p-5">
                  <p className="text-white font-semibold text-sm mb-2">{item.q}</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center glass rounded-3xl p-10">
            <h2 className="font-display text-2xl font-700 text-white mb-3">
              Nog niet zeker?
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              Start vandaag en ervaar zelf hoe een Digitale Werknemer jouw bedrijf verandert.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-2xl transition-all"
            >
              Start vandaag — gratis proberen
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function PlanCard({ plan }: { plan: (typeof PLANS)[number] }) {
  return (
    <div
      className="rounded-3xl p-7 flex flex-col gap-5 flex-1 h-full"
      style={plan.highlight ? { background: "#0d1526" } : undefined}
    >
      <div>
        <h3 className="font-display text-xl font-700 text-white mb-1">{plan.name}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{plan.description}</p>
      </div>
      <div className="flex items-end gap-1.5">
        <span className="font-display text-4xl font-800 text-white">{plan.price}</span>
        <span className="text-slate-400 mb-1">/ maand</span>
      </div>
      <ul className="space-y-2.5 flex-1">
        {plan.features.map((f) => (
          <li key={f.text} className={`flex items-start gap-2.5 text-sm ${f.included ? "text-slate-300" : "text-slate-600"}`}>
            {f.included
              ? <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
              : <X className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-700" />}
            {f.text}
          </li>
        ))}
      </ul>
      <Link
        href="/login"
        className={`w-full flex items-center justify-center py-3.5 rounded-2xl font-semibold text-sm transition-all hover:opacity-90 ${
          plan.highlight
            ? "bg-blue-600 hover:bg-blue-500 text-white"
            : "glass hover:bg-white/[0.08] text-white border border-white/10"
        }`}
      >
        Start vandaag
      </Link>
    </div>
  );
}

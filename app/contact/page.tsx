"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [form, setForm] = useState({ naam: "", email: "", bericht: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSending(false);
    if (res.ok) {
      setSent(true);
    } else {
      setError("Er ging iets mis. Probeer het opnieuw of stuur een email.");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4 block">Contact</span>
            <h1 className="font-display text-4xl md:text-5xl font-700 text-white mb-4">
              Neem contact op
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Heb je een vraag of wil je meer weten over DeltaAgents? We reageren binnen 24 uur.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Contact info */}
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
              <div className="glass rounded-2xl p-6 space-y-5">
                {[
                  { icon: <Mail className="w-5 h-5 text-blue-400" />, label: "E-mail", val: "team@delta-design.nl", href: "mailto:team@delta-design.nl" },
                  { icon: <Phone className="w-5 h-5 text-violet-400" />, label: "Telefoon", val: "06-83417723", href: "tel:0683417723" },
                  { icon: <MapPin className="w-5 h-5 text-emerald-400" />, label: "Locatie", val: "Middenmeer, Noord-Holland", href: null },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-white text-sm hover:text-blue-400 transition-colors">
                          {item.val}
                        </a>
                      ) : (
                        <p className="text-white text-sm">{item.val}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-white text-sm mb-2">Bereikbaarheid</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  We zijn bereikbaar op werkdagen van <span className="text-white">9:00 – 17:30</span>.
                  Voor spoedeisende zaken kun je altijd een WhatsApp sturen.
                </p>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              {sent ? (
                <div className="glass rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="font-display text-xl font-700 text-white mb-2">Bericht verstuurd!</h3>
                  <p className="text-slate-400 text-sm">We nemen zo snel mogelijk contact met je op.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4">
                  <div>
                    <label className="block text-slate-400 text-xs font-medium mb-1.5">Naam</label>
                    <input
                      required
                      value={form.naam}
                      onChange={(e) => setForm((f) => ({ ...f, naam: e.target.value }))}
                      placeholder="Jan de Vries"
                      className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/40 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs font-medium mb-1.5">E-mailadres</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="jan@bedrijf.nl"
                      className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/40 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs font-medium mb-1.5">Bericht</label>
                    <textarea
                      required
                      value={form.bericht}
                      onChange={(e) => setForm((f) => ({ ...f, bericht: e.target.value }))}
                      placeholder="Stel je vraag of beschrijf je wens..."
                      rows={5}
                      className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/40 transition-all resize-none"
                    />
                  </div>
                  {error && <p className="text-red-400 text-xs">{error}</p>}
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all"
                  >
                    {sending ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><Send className="w-4 h-4" />Versturen</>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

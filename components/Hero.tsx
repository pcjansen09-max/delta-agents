"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

const MESSAGES = [
  { from: "customer", text: "Goedemorgen! Wat zijn jullie tarieven voor tuinonderhoud?", delay: 0.6 },
  { from: "agent", text: "Goedemorgen! 🌿 Ons tuinonderhoud start vanaf €45 p/u. Wat voor tuin heeft u?", delay: 1.2 },
  { from: "customer", text: "Een achtertuin van ca. 80m². Kan ik een offerte krijgen?", delay: 1.8 },
  { from: "agent", text: "Natuurlijk! Ik stuur u vandaag nog een offerte. Mag ik uw adres?", delay: 2.4 },
  { from: "customer", text: "Ja, Kerkstraat 14 in Alkmaar.", delay: 3.0 },
  { from: "agent", text: "Dank u! Offerte volgt binnen 2 uur. Fijne dag! 😊", delay: 3.6 },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 65% 40%, #EEF2FF 0%, #FAFAF8 65%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Copy */}
        <div>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-accent-light border border-accent/20 rounded-full px-4 py-2 mb-6"
          >
            <span className="text-sm">🇳🇱</span>
            <span className="text-sm text-accent font-medium">Gemaakt voor het Nederlandse MKB</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="font-display text-5xl md:text-6xl xl:text-[68px] leading-[1.1] text-text-primary mb-6"
          >
            Jouw digitale{" "}
            <span className="text-accent">werknemer</span>{" "}
            werkt terwijl jij slaapt.
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="text-text-secondary text-lg md:text-xl leading-relaxed mb-8 max-w-lg"
          >
            Nooit meer gemiste klanten. Nooit meer herhaalvragen. Een AI-werknemer die 24/7 WhatsApp beantwoordt, offertes stuurt en afspraken inplant.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="flex flex-col sm:flex-row gap-3 mb-10"
          >
            <a
              href="/login"
              className="group inline-flex items-center justify-center gap-2 bg-accent hover:bg-[#1641b8] text-white font-semibold px-7 py-3.5 rounded-xl transition-colors text-base"
            >
              Start gratis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-text-primary font-semibold px-7 py-3.5 rounded-xl border border-border transition-colors text-base"
            >
              Hoe het werkt
            </a>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-5 text-sm text-text-secondary"
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-accent-warm" fill="currentColor" />
              ))}
              <span className="ml-1.5 font-medium text-text-primary">4.8/5</span>
            </div>
            <span className="text-border">|</span>
            <span>Geen setup fee</span>
            <span className="text-border">|</span>
            <span>Maandelijks opzegbaar</span>
            <span className="text-border">|</span>
            <span>In 1 week actief</span>
          </motion.div>
        </div>

        {/* Right: iPhone WhatsApp mockup */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex justify-center lg:justify-end"
        >
          <div
            style={{ transform: "rotate(-3deg)" }}
            className="relative"
          >
            {/* Phone shell */}
            <div
              className="relative rounded-[40px] overflow-hidden shadow-phone"
              style={{
                width: 280,
                border: "8px solid #1A1A2E",
                background: "#ECE5DD",
              }}
            >
              {/* Status bar */}
              <div
                className="flex items-center justify-between px-5 py-2 text-white text-[10px] font-semibold"
                style={{ background: "#075E54" }}
              >
                <span>9:41</span>
                <div className="flex gap-1 items-center">
                  <span>●●●</span>
                </div>
              </div>

              {/* WhatsApp header */}
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{ background: "#075E54" }}
              >
                <div className="w-9 h-9 rounded-full bg-green-300 flex items-center justify-center text-green-900 text-xs font-bold flex-shrink-0">
                  DA
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">Digitale Werknemer</p>
                  <p className="text-green-200 text-[10px]">Online · reageert altijd</p>
                </div>
              </div>

              {/* Chat area */}
              <div
                className="px-3 py-4 space-y-2 min-h-[380px]"
                style={{ background: "#ECE5DD" }}
              >
                {MESSAGES.map((msg, i) => (
                  <div
                    key={i}
                    className={`msg-appear flex ${msg.from === "customer" ? "justify-start" : "justify-end"}`}
                    style={{ animationDelay: `${msg.delay}s` }}
                  >
                    <div
                      className="max-w-[85%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed shadow-sm"
                      style={{
                        background: msg.from === "customer" ? "#FFFFFF" : "#DCF8C6",
                        color: "#1A1A2E",
                        borderRadius: msg.from === "customer"
                          ? "2px 16px 16px 16px"
                          : "16px 2px 16px 16px",
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input bar */}
              <div
                className="flex items-center gap-2 px-3 py-2.5"
                style={{ background: "#F0F0F0" }}
              >
                <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-[10px] text-gray-400">
                  Typ een bericht...
                </div>
                <div className="w-7 h-7 rounded-full bg-[#075E54] flex items-center justify-center text-white text-[10px]">
                  ▶
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8, type: "spring", stiffness: 200 }}
              className="absolute -right-6 top-16 bg-white rounded-2xl px-3 py-2.5 shadow-card-lg border border-border"
            >
              <p className="text-[10px] text-text-secondary font-medium">Antwoord in</p>
              <p className="text-sm font-bold text-accent">2 seconden</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.2, type: "spring", stiffness: 200 }}
              className="absolute -left-8 bottom-20 bg-white rounded-2xl px-3 py-2.5 shadow-card-lg border border-border"
            >
              <p className="text-[10px] text-text-secondary font-medium">Beschikbaar</p>
              <p className="text-sm font-bold text-green-600">24/7</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

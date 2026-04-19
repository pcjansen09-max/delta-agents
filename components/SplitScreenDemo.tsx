"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Send, CheckCheck, Brain, Phone, FileText } from "lucide-react";

const DEMO_SEQUENCE = [
  { delay: 500, type: "user", text: "Klus klaar, 5 uur werk. Stuur factuur naar De Vries." },
  { delay: 1800, type: "typing" },
  {
    delay: 3200,
    type: "agent",
    text: "Factuur van €250 excl. BTW is verstuurd naar fam. De Vries. ✅\nZal ik dit direct in de boekhouding verwerken?",
  },
  { delay: 4500, type: "user", text: "Ja doe dat. En plan maandag ook een onderhoudsbeurt bij Bakker in." },
  { delay: 5800, type: "typing" },
  {
    delay: 7200,
    type: "agent",
    text: "Gedaan! Maandag 09:00 staat geblokkeerd voor Bakker — bevestiging verstuurd via WhatsApp. 📅",
  },
];

interface Message {
  id: number;
  type: "user" | "agent" | "typing";
  text?: string;
}

export default function SplitScreenDemo() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeCard, setActiveCard] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isRunning) {
          startDemo();
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById("demo");
    if (section) observer.observe(section);
    return () => observer.disconnect();
  }, [isRunning]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 3);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  function startDemo() {
    setIsRunning(true);
    setMessages([]);

    DEMO_SEQUENCE.forEach((step, idx) => {
      setTimeout(() => {
        if (step.type === "typing") {
          setMessages((prev) => [...prev, { id: Date.now() + idx, type: "typing" }]);
        } else {
          setMessages((prev) => {
            const filtered = prev.filter((m) => m.type !== "typing");
            return [
              ...filtered,
              {
                id: Date.now() + idx,
                type: step.type as "user" | "agent",
                text: step.text,
              },
            ];
          });
        }
      }, step.delay);
    });

    setTimeout(() => setIsRunning(false), 10000);
  }

  const dashCards = [
    {
      icon: <Phone className="w-5 h-5" />,
      title: "AI Telefoon Service",
      description: "Luistert naar voicemails en beantwoordt gemiste oproepen.",
      stat: "12 oproepen vandaag",
      color: "from-blue-500/20 to-blue-600/10",
      active: activeCard === 0,
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: "Zelflerend Geheugen",
      description: "Maakt een fout één keer, onthoudt het voor altijd.",
      stat: "247 regels geleerd",
      color: "from-violet-500/20 to-violet-600/10",
      active: activeCard === 1,
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Facturatie & Offertes",
      description: "Genereert en mailt direct PDF's in jouw huisstijl.",
      stat: "€18.450 verstuurd",
      color: "from-emerald-500/20 to-emerald-600/10",
      active: activeCard === 2,
    },
  ];

  return (
    <section id="demo" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4 block">
            Live Demo
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-700 tracking-tight mb-4">
            Zie het{" "}
            <span className="gradient-text">in actie</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Typ een opdracht en kijk hoe jouw Digitale Werknemer alles direct regelt.
          </p>
        </motion.div>

        {/* Split screen */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* WhatsApp simulator — 40% */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-3xl overflow-hidden" style={{ maxHeight: 520 }}>
              {/* WhatsApp header */}
              <div className="bg-[#1a2035] px-4 py-3.5 flex items-center gap-3 border-b border-white/[0.06]">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-base">
                  🤖
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">Digitale Werknemer</div>
                  <div className="text-green-400 text-xs flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    Online
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div
                className="px-4 py-4 space-y-3 overflow-y-auto"
                style={{ height: 380, background: "rgba(10,15,26,0.6)" }}
              >
                <AnimatePresence mode="popLayout">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.25 }}
                      className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.type === "typing" ? (
                        <div className="glass rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="typing-dot w-2 h-2 rounded-full bg-slate-400"
                            />
                          ))}
                        </div>
                      ) : (
                        <div
                          className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                            msg.type === "user"
                              ? "bg-blue-600 text-white rounded-br-sm"
                              : "glass text-slate-200 rounded-bl-sm"
                          }`}
                        >
                          {msg.text}
                          {msg.type === "user" && (
                            <div className="flex justify-end mt-1">
                              <CheckCheck className="w-3.5 h-3.5 text-blue-300" />
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={bottomRef} />
              </div>

              {/* Input bar */}
              <div className="bg-[#1a2035] px-4 py-3 border-t border-white/[0.06] flex items-center gap-3">
                <div className="flex-1 glass rounded-xl px-3 py-2 text-sm text-slate-500">
                  Typ een opdracht...
                </div>
                <button className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>

            {/* Replay button */}
            <button
              onClick={startDemo}
              disabled={isRunning}
              className="mt-4 w-full glass rounded-xl py-2.5 text-sm text-slate-400 hover:text-white transition-colors disabled:opacity-50"
            >
              {isRunning ? "Demo loopt..." : "▶ Opnieuw afspelen"}
            </button>
          </motion.div>

          {/* Dashboard — 60% */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-3 space-y-4"
          >
            {dashCards.map((card, i) => (
              <motion.div
                key={card.title}
                animate={{
                  borderColor: card.active
                    ? "rgba(59,130,246,0.4)"
                    : "rgba(255,255,255,0.06)",
                }}
                transition={{ duration: 0.4 }}
                className="glass rounded-2xl p-5 border transition-all"
                style={{
                  background: card.active
                    ? `linear-gradient(135deg, rgba(59,130,246,0.08), transparent)`
                    : undefined,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-slate-300 flex-shrink-0 transition-all`}
                    style={{
                      boxShadow: card.active ? "0 0 20px rgba(59,130,246,0.2)" : "none",
                    }}
                  >
                    {card.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-white text-sm">{card.title}</h3>
                      <span className="text-xs text-blue-400 font-medium">{card.stat}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{card.description}</p>
                  </div>
                </div>

                {card.active && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 pt-4 border-t border-white/[0.06]"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs text-green-400 font-medium">Actief verwerken...</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}

            {/* Live activity feed */}
            <div className="glass rounded-2xl p-5">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">
                Recente activiteit
              </div>
              <div className="space-y-2.5">
                {[
                  { time: "Nu", text: "Factuur €250 verstuurd → De Vries", color: "text-green-400" },
                  { time: "2 min", text: "Afspraak bevestigd → Bakker Maandag 09:00", color: "text-blue-400" },
                  { time: "15 min", text: "Offerte €1.200 goedgekeurd → Hendriks", color: "text-green-400" },
                  { time: "1 uur", text: "3 voicemails verwerkt en beantwoord", color: "text-violet-400" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="text-slate-600 text-xs w-8 flex-shrink-0">{item.time}</span>
                    <span className={`${item.color} text-xs`}>●</span>
                    <span className="text-slate-300">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

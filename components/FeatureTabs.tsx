"use client";

import { useEffect, useState, useRef } from "react";
import { MessageSquare, Calendar, FileText, Brain, BarChart3 } from "lucide-react";

const TABS = [
  {
    Icon: MessageSquare,
    label: "WhatsApp",
    headline: "Hij beantwoordt, jij werkt",
    body: "Terwijl jij aan het werk bent, beantwoordt hij alle WhatsApp-berichten van klanten. Van tariefvragen tot afsprakenverzoekenOmitemlijk, alles wordt direct en professioneel afgehandeld.",
    preview: (
      <div style={{ background: "#E5DDD5", borderRadius: 16, padding: "16px 12px", minHeight: 200 }}>
        {[
          { from: "customer", text: "Wat zijn jullie tarieven voor schilderwerk?" },
          { from: "agent", text: "Ons schilderwerk start vanaf €28 per uur, inclusief materiaal. Wat voor project heeft u?" },
          { from: "customer", text: "Een woonkamer van 40m²" },
          { from: "agent", text: "Voor een woonkamer van 40m² rekent u op ca. €380-480. Wil ik een offerte sturen?" },
        ].map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "customer" ? "flex-start" : "flex-end", marginBottom: 8 }}>
            <div style={{ maxWidth: "78%", background: m.from === "customer" ? "#fff" : "#D9FDD3", borderRadius: m.from === "customer" ? "2px 12px 12px 12px" : "12px 2px 12px 12px", padding: "7px 10px", fontSize: 12, lineHeight: 1.5, color: "#1A1A2E", boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    Icon: Calendar,
    label: "Agenda",
    headline: "Nooit meer dubbele boekingen",
    body: "Hij checkt jouw agenda realtime en plant afspraken in op momenten dat jij beschikbaar bent. Klanten krijgen direct een bevestiging en een herinneringsberichtje de dag ervoor.",
    preview: (
      <div style={{ background: "var(--surface)", borderRadius: 16, padding: 16, border: "1px solid var(--border)" }}>
        {["Ma 09:00 – Erik Jansen (meting)", "Ma 14:00 – Sandra de Vries (offerte)", "Di 10:30 – Pieter Smit (reparatie)", "Wo 09:00 – VRIJ", "Do 11:00 – Maria van Dam (onderhoud)"].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.includes("VRIJ") ? "#CBD5E1" : "var(--blue)", flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: item.includes("VRIJ") ? "var(--t3)" : "var(--t1)", fontWeight: item.includes("VRIJ") ? 400 : 500 }}>{item}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    Icon: FileText,
    label: "Offertes",
    headline: "Offerte verstuurd terwijl jij rijdt",
    body: "Vul eenmalig jouw diensten en tarieven in. Daarna maakt hij professionele offertes op maat en verstuurt ze direct naar de klant — inclusief jouw logo en betalingslink.",
    preview: (
      <div style={{ background: "var(--surface)", borderRadius: 16, padding: 20, border: "1px solid var(--border)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>Offerte #2024-047</div>
        {[["Schilderwerk woonkamer (40m²)", "€420"], ["Materiaalkosten (inbegrepen)", "€0"], ["BTW 21%", "€88"], ["Totaal", "€508"]].map(([label, val], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < 3 ? "1px solid var(--border)" : "none", fontWeight: i === 3 ? 700 : 400, fontSize: 13, color: i === 3 ? "var(--blue)" : "var(--t1)" }}>
            <span>{label}</span><span>{val}</span>
          </div>
        ))}
        <div style={{ marginTop: 16, background: "var(--blue)", color: "#fff", textAlign: "center", padding: "9px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>Offerte accepteren</div>
      </div>
    ),
  },
  {
    Icon: Brain,
    label: "Geheugen",
    headline: "Hij leert van elke correctie",
    body: "Corrigeer hem gewoon via WhatsApp: 'Niet zo zeggen, zeg liever...' Hij onthoudt het voor altijd. Na de inwerkfase werkt hij volledig zelfstandig.",
    preview: (
      <div style={{ background: "#E5DDD5", borderRadius: 16, padding: "16px 12px" }}>
        {[
          { from: "owner", text: "Je zei net €35/uur maar ons tarief is €42/uur" },
          { from: "agent", text: "Gecorrigeerd. Vanaf nu communiceer ik €42/uur. Dank voor de correctie." },
          { from: "owner", text: "En vermeld altijd dat materiaal is inbegrepen" },
          { from: "agent", text: "Noteer ik. Ik vermeld voortaan altijd: tarieven inclusief materiaal." },
        ].map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "owner" ? "flex-start" : "flex-end", marginBottom: 8 }}>
            <div style={{ maxWidth: "78%", background: m.from === "owner" ? "#fff" : "#D9FDD3", borderRadius: m.from === "owner" ? "2px 12px 12px 12px" : "12px 2px 12px 12px", padding: "7px 10px", fontSize: 12, lineHeight: 1.5, color: "#1A1A2E", boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    Icon: BarChart3,
    label: "Dashboard",
    headline: "Alles in één overzicht",
    body: "In je dashboard zie je alle gesprekken, verstuurde offertes en ingeplande afspraken. Je ziet precies wat je werknemer heeft gedaan en kunt hem bijsturen waar nodig.",
    preview: (
      <div style={{ background: "var(--surface)", borderRadius: 16, padding: 20, border: "1px solid var(--border)" }}>
        {[["Berichten beantwoord", "47", "var(--blue)"], ["Offertes verstuurd", "12", "#16A34A"], ["Afspraken ingepland", "8", "#D97706"], ["Klanten geholpen", "31", "#7C3AED"]].map(([label, val, color], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
            <span style={{ fontSize: 12, color: "var(--t2)" }}>{label}</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: color as string }}>{val}</span>
          </div>
        ))}
        <div style={{ marginTop: 12, fontSize: 11, color: "var(--t3)", textAlign: "center" }}>Deze maand · bijgewerkt 2 min geleden</div>
      </div>
    ),
  },
];

const INTERVAL = 4000;

export default function FeatureTabs() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number>(Date.now());

  const startTimer = (idx: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    startRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min((elapsed / INTERVAL) * 100, 100);
      setProgress(pct);
      if (elapsed >= INTERVAL) {
        startRef.current = Date.now();
        setProgress(0);
        setActive((prev) => (prev + 1) % TABS.length);
      }
    }, 30);
  };

  useEffect(() => {
    startTimer(active);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [active]);

  const handleClick = (i: number) => {
    setActive(i);
    setProgress(0);
    startTimer(i);
  };

  const tab = TABS[active];

  return (
    <section style={{ padding: "96px 24px", background: "var(--surface)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(28px, 3.5vw, 44px)",
              color: "var(--t1)",
              fontWeight: 400,
              marginBottom: 12,
            }}
          >
            Wat hij elke dag voor jou regelt
          </h2>
          <p style={{ fontSize: 16, color: "var(--t2)", maxWidth: 480, margin: "0 auto" }}>
            Eén werknemer. Vijf kerntaken. Altijd beschikbaar.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "start",
          }}
          className="tabs-grid"
        >
          {/* Left: tab list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {TABS.map((t, i) => {
              const isActive = active === i;
              return (
                <button
                  key={t.label}
                  onClick={() => handleClick(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "16px 20px",
                    borderRadius: 14,
                    background: isActive ? "var(--blue-l)" : "transparent",
                    border: isActive ? "1px solid rgba(27,79,216,0.15)" : "1px solid transparent",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: isActive ? "var(--blue)" : "var(--bg)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.2s",
                    }}
                  >
                    <t.Icon size={18} style={{ color: isActive ? "#fff" : "var(--t3)" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: isActive ? "var(--blue)" : "var(--t1)", marginBottom: 2 }}>
                      {t.label}
                    </div>
                    {isActive && (
                      <div
                        style={{
                          height: 2,
                          background: "var(--border)",
                          borderRadius: 1,
                          marginTop: 4,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${progress}%`,
                            background: "var(--blue)",
                            borderRadius: 1,
                            transition: "width 30ms linear",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: preview */}
          <div
            key={active}
            style={{
              animation: "fadeIn 0.35s ease-out forwards",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--serif)",
                fontSize: "clamp(22px, 2.5vw, 32px)",
                color: "var(--t1)",
                fontWeight: 400,
                marginBottom: 12,
              }}
            >
              {tab.headline}
            </h3>
            <p style={{ fontSize: 15, color: "var(--t2)", lineHeight: 1.7, marginBottom: 24 }}>
              {tab.body}
            </p>
            {tab.preview}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .tabs-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

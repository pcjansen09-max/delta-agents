"use client";

import { MessageSquare, Calendar, FileText, Brain, Link2, BarChart3 } from "lucide-react";

const FEATURES = [
  {
    Icon: MessageSquare,
    color: "#1B4FD8",
    bg: "#EEF2FF",
    title: "WhatsApp 24/7",
    description: "Hij beantwoordt klantberichten direct — ook midden in de nacht en in het weekend.",
    chips: ["Beantwoordt vragen", "Stuurt bevestigingen"],
  },
  {
    Icon: Calendar,
    color: "#16A34A",
    bg: "#DCFCE7",
    title: "Afspraken inplannen",
    description: "Hij plant afspraken in op basis van jouw agenda. Geen dubbele boekingen, nooit.",
    chips: ["Google Calendar", "Outlook"],
  },
  {
    Icon: FileText,
    color: "#D97706",
    bg: "#FEF3C7",
    title: "Offertes & facturen",
    description: "Hij genereert professionele offertes op basis van jouw tarieven en verstuurt ze direct.",
    chips: ["Jouw tarieven", "Direct verstuurd"],
  },
  {
    Icon: Brain,
    color: "#7C3AED",
    bg: "#FAF5FF",
    title: "Onthoudt alles",
    description: "Hij onthoudt klantvoorkeuren en eerdere gesprekken. Geen herhaalvragen.",
    chips: ["Klantgeheugen", "Leert van correcties"],
  },
  {
    Icon: Link2,
    color: "#0EA5E9",
    bg: "#E0F2FE",
    title: "Koppelingen",
    description: "Hij werkt samen met WhatsApp, boekhouding, CRM en meer dan 50 tools.",
    chips: ["Stripe", "HubSpot", "Zapier"],
  },
  {
    Icon: BarChart3,
    color: "#1B4FD8",
    bg: "#EEF2FF",
    title: "Dashboard & inzichten",
    description: "Bekijk alle activiteiten, gesprekken en resultaten in één overzicht.",
    chips: ["Realtime", "Maandrapport"],
  },
];

export default function Features() {
  return (
    <section id="functies" style={{ padding: "96px 24px", background: "var(--bg-grey)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#FEF2F2",
              border: "1px solid #FCA5A5",
              borderRadius: 999,
              padding: "5px 14px",
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: "#DC2626",
                textTransform: "uppercase",
              }}
            >
              Geen chatbot
            </span>
          </div>
          <h2
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(30px, 4vw, 46px)",
              color: "var(--t1)",
              marginBottom: 12,
              fontWeight: 400,
            }}
          >
            Hij doet het werk. Jij doet jouw werk.
          </h2>
          <p style={{ fontSize: 17, color: "var(--t2)", maxWidth: 520, margin: "0 auto" }}>
            Alleen dan 24/7, zonder ziekmelding en voor een vast maandbedrag.
          </p>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
          className="features-grid"
        >
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="card card-hover"
              style={{ padding: "28px 24px" }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  background: f.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                  flexShrink: 0,
                }}
              >
                <f.Icon size={22} style={{ color: f.color }} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--t1)", marginBottom: 8 }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 13.5, color: "var(--t2)", lineHeight: 1.6, marginBottom: 14 }}>
                {f.description}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {f.chips.map((chip) => (
                  <span
                    key={chip}
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: f.color,
                      background: f.bg,
                      borderRadius: 6,
                      padding: "3px 8px",
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 580px) {
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

const TRAIN_MSGS = [
  { from: "owner", text: "Jij beantwoordt voortaan klanten via WhatsApp. 24/7." },
  { from: "worker", text: "Begrepen. Ik sta klaar, ook 's nachts en in het weekend." },
  { from: "owner", text: "Offertes stuur je altijd binnen 2 uur na aanvraag." },
  { from: "worker", text: "Noteer ik. Offerte binnen 2 uur, altijd." },
  { from: "owner", text: "Maandag en dinsdag zijn mijn drukste dagen." },
  { from: "worker", text: "Ik hou jouw agenda bij. Nooit dubbel ingepland." },
];

export default function Hero() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      i++;
      if (i >= TRAIN_MSGS.length) { clearInterval(iv); return; }
      setVisible(i);
    }, 900);
    return () => clearInterval(iv);
  }, []);

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: 64,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Radial gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 75% 65% at 68% 45%, #EEF2FF 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "80px 24px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
        className="hero-grid"
      >
        {/* LEFT: Copy */}
        <div style={{ animation: "slideUp 0.6s ease-out forwards" }}>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--blue-l)",
              border: "1px solid rgba(27,79,216,0.20)",
              borderRadius: 999,
              padding: "6px 16px",
              marginBottom: 24,
            }}
          >
            <span style={{ fontSize: 14 }}>🇳🇱</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--blue)" }}>
              Gemaakt voor het Nederlandse MKB
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(40px, 5vw, 64px)",
              lineHeight: 1.08,
              color: "var(--t1)",
              marginBottom: 20,
              fontWeight: 400,
            }}
          >
            Jouw digitale{" "}
            <span style={{ color: "var(--blue)", fontStyle: "italic" }}>werknemer</span>{" "}
            werkt terwijl jij slaapt.
          </h1>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.7,
              color: "var(--t2)",
              marginBottom: 32,
              maxWidth: 480,
            }}
          >
            Hij plant afspraken in, verstuurt offertes en beantwoordt klanten — 24 uur per dag, 7 dagen per week. Jij hoeft er niets voor te doen.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
            <Link
              href="#demo"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "var(--blue)",
                color: "#fff",
                fontWeight: 600,
                fontSize: 15,
                padding: "12px 28px",
                borderRadius: 12,
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(27,79,216,0.35)",
                transition: "all 0.15s",
              }}
              className="hover:brightness-110 hover:-translate-y-px"
            >
              Probeer gratis
              <ArrowRight size={16} />
            </Link>
            <Link
              href="#hoe-het-werkt"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "var(--surface)",
                color: "var(--t1)",
                fontWeight: 600,
                fontSize: 15,
                padding: "12px 28px",
                borderRadius: 12,
                textDecoration: "none",
                border: "1px solid var(--border)",
                transition: "all 0.15s",
              }}
              className="hover:shadow-sm hover:-translate-y-px"
            >
              Hoe het werkt
            </Link>
          </div>

          {/* Trust */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", fontSize: 13, color: "var(--t2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} style={{ color: "var(--amber)" }} fill="var(--amber)" />
              ))}
              <span style={{ marginLeft: 4, fontWeight: 600, color: "var(--t1)" }}>4.8/5</span>
            </div>
            <span style={{ color: "var(--border)" }}>|</span>
            <span>Geen setup fee</span>
            <span style={{ color: "var(--border)" }}>|</span>
            <span>Maandelijks opzegbaar</span>
            <span style={{ color: "var(--border)" }}>|</span>
            <span>In 1 week actief</span>
          </div>
        </div>

        {/* RIGHT: 3D floating phone */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Phone wrapper with 3D + float */}
          <div
            style={{
              width: 275,
              height: 580,
              borderRadius: 44,
              background: "#1A1A2E",
              border: "10px solid #1A1A2E",
              boxShadow: "0 40px 80px rgba(0,0,0,0.20), 0 20px 40px rgba(27,79,216,0.14), inset 0 0 0 1px rgba(255,255,255,0.08)",
              overflow: "hidden",
              position: "relative",
              animation: "float 6s ease-in-out infinite",
            }}
          >
            {/* Dynamic Island */}
            <div
              style={{
                position: "absolute",
                top: 12,
                left: "50%",
                transform: "translateX(-50%)",
                width: 120,
                height: 34,
                background: "#000",
                borderRadius: 20,
                zIndex: 10,
              }}
            />

            {/* Screen content */}
            <div style={{ width: "100%", height: "100%", background: "#FFFFFF", display: "flex", flexDirection: "column" }}>
              {/* Status bar */}
              <div
                style={{
                  height: 54,
                  background: "#1A8A5A",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  padding: "0 16px 8px",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.9)",
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                <span>9:41</span>
                <div style={{ display: "flex", gap: 4 }}>
                  <span>●●●</span>
                </div>
              </div>

              {/* WhatsApp header */}
              <div
                style={{
                  background: "#1A8A5A",
                  padding: "10px 14px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  DW
                </div>
                <div>
                  <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>Digitale Werknemer</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7FE8B0", display: "inline-block" }} />
                    <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 10 }}>Online · reageert altijd</span>
                  </div>
                </div>
              </div>

              {/* Chat area */}
              <div
                style={{
                  flex: 1,
                  background: "#E5DDD5",
                  padding: "12px 10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  overflow: "hidden",
                }}
              >
                {TRAIN_MSGS.slice(0, visible + 1).map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: msg.from === "owner" ? "flex-start" : "flex-end",
                      animation: "bubbleIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "82%",
                        background: msg.from === "owner" ? "#FFFFFF" : "#D9FDD3",
                        borderRadius: msg.from === "owner" ? "2px 14px 14px 14px" : "14px 2px 14px 14px",
                        padding: "7px 10px",
                        fontSize: 11,
                        lineHeight: 1.5,
                        color: "#1A1A2E",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.10)",
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input bar */}
              <div
                style={{
                  background: "#F0F2F5",
                  padding: "8px 10px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    background: "#fff",
                    borderRadius: 20,
                    padding: "7px 12px",
                    fontSize: 10,
                    color: "#94A3B8",
                  }}
                >
                  Typ een bericht...
                </div>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "#1A8A5A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 11,
                    flexShrink: 0,
                  }}
                >
                  ▶
                </div>
              </div>
            </div>
          </div>

          {/* Floating badge — right */}
          <div
            style={{
              position: "absolute",
              right: -16,
              top: "18%",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: "10px 14px",
              boxShadow: "var(--shadow-md)",
              animation: "bubbleIn 0.4s 1.2s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            <div style={{ fontSize: 10, color: "var(--t3)", fontWeight: 500 }}>Reageert in</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--blue)" }}>2 seconden</div>
          </div>

          {/* Floating badge — left */}
          <div
            style={{
              position: "absolute",
              left: -8,
              bottom: "22%",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: "10px 14px",
              boxShadow: "var(--shadow-md)",
              animation: "bubbleIn 0.4s 1.8s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            <div style={{ fontSize: 10, color: "var(--t3)", fontWeight: 500 }}>Beschikbaar</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--green)" }}>24/7</div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
            padding-top: 40px !important;
            padding-bottom: 60px !important;
          }
        }
      `}</style>
    </section>
  );
}

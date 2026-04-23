"use client";

import { X, Check } from "lucide-react";

const ITEMS = [
  "Beschikbaar buiten werktijden",
  "Antwoordt binnen seconden",
  "Vergeet nooit een klant op te volgen",
  "Genereert offertes direct",
  "Leert van elke correctie",
  "Vast maandelijks tarief",
  "Geen vakanties of ziekmeldingen",
  "In 1 week operationeel",
];

export default function Comparison() {
  return (
    <section style={{ padding: "96px 24px", background: "var(--surface)" }}>
      <div style={{ maxWidth: 840, margin: "0 auto" }}>
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
            Echte assistent vs. Digitale Werknemer
          </h2>
          <p style={{ fontSize: 16, color: "var(--t2)", maxWidth: 460, margin: "0 auto" }}>
            Zelfde taken. Betere beschikbaarheid. Lager tarief.
          </p>
        </div>

        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              background: "var(--dark)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ padding: "16px 24px", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.40)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Eigenschap
            </div>
            <div style={{ padding: "16px 24px", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.08em", borderLeft: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}>
              Echte assistent
            </div>
            <div style={{ padding: "16px 24px", fontSize: 12, fontWeight: 700, color: "rgba(147,180,255,1)", textTransform: "uppercase", letterSpacing: "0.08em", borderLeft: "1px solid rgba(255,255,255,0.08)", textAlign: "center", background: "rgba(27,79,216,0.20)" }}>
              Digitale Werknemer
            </div>
          </div>

          {ITEMS.map((item, i) => (
            <div
              key={item}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                borderBottom: i < ITEMS.length - 1 ? "1px solid var(--border)" : "none",
                background: i % 2 === 0 ? "var(--surface)" : "var(--bg-grey)",
              }}
            >
              <div style={{ padding: "14px 24px", fontSize: 14, color: "var(--t1)", fontWeight: 500 }}>
                {item}
              </div>
              <div style={{ padding: "14px 24px", display: "flex", justifyContent: "center", alignItems: "center", borderLeft: "1px solid var(--border)" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <X size={13} style={{ color: "#DC2626" }} />
                </div>
              </div>
              <div style={{ padding: "14px 24px", display: "flex", justifyContent: "center", alignItems: "center", borderLeft: "1px solid var(--border)", background: "rgba(27,79,216,0.04)" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Check size={13} style={{ color: "#16A34A" }} />
                </div>
              </div>
            </div>
          ))}

          {/* Price row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              borderTop: "2px solid var(--blue)",
            }}
          >
            <div style={{ padding: "18px 24px", fontSize: 14, fontWeight: 700, color: "var(--t1)" }}>
              Maandelijkse kosten
            </div>
            <div style={{ padding: "18px 24px", textAlign: "center", borderLeft: "1px solid var(--border)" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--t1)" }}>€2.500+</div>
              <div style={{ fontSize: 11, color: "var(--t3)" }}>salaris + bijdragen</div>
            </div>
            <div style={{ padding: "18px 24px", textAlign: "center", borderLeft: "1px solid var(--border)", background: "var(--blue-l)" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--blue)" }}>Vanaf €149</div>
              <div style={{ fontSize: 11, color: "var(--blue)", opacity: 0.7 }}>alles inbegrepen</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Home, Leaf, Wrench, Building2, Scissors, UtensilsCrossed, Car, HeartPulse, Package, Zap } from "lucide-react";

const SECTORS = [
  { Icon: Home, label: "Makelaars" },
  { Icon: Leaf, label: "Hoveniers" },
  { Icon: Wrench, label: "Installateurs" },
  { Icon: Building2, label: "Aannemers" },
  { Icon: Scissors, label: "Kappers" },
  { Icon: UtensilsCrossed, label: "Horeca" },
  { Icon: Car, label: "Garagebedrijven" },
  { Icon: HeartPulse, label: "Zorgverleners" },
  { Icon: Package, label: "Webshops" },
  { Icon: Zap, label: "Electriciens" },
];

export default function SectorBar() {
  return (
    <section
      style={{
        padding: "36px 24px",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p
          style={{
            textAlign: "center",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--t3)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 20,
          }}
        >
          Werkt voor elke branche in het MKB
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {SECTORS.map(({ Icon, label }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: 999,
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--t2)",
                cursor: "default",
                transition: "border-color 0.15s, color 0.15s",
              }}
              className="sector-pill"
            >
              <Icon size={14} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .sector-pill:hover {
          border-color: var(--blue) !important;
          color: var(--blue) !important;
        }
      `}</style>
    </section>
  );
}

"use client";

import AppLogo from "./AppLogo";
import Link from "next/link";

const RING_INNER = [
  "whatsapp",
  "googlecalendar",
  "gmail",
  "stripe",
  "slack",
  "microsoftoutlook",
];

const RING_OUTER = [
  "zapier",
  "shopify",
  "hubspot",
  "notion",
  "mollie",
  "googledrive",
  "moneybird",
];

function OrbitRing({
  logos,
  radius,
  duration,
  direction,
  logoSize,
}: {
  logos: string[];
  radius: number;
  duration: number;
  direction: "cw" | "ccw";
  logoSize: number;
}) {
  const angle = 360 / logos.length;
  const animation = direction === "cw" ? "orbitCW" : "orbitCCW";
  const counterAnim = direction === "cw" ? "orbitCCW" : "orbitCW";

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: radius * 2,
        height: radius * 2,
        marginTop: -radius,
        marginLeft: -radius,
        borderRadius: "50%",
        border: "1px dashed rgba(27,79,216,0.15)",
        animation: `${animation} ${duration}s linear infinite`,
      }}
    >
      {logos.map((name, i) => {
        const deg = i * angle;
        const rad = (deg * Math.PI) / 180;
        const x = radius + radius * Math.cos(rad) - logoSize / 2;
        const y = radius + radius * Math.sin(rad) - logoSize / 2;

        return (
          <div
            key={name}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: logoSize,
              height: logoSize,
              background: "#fff",
              borderRadius: "50%",
              border: "1px solid var(--border)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 5,
              animation: `${counterAnim} ${duration}s linear infinite`,
            }}
          >
            <AppLogo name={name} size={logoSize - 14} />
          </div>
        );
      })}
    </div>
  );
}

export default function IntegrationsOrbit() {
  return (
    <section id="integraties" style={{ padding: "96px 24px", background: "var(--surface)", overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--blue-l)",
              border: "1px solid rgba(27,79,216,0.20)",
              borderRadius: 999,
              padding: "5px 16px",
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--blue)" }}>50+ integraties</span>
          </div>
          <h2
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(28px, 3.5vw, 44px)",
              color: "var(--t1)",
              fontWeight: 400,
              marginBottom: 12,
            }}
          >
            Werkt met de tools die jij al gebruikt
          </h2>
          <p style={{ fontSize: 16, color: "var(--t2)", maxWidth: 480, margin: "0 auto" }}>
            Hij verbindt zich met jouw bestaande software. Geen migratie, geen gedoe.
          </p>
        </div>

        {/* Orbit */}
        <div
          style={{
            position: "relative",
            width: 480,
            height: 480,
            margin: "0 auto 56px",
          }}
        >
          {/* Center hub */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 80,
              height: 80,
              marginTop: -40,
              marginLeft: -40,
              background: "var(--blue)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 0 16px rgba(27,79,216,0.08), 0 0 0 32px rgba(27,79,216,0.04)",
              zIndex: 10,
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 6L21.5 16.5H18V20.5L12.5 14H16V6Z" fill="white" />
              <path d="M13 13.5L10.5 26L16 19.5V24L21.5 16.5H17L13 13.5Z" fill="rgba(255,255,255,0.5)" />
            </svg>
          </div>

          <OrbitRing logos={RING_INNER} radius={145} duration={22} direction="cw" logoSize={46} />
          <OrbitRing logos={RING_OUTER} radius={225} duration={35} direction="ccw" logoSize={40} />
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <Link
            href="/integraties"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--blue-l)",
              color: "var(--blue)",
              fontWeight: 600,
              fontSize: 14,
              padding: "12px 28px",
              borderRadius: 12,
              textDecoration: "none",
              border: "1px solid rgba(27,79,216,0.20)",
              transition: "all 0.15s",
            }}
            className="hover:bg-[var(--blue-m)]"
          >
            Alle integraties bekijken
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

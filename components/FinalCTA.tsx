"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section
      style={{
        padding: "112px 24px",
        background: "var(--dark)",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      {/* Radial blue glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 400,
          background: "radial-gradient(ellipse at center, rgba(27,79,216,0.30) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <h2
          style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(32px, 4.5vw, 58px)",
            color: "#fff",
            fontWeight: 400,
            lineHeight: 1.12,
            marginBottom: 20,
          }}
        >
          Klaar om nooit meer een klant te missen?
        </h2>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 44 }}>
          Start vandaag. In één week actief. Maandelijks opzegbaar.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
          <Link
            href="/auth/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--amber)",
              color: "var(--dark)",
              fontWeight: 700,
              fontSize: 15,
              padding: "14px 32px",
              borderRadius: 12,
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(232,184,75,0.35)",
              transition: "all 0.15s",
            }}
            className="hover:brightness-110 hover:-translate-y-px"
          >
            Start gratis vandaag
            <ArrowRight size={16} />
          </Link>
          <a
            href="mailto:team@deltaagents.nl"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "#fff",
              fontWeight: 600,
              fontSize: 15,
              padding: "14px 32px",
              borderRadius: 12,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.20)",
              transition: "border-color 0.15s",
            }}
            className="hover:border-white/40"
          >
            Neem contact op
          </a>
        </div>

        <p style={{ marginTop: 32, fontSize: 13, color: "rgba(255,255,255,0.30)" }}>
          Geen creditcard nodig · GDPR-compliant · Nederlands support
        </p>
      </div>
    </section>
  );
}

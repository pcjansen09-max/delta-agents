"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const QUESTIONS = [
  {
    q: "Hoe snel is mijn Digitale Werknemer operationeel?",
    a: "Binnen 1 werkdag na aanmelding. Je vult je bedrijfsinfo in, wij configureren de rest. Na de inwerkfase van 3-7 dagen werkt hij volledig zelfstandig.",
  },
  {
    q: "Spreekt hij ook Nederlands?",
    a: "Ja, volledig Nederlands. Ook dialect begrijpt hij goed. Hij past zijn taalgebruik automatisch aan op die van de klant.",
  },
  {
    q: "Kan ik hem zelf bijleren?",
    a: "Ja, op twee manieren: via je dashboard (bedrijfsinfo aanvullen) of door hem direct te corrigeren via WhatsApp. Zeg 'Niet zo zeggen, zeg liever...' en hij onthoudt het voor altijd.",
  },
  {
    q: "Wat als hij iets verkeerds zegt?",
    a: "Corrigeer hem direct. Stuur een bericht met de correcte informatie en hij past zijn gedrag onmiddellijk aan. Fouten worden zelden herhaald.",
  },
  {
    q: "Kan ik hem pauzeren?",
    a: "Ja, via je dashboard met één klik. Handig tijdens vakanties of als je tijdelijk zelf wil antwoorden.",
  },
  {
    q: "Wat kost het echt?",
    a: "Alleen het maandelijkse abonnement: €149, €239 of €499 afhankelijk van je plan. Geen setup fee, geen kosten per bericht, geen verborgen kosten. Maandelijks opzegbaar.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section style={{ padding: "96px 24px", background: "var(--bg-grey)" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
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
            Veelgestelde vragen
          </h2>
          <p style={{ fontSize: 16, color: "var(--t2)" }}>
            Staat jouw vraag er niet bij? Mail ons op{" "}
            <a href="mailto:team@deltaagents.nl" style={{ color: "var(--blue)", textDecoration: "none" }}>
              team@deltaagents.nl
            </a>
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {QUESTIONS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  overflow: "hidden",
                  borderLeft: isOpen ? "3px solid var(--blue)" : "1px solid var(--border)",
                  transition: "border 0.2s",
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "18px 22px",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    gap: 16,
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600, color: "var(--t1)", flex: 1 }}>
                    {item.q}
                  </span>
                  <ChevronDown
                    size={18}
                    style={{
                      color: "var(--t3)",
                      flexShrink: 0,
                      transform: isOpen ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  />
                </button>

                <div
                  style={{
                    maxHeight: isOpen ? 300 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.3s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <div style={{ padding: "0 22px 18px", paddingTop: 2 }}>
                    <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                      <p style={{ fontSize: 14, color: "var(--t2)", lineHeight: 1.75 }}>{item.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

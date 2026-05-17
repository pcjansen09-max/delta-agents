"use client";

import { useState, FormEvent } from "react";

interface CompanyWithPersona {
  id: string;
  company_name: string | null;
  industry: string | null;
  persona_voice: string | null;
  persona_avoid: string | null;
  reply_style: "kort_bondig" | "standaard" | "uitgebreid" | "informeel";
}

interface Props {
  company: CompanyWithPersona;
  bedrijfsinfo: string;
  werkwijze: string;
  moneybirdConnected: boolean;
  moneybirdAdministration: string | null;
}

export default function SettingsForm({
  company,
  bedrijfsinfo: initialBedrijfsinfo,
  werkwijze: initialWerkwijze,
  moneybirdConnected,
  moneybirdAdministration,
}: Props) {
  const [companyName, setCompanyName] = useState(company.company_name ?? "");
  const [industry, setIndustry] = useState(company.industry ?? "");
  const [bedrijfsinfo, setBedrijfsinfo] = useState(initialBedrijfsinfo);
  const [werkwijze, setWerkwijze] = useState(initialWerkwijze);
  const [personaVoice, setPersonaVoice] = useState(company.persona_voice ?? "");
  const [personaAvoid, setPersonaAvoid] = useState(company.persona_avoid ?? "");
  const [replyStyle, setReplyStyle] = useState(company.reply_style ?? "standaard");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true); setSaved(false); setError("");
    try {
      const res = await fetch("/api/dashboard/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: companyName,
          industry,
          bedrijfsinfo,
          werkwijze,
          persona_voice: personaVoice,
          persona_avoid: personaAvoid,
          reply_style: replyStyle,
        }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        setError(e.error ?? "Opslaan mislukt");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="sf-wrap">
      {/* Bedrijfsinfo */}
      <section className="sf-section">
        <h2 className="sf-h">Bedrijfsgegevens</h2>
        <p className="sf-sub">Basis van uw agent. Wijzig wanneer dingen veranderen.</p>

        <div className="sf-grid">
          <label className="sf-field">
            <span className="sf-label">Bedrijfsnaam</span>
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="sf-input" required />
          </label>
          <label className="sf-field">
            <span className="sf-label">Branche</span>
            <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} className="sf-input" />
          </label>
        </div>

        <label className="sf-field">
          <span className="sf-label">Werkwijze &amp; bedrijfsinfo</span>
          <textarea
            value={bedrijfsinfo}
            onChange={(e) => setBedrijfsinfo(e.target.value)}
            rows={8}
            maxLength={3000}
            className="sf-textarea"
            placeholder="Wie u bent, hoe u werkt, voor wie..."
          />
          <span className="sf-counter">{bedrijfsinfo.length}/3000</span>
        </label>
      </section>

      {/* Persona */}
      <section className="sf-section">
        <h2 className="sf-h">Schrijfstijl &amp; persona</h2>
        <p className="sf-sub">
          Bepaal hoe uw agent praat. Voorbeelden van uw eigen schrijfstijl maken
          'm onherkenbaar menselijk — niet als een chatbot maar als een collega
          die uw bedrijf kent.
        </p>

        <label className="sf-field">
          <span className="sf-label">Tone-of-voice (1-3 zinnen)</span>
          <textarea
            value={personaVoice}
            onChange={(e) => setPersonaVoice(e.target.value)}
            rows={3}
            maxLength={500}
            className="sf-textarea"
            placeholder="Bv: Wij zijn altijd direct en zakelijk. Bij vaste klanten mag het iets warmer, geen overdaad. Korte zinnen, geen lange uitwijdingen."
          />
        </label>

        <label className="sf-field">
          <span className="sf-label">Default reactielengte</span>
          <select value={replyStyle} onChange={(e) => setReplyStyle(e.target.value as typeof replyStyle)} className="sf-input">
            <option value="kort_bondig">Kort &amp; bondig (1-2 zinnen)</option>
            <option value="standaard">Standaard (max 3 zinnen)</option>
            <option value="uitgebreid">Uitgebreid (max 4 zinnen, met context)</option>
            <option value="informeel">Informeel (luchtig in u-vorm)</option>
          </select>
        </label>

        <label className="sf-field">
          <span className="sf-label">Wat de agent NOOIT mag doen of zeggen</span>
          <textarea
            value={personaAvoid}
            onChange={(e) => setPersonaAvoid(e.target.value)}
            rows={3}
            maxLength={500}
            className="sf-textarea"
            placeholder="Bv: geen emoji, geen Engelse woorden, niet over politiek, geen aannames over privé."
          />
        </label>
      </section>

      {/* Integraties */}
      <section className="sf-section">
        <h2 className="sf-h">Integraties</h2>
        <p className="sf-sub">Koppelingen met externe systemen waar de agent mee werkt.</p>

        <div className="sf-integration">
          <div>
            <span className="sf-int-name">Moneybird</span>
            <span className={`sf-int-status sf-int-${moneybirdConnected ? "ok" : "off"}`}>
              {moneybirdConnected ? `Verbonden · admin ${moneybirdAdministration?.slice(0, 8)}...` : "Niet verbonden"}
            </span>
          </div>
          {moneybirdConnected ? (
            <a href="/api/moneybird/connect" className="sf-int-btn sf-int-btn-ghost">
              Opnieuw koppelen
            </a>
          ) : (
            <a href="/api/moneybird/connect" className="sf-int-btn">
              Verbind met Moneybird
            </a>
          )}
        </div>

        <div className="sf-integration">
          <div>
            <span className="sf-int-name">WhatsApp Business</span>
            <span className="sf-int-status sf-int-pending">
              Wordt gekoppeld door DeltaDesign na Meta-approval
            </span>
          </div>
          <span className="sf-int-meta">In behandeling</span>
        </div>
      </section>

      <footer className="sf-foot">
        {error && <p className="sf-error">{error}</p>}
        {saved && <p className="sf-saved">Opgeslagen.</p>}
        <button type="submit" disabled={saving} className="sf-save-btn">
          {saving ? "Opslaan..." : "Wijzigingen opslaan"}
        </button>
      </footer>

      <style jsx>{`
        .sf-wrap { display: flex; flex-direction: column; gap: 32px; }
        .sf-section {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .sf-h {
          font-size: 22px; font-weight: 600; letter-spacing: -0.02em;
          margin: 0;
        }
        .sf-sub {
          font-size: 14px; color: var(--muted); margin: 0;
          max-width: 60ch; line-height: 1.55;
        }

        .sf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 720px) { .sf-grid { grid-template-columns: 1fr; } }
        .sf-field { display: flex; flex-direction: column; gap: 6px; }
        .sf-label {
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted);
        }
        .sf-input, .sf-textarea {
          padding: 12px 14px;
          border: 1px solid var(--line); border-radius: 10px;
          font-family: inherit; font-size: 15px;
          background: #fff;
        }
        .sf-input:focus, .sf-textarea:focus { outline: 0; border-color: var(--delta); }
        .sf-textarea { resize: vertical; line-height: 1.55; }
        .sf-counter {
          align-self: flex-end;
          font-family: var(--font-mono); font-size: 11px; color: var(--muted);
        }

        .sf-integration {
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 20px;
          background: var(--bg-soft);
          border-radius: 10px;
          gap: 16px;
        }
        .sf-integration > div { display: flex; flex-direction: column; gap: 4px; }
        .sf-int-name { font-size: 15px; font-weight: 500; }
        .sf-int-status {
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: 0.1em; text-transform: uppercase;
        }
        .sf-int-ok { color: #166534; }
        .sf-int-off { color: var(--muted); }
        .sf-int-pending { color: #92400e; }
        .sf-int-btn {
          padding: 10px 20px; border-radius: 999px;
          background: var(--delta); color: #fff;
          font-size: 14px; font-weight: 500;
          transition: background 0.15s;
        }
        .sf-int-btn:hover { background: var(--delta-2); }
        .sf-int-btn-ghost { background: transparent; color: var(--ink-2); border: 1px solid var(--line); }
        .sf-int-btn-ghost:hover { border-color: var(--ink); background: transparent; }
        .sf-int-meta {
          font-family: var(--font-mono); font-size: 11px;
          color: var(--muted); letter-spacing: 0.1em;
        }

        .sf-foot {
          display: flex; justify-content: space-between; align-items: center;
          gap: 16px; padding-top: 12px;
        }
        .sf-error { margin: 0; color: #991b1b; font-size: 14px; }
        .sf-saved { margin: 0; color: #166534; font-size: 14px; }
        .sf-save-btn {
          margin-left: auto;
          padding: 14px 28px;
          background: var(--ink); color: #fff;
          border: 0; border-radius: 10px;
          font-size: 14px; font-weight: 500;
          cursor: pointer;
        }
        .sf-save-btn:disabled { opacity: 0.5; cursor: wait; }
        .sf-save-btn:hover:not(:disabled) { background: var(--delta); }
      `}</style>
    </form>
  );
}

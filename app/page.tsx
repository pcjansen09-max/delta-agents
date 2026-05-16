"use client";

import { useState, useEffect, useRef, FormEvent } from "react";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  // Reveal on scroll
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) {
      setError("E-mailadres is verplicht");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, company }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Er ging iets mis");
      setStatus("success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Er ging iets mis";
      setError(message);
      setStatus("error");
    }
  }

  return (
    <main>
      {/* ====== NAV ====== */}
      <nav className="da-nav">
        <div className="da-nav-inner">
          <a href="/" className="da-brand" aria-label="DeltaAgents home">
            <span className="da-brand-delta">Δ</span>
            <span className="da-brand-word">DeltaAgents</span>
          </a>
          <a
            href="https://delta-design.nl"
            className="da-nav-link"
            target="_blank"
            rel="noopener"
          >
            DeltaDesign →
          </a>
        </div>
      </nav>

      {/* ====== HERO ====== */}
      <header className="da-hero">
        <div className="da-hero-bg" aria-hidden="true">
          <div className="da-hero-grid" />
          <div className="da-hero-glow" />
        </div>

        <div className="container da-hero-inner">
          <div className="eyebrow da-hero-eyebrow" data-reveal>
            <span className="dot" />
            Early access · DeltaAgents
          </div>

          <h1 className="display da-hero-title">
            <span className="da-line" data-reveal>
              De cloud-versie
            </span>
            <span className="da-line da-line-italic serif" data-reveal data-reveal-delay="1">
              van de Digitale Werknemer
            </span>
            <span className="da-line" data-reveal data-reveal-delay="2">
              komt eraan.
            </span>
          </h1>

          <p className="lead da-hero-lead" data-reveal data-reveal-delay="3">
            DeltaAgents wordt de cloud-versie van de Digitale Werknemer: dezelfde
            AI-collega die 24/7 via WhatsApp uw klanten helpt, offertes opstelt
            en uw planning beheert — maar zonder hardware bij u op locatie.
            Sluit u aan op de wachtlijst voor early access.
          </p>

          {/* ====== WAITLIST FORM ====== */}
          <div className="da-form-wrap" data-reveal data-reveal-delay="4">
            {status !== "success" ? (
              <form className="da-form" onSubmit={onSubmit}>
                <div className="da-form-row">
                  <label className="da-field da-field-half">
                    <span className="da-label">Naam</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Uw naam (optioneel)"
                      autoComplete="name"
                    />
                  </label>
                  <label className="da-field da-field-half">
                    <span className="da-label">Bedrijf</span>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Bedrijfsnaam (optioneel)"
                      autoComplete="organization"
                    />
                  </label>
                </div>
                <label className="da-field">
                  <span className="da-label">E-mailadres *</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="naam@bedrijf.nl"
                    required
                    autoComplete="email"
                  />
                </label>
                <button
                  type="submit"
                  className="btn btn-primary da-submit"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Bezig..." : "Sluit aan op de wachtlijst"}
                  <svg className="arrow" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 13 L13 3 M6 3 H13 V10"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {error && <p className="da-error">{error}</p>}
                <p className="da-note">
                  Geen spam, geen verkooppraat. U krijgt alleen bericht zodra
                  early access begint.
                </p>
              </form>
            ) : (
              <div className="da-success">
                <div className="da-success-ic">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12 L10 17 L19 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3>U staat op de lijst.</h3>
                <p>
                  Bedankt. Zodra DeltaAgents in early access gaat, hoort u het
                  als één van de eersten. Wij benaderen u persoonlijk.
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ====== WAT KOMT ERAAN ====== */}
      <section className="da-section">
        <div className="container">
          <div className="section-marker" data-reveal>
            <span className="label">Wat komt eraan</span>
            <span className="line" />
            <span className="label">Cloud-versie · DeltaAgents</span>
          </div>

          <h2 className="h2 da-section-h" data-reveal>
            Hetzelfde idee.<br />
            <em className="serif" style={{ color: "var(--delta)" }}>
              Zonder hardware.
            </em>
          </h2>

          <div className="da-features">
            <article className="da-feature" data-reveal>
              <div className="da-feature-ix">01</div>
              <h3>24/7 via WhatsApp</h3>
              <p>
                Uw klanten en team appen één nummer. De agent beantwoordt
                vragen, plant afspraken, stuurt offertes. Direct,
                professioneel, in uw eigen toon.
              </p>
            </article>

            <article className="da-feature" data-reveal data-reveal-delay="1">
              <div className="da-feature-ix">02</div>
              <h3>Volautomatische facturatie</h3>
              <p>
                Spraakbericht na de klus — agent maakt concept-factuur in uw
                boekhouding klaar. U tikt 'JA', hij verstuurt. Geen vergeten
                uurtjes meer.
              </p>
            </article>

            <article className="da-feature" data-reveal data-reveal-delay="2">
              <div className="da-feature-ix">03</div>
              <h3>Koppelingen met uw software</h3>
              <p>
                Moneybird, Exact, Google Calendar, Microsoft 365 en meer.
                Bestaat de koppeling nog niet? Wij bouwen 'm op maat tijdens
                onboarding.
              </p>
            </article>

            <article className="da-feature" data-reveal data-reveal-delay="3">
              <div className="da-feature-ix">04</div>
              <h3>Zelflerend per bedrijf</h3>
              <p>
                Corrigeert u 'm één keer, dan maakt hij die fout nooit meer.
                Onthoudt uw klanten, voorkeuren en regels. Wordt elke dag
                slimmer voor uw specifieke bedrijf.
              </p>
            </article>

            <article className="da-feature" data-reveal data-reveal-delay="4">
              <div className="da-feature-ix">05</div>
              <h3>U bepaalt wie wat mag</h3>
              <p>
                Rolgebaseerde toegang per 06-nummer. Directie, voorman, monteur
                — u stelt zelf in wie welke informatie mag opvragen. Op elk
                moment aanpasbaar.
              </p>
            </article>

            <article className="da-feature" data-reveal data-reveal-delay="5">
              <div className="da-feature-ix">06</div>
              <h3>Maandelijks opzegbaar</h3>
              <p>
                Geen lange contracten, geen lock-in. Maandelijks betalen,
                maandelijks stoppen als het niet werkt voor uw bedrijf.
                Eerlijk en transparant.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ====== CLOUD VS LOKAAL ====== */}
      <section className="da-section da-compare-section">
        <div className="container">
          <div className="section-marker" data-reveal>
            <span className="label">Cloud of lokaal</span>
            <span className="line" />
            <span className="label">Twee smaken, één principe</span>
          </div>

          <h2 className="h2 da-section-h" data-reveal>
            Welke past bij<br />
            <em className="serif" style={{ color: "var(--delta)" }}>
              uw bedrijf?
            </em>
          </h2>

          <div className="da-compare">
            <article className="da-compare-card" data-reveal>
              <div className="da-compare-tag">DeltaAgents · Cloud (deze site)</div>
              <h3>Geen apparaat. Snel live.</h3>
              <ul>
                <li>Geen hardware op kantoor</li>
                <li>Snel opgezet (1-2 weken)</li>
                <li>Maandabonnement</li>
                <li>Updates automatisch</li>
                <li>Data in EU-cloud (AVG-proof)</li>
              </ul>
              <div className="da-compare-foot">
                <span className="eyebrow"><span className="dot" />In ontwikkeling</span>
              </div>
            </article>

            <article className="da-compare-card da-compare-card-accent" data-reveal data-reveal-delay="1">
              <div className="da-compare-tag">Digitale Werknemer · Lokaal</div>
              <h3>Fysiek apparaat. 100% lokaal.</h3>
              <ul>
                <li>Apparaat bij u op kantoor</li>
                <li>Uitgebreid traject (3-6 weken)</li>
                <li>Eenmalige investering + service</li>
                <li>Volledig op maat geconfigureerd</li>
                <li>Geen enkele data verlaat uw pand</li>
              </ul>
              <div className="da-compare-foot">
                <a href="https://delta-design.nl/digitale-werknemer" target="_blank" rel="noopener" className="da-compare-link">
                  Beschikbaar via DeltaDesign →
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ====== TIMELINE ====== */}
      <section className="da-section">
        <div className="container">
          <div className="section-marker" data-reveal>
            <span className="label">Tijdlijn</span>
            <span className="line" />
            <span className="label">Wat staat er gepland</span>
          </div>

          <h2 className="h2 da-section-h" data-reveal>
            Op weg naar<br />
            <em className="serif" style={{ color: "var(--delta)" }}>
              early access.
            </em>
          </h2>

          <div className="da-timeline">
            <div className="da-step da-step-done" data-reveal>
              <div className="da-step-ix">Q2 2026</div>
              <div className="da-step-title">Architectuur &amp; eerste prototype</div>
              <div className="da-step-text">
                Kerntechniek opgezet. WhatsApp Business API gekoppeld.
                Eerste interne demo werkend.
              </div>
            </div>
            <div className="da-step" data-reveal data-reveal-delay="1">
              <div className="da-step-ix">Q3 2026</div>
              <div className="da-step-title">Pilot met eerste klanten</div>
              <div className="da-step-text">
                Gesloten pilot met 5-10 MKB-bedrijven. Echte facturen, echte
                klanten, echte feedback. Iteraties op basis van praktijk.
              </div>
            </div>
            <div className="da-step" data-reveal data-reveal-delay="2">
              <div className="da-step-ix">Q4 2026</div>
              <div className="da-step-title">Early access (waitlist)</div>
              <div className="da-step-text">
                De wachtlijst krijgt als eerste toegang. Gereduceerd tarief in
                ruil voor feedback. Onboarding wordt persoonlijk verzorgd.
              </div>
            </div>
            <div className="da-step" data-reveal data-reveal-delay="3">
              <div className="da-step-ix">2027</div>
              <div className="da-step-title">Publieke launch</div>
              <div className="da-step-text">
                Open inschrijving. Self-service onboarding. Volledige
                integraties-library. Maandelijks opzegbare abonnementen.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== SECONDARY CTA ====== */}
      <section className="da-cta">
        <div className="container">
          <div className="da-cta-inner" data-reveal>
            <span className="eyebrow">
              <span className="dot" />
              Klaar om bij de eersten te horen?
            </span>
            <h2 className="display-2 da-cta-headline">
              Sluit u aan.<br />
              <em className="serif" style={{ color: "var(--delta)" }}>
                Wij houden u op de hoogte.
              </em>
            </h2>
            <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="btn btn-primary">
              Naar het formulier
              <svg className="arrow" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 13 L13 3 M6 3 H13 V10"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="da-footer">
        <div className="container">
          <div className="da-footer-top">
            <div>
              <div className="da-brand da-brand-footer">
                <span className="da-brand-delta">Δ</span>
                <span className="da-brand-word">DeltaAgents</span>
              </div>
              <p className="da-footer-tag">
                De cloud-versie van de Digitale Werknemer. In ontwikkeling
                door DeltaDesign — Peter Jansen.
              </p>
            </div>
            <div className="da-footer-links">
              <a href="https://delta-design.nl" target="_blank" rel="noopener">DeltaDesign hoofdsite</a>
              <a href="https://delta-design.nl/digitale-werknemer" target="_blank" rel="noopener">Lokale Digitale Werknemer</a>
              <a href="mailto:info@delta-design.nl">info@delta-design.nl</a>
              <a href="tel:+31683417723">+31 6 83 41 77 23</a>
            </div>
          </div>
          <div className="da-footer-bottom">
            <span>© DeltaDesign — Peter Jansen · KVK 42031960</span>
            <span>Verandering die werkt.</span>
          </div>
        </div>
      </footer>

      <style jsx>{`
        /* NAV */
        .da-nav {
          position: fixed;
          top: 18px;
          left: 0; right: 0;
          z-index: 100;
          display: flex;
          justify-content: center;
          pointer-events: none;
        }
        .da-nav-inner {
          pointer-events: auto;
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 10px 22px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: saturate(180%) blur(22px);
          -webkit-backdrop-filter: saturate(180%) blur(22px);
          border: 1px solid rgba(10, 10, 11, 0.06);
          border-radius: 999px;
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.7) inset, 0 8px 28px rgba(10, 10, 11, 0.06);
        }
        .da-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: var(--ink);
        }
        .da-brand-delta {
          font-size: 22px;
          color: var(--delta);
          line-height: 1;
        }
        .da-brand-word { font-size: 16px; }
        .da-nav-link {
          font-size: 13px;
          color: var(--ink-2);
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(10, 10, 11, 0.04);
          transition: background 0.2s var(--ease);
        }
        .da-nav-link:hover { background: rgba(10, 10, 11, 0.08); }

        /* HERO */
        .da-hero {
          position: relative;
          min-height: 100vh;
          padding: clamp(140px, 18vw, 200px) 0 clamp(60px, 8vw, 100px);
          overflow: hidden;
        }
        .da-hero-bg { position: absolute; inset: 0; pointer-events: none; }
        .da-hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(10,10,11,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(10,10,11,0.04) 1px, transparent 1px);
          background-size: 88px 88px;
          mask-image: radial-gradient(ellipse at 60% 30%, #000 0%, transparent 70%);
        }
        .da-hero-glow {
          position: absolute;
          width: 60vw; height: 60vw;
          right: -10vw; top: -20vw;
          background: radial-gradient(circle at center, rgba(27,58,94,0.07) 0%, transparent 60%);
          border-radius: 999px;
          filter: blur(20px);
        }
        .da-hero-inner { position: relative; z-index: 2; }
        .da-hero-eyebrow { margin-bottom: clamp(24px, 4vw, 56px); }
        .da-hero-title { max-width: 18ch; margin: 0 0 32px; }
        .da-line { display: block; }
        .da-line-italic {
          color: var(--delta);
          font-style: italic;
          font-weight: 400;
          letter-spacing: -0.03em;
        }
        .da-hero-lead { margin: 0 0 clamp(40px, 5vw, 64px); max-width: 60ch; }

        /* FORM */
        .da-form-wrap { max-width: 580px; }
        .da-form {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(12px);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          padding: clamp(24px, 3vw, 36px);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .da-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .da-field { display: flex; flex-direction: column; gap: 6px; }
        .da-label {
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .da-field input {
          font-family: inherit;
          font-size: 16px;
          color: var(--ink);
          padding: 14px 16px;
          border-radius: 10px;
          border: 1px solid var(--line);
          background: #fff;
          transition: border-color 0.2s var(--ease);
          width: 100%;
        }
        .da-field input:focus { outline: 0; border-color: var(--delta); }
        .da-field input::placeholder { color: var(--muted-2); }
        .da-submit {
          width: 100%;
          justify-content: center;
          margin-top: 8px;
        }
        .da-submit:disabled { opacity: 0.6; cursor: wait; }
        .da-note {
          margin: 4px 0 0;
          font-size: 12px;
          color: var(--muted);
          text-align: center;
        }
        .da-error {
          margin: 0;
          font-size: 13px;
          color: #d40000;
        }

        /* SUCCESS */
        .da-success {
          background: rgba(255,255,255,0.85);
          border: 1px solid var(--delta-tint);
          border-radius: var(--radius);
          padding: clamp(32px, 4vw, 48px);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .da-success-ic {
          width: 56px; height: 56px;
          background: var(--delta);
          border-radius: 99px;
          color: #fff;
          display: grid;
          place-items: center;
        }
        .da-success-ic svg { width: 28px; height: 28px; }
        .da-success h3 {
          font-size: 24px;
          font-weight: 600;
          letter-spacing: -0.025em;
          margin: 0;
        }
        .da-success p {
          font-size: 15px;
          color: var(--ink-2);
          line-height: 1.6;
          margin: 0;
          max-width: 42ch;
        }

        /* SECTIONS */
        .da-section { padding: clamp(80px, 12vw, 180px) 0; }
        .da-section-h { margin-bottom: clamp(40px, 5vw, 64px); max-width: 22ch; }

        /* FEATURES */
        .da-features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .da-feature {
          background: var(--bg);
          border: 1px solid var(--line);
          border-radius: var(--radius-lg);
          padding: clamp(28px, 3vw, 40px);
          display: flex;
          flex-direction: column;
          gap: 14px;
          min-height: 260px;
          transition: transform 0.4s var(--ease), border-color 0.3s var(--ease);
        }
        .da-feature:hover {
          transform: translateY(-3px);
          border-color: var(--ink);
        }
        .da-feature-ix {
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.16em;
          color: var(--delta);
        }
        .da-feature h3 {
          font-size: clamp(20px, 1.8vw, 26px);
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin: 0;
        }
        .da-feature p {
          color: var(--ink-2);
          font-size: 14.5px;
          line-height: 1.6;
          margin: 0;
        }

        /* COMPARE */
        .da-compare-section { background: var(--bg-tint); }
        .da-compare {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .da-compare-card {
          background: var(--bg);
          border: 1px solid var(--line);
          border-radius: var(--radius-lg);
          padding: clamp(28px, 3vw, 40px);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .da-compare-card-accent {
          background: linear-gradient(180deg, #fff, var(--bg-soft));
        }
        .da-compare-tag {
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.16em;
          color: var(--delta);
          text-transform: uppercase;
        }
        .da-compare-card h3 {
          font-size: clamp(24px, 2.4vw, 32px);
          font-weight: 600;
          letter-spacing: -0.025em;
          line-height: 1.1;
          margin: 0;
        }
        .da-compare-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .da-compare-card li {
          font-size: 15px;
          color: var(--ink-2);
          padding-left: 20px;
          position: relative;
        }
        .da-compare-card li::before {
          content: "→";
          position: absolute;
          left: 0;
          color: var(--delta);
        }
        .da-compare-foot {
          margin-top: auto;
          padding-top: 8px;
        }
        .da-compare-link {
          color: var(--delta);
          font-weight: 500;
          font-size: 14px;
        }

        /* TIMELINE */
        .da-timeline {
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--line);
        }
        .da-step {
          display: grid;
          grid-template-columns: 140px 1.2fr 1.8fr;
          gap: clamp(24px, 4vw, 56px);
          padding: clamp(28px, 4vw, 48px) 0;
          border-bottom: 1px solid var(--line);
          align-items: start;
          transition: padding 0.4s var(--ease), background 0.4s var(--ease);
        }
        .da-step:hover { background: var(--bg-soft); padding-left: 16px; }
        .da-step-done .da-step-ix::after {
          content: "✓";
          color: #22c55e;
          margin-left: 8px;
          font-size: 14px;
        }
        .da-step-ix {
          font-family: var(--font-mono), monospace;
          font-size: 12px;
          letter-spacing: 0.14em;
          color: var(--delta);
          padding-top: 6px;
        }
        .da-step-title {
          font-size: clamp(22px, 2.4vw, 32px);
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .da-step-text {
          color: var(--ink-2);
          font-size: 16px;
          line-height: 1.6;
        }

        /* CTA */
        .da-cta {
          padding: clamp(100px, 14vw, 200px) 0;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(27,58,94,0.04) 0%, transparent 60%),
            var(--bg);
          border-top: 1px solid var(--line);
        }
        .da-cta-inner {
          max-width: 980px;
          margin: 0 auto;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }
        .da-cta-headline { margin: 12px 0 0; }

        /* FOOTER */
        .da-footer {
          background: #0a0a0b;
          color: #ededee;
          padding: clamp(60px, 8vw, 100px) 0 32px;
        }
        .da-footer-top {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 48px;
          padding-bottom: 56px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .da-brand-footer { color: #fff; }
        .da-footer-tag {
          color: rgba(255,255,255,0.65);
          font-size: 15px;
          line-height: 1.55;
          margin: 20px 0 0;
          max-width: 40ch;
        }
        .da-footer-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .da-footer-links a {
          color: rgba(255,255,255,0.85);
          font-size: 15px;
          transition: color 0.2s var(--ease);
        }
        .da-footer-links a:hover { color: #fff; }
        .da-footer-bottom {
          display: flex;
          justify-content: space-between;
          padding-top: 28px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          flex-wrap: wrap;
          gap: 16px;
        }

        @media (max-width: 880px) {
          .da-features { grid-template-columns: 1fr; }
          .da-compare { grid-template-columns: 1fr; }
          .da-step { grid-template-columns: 1fr; gap: 10px; }
          .da-step:hover { padding-left: 0; }
          .da-footer-top { grid-template-columns: 1fr; gap: 32px; }
          .da-form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}

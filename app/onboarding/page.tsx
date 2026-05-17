"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

const INDUSTRIES = [
  { value: "loonwerk", label: "Loonwerk & grondverzet" },
  { value: "mechanisatie", label: "Mechanisatie" },
  { value: "bouw", label: "Bouw" },
  { value: "agrarisch", label: "Agrarisch" },
  { value: "transport", label: "Transport" },
  { value: "installatie", label: "Installatie / elektra" },
  { value: "overig", label: "Anders, namelijk..." },
];

const DEFAULT_RULES: Record<string, string[]> = {
  loonwerk: [
    "Standaard uurtarief monteur: € 65/uur ex BTW",
    "Voorrijkosten binnen 20 km: € 35 vast",
    "Materialen factureren met 21% BTW, uren ook 21%",
    "Betaaltermijn: 14 dagen na factuurdatum",
  ],
  mechanisatie: [
    "Standaard uurtarief monteur: € 75/uur ex BTW",
    "Spoedoproep avond/weekend: € 110/uur",
    "Onderdelen factureren met 21% BTW",
    "Betaaltermijn: 30 dagen",
  ],
  bouw: [
    "Standaard uurtarief vakman: € 55/uur ex BTW",
    "Voorrijkosten: € 30",
    "Materialen factureren met 21% BTW (9% bij renovatie particulier)",
    "Betaaltermijn: 30 dagen",
  ],
  agrarisch: [
    "Standaard uurtarief: € 60/uur ex BTW",
    "Materialen met 9% BTW (agrarisch tarief)",
    "Bij grote klussen: 50% aanbetaling vooraf",
    "Betaaltermijn: 30 dagen",
  ],
  transport: [
    "Standaard kilometertarief: € 1,85/km",
    "Wachttijd: € 50/uur",
    "Toeslag avond/weekend: 25%",
    "Betaaltermijn: 14 dagen",
  ],
  installatie: [
    "Standaard uurtarief: € 70/uur ex BTW",
    "Voorrijkosten: € 30",
    "Materialen factureren met 21% BTW",
    "Betaaltermijn: 14 dagen",
  ],
  overig: [
    "Standaard uurtarief: € 65/uur ex BTW",
    "Materialen factureren met 21% BTW",
    "Betaaltermijn: 14 dagen",
  ],
};

type Step = 1 | 2 | 3 | 4;

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);

  // Step 1: bedrijfsinfo
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("loonwerk");
  const [industryOther, setIndustryOther] = useState("");
  const [kvk, setKvk] = useState("");

  // Step 2: aanvullende info
  const [bedrijfsinfo, setBedrijfsinfo] = useState("");

  // Step 3: wisdom rules
  const [rules, setRules] = useState<string[]>([]);

  // Step 4: medewerkers
  const [employees, setEmployees] = useState<Array<{ name: string; phone: string; role: string }>>([
    { name: "", phone: "", role: "directie" },
  ]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        router.replace("/login");
        return;
      }

      // Get of create company
      let { data: company } = await supabase
        .from("deltaagents_companies")
        .select("*")
        .eq("owner_email", user.email)
        .single();

      if (!company) {
        const { data: created } = await supabase
          .from("deltaagents_companies")
          .insert({ owner_email: user.email })
          .select()
          .single();
        company = created;
      }

      if (company) {
        setCompanyId(company.id);
        setCompanyName(company.company_name ?? "");
        setIndustry(company.industry ?? "loonwerk");
      }
      setLoading(false);
    }
    init();
  }, [router, supabase]);

  // Stel default rules in als industry verandert (alleen step 3)
  useEffect(() => {
    if (step === 3 && rules.length === 0) {
      const key = industry === "overig" ? "overig" : industry;
      setRules(DEFAULT_RULES[key] ?? DEFAULT_RULES.overig);
    }
  }, [step, industry, rules.length]);

  async function saveStep1(e: FormEvent) {
    e.preventDefault();
    if (!companyId) return;
    setSaving(true); setError("");
    try {
      const finalIndustry = industry === "overig" ? industryOther.trim() || "Overig" : industry;
      const { error: e1 } = await supabase
        .from("deltaagents_companies")
        .update({ company_name: companyName, industry: finalIndustry })
        .eq("id", companyId);
      if (e1) throw new Error(e1.message);

      // Init agent_config
      await supabase
        .from("deltaagents_agent_config")
        .upsert({ company_id: companyId, agent_type: "digital_employee" }, { onConflict: "company_id" });

      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Opslaan mislukt");
    } finally {
      setSaving(false);
    }
  }

  async function saveStep2(e: FormEvent) {
    e.preventDefault();
    if (!companyId) return;
    setSaving(true); setError("");
    try {
      const { error: e1 } = await supabase
        .from("deltaagents_agent_config")
        .update({ bedrijfsinfo })
        .eq("company_id", companyId);
      if (e1) throw new Error(e1.message);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Opslaan mislukt");
    } finally {
      setSaving(false);
    }
  }

  async function saveStep3() {
    if (!companyId) return;
    setSaving(true); setError("");
    try {
      // POST elke rule via API
      const validRules = rules.filter((r) => r.trim().length > 5);
      for (const text of validRules) {
        const res = await fetch("/api/dashboard/wisdom", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rule_text: text.trim(), category: "general" }),
        });
        if (!res.ok) console.warn("Rule save failed:", text);
      }
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Opslaan mislukt");
    } finally {
      setSaving(false);
    }
  }

  async function saveStep4() {
    if (!companyId) return;
    setSaving(true); setError("");
    try {
      const valid = employees.filter((e) => e.name.trim() && e.phone.trim());
      for (const emp of valid) {
        const normalized = emp.phone.replace(/[\s\-+]/g, "");
        const e164 = normalized.startsWith("0") ? "31" + normalized.slice(1) : normalized;
        await supabase
          .from("deltaagents_users")
          .upsert(
            {
              company_id: companyId,
              name: emp.name.trim(),
              phone: e164,
              role: emp.role,
            },
            { onConflict: "company_id,phone" }
          );
      }
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Opslaan mislukt");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="ob-loading">Laden...</div>;
  }

  return (
    <main className="ob-wrap">
      <header className="ob-top">
        <div className="ob-brand">
          <span className="ob-delta">Δ</span>
          <span className="ob-name">DeltaAgents</span>
        </div>
        <div className="ob-progress">
          {[1, 2, 3, 4].map((n) => (
            <span key={n} className={`ob-step ${n === step ? "is-active" : ""} ${n < step ? "is-done" : ""}`}>
              {n < step ? "✓" : n}
            </span>
          ))}
        </div>
      </header>

      <section className="ob-content">
        {step === 1 && (
          <form onSubmit={saveStep1} className="ob-form">
            <span className="eyebrow"><span className="dot" />Stap 1 van 4 · Bedrijf</span>
            <h1 className="h2">
              Welkom bij DeltaAgents.<br />
              <em className="serif" style={{ color: "var(--delta)" }}>
                Vertel ons wie u bent.
              </em>
            </h1>
            <p className="lead ob-lead">
              Uw Digitale Werknemer wordt op maat ingericht voor uw bedrijf.
              We beginnen met het basis.
            </p>

            <label className="ob-label">Bedrijfsnaam *</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              autoFocus
              placeholder="Bv. Van der Berg Grondverzet B.V."
              className="ob-input"
            />

            <label className="ob-label">Branche *</label>
            <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="ob-input">
              {INDUSTRIES.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
            </select>

            {industry === "overig" && (
              <input
                type="text"
                value={industryOther}
                onChange={(e) => setIndustryOther(e.target.value)}
                placeholder="Beschrijf uw branche"
                className="ob-input"
              />
            )}

            <label className="ob-label">KVK-nummer (optioneel)</label>
            <input
              type="text"
              value={kvk}
              onChange={(e) => setKvk(e.target.value)}
              placeholder="12345678"
              className="ob-input"
            />

            {error && <p className="ob-error">{error}</p>}

            <button type="submit" disabled={saving} className="ob-btn">
              {saving ? "Bezig..." : "Doorgaan →"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={saveStep2} className="ob-form">
            <span className="eyebrow"><span className="dot" />Stap 2 van 4 · Werkwijze</span>
            <h1 className="h2">
              Hoe werkt uw bedrijf?<br />
              <em className="serif" style={{ color: "var(--delta)" }}>
                Vertel het in uw eigen woorden.
              </em>
            </h1>
            <p className="lead ob-lead">
              Geef korte achtergrond: wat u doet, voor wie, hoe u prijst,
              hoe u factureert. De agent gebruikt dit als basis voor élk gesprek.
            </p>

            <label className="ob-label">Bedrijfsinfo &amp; werkwijze</label>
            <textarea
              value={bedrijfsinfo}
              onChange={(e) => setBedrijfsinfo(e.target.value)}
              rows={10}
              maxLength={3000}
              placeholder={`Wij zijn ${companyName || "[bedrijf]"}, gevestigd in [plaats], gespecialiseerd in [...].\n\nWij werken voor [doelgroep] en onderscheiden ons door [...].\n\nOnze openingstijden zijn maandag t/m vrijdag 07:00-18:00.\nNoodgevallen 24/7 bereikbaar via WhatsApp.\n\nFacturatie verloopt via Moneybird. Betaaltermijn 14 dagen.`}
              className="ob-textarea"
            />
            <span className="ob-counter">{bedrijfsinfo.length}/3000</span>

            {error && <p className="ob-error">{error}</p>}

            <div className="ob-foot">
              <button type="button" onClick={() => setStep(1)} className="ob-btn ob-btn-ghost">
                ← Terug
              </button>
              <button type="submit" disabled={saving} className="ob-btn">
                {saving ? "Bezig..." : "Doorgaan →"}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="ob-form">
            <span className="eyebrow"><span className="dot" />Stap 3 van 4 · Bedrijfsregels</span>
            <h1 className="h2">
              De eerste regels<br />
              <em className="serif" style={{ color: "var(--delta)" }}>
                die uw agent leert.
              </em>
            </h1>
            <p className="lead ob-lead">
              Een paar standaard regels op basis van uw branche. Pas ze aan,
              verwijder wat niet klopt, voeg toe wat ontbreekt. Later kunt u
              regels altijd bijstellen — of de agent leert ze gewoon van uw
              correcties via WhatsApp.
            </p>

            <div className="ob-rules">
              {rules.map((r, i) => (
                <div key={i} className="ob-rule">
                  <input
                    type="text"
                    value={r}
                    onChange={(e) => setRules((all) => all.map((x, j) => j === i ? e.target.value : x))}
                    className="ob-input"
                  />
                  <button
                    type="button"
                    onClick={() => setRules((all) => all.filter((_, j) => j !== i))}
                    className="ob-rule-del"
                    aria-label="Verwijderen"
                  >×</button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setRules((all) => [...all, ""])}
                className="ob-add-rule"
              >
                + Regel toevoegen
              </button>
            </div>

            {error && <p className="ob-error">{error}</p>}

            <div className="ob-foot">
              <button type="button" onClick={() => setStep(2)} className="ob-btn ob-btn-ghost">
                ← Terug
              </button>
              <button type="button" onClick={saveStep3} disabled={saving} className="ob-btn">
                {saving ? "Opslaan..." : "Doorgaan →"}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="ob-form">
            <span className="eyebrow"><span className="dot" />Stap 4 van 4 · Medewerkers</span>
            <h1 className="h2">
              Wie mag wat?<br />
              <em className="serif" style={{ color: "var(--delta)" }}>
                U bepaalt de toegangsrechten.
              </em>
            </h1>
            <p className="lead ob-lead">
              Voeg medewerkers toe met hun 06-nummer. De agent herkent elke
              afzender en past de rechten toe. U kunt later altijd aanpassen.
            </p>

            <div className="ob-emps">
              <div className="ob-emp-h">
                <span>Naam</span>
                <span>06-nummer</span>
                <span>Rol</span>
                <span></span>
              </div>
              {employees.map((emp, i) => (
                <div key={i} className="ob-emp">
                  <input
                    type="text"
                    value={emp.name}
                    onChange={(e) => setEmployees((all) => all.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                    placeholder="Jan Janssen"
                    className="ob-input"
                  />
                  <input
                    type="tel"
                    value={emp.phone}
                    onChange={(e) => setEmployees((all) => all.map((x, j) => j === i ? { ...x, phone: e.target.value } : x))}
                    placeholder="06 12 34 56 78"
                    className="ob-input"
                  />
                  <select
                    value={emp.role}
                    onChange={(e) => setEmployees((all) => all.map((x, j) => j === i ? { ...x, role: e.target.value } : x))}
                    className="ob-input"
                  >
                    <option value="directie">Directie (alles)</option>
                    <option value="voorman">Voorman (werkbonnen + planning)</option>
                    <option value="monteur">Monteur (alleen eigen uren)</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setEmployees((all) => all.filter((_, j) => j !== i))}
                    className="ob-rule-del"
                    disabled={employees.length === 1}
                    aria-label="Verwijderen"
                  >×</button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setEmployees((all) => [...all, { name: "", phone: "", role: "monteur" }])}
                className="ob-add-rule"
              >
                + Medewerker toevoegen
              </button>
            </div>

            <p className="ob-hint">
              De Digitale Werknemer is via WhatsApp bereikbaar zodra wij uw
              account koppelen aan onze beveiligde nummer. Dat regelen we in
              de volgende stap (volgt na pilot-start).
            </p>

            {error && <p className="ob-error">{error}</p>}

            <div className="ob-foot">
              <button type="button" onClick={() => setStep(3)} className="ob-btn ob-btn-ghost">
                ← Terug
              </button>
              <button type="button" onClick={saveStep4} disabled={saving} className="ob-btn">
                {saving ? "Bezig..." : "Setup voltooien →"}
              </button>
            </div>
          </div>
        )}
      </section>

      <style jsx>{`
        .ob-loading { padding: 60px; text-align: center; color: var(--muted); }
        .ob-wrap {
          min-height: 100vh;
          padding: 32px var(--pad);
          max-width: 760px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 48px;
        }
        .ob-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .ob-brand {
          display: flex; align-items: center; gap: 10px;
          font-weight: 600; letter-spacing: -0.02em; font-size: 17px;
        }
        .ob-delta { font-size: 24px; color: var(--delta); line-height: 1; }
        .ob-progress { display: flex; gap: 6px; }
        .ob-step {
          width: 30px; height: 30px; border-radius: 99px;
          display: grid; place-items: center;
          font-family: var(--font-mono); font-size: 12px;
          background: var(--bg-soft);
          color: var(--muted);
          border: 1px solid var(--line);
        }
        .ob-step.is-active { background: var(--ink); color: #fff; border-color: var(--ink); }
        .ob-step.is-done { background: var(--delta); color: #fff; border-color: var(--delta); }

        .ob-content { display: flex; flex-direction: column; gap: 16px; }
        .ob-form {
          display: flex; flex-direction: column; gap: 14px;
        }
        .ob-lead { margin-bottom: 16px; max-width: 56ch; }

        .ob-label {
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted);
          margin-top: 8px;
        }
        .ob-input {
          padding: 14px 16px;
          font-size: 16px;
          border: 1px solid var(--line);
          border-radius: 10px;
          background: #fff;
          font-family: inherit;
          width: 100%;
          transition: border-color 0.2s;
        }
        .ob-input:focus { outline: 0; border-color: var(--delta); }
        .ob-textarea {
          padding: 16px;
          font-size: 15px;
          border: 1px solid var(--line);
          border-radius: 10px;
          background: #fff;
          font-family: inherit;
          width: 100%;
          line-height: 1.6;
          resize: vertical;
          min-height: 240px;
        }
        .ob-textarea:focus { outline: 0; border-color: var(--delta); }
        .ob-counter {
          align-self: flex-end;
          font-family: var(--font-mono); font-size: 11px; color: var(--muted);
        }

        .ob-rules { display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }
        .ob-rule { display: flex; gap: 8px; align-items: center; }
        .ob-rule .ob-input { font-size: 14px; padding: 12px 14px; }
        .ob-rule-del {
          width: 36px; height: 36px; border-radius: 8px;
          background: transparent; border: 1px solid var(--line);
          color: var(--muted); cursor: pointer; font-size: 18px; line-height: 1;
        }
        .ob-rule-del:hover:not(:disabled) { border-color: #d40000; color: #d40000; }
        .ob-rule-del:disabled { opacity: 0.3; cursor: not-allowed; }
        .ob-add-rule {
          align-self: flex-start;
          padding: 10px 16px; font-size: 13px;
          background: transparent; border: 1px dashed var(--line); border-radius: 8px;
          color: var(--ink-2); cursor: pointer;
        }
        .ob-add-rule:hover { border-color: var(--ink); border-style: solid; }

        .ob-emps { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
        .ob-emp-h, .ob-emp {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1.4fr 36px;
          gap: 8px;
          align-items: center;
        }
        .ob-emp-h span {
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted);
          padding: 0 6px;
        }
        .ob-hint {
          margin: 16px 0 0;
          padding: 14px 18px;
          background: var(--bg-soft);
          border: 1px solid var(--line);
          border-radius: 10px;
          font-size: 13px;
          color: var(--muted);
          line-height: 1.5;
        }

        .ob-foot { display: flex; justify-content: space-between; gap: 12px; margin-top: 12px; }
        .ob-btn {
          padding: 14px 26px;
          background: var(--ink); color: #fff;
          border: 0; border-radius: 999px;
          font-size: 14px; font-weight: 500;
          cursor: pointer;
          transition: background 0.15s, transform 0.15s;
        }
        .ob-btn:hover:not(:disabled) { background: var(--delta); transform: translateY(-1px); }
        .ob-btn:disabled { opacity: 0.5; cursor: wait; }
        .ob-btn-ghost {
          background: transparent; color: var(--ink-2);
          border: 1px solid var(--line);
        }
        .ob-btn-ghost:hover:not(:disabled) {
          background: transparent; border-color: var(--ink); transform: none;
        }
        .ob-error {
          margin: 0; padding: 12px 16px;
          background: #fee2e2; color: #991b1b;
          border-radius: 10px; font-size: 14px;
        }

        @media (max-width: 720px) {
          .ob-emp-h, .ob-emp { grid-template-columns: 1fr; gap: 8px; }
          .ob-emp-h { display: none; }
          .ob-emp .ob-input, .ob-emp .ob-rule-del { width: 100%; }
        }
      `}</style>
    </main>
  );
}

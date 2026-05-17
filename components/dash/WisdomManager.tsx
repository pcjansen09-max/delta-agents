"use client";

import { useState, FormEvent } from "react";
import type { WisdomRule, WisdomCategory } from "@/types/database";

const CATEGORIES: { value: WisdomCategory; label: string }[] = [
  { value: "pricing", label: "Prijzen" },
  { value: "customer", label: "Klant" },
  { value: "communication", label: "Communicatie" },
  { value: "workflow", label: "Werkwijze" },
  { value: "security", label: "Beveiliging" },
  { value: "general", label: "Algemeen" },
];

const SOURCE_LABEL: Record<string, string> = {
  onboarding: "Tijdens setup",
  "user-correction": "Door u gecorrigeerd",
  "auto-detected": "Automatisch herkend",
  system: "Systeem",
};

export default function WisdomManager({ initialRules }: { initialRules: WisdomRule[] }) {
  const [rules, setRules] = useState(initialRules);
  const [filter, setFilter] = useState<WisdomCategory | "all">("all");
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [newCategory, setNewCategory] = useState<WisdomCategory>("general");
  const [busy, setBusy] = useState(false);

  const filtered = filter === "all" ? rules : rules.filter((r) => r.category === filter);

  async function addRule(e: FormEvent) {
    e.preventDefault();
    if (!newText.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/dashboard/wisdom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rule_text: newText.trim(), category: newCategory }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        alert(`Mislukt: ${e.error ?? res.statusText}`);
        return;
      }
      const created = await res.json();
      setRules((r) => [created, ...r]);
      setNewText("");
      setAdding(false);
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(rule: WisdomRule) {
    setBusy(true);
    try {
      const res = await fetch(`/api/dashboard/wisdom/${rule.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !rule.active }),
      });
      if (!res.ok) return;
      const updated = await res.json();
      setRules((r) => r.map((x) => (x.id === rule.id ? updated : x)));
    } finally {
      setBusy(false);
    }
  }

  async function deleteRule(id: string) {
    if (!confirm("Regel verwijderen? Dit is niet ongedaan te maken.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/dashboard/wisdom/${id}`, { method: "DELETE" });
      if (!res.ok) return;
      setRules((r) => r.filter((x) => x.id !== id));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="wm-wrap">
      <div className="wm-toolbar">
        <div className="wm-filters">
          <button
            className={`wm-filter ${filter === "all" ? "is-active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Alle ({rules.length})
          </button>
          {CATEGORIES.map((c) => {
            const count = rules.filter((r) => r.category === c.value).length;
            if (count === 0) return null;
            return (
              <button
                key={c.value}
                className={`wm-filter ${filter === c.value ? "is-active" : ""}`}
                onClick={() => setFilter(c.value)}
              >
                {c.label} ({count})
              </button>
            );
          })}
        </div>
        <button className="wm-add-btn" onClick={() => setAdding((v) => !v)}>
          {adding ? "Annuleren" : "+ Regel toevoegen"}
        </button>
      </div>

      {adding && (
        <form className="wm-add-form" onSubmit={addRule}>
          <label className="wm-label">Categorie</label>
          <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as WisdomCategory)} className="wm-select">
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <label className="wm-label">Regel (in 'u'-vorm, kort en concreet)</label>
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Bijvoorbeeld: Facturen voor klant Boskalis altijd naar adres Vredehof 12, Rotterdam"
            rows={3}
            className="wm-textarea"
            maxLength={500}
            required
          />
          <div className="wm-add-foot">
            <span className="wm-counter">{newText.length}/500</span>
            <button type="submit" disabled={busy} className="wm-save-btn">
              {busy ? "Opslaan..." : "Regel opslaan"}
            </button>
          </div>
        </form>
      )}

      {filtered.length === 0 ? (
        <div className="wm-empty">
          <p>Geen regels in deze categorie.</p>
          <p className="wm-empty-sub">
            Regels ontstaan automatisch zodra u de agent corrigeert via WhatsApp,
            of voeg er hier handmatig één toe.
          </p>
        </div>
      ) : (
        <ul className="wm-list">
          {filtered.map((r) => (
            <li key={r.id} className={`wm-item ${!r.active ? "is-inactive" : ""}`}>
              <div className="wm-item-top">
                <span className={`wm-cat wm-cat-${r.category}`}>{CATEGORIES.find((c) => c.value === r.category)?.label}</span>
                <span className="wm-source">{SOURCE_LABEL[r.source]}</span>
                <span className="wm-conf">vertrouwen: {(r.confidence * 100).toFixed(0)}%</span>
                {r.applied_count > 0 && <span className="wm-applied">{r.applied_count}× toegepast</span>}
              </div>
              <p className="wm-text">{r.rule_text}</p>
              <div className="wm-actions">
                <button onClick={() => toggleActive(r)} disabled={busy} className="wm-action-btn">
                  {r.active ? "Pauzeren" : "Activeren"}
                </button>
                <button onClick={() => deleteRule(r.id)} disabled={busy} className="wm-action-btn wm-action-danger">
                  Verwijderen
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <style>{`
        .wm-wrap { display: flex; flex-direction: column; gap: 20px; }
        .wm-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
        .wm-filters { display: flex; gap: 6px; flex-wrap: wrap; }
        .wm-filter {
          padding: 8px 14px; font-size: 13px;
          background: #fff; border: 1px solid var(--line); border-radius: 999px;
          cursor: pointer; transition: all 0.15s;
        }
        .wm-filter:hover { border-color: var(--ink-2); }
        .wm-filter.is-active { background: var(--ink); color: #fff; border-color: var(--ink); }

        .wm-add-btn {
          padding: 10px 18px; background: var(--delta); color: #fff;
          border: 0; border-radius: 999px; font-size: 14px; font-weight: 500;
          cursor: pointer; transition: background 0.15s;
        }
        .wm-add-btn:hover { background: var(--delta-2); }

        .wm-add-form {
          background: #fff; border: 1px solid var(--line); border-radius: 14px;
          padding: 24px; display: flex; flex-direction: column; gap: 10px;
        }
        .wm-label {
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted);
          margin-top: 6px;
        }
        .wm-select, .wm-textarea {
          padding: 12px 14px; border-radius: 10px;
          border: 1px solid var(--line); background: #fff;
          font-family: inherit; font-size: 15px;
        }
        .wm-textarea { resize: vertical; min-height: 80px; }
        .wm-add-foot { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
        .wm-counter { font-family: var(--font-mono); font-size: 11px; color: var(--muted); }
        .wm-save-btn {
          padding: 12px 24px; background: var(--ink); color: #fff;
          border: 0; border-radius: 10px; font-size: 14px; font-weight: 500;
          cursor: pointer;
        }
        .wm-save-btn:disabled { opacity: 0.5; }

        .wm-empty {
          background: #fff; border: 1px solid var(--line); border-radius: 14px;
          padding: 48px 32px; text-align: center;
        }
        .wm-empty p { margin: 0; font-size: 16px; color: var(--ink); }
        .wm-empty-sub { margin-top: 8px !important; font-size: 14px; color: var(--muted); max-width: 50ch; margin-left: auto !important; margin-right: auto !important; }

        .wm-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
        .wm-item {
          background: #fff; border: 1px solid var(--line); border-radius: 12px;
          padding: 20px 24px; display: flex; flex-direction: column; gap: 10px;
        }
        .wm-item.is-inactive { opacity: 0.6; background: var(--bg-soft); }
        .wm-item-top { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
        .wm-cat {
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 4px 10px; border-radius: 999px;
          background: var(--delta-tint); color: var(--delta);
        }
        .wm-source { font-size: 12px; color: var(--muted); }
        .wm-conf, .wm-applied {
          font-family: var(--font-mono); font-size: 11px; color: var(--muted);
        }
        .wm-text { margin: 0; font-size: 15px; line-height: 1.55; color: var(--ink); }
        .wm-actions { display: flex; gap: 8px; }
        .wm-action-btn {
          padding: 6px 14px; font-size: 12px;
          background: transparent; border: 1px solid var(--line); border-radius: 8px;
          cursor: pointer; color: var(--ink-2);
        }
        .wm-action-btn:hover:not(:disabled) { border-color: var(--ink); }
        .wm-action-danger:hover:not(:disabled) { border-color: #d40000; color: #d40000; }
      `}</style>
    </div>
  );
}

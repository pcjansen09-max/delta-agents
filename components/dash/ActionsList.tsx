"use client";

import { useState } from "react";
import type { AgentAction } from "@/types/database";

interface Props {
  actions: AgentAction[];
}

export default function ActionsList({ actions: initialActions }: Props) {
  const [actions, setActions] = useState(initialActions);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function decide(id: string, decision: "approve" | "reject") {
    setBusyId(id);
    try {
      const res = await fetch(`/api/dashboard/actions/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Onbekende fout" }));
        alert(`Mislukt: ${err.error ?? res.statusText}`);
        return;
      }
      const updated = await res.json();
      setActions((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } finally {
      setBusyId(null);
    }
  }

  if (actions.length === 0) {
    return (
      <div className="al-empty">
        <p>Geen acties in de queue.</p>
        <p className="al-empty-sub">
          Zodra de agent een factuur of bericht voor u voorbereidt, verschijnt
          die hier en op WhatsApp.
        </p>

        <style>{`
          .al-empty {
            background: #fff;
            border: 1px solid var(--line);
            border-radius: 14px;
            padding: 48px 32px;
            text-align: center;
          }
          .al-empty p { margin: 0; font-size: 18px; color: var(--ink); }
          .al-empty-sub { margin-top: 8px !important; font-size: 14px; color: var(--muted); }
        `}</style>
      </div>
    );
  }

  return (
    <div className="al-list">
      {actions.map((a) => (
        <ActionRow key={a.id} action={a} busy={busyId === a.id} onDecide={decide} />
      ))}

      <style>{`
        .al-list {
          display: flex; flex-direction: column; gap: 12px;
        }
      `}</style>
    </div>
  );
}

function ActionRow({ action, busy, onDecide }: { action: AgentAction; busy: boolean; onDecide: (id: string, d: "approve" | "reject") => void }) {
  const isPending = action.status === "pending";
  const payload = action.payload as {
    customer_id?: string;
    line_items?: Array<{ description: string; quantity: number; unit_price: number; vat_rate: number }>;
    notes?: string;
    moneybird_invoice_url?: string;
  };

  const total = payload.line_items
    ? payload.line_items.reduce((sum, l) => sum + l.quantity * l.unit_price * (1 + l.vat_rate / 100), 0)
    : 0;

  return (
    <article className="al-row">
      <header className="al-row-h">
        <div className="al-row-meta">
          <span className={`al-status al-status-${action.status}`}>{statusLabel(action.status)}</span>
          <span className="al-type">{typeLabel(action.type)}</span>
        </div>
        <time className="al-time">{new Date(action.created_at).toLocaleString("nl-NL")}</time>
      </header>

      {payload.line_items && payload.line_items.length > 0 && (
        <div className="al-detail">
          <table className="al-table">
            <thead>
              <tr><th>Omschrijving</th><th>Aantal</th><th>Prijs</th><th>BTW</th><th>Totaal</th></tr>
            </thead>
            <tbody>
              {payload.line_items.map((l, i) => (
                <tr key={i}>
                  <td>{l.description}</td>
                  <td>{l.quantity}</td>
                  <td>€{l.unit_price.toFixed(2)}</td>
                  <td>{l.vat_rate}%</td>
                  <td>€{(l.quantity * l.unit_price * (1 + l.vat_rate / 100)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr><td colSpan={4}>Totaal incl BTW</td><td>€{total.toFixed(2)}</td></tr>
            </tfoot>
          </table>
          {payload.notes && <p className="al-notes">{payload.notes}</p>}
        </div>
      )}

      {action.error_message && (
        <p className="al-error">{action.error_message}</p>
      )}

      {payload.moneybird_invoice_url && (
        <a href={payload.moneybird_invoice_url} target="_blank" rel="noopener" className="al-mb-link">
          Open in Moneybird →
        </a>
      )}

      {isPending && (
        <footer className="al-row-f">
          <button
            className="al-btn al-btn-approve"
            disabled={busy}
            onClick={() => onDecide(action.id, "approve")}
          >
            {busy ? "Bezig..." : "Goedkeuren & versturen"}
          </button>
          <button
            className="al-btn al-btn-reject"
            disabled={busy}
            onClick={() => onDecide(action.id, "reject")}
          >
            Afwijzen
          </button>
        </footer>
      )}

      <style jsx>{`
        .al-row {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .al-row-h { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
        .al-row-meta { display: flex; align-items: center; gap: 12px; }
        .al-status {
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: 0.14em; text-transform: uppercase;
          padding: 4px 10px; border-radius: 999px;
          background: var(--bg-soft); color: var(--muted);
        }
        .al-status-pending { background: #fef3c7; color: #92400e; }
        .al-status-executed { background: #dcfce7; color: #166534; }
        .al-status-failed { background: #fee2e2; color: #991b1b; }
        .al-status-rejected { background: var(--bg-soft); color: var(--muted); }
        .al-status-approved { background: #dbeafe; color: #1e40af; }
        .al-type { font-size: 15px; font-weight: 500; }
        .al-time { font-family: var(--font-mono); font-size: 11px; color: var(--muted); }

        .al-detail { border-top: 1px solid var(--line); padding-top: 16px; }
        .al-table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .al-table th {
          text-align: left; padding: 8px 0;
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted);
          font-weight: 500; border-bottom: 1px solid var(--line);
        }
        .al-table td { padding: 10px 0; border-bottom: 1px solid var(--line); color: var(--ink-2); }
        .al-table tfoot td { font-weight: 500; color: var(--ink); border-bottom: 0; padding-top: 14px; }
        .al-notes { margin: 12px 0 0; font-size: 13px; color: var(--muted); font-style: italic; }
        .al-error {
          margin: 0; padding: 12px 16px;
          background: #fee2e2; color: #991b1b;
          border-radius: 10px; font-size: 14px;
        }
        .al-mb-link { font-size: 13px; color: var(--delta); font-weight: 500; }

        .al-row-f { display: flex; gap: 10px; border-top: 1px solid var(--line); padding-top: 16px; }
        .al-btn {
          padding: 12px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid var(--line);
          cursor: pointer;
          transition: background 0.15s, transform 0.15s;
        }
        .al-btn:disabled { opacity: 0.5; cursor: wait; }
        .al-btn-approve { background: var(--delta); color: #fff; border-color: var(--delta); }
        .al-btn-approve:hover:not(:disabled) { background: var(--delta-2); transform: translateY(-1px); }
        .al-btn-reject { background: #fff; color: var(--ink-2); }
        .al-btn-reject:hover:not(:disabled) { border-color: var(--ink); }
      `}</style>
    </article>
  );
}

function statusLabel(s: string): string {
  return ({ pending: "Wacht op JA", approved: "Goedgekeurd", executed: "Verstuurd", rejected: "Afgewezen", failed: "Mislukt" } as Record<string, string>)[s] ?? s;
}

function typeLabel(t: string): string {
  return ({ create_invoice: "Concept-factuur", send_invoice: "Factuur versturen", create_quote: "Concept-offerte", send_message: "Bericht versturen" } as Record<string, string>)[t] ?? t;
}

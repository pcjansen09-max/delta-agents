"use client";

import { useState, FormEvent } from "react";
import type { User, UserRole } from "@/types/database";

const ROLE_LABELS: Record<UserRole, string> = {
  directie: "Directie",
  voorman: "Voorman",
  monteur: "Monteur",
};

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  directie: "Mag alle informatie inzien, prijzen opvragen, offertes en facturen goedkeuren.",
  voorman: "Mag werkbonnen en planningen inzien. Geen financiële marges.",
  monteur: "Mag alleen eigen uren doorgeven en technische documenten opvragen.",
};

export default function EmployeesManager({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("monteur");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function addUser(e: FormEvent) {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/dashboard/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          phone: newPhone.trim(),
          role: newRole,
        }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        setError(e.error ?? "Toevoegen mislukt");
        return;
      }
      const created = await res.json();
      setUsers((u) => [...u, created]);
      setNewName(""); setNewPhone(""); setNewRole("monteur");
      setAdding(false);
    } finally {
      setBusy(false);
    }
  }

  async function updateUser(id: string, patch: Partial<User>) {
    setBusy(true); setError("");
    try {
      const res = await fetch(`/api/dashboard/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) return;
      const updated = await res.json();
      setUsers((u) => u.map((x) => (x.id === id ? updated : x)));
    } finally {
      setBusy(false);
    }
  }

  async function deleteUser(id: string) {
    if (!confirm("Medewerker verwijderen? Hij krijgt direct geen toegang meer tot de agent.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/dashboard/users/${id}`, { method: "DELETE" });
      if (!res.ok) return;
      setUsers((u) => u.filter((x) => x.id !== id));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="em-wrap">
      <div className="em-toolbar">
        <p className="em-count">{users.length} medewerker{users.length !== 1 ? "s" : ""}</p>
        <button className="em-add-btn" onClick={() => setAdding((v) => !v)}>
          {adding ? "Annuleren" : "+ Medewerker toevoegen"}
        </button>
      </div>

      {adding && (
        <form className="em-add-form" onSubmit={addUser}>
          <div className="em-add-grid">
            <div>
              <label className="em-label">Naam</label>
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="em-input" required autoFocus placeholder="Jan Janssen" />
            </div>
            <div>
              <label className="em-label">06-nummer</label>
              <input type="tel" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="em-input" required placeholder="06 12 34 56 78" />
            </div>
            <div>
              <label className="em-label">Rol</label>
              <select value={newRole} onChange={(e) => setNewRole(e.target.value as UserRole)} className="em-input">
                {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="em-role-desc">{ROLE_DESCRIPTIONS[newRole]}</p>
          {error && <p className="em-error">{error}</p>}
          <button type="submit" disabled={busy} className="em-save-btn">
            {busy ? "Opslaan..." : "Medewerker opslaan"}
          </button>
        </form>
      )}

      {users.length === 0 ? (
        <div className="em-empty">
          <p>Nog geen medewerkers toegevoegd.</p>
          <p className="em-empty-sub">
            Zonder medewerkers kan niemand met de agent appen. Voeg minimaal
            uzelf toe als directie.
          </p>
        </div>
      ) : (
        <ul className="em-list">
          {users.map((u) => (
            <li key={u.id} className={`em-item ${!u.active ? "is-inactive" : ""}`}>
              <div className="em-item-main">
                <div>
                  <h4 className="em-name">{u.name}</h4>
                  <p className="em-phone">{formatPhone(u.phone)}</p>
                </div>
                <select
                  value={u.role}
                  onChange={(e) => updateUser(u.id, { role: e.target.value as UserRole })}
                  disabled={busy}
                  className={`em-role-select em-role-${u.role}`}
                >
                  {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>
              </div>
              <div className="em-item-actions">
                <button onClick={() => updateUser(u.id, { active: !u.active })} disabled={busy} className="em-action-btn">
                  {u.active ? "Pauzeren" : "Activeren"}
                </button>
                <button onClick={() => deleteUser(u.id)} disabled={busy} className="em-action-btn em-action-danger">
                  Verwijderen
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <style>{`
        .em-wrap { display: flex; flex-direction: column; gap: 20px; }
        .em-toolbar { display: flex; justify-content: space-between; align-items: center; }
        .em-count { font-size: 14px; color: var(--muted); margin: 0; }
        .em-add-btn {
          padding: 10px 18px; background: var(--delta); color: #fff;
          border: 0; border-radius: 999px; font-size: 14px; font-weight: 500;
          cursor: pointer;
        }
        .em-add-btn:hover { background: var(--delta-2); }

        .em-add-form {
          background: #fff; border: 1px solid var(--line); border-radius: 14px;
          padding: 24px; display: flex; flex-direction: column; gap: 14px;
        }
        .em-add-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 12px; }
        @media (max-width: 720px) { .em-add-grid { grid-template-columns: 1fr; } }
        .em-label {
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted);
        }
        .em-input {
          width: 100%;
          padding: 12px 14px; margin-top: 4px;
          border: 1px solid var(--line); border-radius: 10px;
          font-family: inherit; font-size: 15px; background: #fff;
        }
        .em-input:focus { outline: 0; border-color: var(--delta); }
        .em-role-desc { font-size: 13px; color: var(--muted); margin: 0; padding: 10px 14px; background: var(--bg-soft); border-radius: 8px; }
        .em-save-btn {
          align-self: flex-end;
          padding: 12px 24px; background: var(--ink); color: #fff;
          border: 0; border-radius: 10px; font-size: 14px; font-weight: 500;
          cursor: pointer;
        }
        .em-save-btn:disabled { opacity: 0.5; }
        .em-error { background: #fee2e2; color: #991b1b; padding: 10px 14px; border-radius: 8px; font-size: 14px; margin: 0; }

        .em-empty {
          background: #fff; border: 1px solid var(--line); border-radius: 14px;
          padding: 48px 32px; text-align: center;
        }
        .em-empty p { margin: 0; font-size: 16px; color: var(--ink); }
        .em-empty-sub { margin-top: 8px !important; font-size: 14px; color: var(--muted); max-width: 50ch; margin-left: auto !important; margin-right: auto !important; }

        .em-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
        .em-item {
          background: #fff; border: 1px solid var(--line); border-radius: 12px;
          padding: 18px 22px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          align-items: center;
        }
        .em-item.is-inactive { opacity: 0.55; background: var(--bg-soft); }
        .em-item-main { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
        .em-name { margin: 0; font-size: 15px; font-weight: 500; }
        .em-phone { margin: 4px 0 0; font-family: var(--font-mono); font-size: 12px; color: var(--muted); }

        .em-role-select {
          padding: 6px 12px; border: 1px solid var(--line); border-radius: 999px;
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: 0.12em; text-transform: uppercase;
          background: var(--bg-soft); color: var(--muted);
          cursor: pointer;
        }
        .em-role-directie { background: var(--delta-tint); color: var(--delta); border-color: var(--delta); }
        .em-role-voorman { background: #dbeafe; color: #1e40af; border-color: #93c5fd; }
        .em-role-monteur { background: var(--bg-soft); }

        .em-item-actions { display: flex; gap: 6px; }
        .em-action-btn {
          padding: 6px 12px; font-size: 12px;
          background: transparent; border: 1px solid var(--line); border-radius: 8px;
          cursor: pointer; color: var(--ink-2);
        }
        .em-action-btn:hover:not(:disabled) { border-color: var(--ink); }
        .em-action-danger:hover:not(:disabled) { border-color: #d40000; color: #d40000; }
      `}</style>
    </div>
  );
}

function formatPhone(phone: string): string {
  if (phone.startsWith("31") && phone.length === 11) {
    return `+31 ${phone.slice(2, 3)} ${phone.slice(3, 5)} ${phone.slice(5, 7)} ${phone.slice(7, 9)} ${phone.slice(9, 11)}`;
  }
  return phone;
}

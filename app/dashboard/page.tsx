import { requireSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await requireSession();
  const admin = getAdminClient();
  const companyId = session.company.id;

  // Tellers parallel ophalen
  const [
    { count: pendingCount },
    { count: rulesCount },
    { count: convCount },
    { count: executedToday },
    { data: recentActions },
    { data: recentMessages },
  ] = await Promise.all([
    admin.from("deltaagents_actions").select("id", { count: "exact", head: true }).eq("company_id", companyId).eq("status", "pending"),
    admin.from("deltaagents_wisdom_rules").select("id", { count: "exact", head: true }).eq("company_id", companyId).eq("active", true),
    admin.from("deltaagents_wa_conversations").select("id", { count: "exact", head: true }).eq("company_id", companyId),
    admin.from("deltaagents_actions").select("id", { count: "exact", head: true }).eq("company_id", companyId).eq("status", "executed").gte("executed_at", startOfTodayIso()),
    admin.from("deltaagents_actions").select("id, type, status, payload, created_at").eq("company_id", companyId).order("created_at", { ascending: false }).limit(8),
    admin.from("deltaagents_wa_messages").select("id, direction, text, transcript, created_at, conversation_id").in("conversation_id",
      (await admin.from("deltaagents_wa_conversations").select("id").eq("company_id", companyId)).data?.map(c => c.id) ?? ["00000000-0000-0000-0000-000000000000"]
    ).order("created_at", { ascending: false }).limit(8),
  ]);

  return (
    <div className="ov-wrap">
      <header className="ov-header">
        <span className="eyebrow"><span className="dot" />Overzicht</span>
        <h1 className="h2 ov-title">
          Welkom terug.<br />
          <em className="serif" style={{ color: "var(--delta)" }}>
            Hier is wat er speelt.
          </em>
        </h1>
      </header>

      <section className="ov-tiles">
        <Tile label="Wacht op uw goedkeuring" value={String(pendingCount ?? 0)} accent={pendingCount && pendingCount > 0 ? "alert" : undefined} href="/dashboard/actions" />
        <Tile label="Bedrijfsregels actief" value={String(rulesCount ?? 0)} href="/dashboard/wisdom" />
        <Tile label="Lopende gesprekken" value={String(convCount ?? 0)} href="/dashboard/conversations" />
        <Tile label="Facturen verstuurd vandaag" value={String(executedToday ?? 0)} />
      </section>

      <section className="ov-grid">
        <article className="ov-card">
          <header className="ov-card-h">
            <span className="eyebrow"><span className="dot" />Actiequeue</span>
            <a className="ov-card-link" href="/dashboard/actions">Alle acties →</a>
          </header>
          <h3>Recent voorgesteld</h3>
          {recentActions && recentActions.length > 0 ? (
            <ul className="ov-list">
              {recentActions.map((a) => (
                <li key={a.id} className="ov-list-item">
                  <span className={`ov-status ov-status-${a.status}`}>{statusLabel(a.status as string)}</span>
                  <span className="ov-list-text">{actionSummary(a)}</span>
                  <span className="ov-list-time">{relativeTime(a.created_at)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="ov-empty">Geen recente acties. De agent verschijnt hier zodra hij iets voorstelt.</p>
          )}
        </article>

        <article className="ov-card">
          <header className="ov-card-h">
            <span className="eyebrow"><span className="dot" />Inkomend</span>
            <a className="ov-card-link" href="/dashboard/conversations">Alle gesprekken →</a>
          </header>
          <h3>Recente berichten</h3>
          {recentMessages && recentMessages.length > 0 ? (
            <ul className="ov-list">
              {recentMessages.map((m) => (
                <li key={m.id} className="ov-list-item">
                  <span className={`ov-dir ov-dir-${m.direction}`}>{m.direction === "in" ? "↘" : "↗"}</span>
                  <span className="ov-list-text">{truncate((m.text ?? m.transcript ?? "[geen tekst]"), 80)}</span>
                  <span className="ov-list-time">{relativeTime(m.created_at)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="ov-empty">Nog geen berichten. Activeer eerst WhatsApp via Instellingen.</p>
          )}
        </article>
      </section>

      <style>{`
        .ov-wrap { display: flex; flex-direction: column; gap: 48px; max-width: 1200px; }
        .ov-header { display: flex; flex-direction: column; gap: 12px; }
        .ov-title { max-width: 18ch; }

        .ov-tiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        @media (max-width: 1000px) { .ov-tiles { grid-template-columns: 1fr 1fr; } }

        .ov-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        @media (max-width: 1000px) { .ov-grid { grid-template-columns: 1fr; } }
        .ov-card {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .ov-card-h { display: flex; justify-content: space-between; align-items: center; }
        .ov-card-link { font-size: 13px; color: var(--delta); }
        .ov-card h3 {
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .ov-list {
          list-style: none; margin: 8px 0 0; padding: 0;
          display: flex; flex-direction: column;
        }
        .ov-list-item {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 14px;
          align-items: center;
          padding: 14px 0;
          border-top: 1px solid var(--line);
          font-size: 14px;
        }
        .ov-list-item:first-child { border-top: 0; }
        .ov-list-text { color: var(--ink-2); line-height: 1.4; }
        .ov-list-time { font-family: var(--font-mono); font-size: 11px; color: var(--muted); }

        .ov-status {
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 4px 8px; border-radius: 999px;
          background: var(--bg-soft); color: var(--muted);
        }
        .ov-status-pending { background: #fef3c7; color: #92400e; }
        .ov-status-executed { background: #dcfce7; color: #166534; }
        .ov-status-failed { background: #fee2e2; color: #991b1b; }
        .ov-status-rejected { background: var(--bg-soft); color: var(--muted); }
        .ov-status-approved { background: #dbeafe; color: #1e40af; }

        .ov-dir {
          font-family: var(--font-mono); font-size: 14px; color: var(--muted);
          width: 24px; text-align: center;
        }
        .ov-dir-out { color: var(--delta); }
        .ov-empty {
          color: var(--muted); font-size: 14px; margin: 12px 0 0;
          padding: 18px 0; line-height: 1.55;
        }
      `}</style>
    </div>
  );
}

function Tile({ label, value, accent, href }: { label: string; value: string; accent?: "alert"; href?: string }) {
  const body = (
    <>
      <span className="tile-label">{label}</span>
      <span className="tile-value">{value}</span>
      <style>{`
        .tile-wrap {
          display: flex; flex-direction: column; gap: 8px;
          padding: 22px;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 14px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .tile-wrap:hover { border-color: var(--ink); transform: translateY(-2px); }
        .tile-wrap.is-alert { background: #fef9e7; border-color: #fde68a; }
        .tile-label {
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted);
        }
        .tile-value {
          font-size: 36px; font-weight: 600; letter-spacing: -0.02em;
          line-height: 1; color: var(--ink);
        }
      `}</style>
    </>
  );
  const cls = `tile-wrap ${accent === "alert" ? "is-alert" : ""}`;
  return href ? <a href={href} className={cls}>{body}</a> : <div className={cls}>{body}</div>;
}

function statusLabel(status: string): string {
  return ({ pending: "Wacht op JA", approved: "Goedgekeurd", executed: "Verstuurd", rejected: "Afgewezen", failed: "Mislukt" } as Record<string, string>)[status] ?? status;
}

function actionSummary(action: { type: string; payload: unknown }): string {
  if (action.type === "create_invoice") {
    const p = action.payload as { line_items?: Array<{ description: string; quantity: number; unit_price: number; vat_rate: number }> };
    const total = p.line_items?.reduce((sum, l) => sum + l.quantity * l.unit_price * (1 + l.vat_rate / 100), 0) ?? 0;
    return `Concept-factuur €${total.toFixed(2)}`;
  }
  return action.type;
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return "net";
  if (min < 60) return `${min}m`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}u`;
  const d = Math.round(h / 24);
  return `${d}d`;
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

function startOfTodayIso(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

import { requireSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase-admin";
import ActionsList from "@/components/dash/ActionsList";
import type { AgentAction } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function ActionsPage() {
  const session = await requireSession();
  const admin = getAdminClient();

  const { data: actions } = await admin
    .from("deltaagents_actions")
    .select("*")
    .eq("company_id", session.company.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="actions-wrap">
      <header className="actions-header">
        <span className="eyebrow"><span className="dot" />Actiequeue</span>
        <h1 className="h2">
          Wat de agent voorstelt.<br />
          <em className="serif" style={{ color: "var(--delta)" }}>
            U beslist.
          </em>
        </h1>
        <p className="lead actions-lead">
          Elke factuur, e-mail of klantbericht passeert hier eerst. Goedkeuren
          kan via WhatsApp (typ JA) of hieronder per regel.
        </p>
      </header>

      <ActionsList actions={(actions ?? []) as unknown as AgentAction[]} />

      <style>{`
        .actions-wrap { display: flex; flex-direction: column; gap: 40px; max-width: 1200px; }
        .actions-header { display: flex; flex-direction: column; gap: 12px; max-width: 700px; }
        .actions-lead { margin-top: 8px; }
      `}</style>
    </div>
  );
}

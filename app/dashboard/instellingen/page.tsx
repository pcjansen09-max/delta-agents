import { requireSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase-admin";
import SettingsForm from "@/components/dash/SettingsForm";

export const dynamic = "force-dynamic";

export default async function InstellingenPage() {
  const session = await requireSession();
  const admin = getAdminClient();

  const [{ data: config }, { data: mb }] = await Promise.all([
    admin
      .from("deltaagents_agent_config")
      .select("bedrijfsinfo, werkwijze")
      .eq("company_id", session.company.id)
      .maybeSingle(),
    admin
      .from("deltaagents_oauth_tokens")
      .select("provider, administration_id, expires_at")
      .eq("company_id", session.company.id)
      .eq("provider", "moneybird")
      .maybeSingle(),
  ]);

  return (
    <div className="set-wrap">
      <header className="set-header">
        <span className="eyebrow"><span className="dot" />Instellingen</span>
        <h1 className="h2">
          Hoe uw agent praat,<br />
          <em className="serif" style={{ color: "var(--delta)" }}>
            en waarmee hij verbonden is.
          </em>
        </h1>
      </header>

      <SettingsForm
        company={session.company as unknown as Parameters<typeof SettingsForm>[0]["company"]}
        bedrijfsinfo={config?.bedrijfsinfo ?? ""}
        werkwijze={config?.werkwijze ?? ""}
        moneybirdConnected={!!mb}
        moneybirdAdministration={mb?.administration_id ?? null}
      />

      <style>{`
        .set-wrap { display: flex; flex-direction: column; gap: 40px; max-width: 900px; }
        .set-header { display: flex; flex-direction: column; gap: 12px; }
      `}</style>
    </div>
  );
}

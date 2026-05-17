import { requireSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase-admin";
import EmployeesManager from "@/components/dash/EmployeesManager";

export const dynamic = "force-dynamic";

export default async function MedewerkersPage() {
  const session = await requireSession();
  const admin = getAdminClient();

  const { data: users } = await admin
    .from("deltaagents_users")
    .select("*")
    .eq("company_id", session.company.id)
    .order("created_at", { ascending: true });

  return (
    <div className="emp-wrap">
      <header className="emp-header">
        <span className="eyebrow"><span className="dot" />Medewerkers &amp; rechten</span>
        <h1 className="h2">
          Wie spreekt met de agent,<br />
          <em className="serif" style={{ color: "var(--delta)" }}>
            en wat mag hij vragen.
          </em>
        </h1>
        <p className="lead emp-lead">
          De agent herkent elk 06-nummer en past rechten toe. Drie standaard
          rollen, maar u kunt op elk moment toevoegen of aanpassen.
        </p>
      </header>

      <EmployeesManager initialUsers={users ?? []} />

      <style>{`
        .emp-wrap { display: flex; flex-direction: column; gap: 40px; max-width: 1200px; }
        .emp-header { display: flex; flex-direction: column; gap: 12px; max-width: 700px; }
        .emp-lead { margin-top: 8px; }
      `}</style>
    </div>
  );
}

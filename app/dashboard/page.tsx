import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { ACTIVITY_ICONS } from "@/lib/dashboard";
import DashboardOverview from "@/components/dashboard/Overview";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: company } = await supabase
    .from("deltaagents_companies")
    .select("*")
    .eq("owner_email", user.email!)
    .single();

  if (company && !company.company_name) {
    redirect("/onboarding");
  }

  const { data: activities } = await supabase
    .from("deltaagents_activity")
    .select("*")
    .eq("company_id", company?.id ?? "")
    .order("created_at", { ascending: false })
    .limit(20);

  const { data: agentConfig } = await supabase
    .from("deltaagents_agent_config")
    .select("actief")
    .eq("company_id", company?.id ?? "")
    .single();

  const now = new Date();
  const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - 7);

  const berichtenVandaag = activities?.filter(
    (a) => new Date(a.created_at) >= startOfDay
  ).length ?? 0;

  const actiesDezeWeek = activities?.filter(
    (a) => new Date(a.created_at) >= startOfWeek
  ).length ?? 0;

  const urenBespaard = ((activities?.length ?? 0) * 0.25).toFixed(1);
  const agentActief = agentConfig?.actief ?? false;

  const companyCreatedAt = company?.created_at
    ? new Date(company.created_at)
    : null;
  const daysSinceCreation = companyCreatedAt
    ? Math.floor((Date.now() - companyCreatedAt.getTime()) / 86400000)
    : null;

  return (
    <DashboardOverview
      companyName={company?.company_name ?? null}
      berichtenVandaag={berichtenVandaag}
      actiesDezeWeek={actiesDezeWeek}
      urenBespaard={urenBespaard}
      agentActief={agentActief}
      activities={activities ?? []}
      activityIcons={ACTIVITY_ICONS}
      daysSinceCreation={daysSinceCreation}
    />
  );
}

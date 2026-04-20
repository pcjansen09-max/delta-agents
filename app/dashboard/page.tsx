import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { motion } from "framer-motion";
import { MessageSquare, FileText, Clock, Zap } from "lucide-react";
import { ACTIVITY_ICONS, TIER_LABELS } from "@/lib/dashboard";
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

  const { data: activities } = await supabase
    .from("deltaagents_activity")
    .select("*")
    .eq("company_id", company?.id ?? "")
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: agentConfig } = await supabase
    .from("deltaagents_agent_config")
    .select("*")
    .eq("company_id", company?.id ?? "")
    .single();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const berichtenVandaag = activities?.filter(
    (a) => new Date(a.created_at) >= today && a.type === "whatsapp"
  ).length ?? 0;

  const facturenDezesMaand = activities?.filter(
    (a) => new Date(a.created_at) >= firstOfMonth && a.type === "factuur"
  ).length ?? 0;

  const urenBespaard = ((activities?.length ?? 0) * 0.25).toFixed(1);
  const agentActief = agentConfig?.actief ?? false;

  return (
    <DashboardOverview
      companyName={company?.company_name ?? null}
      tier={TIER_LABELS[company?.subscription_tier ?? "basis"]}
      berichtenVandaag={berichtenVandaag}
      facturenDezesMaand={facturenDezesMaand}
      urenBespaard={urenBespaard}
      agentActief={agentActief}
      activities={activities ?? []}
      activityIcons={ACTIVITY_ICONS}
    />
  );
}

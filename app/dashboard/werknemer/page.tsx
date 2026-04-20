import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import WerknemerClient from "@/components/dashboard/WerknemerClient";

export default async function WerknemerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: company } = await supabase
    .from("deltaagents_companies")
    .select("*")
    .eq("owner_email", user.email!)
    .single();

  const { data: agentConfig } = await supabase
    .from("deltaagents_agent_config")
    .select("*")
    .eq("company_id", company?.id ?? "")
    .single();

  return (
    <WerknemerClient
      companyId={company?.id ?? ""}
      agentType={agentConfig?.agent_type ?? "klantenservice"}
      actief={agentConfig?.actief ?? false}
      whatsappNumber={company?.whatsapp_number ?? null}
      tier={company?.subscription_tier ?? "basis"}
    />
  );
}

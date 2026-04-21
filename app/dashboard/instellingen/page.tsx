import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import InstellingenClient from "@/components/dashboard/InstellingenClient";

export default async function InstellingenPage() {
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
    .select("actief")
    .eq("company_id", company?.id ?? "")
    .single();

  return (
    <InstellingenClient
      companyId={company?.id ?? ""}
      initialData={{
        company_name: company?.company_name ?? "",
        industry: company?.industry ?? "overig",
        whatsapp_number: company?.whatsapp_number ?? "",
        subscription_tier: company?.subscription_tier ?? "basis",
        created_at: company?.created_at ?? new Date().toISOString(),
      }}
      userEmail={user.email ?? ""}
      agentActief={agentConfig?.actief ?? false}
    />
  );
}

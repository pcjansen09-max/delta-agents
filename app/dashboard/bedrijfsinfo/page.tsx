import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import BedrijfsinfoClient from "@/components/dashboard/BedrijfsinfoClient";

export default async function BedrijfsinfoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: company } = await supabase
    .from("deltaagents_companies")
    .select("*")
    .eq("owner_email", user.email!)
    .single();

  const { data: config } = await supabase
    .from("deltaagents_agent_config")
    .select("*")
    .eq("company_id", company?.id ?? "")
    .single();

  return (
    <BedrijfsinfoClient
      companyId={company?.id ?? ""}
      initialConfig={config ?? null}
    />
  );
}

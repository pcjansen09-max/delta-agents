import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import KoppelingenClient from "@/components/dashboard/KoppelingenClient";

export default async function KoppelingenPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: company } = await supabase
    .from("deltaagents_companies")
    .select("id")
    .eq("owner_email", user.email!)
    .single();

  const { data: integrations } = await supabase
    .from("deltaagents_integrations")
    .select("*")
    .eq("company_id", company?.id ?? "");

  return (
    <KoppelingenClient
      companyId={company?.id ?? ""}
      connectedServices={integrations?.map((i) => i.service) ?? []}
    />
  );
}

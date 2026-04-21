import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import ChatClient from "@/components/dashboard/ChatClient";

export default async function ChatPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: company } = await supabase
    .from("deltaagents_companies")
    .select("id, company_name")
    .eq("owner_email", user.email!)
    .single();

  const { data: agentConfig } = await supabase
    .from("deltaagents_agent_config")
    .select("bedrijfsinfo")
    .eq("company_id", company?.id ?? "")
    .single();

  const hasBedrijfsinfo =
    (agentConfig?.bedrijfsinfo ?? "").trim().length > 20;

  return (
    <ChatClient
      companyId={company?.id ?? ""}
      hasBedrijfsinfo={hasBedrijfsinfo}
      companyName={company?.company_name ?? null}
    />
  );
}

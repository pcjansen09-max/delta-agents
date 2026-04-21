import type { SupabaseClient } from "@supabase/supabase-js";

export async function logActivity(
  supabase: SupabaseClient,
  companyId: string,
  type: string,
  beschrijving: string,
  metadata?: object
) {
  if (!companyId) return;
  await supabase.from("deltaagents_activity").insert({
    company_id: companyId,
    type,
    beschrijving,
    metadata: metadata ?? {},
  });
}

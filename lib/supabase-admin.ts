/**
 * Service role Supabase client — bypasses RLS.
 * Gebruik ALLEEN server-side voor systeem-acties:
 *  - OAuth callbacks (token opslaan zonder user session)
 *  - WhatsApp webhook handlers (geen auth-context)
 *  - Cron jobs (wisdom decay, sync schedules)
 *
 * Lekt deze key nooit naar de client — geen browser code mag dit importeren.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function getAdminClient(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase admin client kan niet initialiseren: NEXT_PUBLIC_SUPABASE_URL of SUPABASE_SERVICE_ROLE_KEY ontbreekt"
    );
  }

  cached = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: "public",
    },
  });

  return cached;
}

/**
 * Auth helpers — koppel Supabase-user aan deltaagents_companies row.
 * Server-side only.
 */

import { createClient } from "./supabase-server";
import { getAdminClient } from "./supabase-admin";
import type { Company } from "@/types/database";

export interface AuthenticatedSession {
  email: string;
  userId: string;
  company: Company;
}

/**
 * Vereist een ingelogde user MET geconfigureerde company.
 * Throws bij geen sessie of geen company-row.
 *
 * Voor pages: catch de error en redirect naar /login of /onboarding.
 * Voor API routes: catch en return 401/404.
 */
export async function requireSession(): Promise<AuthenticatedSession> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    throw new AuthError("not_authenticated", "Geen actieve sessie");
  }

  const admin = getAdminClient();
  const { data: company } = await admin
    .from("deltaagents_companies")
    .select("*")
    .eq("owner_email", user.email)
    .single();

  if (!company) {
    throw new AuthError("no_company", "Geen company-record gekoppeld aan deze gebruiker");
  }

  return {
    email: user.email,
    userId: user.id,
    company: company as Company,
  };
}

/** Optionele variant — geen throw, just null bij geen sessie. */
export async function getSession(): Promise<AuthenticatedSession | null> {
  try {
    return await requireSession();
  } catch {
    return null;
  }
}

export class AuthError extends Error {
  constructor(public code: "not_authenticated" | "no_company", message: string) {
    super(message);
    this.name = "AuthError";
  }
}

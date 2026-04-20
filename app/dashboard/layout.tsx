import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import DashboardSidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get or create company record
  let { data: company } = await supabase
    .from("deltaagents_companies")
    .select("*")
    .eq("owner_email", user.email!)
    .single();

  if (!company) {
    const { data: newCompany } = await supabase
      .from("deltaagents_companies")
      .insert({ owner_email: user.email! })
      .select()
      .single();
    company = newCompany;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar
        companyName={company?.company_name ?? null}
        userEmail={user.email ?? ""}
      />
      <main className="flex-1 md:ml-60 min-h-screen">
        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

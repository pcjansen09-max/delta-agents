import { redirect } from "next/navigation";
import { requireSession, AuthError } from "@/lib/auth";
import Sidebar from "@/components/dash/Sidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session;
  try {
    session = await requireSession();
  } catch (err) {
    if (err instanceof AuthError && err.code === "no_company") {
      redirect("/onboarding");
    }
    redirect("/login");
  }

  if (!session.company.company_name) redirect("/onboarding");

  return (
    <div className="dash-shell">
      <Sidebar companyName={session.company.company_name} />
      <main className="dash-main">{children}</main>

      <style>{`
        .dash-shell { display: flex; min-height: 100vh; }
        .dash-main {
          margin-left: 260px;
          flex: 1;
          padding: 56px 64px;
        }
        @media (max-width: 880px) {
          .dash-shell { flex-direction: column; }
          .dash-main { margin-left: 0; padding: 28px 20px; }
        }
      `}</style>
    </div>
  );
}

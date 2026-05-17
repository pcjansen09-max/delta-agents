"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Overzicht" },
  { href: "/dashboard/actions", label: "Actiequeue" },
  { href: "/dashboard/conversations", label: "Gesprekken" },
  { href: "/dashboard/wisdom", label: "Bedrijfsregels" },
  { href: "/dashboard/medewerkers", label: "Medewerkers" },
  { href: "/dashboard/instellingen", label: "Instellingen" },
];

export default function Sidebar({ companyName }: { companyName: string }) {
  const pathname = usePathname();

  return (
    <aside className="dash-sidebar">
      <div className="dash-brand">
        <span className="dash-brand-delta">Δ</span>
        <span className="dash-brand-name">DeltaAgents</span>
      </div>

      <div className="dash-company">
        <span className="dash-company-label">Bedrijf</span>
        <span className="dash-company-name">{companyName}</span>
      </div>

      <nav className="dash-nav">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`dash-nav-link ${active ? "is-active" : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="dash-footer">
        <Link href="/api/auth/logout" className="dash-logout">Uitloggen</Link>
        <a href="https://delta-design.nl" target="_blank" rel="noopener" className="dash-cross">
          DeltaDesign →
        </a>
      </div>

      <style jsx>{`
        .dash-sidebar {
          width: 260px;
          height: 100vh;
          position: fixed;
          top: 0; left: 0;
          background: var(--bg-soft);
          border-right: 1px solid var(--line);
          padding: 32px 22px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .dash-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          letter-spacing: -0.02em;
        }
        .dash-brand-delta {
          font-size: 24px;
          color: var(--delta);
          line-height: 1;
        }
        .dash-brand-name { font-size: 17px; }

        .dash-company {
          padding: 14px 14px;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .dash-company-label {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .dash-company-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--ink);
        }

        .dash-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: 4px;
        }
        .dash-nav-link {
          padding: 10px 14px;
          font-size: 14px;
          color: var(--ink-2);
          border-radius: 10px;
          transition: background 0.15s, color 0.15s;
        }
        .dash-nav-link:hover { background: rgba(10,10,11,0.04); }
        .dash-nav-link.is-active {
          background: var(--ink);
          color: #fff;
          font-weight: 500;
        }

        .dash-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 20px;
          border-top: 1px solid var(--line);
        }
        .dash-logout {
          font-size: 13px;
          color: var(--muted);
          padding: 8px 14px;
          border-radius: 10px;
          transition: color 0.15s;
        }
        .dash-logout:hover { color: var(--ink); }
        .dash-cross {
          font-size: 12px;
          color: var(--delta);
          padding: 4px 14px;
        }

        @media (max-width: 880px) {
          .dash-sidebar {
            position: static;
            width: 100%;
            height: auto;
            padding: 20px;
            border-right: 0;
            border-bottom: 1px solid var(--line);
          }
        }
      `}</style>
    </aside>
  );
}

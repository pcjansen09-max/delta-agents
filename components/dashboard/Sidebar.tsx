"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Bot, Building2, Plug, Settings,
  LogOut, Zap, Menu, X, MessageSquare,
} from "lucide-react";
import { createClient } from "@/lib/supabase-client";

const NAV = [
  { href: "/dashboard", label: "Overzicht", icon: LayoutDashboard },
  { href: "/dashboard/werknemer", label: "Mijn Werknemer", icon: Bot },
  { href: "/dashboard/chat", label: "Test Werknemer", icon: MessageSquare },
  { href: "/dashboard/bedrijfsinfo", label: "Bedrijfsinfo", icon: Building2 },
  { href: "/dashboard/koppelingen", label: "Koppelingen", icon: Plug },
  { href: "/dashboard/instellingen", label: "Instellingen", icon: Settings },
];

interface Props {
  companyName: string | null;
  userEmail: string;
}

export default function DashboardSidebar({ companyName, userEmail }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.08]">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-white" fill="currentColor" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-white text-[14px] tracking-tight leading-tight">
              Delta<span className="text-blue-400">Agents</span>
            </div>
            {companyName && (
              <div className="text-gray-400 text-[11px] truncate mt-0.5">{companyName}</div>
            )}
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-blue-600/25 text-blue-400"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/[0.08] space-y-2">
        <div className="px-3 py-2">
          <p className="text-gray-500 text-xs truncate">{userEmail}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/[0.08] transition-all"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Uitloggen
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex fixed left-0 top-0 h-screen w-60 flex-col z-40 border-r border-white/[0.08]"
        style={{ background: "#111827" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-40 border-b border-white/[0.08] px-4 py-3 flex items-center justify-between"
        style={{ background: "#111827" }}
      >
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" fill="currentColor" />
          </div>
          <span className="font-semibold text-white text-sm">
            Delta<span className="text-blue-400">Agents</span>
          </span>
        </Link>
        <button onClick={() => setMobileOpen(true)} aria-label="Menu openen" className="text-gray-400 hover:text-white">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 z-50"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 350 }}
              className="md:hidden fixed left-0 top-0 h-screen w-64 z-50 flex flex-col border-r border-white/[0.08]"
              style={{ background: "#111827" }}
            >
              <div className="flex justify-end px-4 pt-4">
                <button onClick={() => setMobileOpen(false)} aria-label="Menu sluiten" className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

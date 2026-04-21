"use client";

import { Zap } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" fill="currentColor" />
          </div>
          <span className="font-display font-700 text-white text-[15px]">
            Delta<span className="text-blue-400">Agents</span>
          </span>
        </div>

        <p className="text-slate-500 text-sm text-center">
          © {new Date().getFullYear()} DeltaAgents ·{" "}
          <a href="https://deltaagents.nl" className="hover:text-slate-300 transition-colors">
            deltaagents.nl
          </a>
          {" "}· Digitale Werknemers voor het MKB ·{" "}
          <span className="text-slate-400">Nederland</span>
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 justify-center">
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
          <Link href="/algemene-voorwaarden" className="hover:text-slate-300 transition-colors">Voorwaarden</Link>
          <Link href="/prijzen" className="hover:text-slate-300 transition-colors">Prijzen</Link>
          <Link href="/contact" className="hover:text-slate-300 transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

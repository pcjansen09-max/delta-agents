"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto px-6 py-4 flex items-center justify-between max-w-7xl">
        <div
          className="glass rounded-2xl px-5 py-3 flex items-center gap-8"
          style={{ backdropFilter: "blur(20px)" }}
        >
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <span className="font-display font-700 text-white text-[15px] tracking-tight">
              Delta<span className="text-blue-400">Agents</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {[
              { label: "Agents", href: "#agents" },
              { label: "Demo", href: "#demo" },
              { label: "Prijzen", href: "#pricing" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <a
          href="#pricing"
          className="glass rounded-xl px-5 py-2.5 text-sm font-semibold text-white bg-blue-600/80 hover:bg-blue-500/90 border-blue-500/50 transition-all hover:shadow-glow"
          style={{ backdropFilter: "blur(20px)" }}
        >
          Start vandaag
        </a>
      </div>
    </motion.nav>
  );
}

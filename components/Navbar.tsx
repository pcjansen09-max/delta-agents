"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(250,250,248,0.92)" : "rgba(250,250,248,0.8)",
        borderBottom: scrolled ? "1px solid #E8E8E4" : "1px solid transparent",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" fill="currentColor" />
          </div>
          <span className="font-semibold text-text-primary text-[15px] tracking-tight">
            Delta<span className="text-accent">Agents</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {[
            { label: "Hoe het werkt", href: "#how-it-works" },
            { label: "Prijzen", href: "#pricing" },
            { label: "Contact", href: "/contact" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="hidden md:inline-flex items-center gap-2 bg-accent hover:bg-[#1641b8] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            Start gratis
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-surface px-6 py-4 space-y-3">
          {[
            { label: "Hoe het werkt", href: "#how-it-works" },
            { label: "Prijzen", href: "#pricing" },
            { label: "Contact", href: "/contact" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block text-text-secondary hover:text-text-primary text-sm font-medium py-1.5 transition-colors"
            >
              {item.label}
            </a>
          ))}
          <a
            href="/login"
            className="block w-full text-center bg-accent text-white text-sm font-semibold px-5 py-3 rounded-lg transition-colors mt-2"
          >
            Start gratis
          </a>
        </div>
      )}
    </motion.nav>
  );
}

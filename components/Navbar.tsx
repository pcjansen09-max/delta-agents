"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

const NAV_LINKS = [
  { href: "#functies", label: "Functies" },
  { href: "#hoe-het-werkt", label: "Hoe het werkt" },
  { href: "#integraties", label: "Integraties" },
  { href: "#prijzen", label: "Prijzen" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: 64,
        display: "flex",
        alignItems: "center",
        background: scrolled ? "rgba(247,245,240,0.92)" : "rgba(247,245,240,0.72)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        boxShadow: scrolled ? "0 1px 20px rgba(0,0,0,0.07)" : "none",
        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 32,
        }}
      >
        <Link href="/" style={{ flexShrink: 0, textDecoration: "none" }}>
          <Logo />
        </Link>

        <nav className="hidden md:flex" style={{ flex: 1, display: "flex", justifyContent: "center", gap: 4 }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "6px 16px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: "var(--t2)",
                textDecoration: "none",
                transition: "color 0.15s, background 0.15s",
              }}
              className="hover:bg-black/[0.05] hover:text-[#1A1A2E]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex" style={{ alignItems: "center", gap: 10, flexShrink: 0 }}>
          <Link
            href="/auth/login"
            style={{
              padding: "8px 18px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              color: "var(--t2)",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            className="hover:text-[#1A1A2E]"
          >
            Inloggen
          </Link>
          <Link
            href="#demo"
            style={{
              padding: "9px 22px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              background: "var(--blue)",
              color: "#fff",
              textDecoration: "none",
              boxShadow: "0 2px 14px rgba(27,79,216,0.28)",
              transition: "all 0.15s",
            }}
            className="hover:brightness-110 hover:-translate-y-px"
          >
            Probeer gratis
          </Link>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ padding: 8, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: 5 }}
          className="md:hidden"
          aria-label="Menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: 22,
                height: 2,
                background: "var(--t1)",
                borderRadius: 2,
                transition: "all 0.2s",
                transform: menuOpen && i === 0 ? "rotate(45deg) translate(5px,5px)" : menuOpen && i === 2 ? "rotate(-45deg) translate(5px,-5px)" : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            position: "absolute",
            top: 64,
            left: 0,
            right: 0,
            background: "rgba(247,245,240,0.97)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--border)",
            padding: "16px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{ padding: "12px 14px", borderRadius: 10, fontSize: 16, fontWeight: 500, color: "var(--t1)", textDecoration: "none" }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />
          <Link
            href="/auth/login"
            onClick={() => setMenuOpen(false)}
            style={{ padding: "12px 14px", borderRadius: 10, fontSize: 15, fontWeight: 500, color: "var(--t2)", textDecoration: "none" }}
          >
            Inloggen
          </Link>
          <Link
            href="#demo"
            onClick={() => setMenuOpen(false)}
            style={{ padding: "13px 14px", borderRadius: 10, fontSize: 15, fontWeight: 600, background: "var(--blue)", color: "#fff", textAlign: "center", textDecoration: "none" }}
          >
            Probeer gratis
          </Link>
        </div>
      )}
    </header>
  );
}

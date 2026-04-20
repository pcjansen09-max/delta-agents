"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Mail, ArrowRight, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);
    if (error) {
      setError("Er ging iets mis. Controleer je e-mailadres en probeer opnieuw.");
    } else {
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(59,130,246,0.1), transparent)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <span className="font-display font-700 text-white text-xl tracking-tight">
              Delta<span className="text-blue-400">Agents</span>
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-3xl p-8">
          {!sent ? (
            <>
              <div className="text-center mb-8">
                <h1 className="font-display text-2xl font-700 text-white mb-2">
                  Log in op jouw werknemers dashboard
                </h1>
                <p className="text-slate-400 text-sm">
                  Vul je e-mailadres in en ontvang een inloglink. Geen wachtwoord nodig.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jouw@email.nl"
                    required
                    className="w-full glass rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-slate-500 text-sm outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-xs text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all group"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Stuur inloglink
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-slate-600 text-xs mt-6">
                Nog geen account?{" "}
                <a href="/#pricing" className="text-blue-400 hover:text-blue-300">
                  Bekijk de pakketten
                </a>
              </p>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
              <h2 className="font-display text-xl font-700 text-white mb-2">
                Inloglink verstuurd!
              </h2>
              <p className="text-slate-400 text-sm mb-1">
                Check je inbox op <span className="text-white">{email}</span>
              </p>
              <p className="text-slate-500 text-xs">
                Klik op de link in de e-mail om in te loggen.
                <br />
                Check ook je spam als je hem niet ziet.
              </p>
              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="mt-6 text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                Ander e-mailadres gebruiken
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

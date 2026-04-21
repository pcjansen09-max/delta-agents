"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="font-display text-2xl font-700 text-white mb-2">
          Er is iets misgegaan
        </h1>
        <p className="text-slate-400 text-sm mb-8">
          We zijn op de hoogte gesteld en lossen het zo snel mogelijk op.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm"
          >
            Opnieuw proberen
          </button>
          <a
            href="/"
            className="glass hover:bg-white/[0.06] text-slate-300 hover:text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar home
          </a>
        </div>
      </motion.div>
    </div>
  );
}

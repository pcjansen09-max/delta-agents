import { ArrowLeft, Bot } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
          <Bot className="w-10 h-10 text-blue-400" />
        </div>
        <p className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-3">404</p>
        <h1 className="font-display text-3xl font-700 text-white mb-3">
          Deze pagina is er niet.
        </h1>
        <p className="text-slate-400 text-sm mb-2">
          Jouw werknemer ook niet gevonden op dit adres.
        </p>
        <p className="text-slate-600 text-xs mb-8">
          Misschien is de link verlopen of heb je een typfout gemaakt.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 glass hover:bg-white/[0.06] text-slate-300 hover:text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar home
        </Link>
      </div>
    </div>
  );
}

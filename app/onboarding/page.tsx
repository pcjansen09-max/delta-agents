"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import {
  Zap, ArrowRight, Check, ChevronRight, Bot, MessageSquare, Sparkles,
  Building2, Phone, Lightbulb, PartyPopper
} from "lucide-react";

const SECTORS = [
  { value: "makelaar", label: "Makelaar" },
  { value: "hovenier", label: "Hovenier" },
  { value: "installateur", label: "Installateur" },
  { value: "kapper", label: "Kapper" },
  { value: "bakker", label: "Bakker" },
  { value: "restaurant", label: "Restaurant" },
  { value: "webshop", label: "Webshop" },
  { value: "advies", label: "Advies / Consultancy" },
  { value: "overig", label: "Overig" },
];

const SECTOR_PLACEHOLDERS: Record<string, string> = {
  makelaar: `Wij zijn makelaar in Noord-Holland, gespecialiseerd in woningverkoop en aankoop. Wij helpen particulieren bij het verkopen en aankopen van woningen in Amsterdam, Haarlem en omgeving. Ons kantoor is bereikbaar op werkdagen van 9:00-17:30.\n\nWij werken met een vast courtage van 1,25% van de verkoopprijs. Voor aankoopbegeleiding rekenen we €2.500 vast tarief. Taxaties kosten €295.\n\nKlanten kunnen WhatsApp-vragen sturen voor een snelle reactie binnen 2 uur.`,
  hovenier: `Wij zijn een hovenier in de regio Utrecht. Wij verzorgen tuinen voor zowel particulieren als bedrijven. Wij zijn gespecialiseerd in aanleg, onderhoud en ontwerp van tuinen.\n\nTarieven:\n- Tuinonderhoud: €45/uur\n- Gazon maaien: €60 per beurt\n- Snoeien: €55/uur\n- Voorrijkosten: €25 binnen 25km\n\nWij zijn bereikbaar op maandag t/m zaterdag van 7:00-18:00.`,
  installateur: `Wij zijn een installatiebedrijf in Rotterdam. Wij verzorgen installaties voor elektra, sanitair en verwarming voor zowel particulieren als zakelijke klanten.\n\nTarieven:\n- Uurtarief monteur: €85 ex btw\n- Spoedservice: €120/uur\n- Voorrijkosten: €35\n\nWij zijn 24/7 bereikbaar voor storingen. Offerte altijd gratis en vrijblijvend.`,
  overig: `Beschrijf je bedrijf volledig. Bijvoorbeeld:\nWij zijn [naam], een [sector] bedrijf gevestigd in [plaats].\nWij zijn bereikbaar op [tel] en [email].\nOnze openingstijden zijn [...]\nWij werken voor [doelgroep] en onderscheiden ons door [USP's].`,
};

function getPlaceholder(sector: string): string {
  return SECTOR_PLACEHOLDERS[sector] ?? SECTOR_PLACEHOLDERS.overig;
}

function Confetti() {
  const colors = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-50">
      {[...Array(40)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-20px`,
            width: `${6 + Math.random() * 6}px`,
            height: `${6 + Math.random() * 6}px`,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            background: colors[Math.floor(Math.random() * colors.length)],
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);

  // Step 2 state
  const [companyName, setCompanyName] = useState("");
  const [sector, setSector] = useState("overig");
  const [phone, setPhone] = useState("");
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [saving2, setSaving2] = useState(false);
  const [error2, setError2] = useState("");

  // Step 3 state
  const [bedrijfsinfo, setBedrijfsinfo] = useState("");
  const [saving3, setSaving3] = useState(false);
  const [error3, setError3] = useState("");

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: company } = await supabase
        .from("deltaagents_companies")
        .select("*")
        .eq("owner_email", user.email!)
        .single();

      if (company?.company_name) {
        router.push("/dashboard");
        return;
      }

      if (company?.id) {
        setCompanyId(company.id);
        setCompanyName(company.company_name ?? "");
        setPhone(company.whatsapp_number ?? "");
        setSector(company.industry ?? "overig");
      }
      setLoading(false);
    }
    init();
  }, [router]);

  async function handleStep2() {
    if (!companyName.trim()) { setError2("Bedrijfsnaam is verplicht."); return; }
    setSaving2(true);
    setError2("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving2(false); return; }

    if (companyId) {
      await supabase
        .from("deltaagents_companies")
        .update({ company_name: companyName, industry: sector, whatsapp_number: phone || null })
        .eq("id", companyId);
    } else {
      const { data: newCo } = await supabase
        .from("deltaagents_companies")
        .insert({ owner_email: user.email!, company_name: companyName, industry: sector, whatsapp_number: phone || null })
        .select()
        .single();
      if (newCo) setCompanyId(newCo.id);
    }
    setSaving2(false);
    setStep(2);
  }

  async function handleStep3() {
    if (bedrijfsinfo.trim().length < 100) {
      setError3("Voer minimaal 100 tekens in voor betere antwoorden.");
      return;
    }
    setSaving3(true);
    setError3("");
    const supabase = createClient();

    const { data: existing } = await supabase
      .from("deltaagents_agent_config")
      .select("id")
      .eq("company_id", companyId!)
      .single();

    if (existing) {
      await supabase
        .from("deltaagents_agent_config")
        .update({ bedrijfsinfo, actief: true })
        .eq("company_id", companyId!);
    } else {
      await supabase
        .from("deltaagents_agent_config")
        .insert({ company_id: companyId!, agent_type: "klantenservice", bedrijfsinfo, actief: true });
    }

    // Log onboarding voltooid
    if (companyId) {
      await supabase.from("deltaagents_activity").insert({
        company_id: companyId,
        type: "onboarding_voltooid",
        beschrijving: "Onboarding doorlopen",
        metadata: {},
      });
    }

    setSaving3(false);
    setShowConfetti(true);
    setStep(3);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const totalSteps = 4;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {showConfetti && <Confetti />}

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(59,130,246,0.08), transparent)" }}
      />

      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8 relative z-10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" fill="currentColor" />
        </div>
        <span className="font-display font-700 text-white text-xl tracking-tight">
          Delta<span className="text-blue-400">Agents</span>
        </span>
      </div>

      {/* Progress bar */}
      {step < 3 && (
        <div className="w-full max-w-lg mb-6 relative z-10">
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            <span>Stap {step + 1} van {totalSteps - 1}</span>
            <span>{Math.round(((step) / (totalSteps - 1)) * 100)}%</span>
          </div>
          <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
              animate={{ width: `${(step / (totalSteps - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      <div className="w-full max-w-lg relative z-10">
        <AnimatePresence mode="wait">

          {/* STAP 0 — Welkom */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              className="glass-strong rounded-3xl p-8 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-6">
                <Bot className="w-8 h-8 text-blue-400" />
              </div>
              <h1 className="font-display text-2xl font-700 text-white mb-3">
                Welkom bij DeltaAgents!
              </h1>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Laten we jouw Digitale Werknemer inwerken. Dit duurt minder dan 5 minuten.
              </p>
              <ul className="text-left space-y-3 mb-8">
                {[
                  { icon: <MessageSquare className="w-4 h-4 text-blue-400" />, text: "Jouw werknemer beantwoordt 24/7 WhatsApp-berichten en vragen van klanten" },
                  { icon: <Bot className="w-4 h-4 text-violet-400" />, text: "Tijdens de inwerkfase leer je hem alles over jouw bedrijf — hij onthoudt het altijd" },
                  { icon: <Sparkles className="w-4 h-4 text-emerald-400" />, text: "Na 3-7 dagen werkt hij volledig zelfstandig en bespaar je uren per week" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                    <span className="mt-0.5 flex-shrink-0">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setStep(1)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-2xl transition-all group"
              >
                Start inwerkfase
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {/* STAP 1 — Bedrijfsgegevens */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              className="glass-strong rounded-3xl p-8"
            >
              <div className="flex items-center gap-2 text-blue-400 mb-6">
                <Building2 className="w-5 h-5" />
                <h2 className="font-display text-xl font-700 text-white">Jouw bedrijfsgegevens</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1.5">
                    Bedrijfsnaam <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Bijv. Jansen Hoveniers"
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1.5">Sector / Branche</label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500/40 transition-all bg-transparent"
                  >
                    {SECTORS.map((s) => (
                      <option key={s.value} value={s.value} className="bg-slate-900">
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1.5">
                    <Phone className="inline w-3.5 h-3.5 mr-1" />
                    Telefoonnummer (optioneel)
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+31 6 12345678"
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/40 transition-all"
                  />
                </div>
              </div>

              {error2 && <p className="text-red-400 text-xs mt-3">{error2}</p>}

              <button
                onClick={handleStep2}
                disabled={saving2}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-4 rounded-2xl transition-all group"
              >
                {saving2 ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Volgende stap <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </motion.div>
          )}

          {/* STAP 2 — Bedrijfsinfo */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              className="glass-strong rounded-3xl p-8"
            >
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <Bot className="w-5 h-5" />
                <h2 className="font-display text-xl font-700 text-white">Vertel je werknemer alles</h2>
              </div>
              <p className="text-slate-400 text-sm mb-5">
                Hoe meer je invult, hoe beter hij presteert. Denk aan: tarieven, werkwijze, openingstijden, klanten.
              </p>

              <textarea
                value={bedrijfsinfo}
                onChange={(e) => setBedrijfsinfo(e.target.value)}
                placeholder={getPlaceholder(sector)}
                rows={10}
                className="w-full glass rounded-2xl p-4 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/40 transition-all resize-none leading-relaxed"
              />

              <div className="flex items-center justify-between mt-2 mb-4">
                <span className={`text-xs ${bedrijfsinfo.trim().length < 100 ? "text-red-400" : "text-emerald-400"}`}>
                  {bedrijfsinfo.trim().length} / 100 tekens minimaal
                </span>
                {bedrijfsinfo.trim().length >= 100 && (
                  <span className="text-emerald-400 text-xs flex items-center gap-1">
                    <Check className="w-3 h-3" /> Voldoende
                  </span>
                )}
              </div>

              {/* Tip box */}
              <div className="glass rounded-xl p-4 border border-amber-500/20 bg-amber-500/5 mb-4">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  Tip van DeltaAgents
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Hoe meer je invult, hoe beter je werknemer presteert. Voeg ook je prijzen en FAQ toe via het dashboard.
                </p>
              </div>

              {error3 && <p className="text-red-400 text-xs mb-3">{error3}</p>}

              <button
                onClick={handleStep3}
                disabled={saving3 || bedrijfsinfo.trim().length < 100}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-4 rounded-2xl transition-all group"
              >
                {saving3 ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Werknemer inwerken <Sparkles className="w-4 h-4" /></>
                )}
              </button>
            </motion.div>
          )}

          {/* STAP 3 — Klaar */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-strong rounded-3xl p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6"
              >
                <PartyPopper className="w-10 h-10 text-emerald-400" />
              </motion.div>

              <h2 className="font-display text-2xl font-700 text-white mb-3">
                Je Digitale Werknemer is klaar!
              </h2>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                {companyName} heeft nu een digitale werknemer die 24/7 klaar staat. Hij beantwoordt klantvragen terwijl jij bezig bent met je werk.
              </p>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-2xl transition-all"
                >
                  <Zap className="w-4 h-4" fill="currentColor" />
                  Ga naar dashboard
                </button>
                <button
                  onClick={() => router.push("/dashboard/chat")}
                  className="w-full flex items-center justify-center gap-2 glass hover:bg-white/[0.06] text-slate-300 hover:text-white font-semibold py-3.5 rounded-2xl transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  Test mijn werknemer
                </button>
                <button
                  onClick={() => router.push("/dashboard/bedrijfsinfo")}
                  className="w-full flex items-center justify-center gap-2 glass hover:bg-white/[0.06] text-slate-400 hover:text-white font-semibold py-3.5 rounded-2xl transition-all text-sm"
                >
                  Voeg meer info toe →
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

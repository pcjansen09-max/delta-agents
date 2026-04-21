"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Check, User, Building2, Bell, AlertTriangle, Trash2, Power } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { TIER_LABELS } from "@/lib/dashboard";

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

interface Props {
  companyId: string;
  initialData: {
    company_name: string;
    industry: string;
    whatsapp_number: string;
    subscription_tier: string;
    created_at: string;
  };
  userEmail: string;
  agentActief: boolean;
}

export default function InstellingenClient({ companyId, initialData, userEmail, agentActief: initialAgentActief }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Notificaties — localStorage
  const [notifChat, setNotifChat] = useState(false);
  const [notifSummary, setNotifSummary] = useState(false);
  useEffect(() => {
    setNotifChat(localStorage.getItem("da_notif_chat") === "1");
    setNotifSummary(localStorage.getItem("da_notif_summary") === "1");
  }, []);

  // Danger zone
  const [agentActief, setAgentActief] = useState(initialAgentActief);
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("deltaagents_companies")
      .update({
        company_name: form.company_name || null,
        industry: form.industry || null,
        whatsapp_number: form.whatsapp_number || null,
      })
      .eq("id", companyId);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function toggleNotif(key: "chat" | "summary") {
    if (key === "chat") {
      const next = !notifChat;
      setNotifChat(next);
      localStorage.setItem("da_notif_chat", next ? "1" : "0");
    } else {
      const next = !notifSummary;
      setNotifSummary(next);
      localStorage.setItem("da_notif_summary", next ? "1" : "0");
    }
  }

  async function handlePauseAgent() {
    const supabase = createClient();
    const newActief = !agentActief;
    await supabase
      .from("deltaagents_agent_config")
      .update({ actief: newActief })
      .eq("company_id", companyId);
    setAgentActief(newActief);
    setShowPauseConfirm(false);
  }

  async function handleDeleteAccount() {
    if (deleteInput !== form.company_name) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  const memberSince = new Date(initialData.created_at).toLocaleDateString("nl-NL", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="pt-16 md:pt-0 space-y-6 max-w-xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-700 text-white mb-1">Instellingen</h1>
        <p className="text-slate-400 text-sm">Beheer je account en bedrijfsgegevens.</p>
      </motion.div>

      {/* Account sectie */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-blue-400" />
          Account
        </h2>
        <div className="space-y-3">
          <div>
            <p className="text-slate-500 text-xs mb-0.5">E-mailadres</p>
            <p className="text-white text-sm">{userEmail}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-1">Abonnement</p>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/20">
              {TIER_LABELS[form.subscription_tier] ?? form.subscription_tier}
            </span>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-0.5">Lid sinds</p>
            <p className="text-white text-sm">{memberSince}</p>
          </div>
        </div>
      </motion.div>

      {/* Bedrijf sectie */}
      <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onSubmit={handleSave} className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-400" />
          Bedrijf
        </h2>
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1.5">Bedrijfsnaam</label>
          <input
            value={form.company_name}
            onChange={(e) => update("company_name", e.target.value)}
            placeholder="Bijv. Jansen Hoveniers"
            className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/40 transition-all"
          />
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1.5">Sector</label>
          <select
            value={form.industry}
            onChange={(e) => update("industry", e.target.value)}
            className="w-full glass rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500/40 transition-all bg-transparent"
          >
            {SECTORS.map((s) => (
              <option key={s.value} value={s.value} className="bg-slate-900">{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1.5">Telefoonnummer</label>
          <input
            value={form.whatsapp_number}
            onChange={(e) => update("whatsapp_number", e.target.value)}
            placeholder="+31 6 12345678"
            className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/40 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-all"
        >
          {saved ? <><Check className="w-4 h-4" />Opgeslagen!</> : saving ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Opslaan...</>
          ) : <><Save className="w-4 h-4" />Opslaan</>}
        </button>
      </motion.form>

      {/* Notificaties */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-400" />
          Notificaties
        </h2>
        {[
          { key: "chat" as const, label: "Email notificatie bij elke chat", val: notifChat },
          { key: "summary" as const, label: "Dagelijkse samenvatting per email", val: notifSummary },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <span className="text-slate-300 text-sm">{item.label}</span>
            <button
              onClick={() => toggleNotif(item.key)}
              aria-label={item.label}
              className={`relative w-11 h-6 rounded-full transition-colors ${item.val ? "bg-blue-600" : "bg-white/[0.1]"}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${item.val ? "translate-x-5" : ""}`} />
            </button>
          </div>
        ))}
      </motion.div>

      {/* Gevaarlijke zone */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6 space-y-4 border border-red-500/15">
        <h2 className="font-semibold text-red-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Gevaarlijke zone
        </h2>

        {/* Pause agent */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-white text-sm font-medium">Agent {agentActief ? "pauzeren" : "activeren"}</p>
            <p className="text-slate-500 text-xs">
              {agentActief ? "Werknemer stopt met antwoorden geven." : "Werknemer gaat weer antwoorden."}
            </p>
          </div>
          {showPauseConfirm ? (
            <div className="flex gap-2">
              <button onClick={handlePauseAgent} className="text-xs bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl transition-all font-semibold">
                Bevestigen
              </button>
              <button onClick={() => setShowPauseConfirm(false)} className="text-xs glass text-slate-400 hover:text-white px-4 py-2 rounded-xl transition-all">
                Annuleren
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowPauseConfirm(true)}
              className="flex items-center gap-2 glass border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
            >
              <Power className="w-4 h-4" />
              {agentActief ? "Pauzeren" : "Activeren"}
            </button>
          )}
        </div>

        <div className="border-t border-white/[0.06]" />

        {/* Delete account */}
        <div>
          <p className="text-white text-sm font-medium mb-0.5">Account verwijderen</p>
          <p className="text-slate-500 text-xs mb-3">
            Je wordt uitgelogd. Data wordt later volledig verwijderd op verzoek.
          </p>
          {showDeleteConfirm ? (
            <div className="space-y-3">
              <p className="text-slate-400 text-xs">
                Typ je bedrijfsnaam <span className="text-white font-semibold">"{form.company_name}"</span> ter bevestiging:
              </p>
              <input
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder={form.company_name}
                className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-red-500/40 transition-all"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteInput !== form.company_name || deleting}
                  className="flex items-center gap-2 text-xs bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white px-4 py-2 rounded-xl transition-all font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {deleting ? "Verwijderen..." : "Account verwijderen"}
                </button>
                <button onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }} className="text-xs glass text-slate-400 hover:text-white px-4 py-2 rounded-xl transition-all">
                  Annuleren
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 glass border border-red-500/20 text-red-400 hover:bg-red-500/10 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Account verwijderen
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

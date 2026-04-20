"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Check, User, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { TIER_LABELS } from "@/lib/dashboard";

interface Props {
  companyId: string;
  initialData: {
    company_name: string;
    industry: string;
    whatsapp_number: string;
    subscription_tier: string;
  };
  userEmail: string;
}

export default function InstellingenClient({ companyId, initialData, userEmail }: Props) {
  const [form, setForm] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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

  return (
    <div className="pt-16 md:pt-0 space-y-6 max-w-xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-700 text-white mb-1">Instellingen</h1>
        <p className="text-slate-400 text-sm">Beheer je bedrijfsgegevens en abonnement.</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSave}
        className="glass rounded-2xl p-6 space-y-5"
      >
        <h2 className="font-semibold text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-400" />
          Bedrijfsgegevens
        </h2>

        {[
          { key: "company_name", label: "Bedrijfsnaam", placeholder: "Bijv. Jansen Hoveniers" },
          { key: "industry", label: "Branche", placeholder: "Bijv. Hoveniers, Makelaardij, Bouw..." },
          { key: "whatsapp_number", label: "WhatsApp nummer", placeholder: "+31 6 12345678" },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">{label}</label>
            <input
              value={form[key as keyof typeof form]}
              onChange={(e) => update(key, e.target.value)}
              placeholder={placeholder}
              className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/40 transition-all"
            />
          </div>
        ))}

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

      {/* Account info */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 space-y-3"
      >
        <h2 className="font-semibold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-blue-400" />
          Account
        </h2>
        <div>
          <p className="text-slate-500 text-xs mb-0.5">E-mailadres</p>
          <p className="text-white text-sm">{userEmail}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs mb-0.5">Abonnement</p>
          <p className="text-white text-sm">{TIER_LABELS[form.subscription_tier] ?? form.subscription_tier}</p>
        </div>
      </motion.div>
    </div>
  );
}

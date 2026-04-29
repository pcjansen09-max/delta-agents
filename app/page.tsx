'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight, Star, Check, ChevronDown, MessageSquare,
  Calendar, FileText, Brain, BarChart3,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MeshBackground from '@/components/MeshBackground'
import PhoneMockup, { SCENARIOS } from '@/components/PhoneMockup'
import IntegrationsOrbit from '@/components/IntegrationsOrbit'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}
const stagger = {
  show: { transition: { staggerChildren: 0.08 } },
}
const vp = { once: true, margin: '-80px' }

// ─── ROI Stats ────────────────────────────────────────────────────────────────
// ─── Actie cards ──────────────────────────────────────────────────────────────
const ACTIE_CARDS = [
  { badge: 'Hij doet het automatisch', badgeBg: '#EEF2FF', badgeColor: '#1B4FD8', icon: '📅', iconBg: '#EEF2FF', title: 'Plant afspraken in', desc: 'Klant vraagt om een afspraak via WhatsApp. Hij checkt jouw agenda en plant in — zonder dat jij iets doet.' },
  { badge: 'Binnen 2 minuten', badgeBg: '#FEF3C7', badgeColor: '#D97706', icon: '📄', iconBg: '#FEF3C7', title: 'Verstuurt offertes', desc: 'Op basis van jouw prijslijst maakt hij een professionele offerte en stuurt die direct naar de klant.' },
  { badge: 'Persoonlijk contact', badgeBg: '#EDE9FE', badgeColor: '#7C3AED', icon: '🧠', iconBg: '#EDE9FE', title: 'Onthoudt elke klant', desc: 'Hij weet nog dat mevrouw De Jong vorige keer vroeg om een afspraak op vrijdag. Hij vraagt er zelf naar.' },
  { badge: 'Alleen Premium', badgeBg: '#DCFCE7', badgeColor: '#16A34A', icon: '📞', iconBg: '#DCFCE7', title: 'Belt zelf terug', desc: 'Gemiste oproep? Hij belt de klant automatisch terug en regelt wat er nodig is — zonder jouw tussenkomst.' },
  { badge: 'Koppeling vereist', badgeBg: '#FEF3C7', badgeColor: '#D97706', icon: '🧾', iconBg: '#FEF3C7', title: 'Verstuurt facturen', desc: 'Na afgeronde klus stuurt hij de factuur via jouw boekhoudpakket. Moneybird, Exact, of wat jij gebruikt.' },
  { badge: 'Elke week', badgeBg: '#EEF2FF', badgeColor: '#1B4FD8', icon: '📊', iconBg: '#EEF2FF', title: 'Rapporteert wat hij deed', desc: 'Elke week een overzicht: hoeveel berichten, afspraken, offertes en hoeveel tijd hij jou heeft bespaard.' },
]

// ─── Scenario tab labels ───────────────────────────────────────────────────────
const SCENARIO_TABS = ['Factuur maken', 'Offerte sturen', 'Afspraak inplannen', 'Betaling opvolgen', 'Klant herinneren']

// ─── Sectors ──────────────────────────────────────────────────────────────────
const SECTORS = [
  { emoji: '🏡', label: 'Makelaars' }, { emoji: '🌿', label: 'Hoveniers' },
  { emoji: '🔧', label: 'Installateurs' }, { emoji: '🏗', label: 'Aannemers' },
  { emoji: '✂️', label: 'Kappers' }, { emoji: '🍽', label: 'Horeca' },
  { emoji: '🚗', label: 'Garagebedrijven' }, { emoji: '💆', label: 'Zorgverleners' },
  { emoji: '📦', label: 'Webshops' }, { emoji: '⚡', label: 'Elektriciëns' },
]

// ─── How it works ─────────────────────────────────────────────────────────────
const STEPS = [
  { n: '01', color: '#EEF2FF', accent: '#1B4FD8', icon: '👤', title: 'Aanmelden & inrichten', desc: 'Account aanmaken en bedrijfsinfo invoeren: tarieven, diensten en werkwijze. Duurt 20 minuten.', chip: '⏱ Duurt 20 minuten' },
  { n: '02', color: '#FEF3C7', accent: '#D97706', icon: '📖', title: 'Werknemer inwerken', desc: 'De eerste week stuur je correcties via WhatsApp. Hij onthoudt alles voor altijd — net als een echte nieuwe collega.', chip: '📅 Eerste 7 dagen' },
  { n: '03', color: '#DCFCE7', accent: '#16A34A', icon: '⚡', title: 'Volledig autonoom', desc: 'Daarna werkt hij zelfstandig. Klanten geholpen, afspraken ingepland, offertes verstuurd — zonder dat jij iets doet.', chip: '🚀 Daarna voor altijd' },
]

// ─── Feature tabs ─────────────────────────────────────────────────────────────
const TABS = [
  {
    Icon: MessageSquare, emoji: '💬', emojiBg: '#DCFCE7', label: 'WhatsApp 24/7', sub: "Antwoordt klanten direct, ook 's nachts",
    headline: 'Hij beantwoordt, jij werkt',
    body: 'Terwijl jij buiten aan het werk bent, beantwoordt hij alle WhatsApp-berichten. Van tariefvragen tot afspraakverzoeken — alles direct en professioneel afgehandeld.',
    preview: (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Actieve gesprekken</div>
        {[
          { ini: 'HB', bg: '#16A34A', name: 'Henk de Boer', msg: 'Wanneer kunnen jullie komen?', time: '09:14', online: true },
          { ini: 'SB', bg: '#1B4FD8', name: 'Sandra Bakker', msg: 'Wat kost een dakgoot reparatie?', time: '08:52', online: true },
          { ini: 'FJ', bg: '#7C3AED', name: 'Familie Jansen', msg: 'Bedankt voor de snelle reactie!', time: 'Gisteren', online: false },
        ].map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid #E8E8E4' }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{c.ini}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>{c.name}</div>
              <div style={{ fontSize: 12, color: '#4A5568', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.msg}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>{c.time}</div>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.online ? '#22C55E' : '#E8E8E4', marginTop: 4, marginLeft: 'auto' }} />
            </div>
          </div>
        ))}
        <div style={{ marginTop: 'auto', paddingTop: 20, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#22C55E', fontWeight: 600 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
          Werknemer is online — reageert direct
        </div>
      </div>
    ),
  },
  {
    Icon: Calendar, emoji: '📅', emojiBg: '#EEF2FF', label: 'Afspraken inplannen', sub: 'Plant in op basis van jouw agenda',
    headline: 'Nooit meer dubbele boekingen',
    body: 'Hij checkt jouw agenda realtime en plant afspraken in op momenten dat jij beschikbaar bent. Klanten krijgen direct een bevestiging en een herinneringsberichtje de dag ervoor.',
    preview: (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1A1A2E' }}>Week van 21 apr 2026</span>
          <span style={{ fontSize: 13, color: '#4A5568' }}>← →</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8, marginTop: 8 }}>
          {[
            { d: 'Ma', items: [{ t: 'Jansen BV\n14:00–15:00', c: 'b' }] },
            { d: 'Di', items: [{ t: 'De Vries\n10:00–11:00', c: 'g' }] },
            { d: 'Wo', items: [] },
            { d: 'Do', items: [{ t: 'Bakker\n15:30–16:30', c: 'a' }] },
            { d: 'Vr', items: [] },
          ].map((day, i) => (
            <div key={i}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', textAlign: 'center', marginBottom: 6 }}>{day.d}</div>
              {day.items.map((ev, j) => (
                <div key={j} style={{ borderRadius: 8, padding: '7px 8px', fontSize: 10, fontWeight: 600, lineHeight: 1.4, marginBottom: 6, background: ev.c === 'b' ? '#DBEAFE' : ev.c === 'g' ? '#DCFCE7' : '#FEF3C7', color: ev.c === 'b' ? '#1D4ED8' : ev.c === 'g' ? '#16A34A' : '#D97706', whiteSpace: 'pre-line' }}>
                  {ev.t}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, background: '#EEF2FF', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#1B4FD8', fontWeight: 600 }}>📅 3 nieuwe afspraken ingepland vandaag</div>
      </div>
    ),
  },
  {
    Icon: FileText, emoji: '📄', emojiBg: '#FEF3C7', label: 'Offertes & facturen', sub: 'Genereert en verstuurt direct',
    headline: 'Offerte verstuurd terwijl jij rijdt',
    body: 'Vul eenmalig jouw diensten en tarieven in. Daarna maakt hij professionele offertes op maat en verstuurt ze direct naar de klant — inclusief jouw logo en betalingslink.',
    preview: (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', transform: 'rotate(-2deg)', position: 'relative', maxWidth: 280, width: '100%' }}>
          <div style={{ position: 'absolute', top: 10, right: 10, background: '#DCFCE7', color: '#16A34A', borderRadius: 100, padding: '3px 10px', fontSize: 10, fontWeight: 700 }}>Verzonden ✓ · 09:14</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1A2E' }}>⚡ DeltaAgents</div>
              <div style={{ fontSize: 18, color: '#1A1A2E', fontWeight: 400 }}>OFFERTE</div>
            </div>
            <div style={{ fontSize: 10, color: '#4A5568', textAlign: 'right', lineHeight: 1.5 }}>23 apr 2026<br />#OFT-2024-089</div>
          </div>
          <div style={{ fontSize: 11, color: '#4A5568', marginBottom: 16, lineHeight: 1.6 }}><strong>Aan:</strong> Fam. Pietersen<br />Dorpsstraat 12, Alkmaar</div>
          {[['Tuinonderhoud (4u)', '€180,–'], ['Snoeiwerk coniferen', '€65,–'], ['Afvoer groenafval', '€40,–']].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E8E8E4', fontSize: 11, color: '#4A5568' }}>
              <span>{l}</span><span>{v}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: 13, fontWeight: 700 }}>
            <span>Totaal incl. BTW</span><span style={{ color: '#1B4FD8' }}>€345,–</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    Icon: Brain, emoji: '🧠', emojiBg: '#EDE9FE', label: 'Zelflerend geheugen', sub: 'Onthoudt alles, leert van jou',
    headline: 'Hij leert van elke correctie',
    body: "Corrigeer hem gewoon via WhatsApp: 'Niet zo zeggen, zeg liever...' Hij onthoudt het voor altijd. Na de inwerkfase werkt hij volledig zelfstandig.",
    preview: (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Correctie-gesprek</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          {[
            { own: true, t: "Gebruik 'u' bij nieuwe klanten ipv 'jij'" },
            { own: false, t: "Begrepen! Ik gebruik voortaan 'u' bij nieuwe klanten ✓" },
            { own: true, t: 'Geef altijd een prijs inclusief BTW' },
            { own: false, t: 'Onthouden! Alle prijzen worden inclusief BTW vermeld ✓' },
            { own: true, t: 'Bij afwezigheid: meld dat ik terugbel binnen 2 uur' },
            { own: false, t: 'Opgeslagen! Klanten ontvangen een terugbelbelofte ✓' },
          ].map((m, i) => (
            <div key={i} style={{ padding: '9px 13px', borderRadius: m.own ? '12px 12px 12px 4px' : '12px 12px 4px 12px', fontSize: 13, maxWidth: '88%', background: m.own ? '#EEF2FF' : '#DCFCE7', color: m.own ? '#1B4FD8' : '#166534', alignSelf: m.own ? 'flex-start' : 'flex-end' }}>
              {m.t}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, background: '#EEF2FF', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#1B4FD8', fontWeight: 600 }}>🧠 12 correcties onthouden · Leerpercentage: 94%</div>
      </div>
    ),
  },
  {
    Icon: BarChart3, emoji: '📊', emojiBg: '#EEF2FF', label: 'Dashboard & inzichten', sub: 'Volledig overzicht van zijn werk',
    headline: 'Alles in één overzicht',
    body: 'In je dashboard zie je alle gesprekken, verstuurde offertes en ingeplande afspraken. Je ziet precies wat je werknemer heeft gedaan en kunt hem bijsturen waar nodig.',
    preview: (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
          {[['47', '#1A1A2E', 'berichten vandaag'], ['€2.840', '#1B4FD8', 'waarde deze week'], ['12', '#16A34A', 'afspraken deze maand']].map(([n, c, l]) => (
            <div key={l} style={{ background: '#F7F5F0', borderRadius: 12, padding: 12 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: c as string }}>{n}</div>
              <div style={{ fontSize: 11, color: '#4A5568', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ background: '#F7F5F0', borderRadius: 12, padding: 14, marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#4A5568', marginBottom: 8 }}>Activiteit deze week</div>
          <svg width="100%" height="52" viewBox="0 0 280 52"><polyline points="0,50 40,42 80,35 120,26 160,18 200,11 240,6 280,3" stroke="#1B4FD8" strokeWidth="2.5" strokeLinecap="round" fill="none"/><polygon points="0,50 40,42 80,35 120,26 160,18 200,11 240,6 280,3 280,52 0,52" fill="rgba(27,79,216,.07)"/></svg>
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Recente activiteit</div>
        {[['#DCFCE7', '💬', 'Henk de Boer beantwoord — tarieven', '09:14'], ['#EEF2FF', '📅', 'Afspraak ingepland — Fam. Jansen', '08:47'], ['#FEF3C7', '📄', 'Offerte verzonden — Sandra Bakker', '08:22']].map(([bg, icon, text, time], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12, color: '#4A5568', marginBottom: 7 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: bg as string, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>{icon}</div>
            <span style={{ flex: 1 }}>{text}</span>
            <span style={{ flexShrink: 0, fontSize: 11 }}>{time}</span>
          </div>
        ))}
      </div>
    ),
  },
]

// ─── Demo chat ────────────────────────────────────────────────────────────────
interface ChatMsg { role: 'user' | 'assistant'; content: string }

function DemoChat() {
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { role: 'assistant', content: 'Hey! Ik ben klaar om te werken. Wat heb je vandaag gedaan?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return }
    if (bottomRef.current) bottomRef.current.scrollTop = bottomRef.current.scrollHeight
  }, [msgs, loading])

  async function send(text: string) {
    if (!text.trim() || loading || count >= 8) return
    const newMsgs: ChatMsg[] = [...msgs, { role: 'user', content: text }]
    setMsgs(newMsgs)
    setInput('')
    setLoading(true)
    setCount(c => c + 1)

    const res = await fetch('/api/demo-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMsgs.map(m => ({ role: m.role, content: m.content })), count }),
    })

    const data = res.headers.get('content-type')?.includes('event-stream') ? null : await res.json()
    if (data?.done) {
      setMsgs(prev => [...prev, { role: 'assistant', content: data.text }])
      setLoading(false)
      return
    }

    setMsgs(prev => [...prev, { role: 'assistant', content: '' }])
    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    let buf = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buf += decoder.decode(value, { stream: true })
      const lines = buf.split('\n')
      buf = lines.pop() ?? ''
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const raw = line.slice(6).trim()
        if (raw === '[DONE]') continue
        try {
          const { t } = JSON.parse(raw)
          if (t) setMsgs(prev => {
            const u = [...prev]
            u[u.length - 1] = { ...u[u.length - 1], content: u[u.length - 1].content + t }
            return u
          })
        } catch { /* skip */ }
      }
    }
    setLoading(false)
  }

  const CHIPS = ['Klus klaar bij Familie Peters. 3u heg knippen.', 'Henk Smit wil offerte voor tuinaanleg.', 'Factuur Jansen staat 2 weken open.']

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '35% 65%', gap: 48, alignItems: 'start' }} className="demo-grid">
      {/* Company card */}
      <div>
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#fff', flexShrink: 0 }}>JH</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#1A1A2E' }}>Jansen Hoveniers</div>
              <div style={{ fontSize: 14, color: '#4A5568' }}>Hovenier · Alkmaar</div>
              <div style={{ fontSize: 13, color: '#22C55E', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
                Werknemer aan het werk
              </div>
            </div>
          </div>
          <div style={{ height: 1, background: '#E5E2DB', marginBottom: 16 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {[['📍', 'Alkmaar, Noord-Holland'], ['💰', 'Tuinonderhoud €45/u · Snoei €55/u'], ['🧾', 'Boekhouden via Moneybird'], ['📅', 'Agenda via Google Calendar']].map(([icon, val]) => (
              <div key={val} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#4A5568' }}>
                <span style={{ fontSize: 16, width: 22, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
                <span>{val}</span>
              </div>
            ))}
          </div>
          <div style={{ height: 1, background: '#E5E2DB', marginBottom: 16 }} />
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Stuur hem een bericht:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {CHIPS.map(c => (
              <button key={c} onClick={() => send(c)} disabled={loading || count >= 8}
                style={{ fontSize: 13, color: '#1A1A2E', background: '#F7F5F0', border: '1px solid #E5E2DB', borderRadius: 100, padding: '8px 16px', cursor: loading || count >= 8 ? 'not-allowed' : 'pointer', opacity: loading || count >= 8 ? 0.5 : 1, textAlign: 'left', transition: 'all 0.15s' }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Demo phone */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 300, height: 620, background: '#1C1C1E', borderRadius: 50, border: '2px solid rgba(255,255,255,0.12)', boxShadow: '0 32px 64px rgba(0,0,0,0.18)', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 120, height: 34, background: '#000', borderRadius: 20, zIndex: 10 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#E5DDD5', borderRadius: 48, margin: 4, overflow: 'hidden', marginTop: 0 }}>
            <div style={{ background: '#1A8A5A', padding: '44px 12px 10px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>DW</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>Mijn Digitale Werknemer</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>Aan het werk voor jou ✓</div>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, display: 'flex', gap: 12 }}>📹 📞</div>
            </div>
            <div ref={bottomRef as React.RefObject<HTMLDivElement>} style={{ flex: 1, padding: '10px 8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', animation: 'msg-in 0.35s var(--spring) forwards' }}>
                  <div style={{ maxWidth: '84%', padding: '8px 11px', fontSize: 12, lineHeight: 1.5, color: '#1A1A2E', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', background: m.role === 'user' ? '#DCF8C6' : '#fff', borderRadius: m.role === 'user' ? '16px 2px 16px 16px' : '2px 16px 16px 16px' }}>
                    {m.content || (loading && i === msgs.length - 1 ? <span style={{ display: 'inline-flex', gap: 3 }}>{[0,1,2].map(d => <span key={d} style={{ display: 'inline-block', width: 5, height: 5, background: '#bbb', borderRadius: '50%', animation: `typing-pulse 1.2s ease-in-out ${d*0.2}s infinite` }} />)}</span> : '')}
                  </div>
                </div>
              ))}
              {loading && msgs[msgs.length - 1]?.role !== 'assistant' && (
                <div style={{ display: 'flex' }}>
                  <div style={{ background: '#fff', borderRadius: '2px 16px 16px 16px', padding: '10px 14px' }}>
                    <span style={{ display: 'inline-flex', gap: 3 }}>{[0,1,2].map(d => <span key={d} style={{ display: 'inline-block', width: 5, height: 5, background: '#bbb', borderRadius: '50%', animation: `typing-pulse 1.2s ease-in-out ${d*0.2}s infinite` }} />)}</span>
                  </div>
                </div>
              )}
            </div>
            <div style={{ background: '#F0F0F0', padding: '10px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <span style={{ fontSize: 18 }}>😊</span>
              {count >= 8 ? (
                <div style={{ flex: 1, fontSize: 11, color: '#94A3B8', textAlign: 'center' }}>Demo limiet bereikt</div>
              ) : (
                <>
                  <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)} placeholder="Typ een bericht..." disabled={loading}
                    style={{ flex: 1, background: '#fff', border: 'none', borderRadius: 24, padding: '10px 14px', fontSize: 12, outline: 'none', color: '#1A1A2E', fontFamily: 'inherit' }} />
                  <button onClick={() => send(input)} disabled={!input.trim() || loading}
                    style={{ width: 34, height: 34, borderRadius: '50%', background: input.trim() && !loading ? '#1A8A5A' : '#CBD5E1', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', flexShrink: 0 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"/></svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: 'Jan de Vries', role: 'Hovenier', city: 'Alkmaar', ini: 'JV', bg: '#16A34A', quote: 'Mijn digitale werknemer beantwoordt WhatsApps terwijl ik aan het snoeien ben. Ik mis geen enkele aanvraag meer en mijn omzet is dit jaar met 30% gestegen.' },
  { name: 'Sandra Bakker', role: 'Makelaar', city: 'Utrecht', ini: 'SB', bg: '#1B4FD8', quote: "Klanten krijgen direct antwoord op bezichtigingsvragen, ook 's avonds. Hij klinkt precies zoals ik zou reageren — maar dan altijd beleefd en altijd beschikbaar." },
  { name: 'Mark van den Berg', role: 'Installateur', city: 'Rotterdam', ini: 'MV', bg: '#7C3AED', quote: 'Offerteaanvragen worden meteen professioneel bevestigd. Voelt echt als een collega. Mijn vrouw dacht dat ik iemand had aangenomen.' },
]

// ─── Comparison ───────────────────────────────────────────────────────────────
const CMP_ITEMS = ['Beschikbaar buiten werktijden', 'Antwoordt binnen seconden', 'Plant afspraken automatisch in', 'Verstuurt offertes direct', 'Onthoudt elke klant', 'Leert van elke correctie', 'Vast maandelijks tarief', 'Geen vakanties of ziekmeldingen']

// ─── Pricing ──────────────────────────────────────────────────────────────────
const PLANS = [
  { name: 'Basis Werknemer', price: '€149', desc: 'De perfecte start voor elk MKB-bedrijf', highlight: false, badge: null, features: ['WhatsApp communicatie met klanten', 'E-mail afhandeling', 'Offertes & facturen genereren', '24/7 beschikbaar', 'Dashboard toegang', 'Inwerkfase begeleiding (7 dagen)'] },
  { name: 'Premium Werknemer', price: '€239', desc: 'De meeste MKB-ondernemers kiezen dit. Inclusief telefoon en zelflerend geheugen.', highlight: true, badge: 'Meest gekozen', features: ['Alles van Basis', 'Inkomende gesprekken via AI telefoon', 'CRM-integratie', 'Zelflerend geheugen', 'Maandelijkse rapportage', 'Google Calendar koppeling', '3 boekhouding koppelingen', 'Prioriteit support'] },
  { name: 'All-Round Werknemer', price: '€499', desc: 'Volledige automatisering. Belt zelf terug.', highlight: false, badge: null, features: ['Alles van Premium', 'Voice outbound (agent belt zelf terug)', 'Volledige automatisering bedrijfsprocessen', 'Onbeperkte koppelingen', '3 Digitale Werknemers', 'Dedicated setup begeleiding', 'Telefonische support'] },
]

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: 'Hoe snel is mijn Digitale Werknemer operationeel?', a: 'Binnen 1 werkdag na aanmelding. Je vult je bedrijfsinfo in via ons dashboard — tarieven, diensten, werkwijze. Wij configureren de rest. De meeste klanten zijn binnen een werkdag al live.' },
  { q: 'Is het moeilijk in te stellen?', a: 'Nee. Als je WhatsApp kunt gebruiken, kun je met je Digitale Werknemer werken. Je vult een formulier in met je bedrijfsinformatie. Dat is alles. Wij doen de techniek.' },
  { q: 'Wat als hij iets verkeerds zegt?', a: 'Corrigeer hem dan direct via WhatsApp of via je dashboard. Hij onthoudt de correctie en maakt die fout nooit meer. Hoe meer feedback je geeft, hoe beter hij wordt — net als een echte nieuwe medewerker.' },
  { q: 'Kan ik hem pauzeren of opzeggen?', a: 'Ja. Via je dashboard kun je hem met één klik pauzeren. Opzeggen kan maandelijks — geen gedoe, geen verborgen kosten, geen minimale contractduur.' },
  { q: 'Spreekt hij goed Nederlands?', a: 'Ja, volledig Nederlands. Hij past zijn taalgebruik aan op die van de klant — formeel als de klant formeel is, informeel als de klant jou tutoyeert.' },
  { q: 'Zijn mijn klantgegevens veilig?', a: 'Ja. Alle data wordt opgeslagen op Nederlandse servers en is volledig AVG/GDPR-compliant. Jouw klantgegevens worden nooit gedeeld of gebruikt voor training van AI modellen.' },
]

// ─── FeatureTabsSection ───────────────────────────────────────────────────────
const TAB_INTERVAL = 4000

function FeatureTabsSection() {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef = useRef(Date.now())

  function startTimer(idx: number) {
    if (timerRef.current) clearInterval(timerRef.current)
    startRef.current = Date.now()
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current
      setProgress(Math.min((elapsed / TAB_INTERVAL) * 100, 100))
      if (elapsed >= TAB_INTERVAL) {
        startRef.current = Date.now()
        setProgress(0)
        setActive(prev => (prev + 1) % TABS.length)
      }
    }, 30)
  }

  useEffect(() => { startTimer(active); return () => { if (timerRef.current) clearInterval(timerRef.current) } }, [active])

  const tab = TABS[active]

  return (
    <section id="features" style={{ padding: '96px 24px', background: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial="hidden" whileInView="show" viewport={vp} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="sec-label blue">Wat hij doet</div>
          <h2 className="font-display" style={{ fontSize: 'clamp(28px,3.5vw,48px)', color: '#1A1A2E', fontWeight: 400, marginBottom: 16 }}>Alles wat een goede werknemer doet</h2>
          <p style={{ fontSize: 17, color: '#4A5568', maxWidth: 520, margin: '0 auto' }}>Alleen dan 24/7, zonder ziekmelding en voor een vast maandbedrag.</p>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: '38% 62%', gap: 64, alignItems: 'start' }} className="tabs-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {TABS.map((t, i) => (
              <button key={t.label} onClick={() => { setActive(i); setProgress(0); startTimer(i) }}
                style={{ display: 'flex', flexDirection: 'column', padding: 18, borderRadius: 16, background: active === i ? '#fff' : 'transparent', border: active === i ? '1px solid #E8E8E4' : '1px solid transparent', borderLeft: active === i ? '3px solid #1B4FD8' : '3px solid transparent', textAlign: 'left', cursor: 'pointer', transition: 'all 0.25s', boxShadow: active === i ? '0 2px 4px rgba(0,0,0,0.04),0 8px 24px rgba(0,0,0,0.06)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 5 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: t.emojiBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{t.emoji}</div>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#1A1A2E' }}>{t.label}</span>
                </div>
                <div style={{ fontSize: 13, color: '#4A5568', paddingLeft: 46 }}>{t.sub}</div>
                {active === i && (
                  <div style={{ height: 3, background: '#E8E8E4', borderRadius: 3, overflow: 'hidden', marginTop: 12 }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: '#1B4FD8', borderRadius: 3, transition: 'width 30ms linear' }} />
                  </div>
                )}
              </button>
            ))}
          </div>
          <div key={active} style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #E8E8E4', boxShadow: '0 2px 4px rgba(0,0,0,0.04),0 8px 24px rgba(0,0,0,0.06)', minHeight: 440, display: 'flex', flexDirection: 'column', animation: 'msg-in 0.35s var(--spring) forwards' }}>
            <h3 className="font-display" style={{ fontSize: 'clamp(20px,2.2vw,28px)', color: '#1A1A2E', fontWeight: 400, marginBottom: 12 }}>{tab.headline}</h3>
            <p style={{ fontSize: 15, color: '#4A5568', lineHeight: 1.7, marginBottom: 24 }}>{tab.body}</p>
            {tab.preview}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── FAQ accordion ────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section style={{ padding: '96px 24px', background: '#F9F8F5' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <motion.div initial="hidden" whileInView="show" viewport={vp} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="sec-label blue">Veelgestelde vragen</div>
          <h2 className="font-display" style={{ fontSize: 'clamp(28px,3.5vw,48px)', color: '#1A1A2E', fontWeight: 400 }}>Alles wat je wil weten</h2>
        </motion.div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FAQS.map((f, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #E5E2DB', borderRadius: 14, overflow: 'hidden', borderLeft: open === i ? '3px solid #1B4FD8' : '1px solid #E5E2DB', transition: 'border 0.2s' }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', gap: 16 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#1A1A2E', flex: 1 }}>{f.q}</span>
                <ChevronDown size={18} style={{ color: '#94A3B8', flexShrink: 0, transform: open === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              <div style={{ maxHeight: open === i ? 300 : 0, overflow: 'hidden', transition: 'max-height 0.3s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ padding: '0 22px 18px', paddingTop: 2 }}>
                  <div style={{ borderTop: '1px solid #E5E2DB', paddingTop: 14 }}>
                    <p style={{ fontSize: 14, color: '#4A5568', lineHeight: 1.75 }}>{f.a}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [activeScenario, setActiveScenario] = useState(0)

  return (
    <main>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 64, position: 'relative', overflow: 'hidden', background: '#F7F5F0' }}>
        <MeshBackground />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px', width: '100%', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '55% 45%', gap: 48, alignItems: 'center' }} className="hero-grid">
          {/* Left */}
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#EEF2FF', border: '1px solid rgba(27,79,216,0.2)', borderRadius: 999, padding: '5px 16px', marginBottom: 24 }}>
                <span style={{ fontSize: 14 }}>🇳🇱</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#1B4FD8' }}>Gemaakt voor het Nederlandse MKB</span>
              </div>
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-display" style={{ fontSize: 'clamp(38px,4.8vw,72px)', lineHeight: 1.08, color: '#1A1A2E', marginBottom: 20, fontWeight: 400 }}>
              Jouw digitale<br />
              <em>werknemer.</em><br />
              Altijd beschikbaar.
            </motion.h1>
            <motion.p variants={fadeUp} style={{ fontSize: 18, lineHeight: 1.7, color: '#4A5568', marginBottom: 16, maxWidth: 480 }}>
              Jij werkt buiten. Hij werkt op kantoor. Stuur hem via WhatsApp wat je hebt gedaan — hij maakt de factuur, plant de afspraak in, verstuurt de offerte en houdt de administratie bij. Dag en nacht.
            </motion.p>
            <motion.div variants={fadeUp} style={{ background: '#EEF2FF', border: '1px solid rgba(27,79,216,0.18)', borderRadius: 14, padding: '14px 18px', fontSize: 14, color: '#1D4ED8', fontWeight: 500, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
              💰 <span>Gemiddeld <strong>€2.351 per maand goedkoper</strong> dan een echte assistent</span>
            </motion.div>
            <motion.div variants={fadeUp} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
              <a href="/auth/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1B4FD8', color: '#fff', fontWeight: 600, fontSize: 15, padding: '12px 28px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 4px 20px rgba(27,79,216,0.35)' }}>
                Probeer gratis — geen creditcard
              </a>
              <a href="#actie" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#1A1A2E', fontWeight: 600, fontSize: 15, padding: '12px 28px', borderRadius: 12, textDecoration: 'none', border: '1px solid #E5E2DB' }}>
                Zie wat hij regelt ↓
              </a>
            </motion.div>
            <motion.div variants={fadeUp} style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', fontSize: 13, color: '#4A5568', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={12} style={{ color: '#E8B84B' }} fill="#E8B84B" />)}
                <span style={{ marginLeft: 4, fontWeight: 600, color: '#1A1A2E' }}>4.8/5</span>
              </div>
              <span style={{ color: '#E5E2DB' }}>|</span>
              <span>Geen setup fee</span>
              <span style={{ color: '#E5E2DB' }}>|</span>
              <span>In 1 week actief</span>
              <span style={{ color: '#E5E2DB' }}>|</span>
              <span>Maandelijks opzegbaar</span>
            </motion.div>
            <motion.div variants={fadeUp} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SCENARIO_TABS.map((label, i) => (
                <button key={i} onClick={() => setActiveScenario(i)}
                  style={{ fontSize: 13, fontWeight: 500, padding: '7px 16px', borderRadius: 999, border: `1px solid ${activeScenario === i ? '#1B4FD8' : '#E5E2DB'}`, cursor: 'pointer', transition: 'all 0.2s', background: activeScenario === i ? '#1B4FD8' : '#F7F5F0', color: activeScenario === i ? '#fff' : '#4A5568' }}>
                  {label}
                </button>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: phone */}
          <motion.div initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} style={{ display: 'flex', justifyContent: 'center' }}>
            <PhoneMockup float={true} scenarioIndex={activeScenario} onScenarioEnd={setActiveScenario} />
          </motion.div>
        </div>
      </section>

      {/* ── SECTOR BAR ── */}
      <section style={{ padding: '32px 24px', borderBottom: '1px solid #E5E2DB', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 18 }}>Werkt voor elke branche in het MKB</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
            {SECTORS.map(({ emoji, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#F7F5F0', border: '1px solid #E5E2DB', borderRadius: 999, padding: '8px 18px', fontSize: 14, color: '#1A1A2E', cursor: 'default' }}>
                <span>{emoji}</span><span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACTIE SECTIE ── */}
      <section id="actie" style={{ padding: '96px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="show" viewport={vp} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 999, padding: '4px 14px', marginBottom: 16 }}>
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', color: '#DC2626', textTransform: 'uppercase' }}>Geen chatbot</span>
            </div>
            <h2 className="font-display" style={{ fontSize: 'clamp(28px,3.5vw,46px)', color: '#1A1A2E', fontWeight: 400, marginBottom: 12 }}>Hij doet het werk.<br />Jij doet jouw werk.</h2>
            <p style={{ fontSize: 17, color: '#4A5568', maxWidth: 600, margin: '0 auto' }}>Jij werkt buiten. Hij werkt op kantoor. Stuur via WhatsApp wat je hebt gedaan — hij regelt de rest. Facturen, offertes, afspraken, herinneringen. Dag en nacht.</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={vp} variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }} className="features-grid">
            {ACTIE_CARDS.map(card => (
              <motion.div key={card.title} variants={fadeUp} className="card" style={{ padding: 28, transition: 'all 0.3s var(--spring)', cursor: 'default' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-6px)'; el.style.boxShadow = '0 4px 8px rgba(0,0,0,0.04), 0 16px 40px rgba(0,0,0,0.07)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.boxShadow = '' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', borderRadius: 100, padding: '3px 12px', fontSize: 11, fontWeight: 700, marginBottom: 16, background: card.badgeBg, color: card.badgeColor }}>{card.badge}</div>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14 }}>{card.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>{card.title}</div>
                <p style={{ fontSize: 14, color: '#4A5568', lineHeight: 1.65 }}>{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={vp} variants={fadeUp} style={{ marginTop: 56, textAlign: 'center', fontStyle: 'italic', fontSize: 22, color: '#1B4FD8', lineHeight: 1.5 }} className="font-display">
            &ldquo;Gemiddeld bespaart een Digitale Werknemer zijn eigenaar 14 uur per week.<br />Dat is 168 uur per jaar.&rdquo;
          </motion.div>
        </div>
      </section>

      {/* ── HOE HET WERKT ── */}
      <section id="hoe-het-werkt" style={{ padding: '96px 24px', background: '#FAFAF8' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="show" viewport={vp} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="sec-label blue">Hoe het werkt</div>
            <h2 className="font-display" style={{ fontSize: 'clamp(28px,3.5vw,48px)', color: '#1A1A2E', fontWeight: 400, marginBottom: 16 }}>Van aanmelding tot autonoom werknemer</h2>
            <p style={{ fontSize: 17, color: '#4A5568' }}>Drie stappen. Geen technische kennis nodig.</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={vp} variants={stagger} style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr 40px 1fr', gap: 0, alignItems: 'start' }} className="steps-grid">
            {STEPS.map((s, si) => (
              <>
                <motion.div key={s.n} variants={fadeUp} className="card" style={{ padding: 32, transition: 'all 0.25s var(--spring)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 8px rgba(0,0,0,0.04),0 16px 40px rgba(0,0,0,0.07)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '' }}>
                  <div className="font-display" style={{ fontSize: 54, lineHeight: 1, marginBottom: 18, color: s.color === '#EEF2FF' ? '#DBEAFE' : s.color === '#FEF3C7' ? '#FEF3C7' : '#DCFCE7' }}>{s.n}</div>
                  <div style={{ width: 46, height: 46, borderRadius: '50%', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14 }}>{s.icon}</div>
                  <h3 style={{ fontSize: 19, fontWeight: 700, color: '#1A1A2E', marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: '#4A5568', lineHeight: 1.7, marginBottom: 16 }}>{s.desc}</p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#F1F5F9', borderRadius: 100, padding: '5px 14px', fontSize: 12, color: '#4A5568' }}>{s.chip}</div>
                </motion.div>
                {si < 2 && (
                  <motion.div key={`arrow-${si}`} variants={fadeUp} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 72, fontSize: 22, color: '#1B4FD8', animation: 'arrowPulse 2s ease-in-out infinite' }}>→</motion.div>
                )}
              </>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURE TABS ── */}
      <FeatureTabsSection />

      {/* ── DEMO ── */}
      <section id="demo" style={{ padding: '96px 24px', background: '#F0F5FF' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="show" viewport={vp} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="sec-label amber">Probeer het zelf</div>
            <h2 className="font-display" style={{ fontSize: 'clamp(28px,3.5vw,44px)', color: '#1A1A2E', fontWeight: 400, marginBottom: 12 }}>Stuur hem een bericht. Zie hoe hij reageert.</h2>
            <p style={{ fontSize: 17, color: '#4A5568', maxWidth: 480, margin: '0 auto' }}>Doe alsof je net een klus hebt afgerond. Stuur je werknemer een berichtje — hij regelt de rest.</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={vp} variants={fadeUp} style={{ background: 'rgba(219,234,254,0.7)', border: '1px solid rgba(27,79,216,0.15)', borderRadius: 14, padding: '14px 20px', fontSize: 14, color: '#1B4FD8', marginBottom: 48, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <span>💡</span>
            <span>Dit is een demo-werknemer. Jouw eigen werknemer leer je jouw bedrijf, tarieven en werkwijze — hij klinkt dan precies zoals jij wil.</span>
          </motion.div>
          <DemoChat />
        </div>
      </section>

      {/* ── ORBIT ── */}
      <IntegrationsOrbit />

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '96px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="show" viewport={vp} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 24, letterSpacing: 2, color: '#E8B84B', marginBottom: 12 }}>★★★★★</div>
            <p style={{ fontSize: 15, color: '#4A5568', marginBottom: 20 }}>Gemiddeld 4.8/5 op basis van 127 beoordelingen</p>
            <div className="sec-label blue">Klantervaring</div>
            <h2 className="font-display" style={{ fontSize: 'clamp(28px,3.5vw,48px)', color: '#1A1A2E', fontWeight: 400 }}>MKB-ondernemers aan het woord</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={vp} variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }} className="test-grid">
            {TESTIMONIALS.map(t => (
              <motion.div key={t.name} variants={fadeUp} className="card" style={{ padding: 32, display: 'flex', flexDirection: 'column', transition: 'all 0.25s var(--spring)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 8px rgba(0,0,0,0.04),0 16px 40px rgba(0,0,0,0.07)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '' }}>
                <div className="font-display" style={{ fontSize: 64, color: '#1B4FD8', lineHeight: 0.7, marginBottom: 16, opacity: 0.4 }}>&ldquo;</div>
                <p className="font-display" style={{ fontStyle: 'italic', fontSize: 17, color: '#1A1A2E', lineHeight: 1.7, flex: 1, marginBottom: 24 }}>{t.quote}</p>
                <div style={{ height: 1, background: '#E8E8E4', marginBottom: 20 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{t.ini}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#4A5568' }}>{t.role} · {t.city}</div>
                    <div style={{ fontSize: 12, color: '#E8B84B', marginTop: 2 }}>★★★★★</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section style={{ padding: '96px 24px', background: '#F9F8F5' }}>
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="show" viewport={vp} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="sec-label" style={{ background: '#F1F5F9', color: '#4A5568' }}>Vergelijking</div>
            <h2 className="font-display" style={{ fontSize: 'clamp(28px,3.5vw,48px)', color: '#1A1A2E', fontWeight: 400, marginBottom: 16 }}>Echte assistent vs. Digitale Werknemer</h2>
            <p style={{ fontSize: 17, color: '#4A5568' }}>Zelfde taken. Betere beschikbaarheid. Lager tarief.</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={vp} variants={fadeUp} style={{ background: '#fff', border: '1px solid #E5E2DB', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.04), 0 16px 40px rgba(0,0,0,0.07)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', background: '#0F172A' }}>
              <div style={{ padding: '20px 24px', fontSize: 14, fontWeight: 700, color: '#fff' }}>Eigenschap</div>
              <div style={{ padding: '20px 24px', fontSize: 14, fontWeight: 700, color: '#fff', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>Echte assistent</div>
              <div style={{ padding: '20px 24px', fontSize: 14, fontWeight: 700, color: '#1B4FD8', borderLeft: '1px solid rgba(255,255,255,0.08)', background: '#EEF2FF' }}>Digitale Werknemer</div>
            </div>
            {CMP_ITEMS.map((item, i) => (
              <div key={item} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', borderBottom: i < CMP_ITEMS.length - 1 ? '1px solid #E5E2DB' : 'none', background: i % 2 === 0 ? '#fff' : '#FAFAF8' }}>
                <div style={{ padding: '15px 24px', fontSize: 14, color: '#1A1A2E', fontWeight: 500, display: 'flex', alignItems: 'center' }}>{item}</div>
                <div style={{ padding: '15px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderLeft: '1px solid #E5E2DB' }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#FEE2E2', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#DC2626' }}>✕</div>
                </div>
                <div style={{ padding: '15px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderLeft: '1px solid #E5E2DB', background: 'rgba(240,245,255,0.5)' }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#DCFCE7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#16A34A' }}>✓</div>
                </div>
              </div>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', background: '#EEF2FF' }}>
              <div style={{ padding: '18px 24px', fontSize: 16, fontWeight: 700, color: '#1A1A2E', display: 'flex', alignItems: 'center' }}>Prijs</div>
              <div style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', borderLeft: '1px solid #E5E2DB' }}>
                <span style={{ fontSize: 16, color: '#94A3B8', textDecoration: 'line-through', fontWeight: 600 }}>€2.500+/mnd</span>
              </div>
              <div style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', borderLeft: '1px solid #E5E2DB' }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#1B4FD8' }}>Vanaf €149/mnd</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="prijzen" style={{ padding: '96px 24px', background: '#F0F5FF' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="show" viewport={vp} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="sec-label blue">Transparante prijzen</div>
            <h2 className="font-display" style={{ fontSize: 'clamp(28px,3.5vw,48px)', color: '#1A1A2E', fontWeight: 400, marginBottom: 16 }}>Kies jouw Digitale Werknemer</h2>
            <p style={{ fontSize: 17, color: '#4A5568', maxWidth: 440, margin: '0 auto' }}>Geen verborgen kosten. Geen lange contracten. Maandelijks opzegbaar.</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={vp} variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, alignItems: 'start' }} className="pricing-grid">
            {PLANS.map((plan, i) => (
              <motion.div key={plan.name} variants={fadeUp} style={{ position: 'relative', alignSelf: plan.highlight ? undefined : 'center' }}>
                {plan.highlight ? (
                  <div style={{ background: '#0F172A', borderRadius: 20, padding: '36px 30px', display: 'flex', flexDirection: 'column', gap: 22, position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.22)', transform: 'scale(1.04)' }}>
                    <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#E8B84B', color: '#1A1A2E', fontSize: 12, fontWeight: 700, padding: '5px 16px', borderRadius: 999, whiteSpace: 'nowrap' }}>{plan.badge}</div>
                    <div>
                      <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{plan.name}</h3>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{plan.desc}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span className="font-display" style={{ fontSize: 40, color: '#fff' }}>{plan.price}</span>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>/ maand</span>
                    </div>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                      {plan.features.map(f => (
                        <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                          <Check size={15} style={{ color: '#E8B84B', flexShrink: 0, marginTop: 2 }} />{f}
                        </li>
                      ))}
                    </ul>
                    <a href="/auth/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px', borderRadius: 12, fontWeight: 700, fontSize: 14, background: '#E8B84B', color: '#1A1A2E', textDecoration: 'none', border: 'none' }}>
                      Start vandaag
                    </a>
                  </div>
                ) : (
                  <div className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1A1A2E', marginBottom: 6 }}>{plan.name}</h3>
                      <p style={{ fontSize: 13, color: '#4A5568', lineHeight: 1.6 }}>{plan.desc}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span className="font-display" style={{ fontSize: 40, color: '#1A1A2E' }}>{plan.price}</span>
                      <span style={{ color: '#94A3B8', fontSize: 14 }}>/ maand</span>
                    </div>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                      {plan.features.map(f => (
                        <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#4A5568' }}>
                          <Check size={15} style={{ color: '#1B4FD8', flexShrink: 0, marginTop: 2 }} />{f}
                        </li>
                      ))}
                    </ul>
                    <a href="/auth/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px', borderRadius: 12, fontWeight: 600, fontSize: 14, border: '1px solid #E5E2DB', color: '#1A1A2E', textDecoration: 'none' }}>
                      Start vandaag
                    </a>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={vp} variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, maxWidth: 900, margin: '48px auto 0' }} className="trust-grid">
            {[
              { emoji: '🔒', title: 'GDPR-compliant', desc: 'Jouw data blijft in Nederland. Volledig AVG-proof.' },
              { emoji: '⏱', title: 'Maandelijks opzegbaar', desc: 'Geen jaarcontract. Stop wanneer je wil.' },
              { emoji: '⚡', title: 'In 1 week actief', desc: 'Inwerkfase duurt maximaal 7 dagen.' },
            ].map(item => (
              <motion.div key={item.title} variants={fadeUp} className="card" style={{ padding: '20px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{item.emoji}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E', marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: '#4A5568', marginTop: 4 }}>{item.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FAQSection />

      {/* ── FINAL CTA ── */}
      <section style={{ padding: '112px 24px', background: '#0F172A', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse at center, rgba(27,79,216,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <motion.div initial="hidden" whileInView="show" viewport={vp} variants={fadeUp} style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(30px,4.5vw,58px)', color: '#fff', fontWeight: 400, lineHeight: 1.12, marginBottom: 20 }}>Klaar om nooit meer een klant te missen?</h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 44 }}>Start vandaag. In één week actief. Maandelijks opzegbaar.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            <a href="/auth/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#E8B84B', color: '#1A1A2E', fontWeight: 700, fontSize: 15, padding: '14px 32px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 4px 20px rgba(232,184,75,0.35)' }}>
              Start gratis vandaag <ArrowRight size={16} />
            </a>
            <a href="mailto:team@deltaagents.nl" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#fff', fontWeight: 600, fontSize: 15, padding: '14px 32px', borderRadius: 12, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>
              Neem contact op
            </a>
          </div>
          <p style={{ marginTop: 32, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Geen creditcard nodig · GDPR-compliant · Nederlands support</p>
        </motion.div>
      </section>

      <Footer />

      <style>{`
        @keyframes float-3d {
          0%,100% { transform: translateY(0) rotate3d(1,.5,0,2deg); }
          50% { transform: translateY(-12px) rotate3d(1,.5,0,-2deg); }
        }
        @keyframes typing-pulse {
          0%,80%,100% { transform: scale(1); opacity: 0.5; }
          40% { transform: scale(1.4); opacity: 1; }
        }
        @keyframes msg-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes arrowPulse {
          0%,100% { opacity: .35; transform: translateX(0); }
          50% { opacity: .9; transform: translateX(5px); }
        }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
          .hero-grid > *:last-child { display: none !important; }
          .features-grid { grid-template-columns: repeat(2,1fr) !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .steps-grid > *:nth-child(even) { display: none !important; }
          .tabs-grid { grid-template-columns: 1fr !important; }
          .demo-grid { grid-template-columns: 1fr !important; }
          .test-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .pricing-grid > * { margin-top: 0 !important; }
          .trust-grid { grid-template-columns: 1fr !important; }
          .roi-grid { grid-template-columns: repeat(2,1fr) !important; }
          section { padding-left: 20px !important; padding-right: 20px !important; }
        }
        @media (max-width: 640px) {
          .hero-grid { padding-top: 48px !important; padding-bottom: 48px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .roi-grid { grid-template-columns: 1fr !important; }
          .roi-grid > div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.12); }
          section { padding-top: 64px !important; padding-bottom: 64px !important; }
        }
      `}</style>
    </main>
  )
}

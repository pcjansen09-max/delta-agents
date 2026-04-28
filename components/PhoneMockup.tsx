'use client'
import { useEffect, useRef, useState } from 'react'

interface Message {
  side: 'owner' | 'worker' | 'typing'
  text?: string
  time?: string
}

interface Scenario {
  av: string
  name: string
  badge: string
  messages: Message[]
}

export const SCENARIOS: Scenario[] = [
  {
    av: 'JH', name: 'Jansen Hoveniers', badge: 'Factuur verstuurd in 9 sec',
    messages: [
      { side: 'owner', text: 'Klus afgerond bij familie Bakker. 3u heg knippen + 1u borders. Maak factuur.' },
      { side: 'typing' },
      { side: 'worker', text: 'Begrepen! Factuur €180 excl. BTW\n(3u × €45 + 1u × €45)\nStuur ik naar s.bakker@gmail.com?', time: '14:32' },
      { side: 'owner', text: 'Ja. Sla ook op in Moneybird.' },
      { side: 'typing' },
      { side: 'worker', text: 'Factuur #2024-089 verstuurd ✓\nOpgeslagen in Moneybird ✓\nBedrag: €217,80 incl. BTW', time: '14:32' },
    ],
  },
  {
    av: 'VB', name: 'Van Berg Installaties', badge: 'Offerte klaar in 45 sec',
    messages: [
      { side: 'owner', text: 'Kees Smit wil offerte voor badkamer. 2 dagen werk, materiaal €800.' },
      { side: 'typing' },
      { side: 'worker', text: 'Offerte:\n• Arbeid 2 dagen: €700\n• Materiaal: €800\n• Totaal: €1.500 excl. BTW\nNaar k.smit@hotmail.com?', time: '09:14' },
      { side: 'owner', text: 'Ja. Geef 5% korting, vaste klant.' },
      { side: 'typing' },
      { side: 'worker', text: 'Korting €75 toegepast.\nNieuw totaal: €1.425\nVerstuurd naar Kees Smit ✓', time: '09:15' },
    ],
  },
  {
    av: 'BM', name: 'Bakker Makelaardij', badge: 'Afspraak ingepland in 12 sec',
    messages: [
      { side: 'owner', text: 'Mevr. De Vries wil bezichtiging Kerkstraat 14. Wanneer heb ik ruimte?' },
      { side: 'typing' },
      { side: 'worker', text: 'Je hebt ruimte:\n• Dinsdag 15:00–16:00\n• Donderdag 10:00–11:00\nWelke stuur ik door?', time: '11:22' },
      { side: 'owner', text: 'Dinsdag. Met bevestiging en parkeerinfo.' },
      { side: 'typing' },
      { side: 'worker', text: 'Afspraak di 15:00 ingepland ✓\nBevestiging met adres en parkeerinfo verstuurd ✓', time: '11:22' },
    ],
  },
  {
    av: 'RK', name: 'Roozen Kapperszaak', badge: '8 herinneringen verstuurd',
    messages: [
      { side: 'owner', text: 'Stuur herinneringen naar klanten die 6+ weken niet zijn geweest.' },
      { side: 'typing' },
      { side: 'worker', text: '8 klanten gevonden.\nStuur ik WhatsApp met jouw naam?', time: '10:05' },
      { side: 'owner', text: 'Ja doe maar.' },
      { side: 'typing' },
      { side: 'worker', text: '8 herinneringen verstuurd ✓\nAl 3 nieuwe afspraken binnen.\nZet ik ze in je agenda?', time: '10:06' },
    ],
  },
  {
    av: 'DT', name: 'De Tuin Totaalservice', badge: 'Betaling opgevolgd automatisch',
    messages: [
      { side: 'owner', text: 'Factuur Hendriks staat 14 dagen open. Stuur herinnering.' },
      { side: 'typing' },
      { side: 'worker', text: 'Vriendelijke betalingsherinnering naar h.hendriks@gmail.com.\nZelfde toon als jij?', time: '16:20' },
      { side: 'owner', text: 'Ja precies zo.' },
      { side: 'typing' },
      { side: 'worker', text: 'Herinnering verstuurd ✓\nBij geen reactie in 3 dagen stuur ik automatisch een 2e.', time: '16:21' },
    ],
  },
]

interface Props {
  float?: boolean
  scenarioIndex?: number
  onScenarioEnd?: (next: number) => void
}

export default function PhoneMockup({ float = true, scenarioIndex = 0, onScenarioEnd }: Props) {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([])
  const chatRef = useRef<HTMLDivElement>(null)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const activeIdx = useRef(scenarioIndex)

  function clearTimeouts() {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }

  function playScenario(idx: number) {
    activeIdx.current = idx
    const s = SCENARIOS[idx]
    setVisibleMessages([])
    clearTimeouts()
    let delay = 400

    s.messages.forEach((msg) => {
      if (msg.side === 'typing') {
        const t1 = setTimeout(() => {
          setVisibleMessages(prev => [...prev, { side: 'typing' }])
        }, delay)
        timeoutsRef.current.push(t1)
        delay += 1400
        const t2 = setTimeout(() => {
          setVisibleMessages(prev => prev.slice(0, -1))
        }, delay - 100)
        timeoutsRef.current.push(t2)
      } else {
        const t = setTimeout(() => {
          setVisibleMessages(prev => [...prev, msg])
          setTimeout(() => {
            if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
          }, 50)
        }, delay)
        timeoutsRef.current.push(t)
        delay += 700
      }
    })

    const loop = setTimeout(() => {
      const next = (idx + 1) % SCENARIOS.length
      onScenarioEnd?.(next)
      playScenario(next)
    }, delay + 3500)
    timeoutsRef.current.push(loop)
  }

  useEffect(() => {
    playScenario(scenarioIndex)
    return clearTimeouts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioIndex])

  const s = SCENARIOS[activeIdx.current]

  return (
    <div style={{ position: 'relative' }}>
      {/* Badge */}
      <div style={{
        position: 'absolute', top: 64, right: -20, zIndex: 20,
        background: '#fff', borderRadius: 100, padding: '8px 14px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 11, fontWeight: 700, color: '#1A1A2E',
        whiteSpace: 'nowrap',
      }}>
        <div className="pulse-dot" style={{ width: 8, height: 8, background: '#22C55E', borderRadius: '50%', flexShrink: 0 }} />
        ⚡ Leert van jou via WhatsApp
      </div>

      {/* Phone shell */}
      <div style={{
        width: 272, height: 544,
        background: 'linear-gradient(145deg, #2D2D2D, #141414)',
        borderRadius: 50, position: 'relative', overflow: 'hidden',
        border: '1.5px solid rgba(255,255,255,0.1)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 32px 64px rgba(0,0,0,0.22), 0 12px 28px rgba(27,79,216,0.12)',
        ...(float ? { animation: 'float-3d 6s ease-in-out infinite' } : {}),
      }}>
        {/* Dynamic Island */}
        <div style={{
          position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
          width: 110, height: 28, background: '#000', borderRadius: 20, zIndex: 10,
        }} />

        {/* Screen */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: 49, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* WhatsApp header */}
          <div style={{ background: '#1A8A5A', padding: '40px 10px 10px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>DW</div>
            <div>
              <div style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>Mijn Digitale Werknemer</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9 }}>Aan het werk voor jou ✓</div>
            </div>
          </div>

          {/* Chat */}
          <div ref={chatRef} style={{
            flex: 1, background: '#E5DDD5', padding: '8px', overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: 5,
          }}>
            {visibleMessages.map((msg, i) => {
              if (msg.side === 'typing') return (
                <div key={i} style={{
                  background: '#fff', borderRadius: '14px 14px 14px 3px',
                  alignSelf: 'flex-start', padding: '8px 12px',
                  display: 'flex', gap: 3, alignItems: 'center',
                }}>
                  {[0, 1, 2].map(d => (
                    <div key={d} style={{
                      width: 5, height: 5, background: '#bbb', borderRadius: '50%',
                      animation: `typing-pulse 1.2s ease-in-out ${d * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              )
              return (
                <div key={i} className="msg-in" style={{
                  maxWidth: '84%',
                  alignSelf: msg.side === 'owner' ? 'flex-start' : 'flex-end',
                  background: msg.side === 'owner' ? '#fff' : '#DCF8C6',
                  borderRadius: msg.side === 'owner' ? '14px 14px 14px 3px' : '14px 14px 3px 14px',
                  padding: '6px 9px',
                  fontSize: 10, color: '#1A1A2E', lineHeight: 1.45,
                }}>
                  {msg.text?.split('\n').map((line, li, arr) => (
                    <span key={li}>{line}{li < arr.length - 1 && <br />}</span>
                  ))}
                  {msg.time && (
                    <div style={{ fontSize: 8, color: '#999', textAlign: 'right', marginTop: 2 }}>
                      {msg.time} {msg.side === 'worker' && <span style={{ color: '#53BDEB' }}>✓✓</span>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Input bar */}
          <div style={{ background: '#F0F0F0', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <div style={{ flex: 1, background: '#fff', borderRadius: 18, padding: '5px 10px', fontSize: 10, color: '#aaa' }}>
              Typ een bericht...
            </div>
            <div style={{ width: 26, height: 26, background: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
                <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

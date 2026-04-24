'use client'
import AppLogo from './AppLogo'
import Link from 'next/link'

const INNER = ['whatsapp', 'gmail', 'calendar', 'moneybird', 'exact']
const OUTER = ['slack', 'outlook', 'zapier', 'stripe', 'mollie', 'hubspot', 'shopify', 'drive']

function OrbitRing({ apps, radius, duration, reverse }: {
  apps: string[]; radius: number; duration: number; reverse: boolean
}) {
  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      width: 0, height: 0,
      animation: `${reverse ? 'orbit-ccw' : 'orbit-cw'} ${duration}s linear infinite`,
    }}>
      {apps.map((app, i) => {
        const angle = (i / apps.length) * 360
        const rad = (angle * Math.PI) / 180
        const x = Math.cos(rad) * radius
        const y = Math.sin(rad) * radius
        return (
          <div
            key={app}
            style={{
              position: 'absolute',
              transform: `translate(${x - 26}px, ${y - 26}px)`,
              animation: `${reverse ? 'orbit-cw' : 'orbit-ccw'} ${duration}s linear infinite`,
            }}
          >
            <div
              style={{ position: 'relative', transition: 'transform 0.2s var(--spring)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.18)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
            >
              <AppLogo app={app} size={52} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function IntegrationsOrbit() {
  return (
    <section id="integraties" style={{ background: '#F7F5F0', padding: '80px 48px', textAlign: 'center' }}>
      <div style={{ display: 'inline-block', background: '#EEF2FF', color: '#1B4FD8', borderRadius: 100, padding: '4px 14px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>
        Koppelingen
      </div>
      <h2 className="font-display" style={{ fontSize: 'clamp(28px,3.5vw,44px)', color: '#1A1A2E', fontWeight: 400, lineHeight: 1.1, marginBottom: 10 }}>
        Koppelt aan alle apps die je al gebruikt
      </h2>
      <p style={{ fontSize: 16, color: '#4A5568', maxWidth: 500, margin: '0 auto 52px', lineHeight: 1.65 }}>
        Plug & play — geen technische kennis nodig.
      </p>

      <div style={{ position: 'relative', width: 500, height: 500, margin: '0 auto 36px' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <circle cx="250" cy="250" r="148" fill="none" stroke="rgba(27,79,216,0.08)" strokeWidth="1" strokeDasharray="4 6"/>
          <circle cx="250" cy="250" r="238" fill="none" stroke="rgba(27,79,216,0.06)" strokeWidth="1" strokeDasharray="4 6"/>
        </svg>

        {/* Center hub */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 68, height: 68, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1B4FD8, #3B6FFF)',
          boxShadow: '0 8px 32px rgba(27,79,216,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
        }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M13 3L4 14h7l-2 9 13-14h-8L13 3z"/>
          </svg>
        </div>

        <OrbitRing apps={INNER} radius={148} duration={28} reverse={false} />
        <OrbitRing apps={OUTER} radius={238} duration={44} reverse={true} />
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <div style={{ background: '#fff', border: '1px solid #E5E2DB', borderRadius: 100, padding: '8px 20px', fontSize: 13, fontWeight: 600, color: '#1A1A2E' }}>
          55+ integraties beschikbaar
        </div>
        <Link href="/integraties" style={{ fontSize: 14, color: '#1B4FD8', fontWeight: 600, textDecoration: 'none' }}>
          Bekijk alle integraties →
        </Link>
      </div>
    </section>
  )
}

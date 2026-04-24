'use client'
import Link from 'next/link'

const INNER = [
  { slug: 'whatsapp',       brand: '#25D366', label: 'W',  letter: false },
  { slug: 'gmail',          brand: '#EA4335', label: 'G',  letter: false },
  { slug: 'googlecalendar', brand: '#4285F4', label: 'C',  letter: false },
  { slug: null,             brand: '#1AB5C1', label: 'MB', letter: true  },
  { slug: null,             brand: '#ED7D31', label: 'EX', letter: true  },
]
const OUTER = [
  { slug: null,             brand: '#6264A7', label: 'T',  letter: true  },
  { slug: 'googledrive',    brand: '#4285F4', label: 'D',  letter: false },
  { slug: 'zapier',         brand: '#FF4A00', label: 'Z',  letter: false },
  { slug: 'stripe',         brand: '#635BFF', label: 'St', letter: false },
  { slug: null,             brand: '#2D2D2D', label: 'Mo', letter: true  },
  { slug: null,             brand: '#0057A8', label: 'SS', letter: true  },
  { slug: 'slack',          brand: '#4A154B', label: 'S',  letter: false },
  { slug: null,             brand: '#FF5500', label: 'TL', letter: true  },
]

function OrbApp({ app, size = 52 }: { app: typeof INNER[0]; size?: number }) {
  const r = size / 2
  if (!app.letter && app.slug) {
    const iconUrl = `https://cdn.jsdelivr.net/npm/simple-icons@12/icons/${app.slug}.svg`
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%', background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.25s var(--spring)', cursor: 'default',
      }}>
        <div style={{
          width: size * 0.5, height: size * 0.5,
          backgroundColor: app.brand,
          WebkitMask: `url('${iconUrl}') center/contain no-repeat`,
          mask: `url('${iconUrl}') center/contain no-repeat`,
        }} />
      </div>
    )
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: app.brand,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'default',
    }}>
      <span style={{ color: '#fff', fontWeight: 800, fontSize: size * 0.26, letterSpacing: '-0.5px' }}>
        {app.label}
      </span>
    </div>
  )
}

function Ring({ apps, radius, duration, cw }: { apps: typeof INNER; radius: number; duration: number; cw: boolean }) {
  const diam = radius * 2
  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      width: diam, height: diam,
      marginLeft: -radius, marginTop: -radius,
      borderRadius: '50%',
      border: '1.5px dashed rgba(27,79,216,0.1)',
      animation: `orbit-${cw ? 'cw' : 'ccw'} ${duration}s linear infinite`,
    }}>
      {apps.map((app, i) => {
        const angle = (i / apps.length) * 2 * Math.PI - Math.PI / 2
        const x = radius + radius * Math.cos(angle) - 26
        const y = radius + radius * Math.sin(angle) - 26
        return (
          <div key={i} style={{
            position: 'absolute', left: x, top: y,
            width: 52, height: 52,
            animation: `orbit-${cw ? 'ccw' : 'cw'} ${duration}s linear infinite`,
          }}>
            <OrbApp app={app} />
          </div>
        )
      })}
    </div>
  )
}

export default function IntegrationsOrbit() {
  return (
    <section id="integraties" style={{ background: 'var(--bg-grey)', padding: '120px 0' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: 0 }}>
          <div className="sec-label blue">Koppelingen</div>
          <h2 className="font-display" style={{ fontSize: 'clamp(32px,4vw,48px)', color: 'var(--t1)', fontWeight: 400, lineHeight: 1.15, marginBottom: 16 }}>
            Koppelt aan alle apps die je al gebruikt
          </h2>
          <p style={{ fontSize: 17, color: 'var(--t2)', lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
            Plug &amp; play — geen technische kennis nodig.
          </p>
        </div>

        <div style={{ position: 'relative', width: 480, height: 480, margin: '64px auto 40px' }}>
          {/* Center hub */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 68, height: 68, borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 8px 32px rgba(27,79,216,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #1B4FD8, #3B6FFF)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg viewBox="0 0 24 24" fill="white" style={{ width: 22, height: 22 }}>
                <path d="M13 2L4.5 13.5H10.5L8.5 22L20 10H14L13 2Z"/>
              </svg>
            </div>
          </div>

          <Ring apps={INNER} radius={140} duration={25} cw={true} />
          <Ring apps={OUTER} radius={230} duration={40} cw={false} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-block', background: '#fff',
            border: '1px solid var(--border)', borderRadius: 100,
            padding: '8px 20px', fontSize: 14, fontWeight: 600, color: 'var(--t1)', marginBottom: 12,
          }}>
            55+ integraties beschikbaar
          </div>
          <p style={{ fontSize: 14, color: 'var(--t2)' }}>
            Niet jouw app erbij?{' '}
            <Link href="/integraties" style={{ color: 'var(--blue)', fontWeight: 500 }}>
              Bekijk alle integraties →
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

'use client'

interface Props { white?: boolean; size?: 'sm' | 'md' | 'lg' }

export default function Logo({ white = false, size = 'md' }: Props) {
  const s = size === 'sm' ? 28 : size === 'lg' ? 44 : 36
  return (
    <div className="flex items-center gap-2.5">
      <div style={{
        width: s, height: s,
        borderRadius: s * 0.28,
        background: 'linear-gradient(135deg, #1B4FD8, #3B6FFF)',
        boxShadow: '0 4px 12px rgba(27,79,216,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width={s * 0.5} height={s * 0.5} viewBox="0 0 24 24" fill="white">
          <path d="M13 3L4 14h7l-2 9 13-14h-8L13 3z"/>
        </svg>
      </div>
      <span style={{
        fontFamily: 'var(--font-body), DM Sans, sans-serif',
        fontSize: size === 'sm' ? 16 : size === 'lg' ? 24 : 20,
        fontWeight: 700,
        letterSpacing: '-0.02em',
      }}>
        <span style={{ color: white ? '#fff' : '#1A1A2E' }}>Delta</span>
        <span style={{ color: white ? '#93C5FD' : '#1B4FD8' }}>Agents</span>
      </span>
    </div>
  )
}

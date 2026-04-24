'use client'
import { useState } from 'react'

const APPS: Record<string, { slug: string; color: string; label: string }> = {
  whatsapp:  { slug: 'whatsapp',         color: '25D366', label: 'WhatsApp' },
  gmail:     { slug: 'gmail',            color: 'EA4335', label: 'Gmail' },
  calendar:  { slug: 'googlecalendar',   color: '4285F4', label: 'Google Calendar' },
  outlook:   { slug: 'microsoftoutlook', color: '0078D4', label: 'Outlook' },
  moneybird: { slug: 'moneybird',        color: '1AB5C1', label: 'Moneybird' },
  exact:     { slug: 'exact',            color: 'ED7D31', label: 'Exact' },
  slack:     { slug: 'slack',            color: '4A154B', label: 'Slack' },
  zapier:    { slug: 'zapier',           color: 'FF4A00', label: 'Zapier' },
  stripe:    { slug: 'stripe',           color: '635BFF', label: 'Stripe' },
  mollie:    { slug: 'mollie',           color: '000000', label: 'Mollie' },
  hubspot:   { slug: 'hubspot',          color: 'FF7A59', label: 'HubSpot' },
  shopify:   { slug: 'shopify',          color: '96BF48', label: 'Shopify' },
  drive:     { slug: 'googledrive',      color: '4285F4', label: 'Google Drive' },
  notion:    { slug: 'notion',           color: '000000', label: 'Notion' },
}

export default function AppLogo({ app, size = 48 }: { app: string; size?: number }) {
  const [err, setErr] = useState(false)
  const cfg = APPS[app]
  if (!cfg) return null
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: err ? `#${cfg.color}` : '#fff',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, transition: 'transform 0.2s var(--spring)',
    }}>
      {!err ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={`https://cdn.simpleicons.org/${cfg.slug}/${cfg.color}`}
          alt={cfg.label}
          width={size * 0.55}
          height={size * 0.55}
          onError={() => setErr(true)}
          style={{ objectFit: 'contain' }}
        />
      ) : (
        <span style={{
          color: '#fff', fontWeight: 700,
          fontSize: size * 0.38,
          fontFamily: 'var(--font-body), DM Sans, sans-serif',
        }}>
          {cfg.label[0]}
        </span>
      )}
    </div>
  )
}

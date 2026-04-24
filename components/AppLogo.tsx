'use client'
import { useState } from 'react'

const APPS: Record<string, { slug: string | null; brand: string; label: string }> = {
  whatsapp:     { slug: 'whatsapp',          brand: '#25D366', label: 'W'  },
  gmail:        { slug: 'gmail',             brand: '#EA4335', label: 'G'  },
  calendar:     { slug: 'googlecalendar',    brand: '#4285F4', label: 'C'  },
  outlook:      { slug: null,                brand: '#0078D4', label: 'OL' },
  teams:        { slug: null,                brand: '#6264A7', label: 'T'  },
  moneybird:    { slug: null,                brand: '#1AB5C1', label: 'MB' },
  exact:        { slug: null,                brand: '#ED7D31', label: 'EX' },
  snelstart:    { slug: null,                brand: '#0057A8', label: 'SS' },
  afas:         { slug: null,                brand: '#0D2B52', label: 'AF' },
  twinfield:    { slug: null,                brand: '#003087', label: 'TW' },
  slack:        { slug: 'slack',             brand: '#4A154B', label: 'S'  },
  zapier:       { slug: 'zapier',            brand: '#FF4A00', label: 'Z'  },
  stripe:       { slug: 'stripe',            brand: '#635BFF', label: 'St' },
  mollie:       { slug: null,                brand: '#2D2D2D', label: 'Mo' },
  hubspot:      { slug: 'hubspot',           brand: '#FF7A59', label: 'H'  },
  shopify:      { slug: 'shopify',           brand: '#96BF48', label: 'Sh' },
  drive:        { slug: 'googledrive',       brand: '#4285F4', label: 'D'  },
  notion:       { slug: 'notion',            brand: '#000000', label: 'N'  },
  salesforce:   { slug: 'salesforce',        brand: '#00A1E0', label: 'SF' },
  pipedrive:    { slug: 'pipedrive',         brand: '#00B050', label: 'PD' },
  activecampaign: { slug: 'activecampaign', brand: '#004FD6', label: 'AC' },
  teamleader:   { slug: null,                brand: '#FF5500', label: 'TL' },
  woocommerce:  { slug: 'woocommerce',       brand: '#7F54B3', label: 'WC' },
  shopify2:     { slug: 'shopify',           brand: '#96BF48', label: 'Sh' },
  bol:          { slug: null,                brand: '#0000A4', label: 'bol'},
  paypal:       { slug: 'paypal',            brand: '#003087', label: 'PP' },
  klarna:       { slug: 'klarna',            brand: '#FFB3C7', label: 'K'  },
  ideal:        { slug: null,                brand: '#CC0066', label: 'iD' },
  dropbox:      { slug: 'dropbox',           brand: '#0061FF', label: 'DB' },
  trello:       { slug: 'trello',            brand: '#0052CC', label: 'Tr' },
  asana:        { slug: 'asana',             brand: '#F06A6A', label: 'As' },
  sheets:       { slug: 'googlesheets',      brand: '#34A853', label: 'GS' },
  calendly:     { slug: 'calendly',          brand: '#006BFF', label: 'Ca' },
  make:         { slug: null,                brand: '#6D00CC', label: 'Mk' },
  twilio:       { slug: 'twilio',            brand: '#F22F46', label: 'Tw' },
  typeform:     { slug: 'typeform',          brand: '#262627', label: 'Tf' },
  telegram:     { slug: 'telegram',          brand: '#26A5E4', label: 'Tg' },
  monday:       { slug: 'monday',            brand: '#FF3D57', label: 'Mo' },
  etsy:         { slug: 'etsy',              brand: '#F56400', label: 'Et' },
  wix:          { slug: 'wix',              brand: '#0C6EFC', label: 'Wx' },
}

export default function AppLogo({ app, size = 48 }: { app: string; size?: number }) {
  const [err, setErr] = useState(false)
  const cfg = APPS[app]
  if (!cfg) return null

  const r = size * 0.28
  const iconSize = size * 0.54

  if (cfg.slug && !err) {
    const iconUrl = `https://cdn.jsdelivr.net/npm/simple-icons@12/icons/${cfg.slug}.svg`
    return (
      <div style={{
        width: size, height: size, borderRadius: r,
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <div
          style={{
            width: iconSize, height: iconSize,
            backgroundColor: cfg.brand,
            WebkitMask: `url('${iconUrl}') center/contain no-repeat`,
            mask: `url('${iconUrl}') center/contain no-repeat`,
          }}
          /* eslint-disable-next-line @next/next/no-img-element */
          onError={() => setErr(true)}
        />
      </div>
    )
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: r,
      background: cfg.brand,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{
        color: '#fff', fontWeight: 800,
        fontSize: size * 0.3,
        letterSpacing: '-0.5px',
        fontFamily: 'var(--font-body), DM Sans, sans-serif',
      }}>
        {cfg.label}
      </span>
    </div>
  )
}

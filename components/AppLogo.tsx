'use client'
import { useState } from 'react'

const APPS: Record<string, { slug: string | null; domain: string | null; brand: string; label: string }> = {
  whatsapp:       { slug: 'whatsapp',          domain: null,                   brand: '#25D366', label: 'WA' },
  gmail:          { slug: 'gmail',             domain: null,                   brand: '#EA4335', label: 'G'  },
  calendar:       { slug: 'googlecalendar',    domain: null,                   brand: '#4285F4', label: 'Cal'},
  outlook:        { slug: 'microsoftoutlook',  domain: null,                   brand: '#0078D4', label: 'OL' },
  teams:          { slug: 'microsoftteams',    domain: null,                   brand: '#6264A7', label: 'T'  },
  moneybird:      { slug: null,                domain: 'moneybird.nl',         brand: '#1AB5C1', label: 'MB' },
  exact:          { slug: null,                domain: 'exact.com',            brand: '#ED7D31', label: 'EX' },
  snelstart:      { slug: null,                domain: 'snelstart.nl',         brand: '#0057A8', label: 'SS' },
  afas:           { slug: null,                domain: 'afas.nl',              brand: '#0D2B52', label: 'AF' },
  twinfield:      { slug: null,                domain: 'twinfield.nl',         brand: '#003087', label: 'TW' },
  slack:          { slug: 'slack',             domain: null,                   brand: '#4A154B', label: 'S'  },
  zapier:         { slug: 'zapier',            domain: null,                   brand: '#FF4F00', label: 'Z'  },
  stripe:         { slug: 'stripe',            domain: null,                   brand: '#008CDD', label: 'St' },
  mollie:         { slug: null,                domain: 'mollie.com',           brand: '#2D2D2D', label: 'Mo' },
  hubspot:        { slug: 'hubspot',           domain: null,                   brand: '#FF7A59', label: 'H'  },
  shopify:        { slug: 'shopify',           domain: null,                   brand: '#7AB55C', label: 'Sh' },
  drive:          { slug: 'googledrive',       domain: null,                   brand: '#4285F4', label: 'D'  },
  notion:         { slug: 'notion',            domain: null,                   brand: '#000000', label: 'N'  },
  salesforce:     { slug: 'salesforce',        domain: null,                   brand: '#00A1E0', label: 'SF' },
  pipedrive:      { slug: null,                domain: 'pipedrive.com',        brand: '#00B050', label: 'PD' },
  activecampaign: { slug: null,                domain: 'activecampaign.com',   brand: '#004FD6', label: 'AC' },
  teamleader:     { slug: null,                domain: 'teamleader.eu',        brand: '#FF5500', label: 'TL' },
  woocommerce:    { slug: 'woocommerce',       domain: null,                   brand: '#96588A', label: 'WC' },
  paypal:         { slug: 'paypal',            domain: null,                   brand: '#003087', label: 'PP' },
  klarna:         { slug: 'klarna',            domain: null,                   brand: '#FFB3C7', label: 'K'  },
  ideal:          { slug: null,                domain: 'ideal.nl',             brand: '#CC0066', label: 'iD' },
  dropbox:        { slug: 'dropbox',           domain: null,                   brand: '#0061FF', label: 'DB' },
  trello:         { slug: 'trello',            domain: null,                   brand: '#0052CC', label: 'Tr' },
  asana:          { slug: 'asana',             domain: null,                   brand: '#F06A6A', label: 'As' },
  sheets:         { slug: 'googlesheets',      domain: null,                   brand: '#34A853', label: 'GS' },
  calendly:       { slug: 'calendly',          domain: null,                   brand: '#006BFF', label: 'Ca' },
  make:           { slug: 'make',              domain: null,                   brand: '#6D00CC', label: 'Mk' },
  twilio:         { slug: 'twilio',            domain: null,                   brand: '#F22F46', label: 'Tw' },
  typeform:       { slug: 'typeform',          domain: null,                   brand: '#262627', label: 'Tf' },
  telegram:       { slug: 'telegram',          domain: null,                   brand: '#26A5E4', label: 'Tg' },
  monday:         { slug: null,                domain: 'monday.com',           brand: '#FF3D57', label: 'Mo' },
  etsy:           { slug: 'etsy',              domain: null,                   brand: '#F16521', label: 'Et' },
  wix:            { slug: 'wix',              domain: null,                    brand: '#0C6EFC', label: 'Wx' },
  zoho:           { slug: 'zoho',              domain: null,                   brand: '#E42527', label: 'ZO' },
  freshdesk:      { slug: null,                domain: 'freshdesk.com',        brand: '#0AB5B1', label: 'FD' },
  quickbooks:     { slug: 'quickbooks',        domain: null,                   brand: '#2CA01C', label: 'QB' },
  magento:        { slug: 'magento',           domain: null,                   brand: '#EE672F', label: 'MG' },
  messenger:      { slug: 'messenger',         domain: null,                   brand: '#00B2FF', label: 'FM' },
  excel:          { slug: 'microsoftexcel',    domain: null,                   brand: '#217346', label: 'XL' },
  bol:            { slug: null,                domain: 'bol.com',              brand: '#0000A4', label: 'bol'},
}

function faviconUrl(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
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
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <div style={{
          width: iconSize, height: iconSize,
          backgroundColor: cfg.brand,
          WebkitMask: `url('${iconUrl}') center/contain no-repeat`,
          mask: `url('${iconUrl}') center/contain no-repeat`,
        }} />
      </div>
    )
  }

  if (cfg.domain && !err) {
    return (
      <div style={{
        width: size, height: size, borderRadius: r,
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        overflow: 'hidden',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={faviconUrl(cfg.domain)}
          alt={app}
          width={iconSize}
          height={iconSize}
          style={{ objectFit: 'contain' }}
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
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
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

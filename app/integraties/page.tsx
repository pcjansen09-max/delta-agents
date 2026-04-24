'use client'
import { useState, useMemo } from 'react'
import AppLogo from '@/components/AppLogo'
import Link from 'next/link'

const INTEGRATIONS = [
  { id: 'whatsapp', label: 'WhatsApp', category: 'Communicatie', available: true },
  { id: 'gmail', label: 'Gmail', category: 'Communicatie', available: true },
  { id: 'outlook', label: 'Outlook', category: 'Communicatie', available: true },
  { id: 'slack', label: 'Slack', category: 'Communicatie', available: true },
  { id: 'calendar', label: 'Google Calendar', category: 'Agenda', available: true },
  { id: 'moneybird', label: 'Moneybird', category: 'Boekhouding', available: true },
  { id: 'exact', label: 'Exact Online', category: 'Boekhouding', available: true },
  { id: 'twinfield', label: 'Twinfield', category: 'Boekhouding', available: false },
  { id: 'mollie', label: 'Mollie', category: 'Betalen', available: true },
  { id: 'stripe', label: 'Stripe', category: 'Betalen', available: true },
  { id: 'paypal', label: 'PayPal', category: 'Betalen', available: false },
  { id: 'hubspot', label: 'HubSpot', category: 'CRM', available: true },
  { id: 'salesforce', label: 'Salesforce', category: 'CRM', available: false },
  { id: 'shopify', label: 'Shopify', category: 'E-commerce', available: true },
  { id: 'woocommerce', label: 'WooCommerce', category: 'E-commerce', available: false },
  { id: 'zapier', label: 'Zapier', category: 'Overig', available: true },
  { id: 'drive', label: 'Google Drive', category: 'Overig', available: true },
  { id: 'notion', label: 'Notion', category: 'Overig', available: true },
  { id: 'dropbox', label: 'Dropbox', category: 'Overig', available: false },
]

const CATEGORIES = ['Alle', 'Communicatie', 'Agenda', 'Boekhouding', 'Betalen', 'CRM', 'E-commerce', 'Overig']

type Integration = typeof INTEGRATIONS[0]

function IntegrationCard({ item }: { item: Integration }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff', border: '1px solid #E5E2DB', borderRadius: 14,
        padding: '24px 20px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 12, cursor: 'default',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
        transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease',
      }}
    >
      <AppLogo app={item.id} size={64} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A2E', marginBottom: 6 }}>{item.label}</div>
        <div style={{
          display: 'inline-block',
          background: item.available ? '#DCFCE7' : '#F3F4F6',
          color: item.available ? '#16A34A' : '#6B7280',
          borderRadius: 100, padding: '2px 10px', fontSize: 11, fontWeight: 600,
        }}>
          {item.available ? 'Beschikbaar' : 'Binnenkort'}
        </div>
      </div>
      <div style={{ fontSize: 11, color: '#9CA3AF' }}>{item.category}</div>
    </div>
  )
}

export default function IntegratiePage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Alle')

  const filtered = useMemo(() => INTEGRATIONS.filter(item => {
    const matchSearch = item.label.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'Alle' || item.category === activeCategory
    return matchSearch && matchCat
  }), [search, activeCategory])

  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E2DB', padding: '80px 24px 48px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: '#EEF2FF', color: '#1B4FD8', borderRadius: 100, padding: '4px 14px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 20 }}>
            Koppelingen
          </div>
          <h1 className='font-display' style={{ fontSize: 'clamp(32px,5vw,56px)', color: '#1A1A2E', fontWeight: 400, lineHeight: 1.1, marginBottom: 16 }}>
            Alle integraties
          </h1>
          <p style={{ fontSize: 18, color: '#4A5568', lineHeight: 1.6, maxWidth: 520, margin: '0 auto 40px' }}>
            Plug &amp; play koppelingen met de tools die jij al gebruikt.
          </p>
          <div style={{ position: 'relative', maxWidth: 480, margin: '0 auto' }}>
            <svg style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#9CA3AF' strokeWidth='2'>
              <circle cx='11' cy='11' r='8'/><path d='m21 21-4.35-4.35'/>
            </svg>
            <input type='text' placeholder='Zoek integratie...' value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '14px 16px 14px 48px', border: '1.5px solid #E5E2DB', borderRadius: 12, fontSize: 15, background: '#fff', outline: 'none', boxSizing: 'border-box' as const }} />
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderBottom: '1px solid #E5E2DB', overflowX: 'auto' as const }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 4 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: activeCategory === cat ? 700 : 500,
              color: activeCategory === cat ? '#1B4FD8' : '#4A5568',
              borderBottom: '2px solid ' + (activeCategory === cat ? '#1B4FD8' : 'transparent'),
              whiteSpace: 'nowrap' as const, transition: 'all 0.15s',
            }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#4A5568' }}>
            <p style={{ fontSize: 16 }}>Geen resultaten voor &quot;{search}&quot;</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {filtered.map((item, i) => <IntegrationCard key={item.id + item.category + i} item={item} />)}
          </div>
        )}

        <div style={{ marginTop: 72, textAlign: 'center', background: '#fff', border: '1px solid #E5E2DB', borderRadius: 16, padding: '40px 24px' }}>
          <p style={{ fontSize: 17, color: '#1A1A2E', fontWeight: 600, marginBottom: 8 }}>Mis je een integratie?</p>
          <p style={{ fontSize: 14, color: '#4A5568', marginBottom: 20 }}>We bouwen nieuwe koppelingen op aanvraag.</p>
          <Link href='/contact' style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#1A1A2E', color: '#fff', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            Stel integratie voor
          </Link>
        </div>
      </div>
    </div>
  )
}

'use client'
import { useState, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

type IntegApp = {
  name: string; cat: string; desc: string; status: 'available' | 'soon'
  slug?: string; domain?: string; brand: string; label: string
}

const INTEGRATIONS: IntegApp[] = [
  // Communicatie
  { name: 'WhatsApp Business', cat: 'communicatie', desc: 'Ontvang en beantwoord klantberichten via WhatsApp — altijd direct en persoonlijk.', slug: 'whatsapp', brand: '#25D366', label: 'WA', status: 'available' },
  { name: 'Gmail', cat: 'communicatie', desc: 'Verwerk e-mails automatisch: beantwoorden, archiveren en opvolgen.', slug: 'gmail', brand: '#EA4335', label: 'G', status: 'available' },
  { name: 'Microsoft Outlook', cat: 'communicatie', desc: 'Koppel je Outlook inbox voor automatische e-mailverwerking.', slug: 'microsoftoutlook', brand: '#0078D4', label: 'OL', status: 'available' },
  { name: 'Microsoft Teams', cat: 'communicatie', desc: 'Ontvang meldingen en geef instructies via Teams-berichten.', slug: 'microsoftteams', brand: '#6264A7', label: 'T', status: 'available' },
  { name: 'Slack', cat: 'communicatie', desc: 'Laat je werknemer rapportages en meldingen sturen in Slack.', slug: 'slack', brand: '#4A154B', label: 'S', status: 'available' },
  { name: 'SMS / Tekstbericht', cat: 'communicatie', desc: 'Stuur automatische sms-berichten voor bevestigingen en herinneringen.', brand: '#2563EB', label: 'SMS', status: 'available' },
  { name: 'Telegram', cat: 'communicatie', desc: 'Beheer klantcommunicatie via Telegram-kanalen.', slug: 'telegram', brand: '#26A5E4', label: 'Tg', status: 'soon' },
  { name: 'Facebook Messenger', cat: 'communicatie', desc: 'Beantwoord berichten van jouw Facebook-pagina automatisch.', slug: 'messenger', brand: '#00B2FF', label: 'FM', status: 'soon' },

  // Agenda
  { name: 'Google Calendar', cat: 'agenda', desc: 'Plan automatisch afspraken in op basis van jouw beschikbaarheid.', slug: 'googlecalendar', brand: '#4285F4', label: 'Cal', status: 'available' },
  { name: 'Outlook Calendar', cat: 'agenda', desc: 'Synchroniseer afspraken met je Microsoft agenda.', slug: 'microsoftoutlook', brand: '#0078D4', label: 'OC', status: 'available' },
  { name: 'Calendly', cat: 'agenda', desc: 'Laat klanten zelf een moment kiezen via Calendly-links.', slug: 'calendly', brand: '#006BFF', label: 'Ca', status: 'available' },
  { name: 'Acuity Scheduling', cat: 'agenda', desc: 'Koppel je Acuity agenda voor automatische boekingen.', domain: 'acuityscheduling.com', brand: '#1C3C5A', label: 'AS', status: 'available' },
  { name: 'SimplyBook.me', cat: 'agenda', desc: 'Populair bij kappers en beauty salons — volledig geïntegreerd.', domain: 'simplybook.me', brand: '#FF6B35', label: 'SB', status: 'soon' },
  { name: 'Booksy', cat: 'agenda', desc: 'Koppel je Booksy-agenda voor naadloze planning.', domain: 'booksy.com', brand: '#FF585B', label: 'BK', status: 'soon' },

  // Boekhouding
  { name: 'Moneybird', cat: 'boekhouding', desc: 'Maak facturen en offertes direct in Moneybird — de populairste keuze voor Nederlands MKB.', domain: 'moneybird.nl', brand: '#1AB5C1', label: 'MB', status: 'available' },
  { name: 'Exact Online', cat: 'boekhouding', desc: 'Synchroniseer facturen, debiteuren en projecten met Exact Online.', domain: 'exact.com', brand: '#ED7D31', label: 'EX', status: 'available' },
  { name: 'Snelstart', cat: 'boekhouding', desc: 'Verwerk administratie direct in Snelstart zonder handmatig invoeren.', domain: 'snelstart.nl', brand: '#0057A8', label: 'SS', status: 'available' },
  { name: 'AFAS', cat: 'boekhouding', desc: 'Koppel je AFAS-omgeving voor volledige automatisering van facturen.', domain: 'afas.nl', brand: '#0D2B52', label: 'AF', status: 'available' },
  { name: 'Twinfield', cat: 'boekhouding', desc: 'Stuur boekingen en facturen direct naar Twinfield.', domain: 'twinfield.nl', brand: '#003087', label: 'TW', status: 'available' },
  { name: 'Unit4', cat: 'boekhouding', desc: 'Integreer met Unit4 voor grotere MKB-bedrijven.', domain: 'unit4.com', brand: '#E31B23', label: 'U4', status: 'available' },
  { name: 'QuickBooks', cat: 'boekhouding', desc: 'Stuur facturen en betalingen door naar QuickBooks.', slug: 'quickbooks', brand: '#2CA01C', label: 'QB', status: 'soon' },
  { name: 'Boekhoudgemak', cat: 'boekhouding', desc: 'Verwerk facturen via Boekhoudgemak voor ZZP\'ers.', domain: 'boekhoudgemak.nl', brand: '#FF6600', label: 'BG', status: 'soon' },

  // Betalen
  { name: 'Mollie', cat: 'betalen', desc: 'Ontvang betalingen via iDEAL, creditcard en meer — de meest gebruikte betaaloplossing in Nederland.', domain: 'mollie.com', brand: '#2D2D2D', label: 'Mo', status: 'available' },
  { name: 'Stripe', cat: 'betalen', desc: 'Verwerk internationale betalingen en abonnementen via Stripe.', slug: 'stripe', brand: '#008CDD', label: 'St', status: 'available' },
  { name: 'iDEAL', cat: 'betalen', desc: 'Stuur directe iDEAL-betaallinks naar klanten via WhatsApp.', domain: 'ideal.nl', brand: '#CC0066', label: 'iD', status: 'available' },
  { name: 'Buckaroo', cat: 'betalen', desc: 'Verwerk betalingen via Buckaroo — populair bij Nederlandse webshops.', domain: 'buckaroo.eu', brand: '#00A3A1', label: 'BU', status: 'available' },
  { name: 'PayPal', cat: 'betalen', desc: 'Stuur PayPal-betaalverzoeken automatisch naar klanten.', slug: 'paypal', brand: '#003087', label: 'PP', status: 'soon' },
  { name: 'Klarna', cat: 'betalen', desc: 'Bied achteraf betalen aan via Klarna-integratie.', slug: 'klarna', brand: '#FFB3C7', label: 'K', status: 'soon' },
  { name: 'MultiSafepay', cat: 'betalen', desc: 'Nederlandse betaalprovider met alle gangbare betaalmethodes.', domain: 'multisafepay.com', brand: '#0F4C81', label: 'MS', status: 'soon' },

  // CRM
  { name: 'Teamleader', cat: 'crm', desc: 'Sync klantgegevens, offertes en projecten met Teamleader Focus.', domain: 'teamleader.eu', brand: '#FF5500', label: 'TL', status: 'available' },
  { name: 'HubSpot', cat: 'crm', desc: 'Log gesprekken en contacten automatisch in je HubSpot CRM.', slug: 'hubspot', brand: '#FF7A59', label: 'H', status: 'available' },
  { name: 'Salesforce', cat: 'crm', desc: 'Koppel je Salesforce-omgeving voor enterprise klantbeheer.', slug: 'salesforce', brand: '#00A1E0', label: 'SF', status: 'available' },
  { name: 'Pipedrive', cat: 'crm', desc: 'Update deals en contacten in Pipedrive automatisch na elk gesprek.', domain: 'pipedrive.com', brand: '#00B050', label: 'PD', status: 'available' },
  { name: 'ActiveCampaign', cat: 'crm', desc: 'Trigger marketing-automations in ActiveCampaign op basis van klantgesprekken.', domain: 'activecampaign.com', brand: '#004FD6', label: 'AC', status: 'available' },
  { name: 'Zoho CRM', cat: 'crm', desc: 'Synchroniseer contacten en deals met Zoho CRM.', slug: 'zoho', brand: '#E42527', label: 'ZO', status: 'soon' },
  { name: 'Freshdesk', cat: 'crm', desc: 'Maak automatisch tickets aan in Freshdesk bij klachten.', domain: 'freshdesk.com', brand: '#0AB5B1', label: 'FD', status: 'soon' },

  // E-commerce
  { name: 'Shopify', cat: 'ecommerce', desc: 'Beantwoord bestellingsvragen en verwerk retouren via je Shopify-winkel.', slug: 'shopify', brand: '#7AB55C', label: 'Sh', status: 'available' },
  { name: 'WooCommerce', cat: 'ecommerce', desc: 'Koppel je WordPress/WooCommerce webshop voor orderverwerking.', slug: 'woocommerce', brand: '#96588A', label: 'WC', status: 'available' },
  { name: 'Bol.com', cat: 'ecommerce', desc: 'Beheer jouw Bol.com verkopersaccount automatisch.', domain: 'bol.com', brand: '#0000A4', label: 'bol', status: 'available' },
  { name: 'Lightspeed', cat: 'ecommerce', desc: 'Integreer met Lightspeed POS voor retail en horeca.', domain: 'lightspeedhq.com', brand: '#FF4D00', label: 'LS', status: 'available' },
  { name: 'Magento', cat: 'ecommerce', desc: 'Verwerk orders en klantverzoeken via Magento.', slug: 'magento', brand: '#EE672F', label: 'MG', status: 'soon' },
  { name: 'Etsy', cat: 'ecommerce', desc: 'Automatiseer klantcommunicatie voor jouw Etsy-winkel.', slug: 'etsy', brand: '#F16521', label: 'Et', status: 'soon' },
  { name: 'Wix', cat: 'ecommerce', desc: 'Koppel je Wix-website en webshop voor leadverwerking.', slug: 'wix', brand: '#0C6EFC', label: 'Wx', status: 'soon' },

  // Overig
  { name: 'Zapier', cat: 'overig', desc: 'Koppel 5.000+ apps via Zapier-automations — onbeperkte mogelijkheden.', slug: 'zapier', brand: '#FF4F00', label: 'Z', status: 'available' },
  { name: 'Make (Integromat)', cat: 'overig', desc: 'Bouw complexe automations via Make-scenario\'s.', slug: 'make', brand: '#6D00CC', label: 'Mk', status: 'available' },
  { name: 'Google Drive', cat: 'overig', desc: 'Sla documenten, offertes en rapporten op in Google Drive.', slug: 'googledrive', brand: '#4285F4', label: 'GD', status: 'available' },
  { name: 'Dropbox', cat: 'overig', desc: 'Bewaar en deel bestanden automatisch via Dropbox.', slug: 'dropbox', brand: '#0061FF', label: 'DB', status: 'available' },
  { name: 'Notion', cat: 'overig', desc: 'Log taken en notities automatisch in je Notion workspace.', slug: 'notion', brand: '#000000', label: 'N', status: 'available' },
  { name: 'Trello', cat: 'overig', desc: 'Maak automatisch Trello-kaarten aan bij nieuwe opdrachten.', slug: 'trello', brand: '#0052CC', label: 'Tr', status: 'available' },
  { name: 'Asana', cat: 'overig', desc: 'Zet klantverzoeken direct om in Asana-taken.', slug: 'asana', brand: '#F06A6A', label: 'As', status: 'available' },
  { name: 'Google Sheets', cat: 'overig', desc: 'Exporteer rapportages en klantdata naar Google Sheets.', slug: 'googlesheets', brand: '#34A853', label: 'GS', status: 'available' },
  { name: 'Microsoft Excel', cat: 'overig', desc: 'Exporteer data automatisch naar Excel-bestanden.', slug: 'microsoftexcel', brand: '#217346', label: 'XL', status: 'available' },
  { name: 'Twilio', cat: 'overig', desc: 'Stuur SMS en voice-berichten via Twilio.', slug: 'twilio', brand: '#F22F46', label: 'Tw', status: 'available' },
  { name: 'Monday.com', cat: 'overig', desc: 'Update projectboards in Monday.com automatisch.', domain: 'monday.com', brand: '#FF3D57', label: 'Mo', status: 'soon' },
  { name: 'Typeform', cat: 'overig', desc: 'Verwerk Typeform-inzendingen automatisch als klantverzoeken.', slug: 'typeform', brand: '#262627', label: 'Tf', status: 'soon' },
]

const CATS = [
  { id: 'alle', label: 'Alle' },
  { id: 'communicatie', label: 'Communicatie' },
  { id: 'agenda', label: 'Agenda' },
  { id: 'boekhouding', label: 'Boekhouding' },
  { id: 'betalen', label: 'Betalen' },
  { id: 'crm', label: 'CRM' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'overig', label: 'Overig' },
]

const CAT_LABELS: Record<string, string> = {
  communicatie: 'Communicatie', agenda: 'Agenda', boekhouding: 'Boekhouding',
  betalen: 'Betalen', crm: 'CRM', ecommerce: 'E-commerce', overig: 'Overig',
}

function AppIcon({ app, size = 52 }: { app: IntegApp; size?: number }) {
  const [err, setErr] = useState(false)
  const r = 12

  if (app.slug && !err) {
    const iconUrl = `https://cdn.jsdelivr.net/npm/simple-icons@12/icons/${app.slug}.svg`
    return (
      <div style={{
        width: size, height: size, borderRadius: r,
        background: '#F8FAFF', border: '1px solid rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <div style={{
          width: size * 0.54, height: size * 0.54,
          backgroundColor: app.brand,
          WebkitMask: `url('${iconUrl}') center/contain no-repeat`,
          mask: `url('${iconUrl}') center/contain no-repeat`,
        }} />
      </div>
    )
  }

  if (app.domain && !err) {
    const favUrl = `https://www.google.com/s2/favicons?domain=${app.domain}&sz=128`
    return (
      <div style={{
        width: size, height: size, borderRadius: r,
        background: '#fff', border: '1px solid rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        overflow: 'hidden',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={favUrl}
          alt={app.name}
          width={size * 0.6}
          height={size * 0.6}
          style={{ objectFit: 'contain' }}
          onError={() => setErr(true)}
        />
      </div>
    )
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: r,
      background: app.brand,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <span style={{ color: '#fff', fontWeight: 800, fontSize: size * 0.26, letterSpacing: '-0.5px' }}>
        {app.label}
      </span>
    </div>
  )
}

function IntegCard({ app }: { app: IntegApp }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff', border: `1.5px solid ${hov ? 'rgba(27,79,216,0.2)' : '#E8E8E4'}`,
        borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 14,
        transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)', cursor: 'default',
        transform: hov ? 'translateY(-4px)' : 'none',
        boxShadow: hov ? '0 8px 32px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <AppIcon app={app} />
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          borderRadius: 100, padding: '4px 10px', fontSize: 11, fontWeight: 700,
          background: app.status === 'available' ? '#DCFCE7' : '#F1F5F9',
          color: app.status === 'available' ? '#16A34A' : '#94A3B8',
          whiteSpace: 'nowrap' as const,
        }}>
          {app.status === 'available' ? '✓ Beschikbaar' : 'Binnenkort'}
        </span>
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1A2E', marginBottom: 6 }}>{app.name}</div>
        <div style={{ fontSize: 13, color: '#4A5568', lineHeight: 1.6 }}>{app.desc}</div>
      </div>
      <div style={{
        display: 'inline-block', fontSize: 11, fontWeight: 600, color: '#94A3B8',
        background: '#F5F4F0', borderRadius: 6, padding: '2px 8px', alignSelf: 'flex-start',
      }}>
        {CAT_LABELS[app.cat]}
      </div>
    </div>
  )
}

function CatSection({ cat, apps }: { cat: string; apps: IntegApp[] }) {
  return (
    <div style={{ marginBottom: 56 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A2E' }}>{CAT_LABELS[cat]}</h3>
        <span style={{ fontSize: 13, color: '#94A3B8', background: '#F5F4F0', borderRadius: 100, padding: '2px 10px' }}>
          {apps.length}
        </span>
      </div>
      <div className="integ-grid">
        {apps.map(app => <IntegCard key={app.name} app={app} />)}
      </div>
    </div>
  )
}

export default function IntegratiePage() {
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('alle')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return INTEGRATIONS.filter(app => {
      const matchCat = activeCat === 'alle' || app.cat === activeCat
      const matchQ = !q || app.name.toLowerCase().includes(q) || app.desc.toLowerCase().includes(q)
      return matchCat && matchQ
    })
  }, [search, activeCat])

  const grouped = useMemo(() => {
    const order = ['communicatie', 'agenda', 'boekhouding', 'betalen', 'crm', 'ecommerce', 'overig']
    return order.map(cat => ({ cat, apps: filtered.filter(a => a.cat === cat) })).filter(g => g.apps.length > 0)
  }, [filtered])

  const showGrouped = activeCat === 'alle' && !search

  return (
    <>
      <Navbar />
      <main style={{ background: '#F5F4F0', minHeight: '100vh', paddingTop: 64 }}>
        {/* Hero */}
        <div style={{ background: '#fff', borderBottom: '1px solid #E8E8E4', padding: '80px 24px 56px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#DBEAFE', color: '#1D4ED8', borderRadius: 100,
              padding: '6px 16px', fontSize: 13, fontWeight: 600, marginBottom: 20,
            }}>
              ⚡ Plug &amp; play koppelingen
            </div>
            <h1 className="font-display" style={{ fontSize: 'clamp(32px,4.5vw,56px)', color: '#1A1A2E', fontWeight: 400, lineHeight: 1.1, marginBottom: 16 }}>
              Koppelt aan alle apps<br />die je al gebruikt
            </h1>
            <p style={{ fontSize: 18, color: '#4A5568', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 40px' }}>
              Geen technische kennis nodig. Jouw Digitale Werknemer werkt direct samen met jouw bestaande software.
            </p>
            <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto' }}>
              <svg style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth={2}>
                <circle cx={11} cy={11} r={8} /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text" placeholder="Zoek een integratie..."
                value={search} onChange={e => { setSearch(e.target.value); if (e.target.value) setActiveCat('alle') }}
                style={{
                  width: '100%', padding: '14px 20px 14px 50px',
                  border: '1.5px solid #E8E8E4', borderRadius: 14,
                  fontSize: 16, fontFamily: 'inherit', color: '#1A1A2E',
                  outline: 'none', background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div style={{ background: '#fff', borderBottom: '1px solid #E8E8E4' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', gap: 4, overflowX: 'auto' as const, paddingBottom: 1 }} className="hide-scrollbar">
              {CATS.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  style={{
                    padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 14, fontWeight: activeCat === cat.id ? 700 : 500,
                    color: activeCat === cat.id ? '#1B4FD8' : '#4A5568',
                    borderBottom: `2px solid ${activeCat === cat.id ? '#1B4FD8' : 'transparent'}`,
                    whiteSpace: 'nowrap' as const, transition: 'all 0.15s', flexShrink: 0,
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '56px 24px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <p style={{ fontSize: 16, color: '#4A5568' }}>Geen integraties gevonden voor &quot;{search}&quot;</p>
            </div>
          ) : showGrouped ? (
            grouped.map(g => <CatSection key={g.cat} cat={g.cat} apps={g.apps} />)
          ) : (
            <div className="integ-grid">
              {filtered.map(app => <IntegCard key={app.name} app={app} />)}
            </div>
          )}

          {/* Miss section */}
          <div style={{
            background: '#fff', border: '1.5px solid #E8E8E4', borderRadius: 20,
            padding: 48, textAlign: 'center', maxWidth: 600, margin: '64px auto 0',
          }}>
            <h3 className="font-display" style={{ fontSize: 28, color: '#1A1A2E', fontWeight: 400, marginBottom: 12 }}>
              Mis je een integratie?
            </h3>
            <p style={{ fontSize: 16, color: '#4A5568', marginBottom: 28, lineHeight: 1.7 }}>
              Staat jouw app er niet bij? Laat het ons weten. We bouwen nieuwe koppelingen op aanvraag, vaak binnen één week.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' as const }}>
              <a
                href="mailto:team@deltaagents.nl?subject=Integratie aanvraag"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#1B4FD8', color: '#fff', fontWeight: 600, fontSize: 15,
                  padding: '12px 24px', borderRadius: 12, textDecoration: 'none',
                }}
              >
                Integratie aanvragen →
              </a>
              <Link
                href="/prijzen"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  color: '#1A1A2E', fontWeight: 600, fontSize: 15,
                  padding: '12px 24px', borderRadius: 12, textDecoration: 'none',
                  border: '1.5px solid #E8E8E4',
                }}
              >
                Bekijk prijzen
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <style>{`
        .integ-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
        }
        .hide-scrollbar { scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        @media (max-width: 640px) {
          .integ-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
        }
        @media (max-width: 400px) {
          .integ-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  )
}

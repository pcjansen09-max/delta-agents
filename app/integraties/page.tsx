import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppLogo from "@/components/AppLogo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integraties — DeltaAgents",
  description: "Verbind jouw digitale werknemer met meer dan 50 tools die je al gebruikt.",
};

const INTEGRATIONS = [
  { name: "whatsapp", label: "WhatsApp", category: "Communicatie", description: "Beantwoordt klantberichten direct via WhatsApp Business" },
  { name: "gmail", label: "Gmail", category: "Communicatie", description: "Verwerkt e-mails en stuurt professionele antwoorden" },
  { name: "microsoftoutlook", label: "Outlook", category: "Communicatie", description: "Koppel je Outlook inbox voor automatische afhandeling" },
  { name: "slack", label: "Slack", category: "Communicatie", description: "Intern notificaties sturen bij nieuwe klantcontacten" },
  { name: "googlecalendar", label: "Google Calendar", category: "Planning", description: "Plant afspraken in op basis van je beschikbaarheid" },
  { name: "zapier", label: "Zapier", category: "Automatisering", description: "Verbind met 5000+ andere tools via Zapier-workflows" },
  { name: "stripe", label: "Stripe", category: "Betalen", description: "Accepteer betalingen en stuur factuurlinks" },
  { name: "mollie", label: "Mollie", category: "Betalen", description: "iDEAL, creditcard en meer via Mollie" },
  { name: "shopify", label: "Shopify", category: "Webshop", description: "Koppel je webshop voor orderinformatie en retourvragen" },
  { name: "hubspot", label: "HubSpot", category: "CRM", description: "Klantdata automatisch bijwerken in HubSpot" },
  { name: "notion", label: "Notion", category: "Kennisbank", description: "Sla bedrijfskennis op in Notion als trainingsbron" },
  { name: "googledrive", label: "Google Drive", category: "Documenten", description: "Offertes en documenten opslaan in Google Drive" },
  { name: "moneybird", label: "Moneybird", category: "Boekhouding", description: "Facturen automatisch aanmaken in Moneybird" },
];

const CATEGORIES = ["Alle", ...Array.from(new Set(INTEGRATIONS.map((i) => i.category)))];

export default function IntegratiesPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          paddingTop: 120,
          paddingBottom: 64,
          paddingLeft: 24,
          paddingRight: 24,
          textAlign: "center",
          background: "var(--bg-blue)",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--blue-l)",
              border: "1px solid rgba(27,79,216,0.20)",
              borderRadius: 999,
              padding: "5px 16px",
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--blue)" }}>50+ integraties</span>
          </div>
          <h1
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(32px, 4.5vw, 54px)",
              color: "var(--t1)",
              fontWeight: 400,
              marginBottom: 16,
            }}
          >
            Werkt met de tools die jij al gebruikt
          </h1>
          <p style={{ fontSize: 17, color: "var(--t2)", lineHeight: 1.7 }}>
            Geen migratie, geen gedoe. Jouw digitale werknemer verbindt zich met jouw bestaande software.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: "64px 24px 96px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {INTEGRATIONS.map((int) => (
              <div
                key={int.name}
                className="card card-hover"
                style={{ padding: "20px 20px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 8,
                      flexShrink: 0,
                    }}
                  >
                    <AppLogo name={int.name} size={28} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--t1)" }}>{int.label}</div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: "var(--blue)",
                        background: "var(--blue-l)",
                        borderRadius: 6,
                        padding: "2px 7px",
                        display: "inline-block",
                        marginTop: 2,
                      }}
                    >
                      {int.category}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.6 }}>{int.description}</p>
              </div>
            ))}

            {/* Coming soon */}
            {["Moneyworks", "Exact Online", "AFAS", "Twinfield", "ActiveCampaign"].map((name) => (
              <div
                key={name}
                style={{
                  padding: "20px 20px",
                  background: "var(--bg-grey)",
                  border: "1px dashed var(--border)",
                  borderRadius: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  opacity: 0.7,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "var(--border)",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--t2)" }}>{name}</div>
                  <div style={{ fontSize: 11, color: "var(--t3)", marginTop: 2 }}>Binnenkort beschikbaar</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "64px 24px", background: "var(--surface)", textAlign: "center" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(24px, 3vw, 36px)",
              color: "var(--t1)",
              fontWeight: 400,
              marginBottom: 12,
            }}
          >
            Mis je een integratie?
          </h2>
          <p style={{ fontSize: 15, color: "var(--t2)", marginBottom: 28 }}>
            We bouwen voortdurend nieuwe koppelingen. Laat ons weten welke tool jij nodig hebt.
          </p>
          <a
            href="mailto:team@deltaagents.nl?subject=Integratieverzoek"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--blue)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              padding: "12px 28px",
              borderRadius: 12,
              textDecoration: "none",
              boxShadow: "0 4px 16px rgba(27,79,216,0.30)",
            }}
          >
            Integratie aanvragen
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}

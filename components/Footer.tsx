import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer style={{ background: "var(--darker)", padding: "72px 24px 40px" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 40,
        }}
        className="footer-grid"
      >
        {/* Brand */}
        <div>
          <Link href="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: 16 }}>
            <Logo white />
          </Link>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.50)", lineHeight: 1.7, maxWidth: 240 }}>
            Digitale Werknemers voor het Nederlandse MKB. 24/7 beschikbaar, nooit ziek.
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
            <a
              href="https://wa.me/31683417723"
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                transition: "background 0.15s",
              }}
              title="WhatsApp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="white" opacity="0.7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Product */}
        <div>
          <h4 style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.40)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 18 }}>
            Product
          </h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { href: "#hoe-het-werkt", label: "Hoe het werkt" },
              { href: "#functies", label: "Functies" },
              { href: "#integraties", label: "Integraties" },
              { href: "#prijzen", label: "Prijzen" },
              { href: "/auth/login", label: "Inloggen" },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 0.15s" }} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Juridisch */}
        <div>
          <h4 style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.40)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 18 }}>
            Juridisch
          </h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { href: "/privacy", label: "Privacyverklaring" },
              { href: "/algemene-voorwaarden", label: "Algemene Voorwaarden" },
              { href: "/cookies", label: "Cookiebeleid" },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 0.15s" }} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.40)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 18 }}>
            Contact
          </h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
            <li>
              <a href="mailto:team@deltaagents.nl" style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 0.15s" }} className="hover:text-white">
                team@deltaagents.nl
              </a>
            </li>
            <li>
              <a href="tel:+31683417723" style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 0.15s" }} className="hover:text-white">
                06-83417723
              </a>
            </li>
            <li style={{ fontSize: 14, color: "rgba(255,255,255,0.40)" }}>
              Middenmeer, Noord-Holland
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 1200,
          margin: "48px auto 0",
          paddingTop: 24,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
          © {new Date().getFullYear()} DeltaAgents · DeltaDesign BV, KVK 42031960
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}>
          Digitale Werknemers voor het MKB · Nederland
        </p>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

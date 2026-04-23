import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://deltaagents.nl"),
  title: "DeltaAgents — Jouw Digitale Werknemer voor het MKB",
  description:
    "Nooit meer gemiste klanten. DeltaAgents geeft jouw bedrijf een AI-werknemer die 24/7 WhatsApp beantwoordt, offertes maakt en klanten helpt.",
  keywords: [
    "digitale werknemer",
    "AI assistent MKB",
    "WhatsApp bot bedrijf",
    "AI klantenservice",
    "automatisering MKB",
    "digitale medewerker",
  ],
  openGraph: {
    title: "DeltaAgents — Jouw Digitale Werknemer voor het MKB",
    description:
      "Nooit meer gemiste klanten. Een AI-werknemer die 24/7 voor jouw bedrijf klaarstaat.",
    type: "website",
    url: "https://deltaagents.nl",
    locale: "nl_NL",
    siteName: "DeltaAgents",
  },
  twitter: {
    card: "summary_large_image",
    title: "DeltaAgents — Jouw Digitale Werknemer voor het MKB",
    description:
      "Nooit meer gemiste klanten. Een AI-werknemer die 24/7 voor jouw bedrijf klaarstaat.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}

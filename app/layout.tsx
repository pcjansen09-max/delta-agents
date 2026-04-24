import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

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
    <html lang="nl" className={`${instrumentSerif.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}

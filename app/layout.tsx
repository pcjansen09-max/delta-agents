import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["italic"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://deltaagents.nl"),
  title: "DeltaAgents — Cloud Digitale Werknemer voor het MKB | Early Access",
  description:
    "DeltaAgents wordt de cloud-versie van de Digitale Werknemer: een AI-collega die 24/7 via WhatsApp uw klanten helpt, offertes maakt en uw planning beheert. In ontwikkeling — sluit u nu aan op de wachtlijst voor early access.",
  keywords: [
    "digitale werknemer cloud",
    "AI assistent MKB",
    "WhatsApp AI Nederland",
    "automatisering MKB",
    "DeltaAgents",
    "DeltaDesign",
    "AI ondernemer waitlist",
  ],
  authors: [{ name: "Peter Jansen — DeltaDesign" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://deltaagents.nl" },
  openGraph: {
    title: "DeltaAgents — Cloud Digitale Werknemer voor het MKB | Early Access",
    description:
      "De cloud-versie van de Digitale Werknemer komt eraan. Sluit u aan op de wachtlijst voor early access.",
    type: "website",
    url: "https://deltaagents.nl",
    locale: "nl_NL",
    siteName: "DeltaAgents",
  },
  twitter: {
    card: "summary_large_image",
    title: "DeltaAgents — Cloud Digitale Werknemer voor het MKB | Early Access",
    description:
      "De cloud-versie van de Digitale Werknemer komt eraan. Sluit u aan op de wachtlijst.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="nl"
      className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <body className="page-fade">{children}</body>
    </html>
  );
}

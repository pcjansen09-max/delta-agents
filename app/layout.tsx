import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://deltaagents.nl"),
  title: "DeltaAgents — Jouw Digitale Werknemer",
  description:
    "Een digitale werknemer die 24/7 de telefoon opneemt, offertes maakt en je WhatsApp beantwoordt. Nooit ziek, nooit vakantie.",
  keywords: ["AI agent", "digitale werknemer", "MKB", "automatisering", "WhatsApp", "facturatie"],
  openGraph: {
    title: "DeltaAgents — Jouw Digitale Werknemer",
    description: "AI-gedreven werknemers voor Nederlandse MKB-ondernemers.",
    type: "website",
    url: "https://deltaagents.nl",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-background text-slate-100 antialiased">{children}</body>
    </html>
  );
}

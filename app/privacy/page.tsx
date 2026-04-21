import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacyverklaring — DeltaAgents",
};

const SECTIONS = [
  {
    title: "1. Wie zijn wij",
    content: `DeltaAgents is een handelsnaam van DeltaDesign, gevestigd in Middenmeer, Noord-Holland. Wij zijn ingeschreven bij de Kamer van Koophandel onder nummer 42031960.

Contactgegevens:
E-mail: team@delta-design.nl
Telefoon: 06-83417723
Adres: Middenmeer, Noord-Holland`,
  },
  {
    title: "2. Welke gegevens verzamelen wij",
    content: `Wij verwerken de volgende persoonsgegevens:

• E-mailadres (voor account aanmaken en inloggen)
• Bedrijfsnaam en bedrijfsgegevens (die u zelf invult)
• WhatsApp-nummer (indien ingesteld)
• Chatberichten en activiteitslogs van uw Digitale Werknemer
• Technische gegevens zoals IP-adres en browser (via Supabase/Vercel)`,
  },
  {
    title: "3. Hoe gebruiken wij deze gegevens",
    content: `Wij gebruiken uw gegevens voor:

• Het verlenen van onze diensten (uw Digitale Werknemer laten functioneren)
• Communicatie over uw account en abonnement
• Verbetering van onze dienstverlening
• Nakomen van wettelijke verplichtingen

Wij verkopen uw gegevens nooit aan derden.`,
  },
  {
    title: "4. Bewaartermijn",
    content: `Wij bewaren uw gegevens zolang uw account actief is en maximaal 2 jaar na beëindiging van het abonnement. Na verzoek tot verwijdering verwijderen wij uw gegevens binnen 30 dagen.`,
  },
  {
    title: "5. Jouw rechten",
    content: `U heeft het recht op:

• Inzage in uw persoonsgegevens
• Correctie van onjuiste gegevens
• Verwijdering van uw gegevens ('recht op vergetelheid')
• Beperking van verwerking
• Gegevensoverdraagbaarheid
• Bezwaar maken tegen verwerking

Om gebruik te maken van deze rechten, stuur een e-mail naar team@delta-design.nl.`,
  },
  {
    title: "6. Beveiliging",
    content: `Wij nemen de beveiliging van uw gegevens serieus. Wij gebruiken Supabase voor dataopslag (ISO 27001 gecertificeerd), versleutelde verbindingen (HTTPS/TLS) en toegangscontrole via authenticatie.`,
  },
  {
    title: "7. Cookies",
    content: `Wij gebruiken functionele cookies voor het bijhouden van uw inlogsessie. Wij gebruiken geen tracking cookies of advertentiecookies van derden.`,
  },
  {
    title: "8. Contact en klachten",
    content: `Voor vragen over deze privacyverklaring kunt u contact opnemen via team@delta-design.nl.

U heeft ook het recht een klacht in te dienen bij de Autoriteit Persoonsgegevens (autoriteitpersoonsgegevens.nl).`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h1 className="font-display text-4xl font-700 text-white mb-3">Privacyverklaring</h1>
            <p className="text-slate-400 text-sm">
              Laatste update: april 2026 · DeltaDesign, KVK 42031960
            </p>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed mb-10">
            DeltaAgents hecht grote waarde aan de bescherming van uw persoonsgegevens. In deze privacyverklaring leggen wij uit welke gegevens wij verzamelen, hoe wij deze gebruiken en welke rechten u heeft.
          </p>

          <div className="space-y-8">
            {SECTIONS.map((s) => (
              <div key={s.title} className="glass rounded-2xl p-6">
                <h2 className="font-semibold text-white text-base mb-3">{s.title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

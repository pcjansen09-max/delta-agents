import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Algemene Voorwaarden — DeltaAgents",
};

const SECTIONS = [
  {
    title: "Artikel 1 — Definities",
    content: `DeltaAgents: de handelsnaam van DeltaDesign, KVK 42031960, gevestigd in Middenmeer.
Klant: de natuurlijke persoon of rechtspersoon die gebruik maakt van de diensten van DeltaAgents.
Dienst: het beschikbaar stellen van een AI-gestuurde digitale medewerker via het DeltaAgents platform.`,
  },
  {
    title: "Artikel 2 — Toepasselijkheid",
    content: `Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, overeenkomsten en diensten van DeltaAgents. Afwijkingen zijn alleen geldig indien schriftelijk overeengekomen.`,
  },
  {
    title: "Artikel 3 — Overeenkomst en looptijd",
    content: `De overeenkomst gaat in op de dag van activering van het account. Het abonnement is maandelijks en wordt automatisch verlengd. Opzeggen kan op elk moment met een opzegtermijn van 1 kalendermaand.`,
  },
  {
    title: "Artikel 4 — Betalingen",
    content: `Facturen dienen binnen 14 dagen na factuurdatum te worden voldaan. Bij niet-tijdige betaling is DeltaAgents gerechtigd de dienst tijdelijk te onderbreken tot betaling is ontvangen.

Prijzen zijn exclusief BTW, tenzij anders vermeld.`,
  },
  {
    title: "Artikel 5 — Gebruik van de dienst",
    content: `De klant is zelf verantwoordelijk voor de inhoud die wordt ingevoerd in het systeem (bedrijfsinfo, instructies). De klant garandeert dat de ingevoerde informatie accuraat is en geen inbreuk maakt op rechten van derden.

DeltaAgents behoudt zich het recht voor om accounts te blokkeren bij misbruik of overtreding van deze voorwaarden.`,
  },
  {
    title: "Artikel 6 — Aansprakelijkheid",
    content: `DeltaAgents is niet aansprakelijk voor indirecte schade, gevolgschade of gederfde winst. De totale aansprakelijkheid van DeltaAgents is beperkt tot het bedrag dat de klant in de afgelopen 3 maanden heeft betaald voor de dienst.

DeltaAgents garandeert geen 100% beschikbaarheid van de dienst. Gepland onderhoud wordt vooraf gecommuniceerd.`,
  },
  {
    title: "Artikel 7 — Intellectueel eigendom",
    content: `Alle software, algoritmen en technologie van DeltaAgents zijn en blijven eigendom van DeltaAgents. De klant krijgt een niet-exclusief gebruiksrecht voor de duur van het abonnement.`,
  },
  {
    title: "Artikel 8 — Persoonsgegevens",
    content: `DeltaAgents verwerkt persoonsgegevens conform de AVG/GDPR. Zie onze privacyverklaring voor meer informatie.`,
  },
  {
    title: "Artikel 9 — Toepasselijk recht",
    content: `Op deze overeenkomst is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in het arrondissement Noord-Holland.`,
  },
];

export default function AlgemeneVoorwaardenPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h1 className="font-display text-4xl font-700 text-white mb-3">Algemene Voorwaarden</h1>
            <p className="text-slate-400 text-sm">
              Laatste update: april 2026 · DeltaDesign, KVK 42031960
            </p>
          </div>

          <div className="space-y-6">
            {SECTIONS.map((s) => (
              <div key={s.title} className="glass rounded-2xl p-6">
                <h2 className="font-semibold text-white text-sm mb-3">{s.title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">{s.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 glass rounded-2xl p-5 border border-blue-500/15">
            <p className="text-slate-400 text-sm">
              Vragen over deze voorwaarden? Stuur een e-mail naar{" "}
              <a href="mailto:team@delta-design.nl" className="text-blue-400 hover:text-blue-300 transition-colors">
                team@delta-design.nl
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

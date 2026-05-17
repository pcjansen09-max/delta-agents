import { requireSession } from "@/lib/auth";
import { listRules } from "@/lib/wisdom/store";
import WisdomManager from "@/components/dash/WisdomManager";

export const dynamic = "force-dynamic";

export default async function WisdomPage() {
  const session = await requireSession();
  const rules = await listRules(session.company.id, { activeOnly: false });

  return (
    <div className="wi-wrap">
      <header className="wi-header">
        <span className="eyebrow"><span className="dot" />Bedrijfsregels</span>
        <h1 className="h2">
          De geleerde wijsheid<br />
          <em className="serif" style={{ color: "var(--delta)" }}>
            van uw bedrijf.
          </em>
        </h1>
        <p className="lead wi-lead">
          Hier ziet u élke regel die uw Digitale Werknemer toepast bij beslissingen.
          Een correctie via WhatsApp wordt automatisch een regel hier. U kunt
          regels bewerken, pauzeren of verwijderen — de agent past zich direct aan.
        </p>
      </header>

      <WisdomManager initialRules={rules} />

      <style>{`
        .wi-wrap { display: flex; flex-direction: column; gap: 40px; max-width: 1200px; }
        .wi-header { display: flex; flex-direction: column; gap: 12px; max-width: 720px; }
        .wi-lead { margin-top: 8px; }
      `}</style>
    </div>
  );
}

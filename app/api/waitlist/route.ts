import { NextResponse } from "next/server";

const WEB3FORMS_ACCESS_KEY = "84ab51cd-7f92-4ec1-9b77-492755ff5167";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim();
    const name = String(body?.name || "").trim();
    const company = String(body?.company || "").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Geldig e-mailadres is verplicht" },
        { status: 400 }
      );
    }

    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: "DeltaAgents waitlist — nieuwe aanmelding",
      from_name: "DeltaAgents Waitlist",
      "Naam": name || "(niet opgegeven)",
      "Bedrijf": company || "(niet opgegeven)",
      "E-mail": email,
      "Bron": "deltaagents.nl waitlist formulier",
      "Datum": new Date().toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" }),
    };

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data?.success) {
      return NextResponse.json(
        { error: data?.message || "Verzenden mislukt — probeer het later opnieuw" },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Onverwachte fout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

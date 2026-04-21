import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let body: { naam: string; email: string; bericht: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { naam, email, bericht } = body;
  if (!naam || !email || !bericht) {
    return NextResponse.json({ error: "Alle velden zijn verplicht" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Graceful degradation: log and return success anyway
    console.log("Contact form submission (no RESEND_API_KEY):", { naam, email, bericht });
    return NextResponse.json({ success: true });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "DeltaAgents Contact <noreply@deltaagents.nl>",
      to: ["team@delta-design.nl"],
      subject: `Contactaanvraag van ${naam}`,
      text: `Naam: ${naam}\nEmail: ${email}\n\nBericht:\n${bericht}`,
      html: `<p><strong>Naam:</strong> ${naam}</p><p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p><p><strong>Bericht:</strong></p><p style="white-space:pre-wrap">${bericht}</p>`,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Verzenden mislukt" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

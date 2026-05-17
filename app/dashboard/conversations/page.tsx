import { requireSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase-admin";
import ConversationsView from "@/components/dash/ConversationsView";

export const dynamic = "force-dynamic";

export default async function ConversationsPage() {
  const session = await requireSession();
  const admin = getAdminClient();

  // Threads + per thread laatste 50 messages
  const { data: conversations } = await admin
    .from("deltaagents_wa_conversations")
    .select("id, user_phone, user_id, last_message_at, created_at, context_summary")
    .eq("company_id", session.company.id)
    .order("last_message_at", { ascending: false })
    .limit(50);

  const convIds = (conversations ?? []).map((c) => c.id);

  // Bulk-fetch messages voor alle convs in 1 call
  const { data: allMessages } = convIds.length > 0
    ? await admin
        .from("deltaagents_wa_messages")
        .select("id, conversation_id, direction, type, text, transcript, created_at, metadata")
        .in("conversation_id", convIds)
        .order("created_at", { ascending: true })
    : { data: [] };

  // Users map (phone → name/role)
  const { data: users } = await admin
    .from("deltaagents_users")
    .select("phone, name, role")
    .eq("company_id", session.company.id);

  const userMap = Object.fromEntries((users ?? []).map((u) => [u.phone, u]));

  // Group messages per conversation
  const messagesByConv: Record<string, typeof allMessages> = {};
  for (const m of allMessages ?? []) {
    (messagesByConv[m.conversation_id] ??= []).push(m);
  }

  const enriched = (conversations ?? []).map((c) => ({
    ...c,
    user_info: userMap[c.user_phone] ?? null,
    messages: messagesByConv[c.id] ?? [],
  }));

  return (
    <div className="cv-wrap">
      <header className="cv-header">
        <span className="eyebrow"><span className="dot" />Gesprekken</span>
        <h1 className="h2">
          Wat is er besproken,<br />
          <em className="serif" style={{ color: "var(--delta)" }}>
            en met wie.
          </em>
        </h1>
        <p className="lead cv-lead">
          Alle WhatsApp-conversaties tussen uw team en de Digitale Werknemer.
          Per bericht ziet u welke acties zijn voorgesteld en welke regels zijn
          toegepast.
        </p>
      </header>

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <ConversationsView conversations={enriched as any} />

      <style>{`
        .cv-wrap { display: flex; flex-direction: column; gap: 40px; max-width: 1400px; }
        .cv-header { display: flex; flex-direction: column; gap: 12px; max-width: 700px; }
        .cv-lead { margin-top: 8px; }
      `}</style>
    </div>
  );
}

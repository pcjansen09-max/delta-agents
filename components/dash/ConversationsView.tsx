"use client";

import { useState } from "react";

interface Message {
  id: string;
  conversation_id: string;
  direction: "in" | "out";
  type: string;
  text: string | null;
  transcript: string | null;
  created_at: string;
  metadata: Record<string, unknown> | null;
}

interface UserInfo {
  phone: string;
  name: string;
  role: string;
}

interface Conversation {
  id: string;
  user_phone: string;
  user_info: UserInfo | null;
  last_message_at: string;
  created_at: string;
  context_summary: string | null;
  messages: Message[];
}

interface Props {
  conversations: Conversation[];
}

export default function ConversationsView({ conversations }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(conversations[0]?.id ?? null);
  const selected = conversations.find((c) => c.id === selectedId);

  if (conversations.length === 0) {
    return (
      <div className="cv-empty">
        <p>Nog geen gesprekken.</p>
        <p className="cv-empty-sub">
          Zodra een medewerker uw DeltaAgents-nummer aanschrijft via WhatsApp,
          verschijnen alle berichten hier.
        </p>
        <style>{`
          .cv-empty {
            background: #fff; border: 1px solid var(--line); border-radius: 14px;
            padding: 48px 32px; text-align: center;
          }
          .cv-empty p { margin: 0; font-size: 18px; color: var(--ink); }
          .cv-empty-sub { margin-top: 8px !important; font-size: 14px; color: var(--muted); max-width: 50ch; margin-left: auto !important; margin-right: auto !important; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="cv-split">
      <aside className="cv-list">
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedId(c.id)}
            className={`cv-list-item ${c.id === selectedId ? "is-active" : ""}`}
          >
            <span className="cv-list-name">
              {c.user_info?.name ?? formatPhone(c.user_phone)}
            </span>
            <span className="cv-list-meta">
              {c.user_info && <span className={`cv-role cv-role-${c.user_info.role}`}>{c.user_info.role}</span>}
              <span className="cv-list-time">{relativeTime(c.last_message_at)}</span>
            </span>
            <span className="cv-list-preview">
              {previewLast(c.messages)}
            </span>
          </button>
        ))}
      </aside>

      <section className="cv-thread">
        {selected ? (
          <>
            <header className="cv-thread-h">
              <div>
                <h3 className="cv-thread-name">
                  {selected.user_info?.name ?? formatPhone(selected.user_phone)}
                </h3>
                <p className="cv-thread-sub">
                  {selected.user_info ? (
                    <>
                      <span className={`cv-role cv-role-${selected.user_info.role}`}>{selected.user_info.role}</span>
                      <span> · {formatPhone(selected.user_phone)}</span>
                    </>
                  ) : (
                    <span className="cv-unknown">Onbekend nummer — voeg medewerker toe in Instellingen</span>
                  )}
                </p>
              </div>
              <span className="cv-thread-meta">
                {selected.messages.length} berichten · gestart {new Date(selected.created_at).toLocaleDateString("nl-NL")}
              </span>
            </header>

            {selected.context_summary && (
              <div className="cv-summary">
                <span className="eyebrow"><span className="dot" />Samenvatting eerder gesprek</span>
                <p>{selected.context_summary}</p>
              </div>
            )}

            <div className="cv-messages">
              {selected.messages.length === 0 ? (
                <p className="cv-no-msg">Nog geen berichten.</p>
              ) : (
                selected.messages.map((m) => (
                  <MessageBubble key={m.id} message={m} />
                ))
              )}
            </div>
          </>
        ) : (
          <p className="cv-pick">Selecteer een gesprek links.</p>
        )}
      </section>

      <style>{`
        .cv-split {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 0;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 14px;
          min-height: 600px;
          overflow: hidden;
        }

        .cv-list {
          border-right: 1px solid var(--line);
          background: var(--bg-soft);
          overflow-y: auto;
          max-height: 800px;
        }
        .cv-list-item {
          display: flex; flex-direction: column; gap: 4px;
          padding: 14px 18px;
          width: 100%;
          text-align: left;
          background: transparent;
          border: 0;
          border-bottom: 1px solid var(--line);
          cursor: pointer;
          transition: background 0.15s;
        }
        .cv-list-item:hover { background: rgba(10,10,11,0.03); }
        .cv-list-item.is-active { background: #fff; border-left: 3px solid var(--delta); padding-left: 15px; }
        .cv-list-name { font-size: 14px; font-weight: 500; color: var(--ink); }
        .cv-list-meta { display: flex; gap: 8px; align-items: center; }
        .cv-list-time { font-family: var(--font-mono); font-size: 10px; color: var(--muted); margin-left: auto; }
        .cv-list-preview { font-size: 12px; color: var(--muted); line-height: 1.4; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }

        .cv-thread { padding: 28px 32px; overflow-y: auto; max-height: 800px; }
        .cv-thread-h {
          display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;
          padding-bottom: 20px; border-bottom: 1px solid var(--line); margin-bottom: 20px;
        }
        .cv-thread-name { margin: 0; font-size: 22px; font-weight: 600; letter-spacing: -0.02em; }
        .cv-thread-sub { margin: 6px 0 0; font-size: 13px; color: var(--muted); display: flex; align-items: center; gap: 6px; }
        .cv-thread-meta { font-family: var(--font-mono); font-size: 11px; color: var(--muted); text-align: right; }
        .cv-unknown { color: #92400e; }

        .cv-role {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.14em; text-transform: uppercase;
          padding: 2px 8px; border-radius: 999px;
          background: var(--bg-soft); color: var(--muted);
        }
        .cv-role-directie { background: var(--delta-tint); color: var(--delta); }
        .cv-role-voorman { background: #dbeafe; color: #1e40af; }
        .cv-role-monteur { background: var(--bg-soft); color: var(--muted); }

        .cv-summary {
          background: var(--bg-soft);
          padding: 16px 20px;
          border-radius: 10px;
          margin-bottom: 20px;
        }
        .cv-summary p { margin: 8px 0 0; font-size: 13px; line-height: 1.55; color: var(--ink-2); }

        .cv-messages { display: flex; flex-direction: column; gap: 12px; }
        .cv-no-msg { text-align: center; color: var(--muted); padding: 40px; }
        .cv-pick { padding: 60px; text-align: center; color: var(--muted); }
      `}</style>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isIn = message.direction === "in";
  const text = message.text ?? message.transcript ?? "[geen tekst]";
  const meta = message.metadata as { proposed_action?: { type: string; summary: string }; tokens?: { input_tokens: number; output_tokens: number } } | null;

  return (
    <div className={`mb-row ${isIn ? "mb-in" : "mb-out"}`}>
      <div className="mb-bubble">
        {message.type === "audio" && (
          <span className="mb-audio-tag">🎙 Voicebericht</span>
        )}
        <p className="mb-text">{text}</p>
        <div className="mb-foot">
          <time className="mb-time">{new Date(message.created_at).toLocaleString("nl-NL")}</time>
          {meta?.proposed_action && (
            <span className="mb-action">→ {meta.proposed_action.summary}</span>
          )}
        </div>
      </div>

      <style jsx>{`
        .mb-row { display: flex; }
        .mb-row.mb-in { justify-content: flex-start; }
        .mb-row.mb-out { justify-content: flex-end; }
        .mb-bubble {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 14px;
          font-size: 14px;
          line-height: 1.5;
        }
        .mb-in .mb-bubble {
          background: var(--bg-tint);
          color: var(--ink);
          border-bottom-left-radius: 4px;
        }
        .mb-out .mb-bubble {
          background: var(--delta);
          color: #fff;
          border-bottom-right-radius: 4px;
        }
        .mb-audio-tag {
          display: inline-block;
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 3px 8px; border-radius: 999px;
          background: rgba(0,0,0,0.08);
          margin-bottom: 6px;
        }
        .mb-out .mb-audio-tag { background: rgba(255,255,255,0.18); }
        .mb-text { margin: 0; white-space: pre-wrap; }
        .mb-foot {
          margin-top: 8px;
          display: flex; gap: 10px; align-items: center; flex-wrap: wrap;
          font-family: var(--font-mono); font-size: 10px;
          opacity: 0.7;
        }
        .mb-action { font-style: italic; }
      `}</style>
    </div>
  );
}

function formatPhone(phone: string): string {
  // 31612345678 → +31 6 12 34 56 78
  if (phone.startsWith("31") && phone.length === 11) {
    return `+31 ${phone.slice(2, 3)} ${phone.slice(3, 5)} ${phone.slice(5, 7)} ${phone.slice(7, 9)} ${phone.slice(9, 11)}`;
  }
  return phone;
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return "net";
  if (min < 60) return `${min}m`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}u`;
  const d = Math.round(h / 24);
  return `${d}d`;
}

function previewLast(messages: Message[]): string {
  const last = messages[messages.length - 1];
  if (!last) return "(geen berichten)";
  const text = last.text ?? last.transcript ?? "[geen tekst]";
  return text.length > 60 ? text.slice(0, 59) + "…" : text;
}

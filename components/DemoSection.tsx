"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

interface Message {
  from: "user" | "agent";
  text: string;
}

const QUICK_CHIPS = [
  "Wat zijn jullie tarieven?",
  "Kan ik een offerte aanvragen?",
  "Hoe snel reageren jullie?",
  "Wat doen jullie voor tuinonderhoud?",
];

const INITIAL: Message[] = [
  { from: "agent", text: "Goedemiddag! Ik ben de digitale werknemer van Jansen Hoveniers. Waarmee kan ik u helpen?" },
];

export default function DemoSection() {
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading || count >= 8) return;
    const userMsg: Message = { from: "user", text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setCount((c) => c + 1);

    try {
      const res = await fetch("/api/demo-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok || !res.body) throw new Error("Network error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let agentText = "";
      setMessages((prev) => [...prev, { from: "agent", text: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.delta) {
                agentText += data.delta;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { from: "agent", text: agentText };
                  return updated;
                });
              }
            } catch {}
          }
        }
      }
    } catch {
      setMessages((prev) => [...prev, { from: "agent", text: "Sorry, er ging iets mis. Probeer het opnieuw." }]);
    } finally {
      setLoading(false);
    }
  };

  const maxReached = count >= 8;

  return (
    <section id="demo" style={{ padding: "96px 24px", background: "var(--bg-blue)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--blue-l)",
              border: "1px solid rgba(27,79,216,0.20)",
              borderRadius: 999,
              padding: "5px 16px",
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--blue)" }}>Live demo</span>
          </div>
          <h2
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(28px, 3.5vw, 44px)",
              color: "var(--t1)",
              fontWeight: 400,
              marginBottom: 12,
            }}
          >
            Praat met een echte digitale werknemer
          </h2>
          <p style={{ fontSize: 16, color: "var(--t2)", maxWidth: 480, margin: "0 auto" }}>
            Dit is hoe jouw klanten jouw werknemer ervaren. Hij is ingericht voor Jansen Hoveniers.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
            alignItems: "start",
          }}
          className="demo-grid"
        >
          {/* Left: company card */}
          <div>
            <div className="card" style={{ padding: 28, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: "#DCFCE7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  🌿
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--t1)" }}>Jansen Hoveniers</div>
                  <div style={{ fontSize: 13, color: "var(--t2)" }}>Haarlem & omgeving</div>
                </div>
              </div>
              <p style={{ fontSize: 13.5, color: "var(--t2)", lineHeight: 1.7, marginBottom: 20 }}>
                De digitale werknemer van Jansen Hoveniers kent alle diensten, tarieven en beschikbaarheid. Hij beantwoordt klanten alsof hij al jaren in dienst is.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  ["Tuinonderhoud", "vanaf €45/u"],
                  ["Tuinaanleg", "op offerte"],
                  ["Snoeien & maaien", "€55/u"],
                  ["Responstijd", "< 2 seconden"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ color: "var(--t2)" }}>{k}</span>
                    <span style={{ fontWeight: 600, color: "var(--t1)" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p style={{ fontSize: 12, color: "var(--t3)", marginBottom: 10, fontWeight: 500 }}>Snel beginnen:</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {QUICK_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => send(chip)}
                    disabled={loading || maxReached}
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "var(--blue)",
                      background: "var(--blue-l)",
                      border: "1px solid rgba(27,79,216,0.15)",
                      borderRadius: 999,
                      padding: "6px 14px",
                      cursor: loading || maxReached ? "not-allowed" : "pointer",
                      opacity: loading || maxReached ? 0.5 : 1,
                      transition: "all 0.15s",
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: iPhone chat */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: "100%",
                maxWidth: 380,
                background: "#1A1A2E",
                borderRadius: 36,
                padding: 10,
                boxShadow: "0 30px 60px rgba(0,0,0,0.18), 0 12px 28px rgba(27,79,216,0.12)",
              }}
            >
              <div style={{ borderRadius: 28, overflow: "hidden", background: "#fff" }}>
                {/* Header */}
                <div style={{ background: "#1A8A5A", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                    JH
                  </div>
                  <div>
                    <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Jansen Hoveniers</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7FE8B0", display: "inline-block" }} />
                      <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 10 }}>Online · reageert altijd</span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ background: "#E5DDD5", padding: "12px 10px", minHeight: 320, maxHeight: 380, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
                  {messages.map((msg, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start" }}>
                      <div
                        style={{
                          maxWidth: "82%",
                          background: msg.from === "user" ? "#D9FDD3" : "#fff",
                          borderRadius: msg.from === "user" ? "14px 2px 14px 14px" : "2px 14px 14px 14px",
                          padding: "8px 11px",
                          fontSize: 12.5,
                          lineHeight: 1.5,
                          color: "#1A1A2E",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                          animation: "bubbleIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards",
                        }}
                      >
                        {msg.text || (loading && i === messages.length - 1 ? (
                          <span style={{ display: "inline-flex", gap: 3 }}>
                            <span className="td" /><span className="td" /><span className="td" />
                          </span>
                        ) : "")}
                      </div>
                    </div>
                  ))}
                  {loading && messages[messages.length - 1]?.from !== "agent" && (
                    <div style={{ display: "flex", justifyContent: "flex-start" }}>
                      <div style={{ background: "#fff", borderRadius: "2px 14px 14px 14px", padding: "10px 14px", boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }}>
                        <span style={{ display: "inline-flex", gap: 3 }}>
                          <span className="td" /><span className="td" /><span className="td" />
                        </span>
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div style={{ background: "#F0F2F5", padding: "8px 10px", display: "flex", gap: 8, alignItems: "flex-end" }}>
                  {maxReached ? (
                    <div style={{ flex: 1, background: "#fff", borderRadius: 20, padding: "8px 14px", fontSize: 11, color: "var(--t3)", textAlign: "center" }}>
                      Demo limiet bereikt — start jouw eigen werknemer
                    </div>
                  ) : (
                    <>
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                        placeholder="Typ een bericht..."
                        disabled={loading}
                        style={{
                          flex: 1,
                          background: "#fff",
                          border: "none",
                          borderRadius: 20,
                          padding: "8px 14px",
                          fontSize: 12.5,
                          outline: "none",
                          color: "#1A1A2E",
                          fontFamily: "inherit",
                        }}
                      />
                      <button
                        onClick={() => send(input)}
                        disabled={!input.trim() || loading}
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          background: input.trim() && !loading ? "#1A8A5A" : "#CBD5E1",
                          border: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                          flexShrink: 0,
                          transition: "background 0.15s",
                        }}
                      >
                        <Send size={14} style={{ color: "#fff" }} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .demo-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

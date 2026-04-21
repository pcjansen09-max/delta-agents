"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
}

interface Props {
  companyId: string;
  hasBedrijfsinfo: boolean;
  companyName: string | null;
}

export default function ChatClient({ companyId, hasBedrijfsinfo, companyName }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setStreaming(true);

    const agentMsg: Message = { id: crypto.randomUUID(), role: "agent", content: "" };
    setMessages((prev) => [...prev, agentMsg]);

    try {
      const allMessages = [...messages, userMsg].map((m) => ({
        role: m.role === "agent" ? "assistant" : "user",
        content: m.content,
      }));

      const res = await fetch("/api/dashboard-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMessages, companyId }),
      });

      if (!res.ok || !res.body) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === agentMsg.id ? { ...m, content: "Er ging iets mis. Probeer opnieuw." } : m
          )
        );
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") continue;
          try {
            const { text } = JSON.parse(raw) as { text: string };
            setMessages((prev) =>
              prev.map((m) =>
                m.id === agentMsg.id ? { ...m, content: m.content + text } : m
              )
            );
          } catch {
            // skip
          }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === agentMsg.id ? { ...m, content: "Verbindingsfout. Probeer opnieuw." } : m
        )
      );
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="pt-16 md:pt-0 flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex-shrink-0"
      >
        <h1 className="font-display text-2xl font-700 text-white mb-1">Test je werknemer</h1>
        <p className="text-slate-400 text-sm">
          Stuur een bericht zoals een klant dat zou doen — jouw werknemer antwoordt direct.
        </p>
      </motion.div>

      {/* No bedrijfsinfo banner */}
      {!hasBedrijfsinfo && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0 mb-4 flex items-center gap-3 glass rounded-xl p-3.5 border border-amber-500/20 bg-amber-500/5"
        >
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <p className="text-amber-300 text-sm flex-1">
            Tip: vul je bedrijfsinfo in via het dashboard voor betere antwoorden
          </p>
          <Link
            href="/dashboard/bedrijfsinfo"
            className="text-amber-400 hover:text-amber-300 text-xs font-semibold whitespace-nowrap transition-colors"
          >
            Invullen →
          </Link>
        </motion.div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-slate-400 text-sm font-medium mb-1">
              {companyName ? `${companyName}'s werknemer staat klaar` : "Jouw werknemer staat klaar"}
            </p>
            <p className="text-slate-600 text-xs max-w-xs">
              Typ een bericht om te starten. Hij antwoordt zoals een klant dat zou verwachten.
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  msg.role === "user"
                    ? "bg-blue-600"
                    : "bg-white/[0.06] border border-white/[0.08]"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-blue-400" />
                )}
              </div>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-sm"
                    : "glass text-slate-200 rounded-tl-sm"
                }`}
              >
                {msg.content || (
                  <span className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex-shrink-0 glass rounded-2xl p-3 flex gap-3 items-end"
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Stuur een bericht..."
          rows={1}
          className="flex-1 bg-transparent text-white text-sm placeholder-slate-500 outline-none resize-none leading-relaxed max-h-32"
          style={{ minHeight: "24px" }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || streaming}
          aria-label="Verstuur bericht"
          className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all flex-shrink-0"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </motion.div>
    </div>
  );
}

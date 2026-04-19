"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { X, Send, Loader2, ExternalLink } from "lucide-react";
import { useChatStore } from "@/lib/store";
import type { ChatMessage } from "@/lib/store";
import type { Agent } from "@/lib/agents";

function parseMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\((#[^)]+)\)/g, '<a href="$2" class="text-blue-400 underline hover:text-blue-300">$1</a>')
    .replace(/\n/g, "<br/>");
}

export default function ChatModal() {
  const { activeAgent, isOpen, messages, isLoading, closeChat, addMessage, setLoading } =
    useChatStore();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isLoading || !activeAgent) return;

    setInput("");

    addMessage({ role: "user", content: text });
    setLoading(true);

    try {
      const currentMessages = useChatStore.getState().messages;
      const apiMessages = currentMessages
        .filter((m) => m.role === "user" || m.role === "agent")
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: activeAgent.id,
          messages: apiMessages,
        }),
      });

      const data = await res.json();
      addMessage({
        role: "agent",
        content: data.content ?? "Er ging iets mis. Probeer het opnieuw.",
        isUpsell: data.isUpsell,
      });
    } catch {
      addMessage({
        role: "agent",
        content: "Er ging iets mis. Controleer je verbinding en probeer het opnieuw.",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (!activeAgent) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeChat}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 40 }}
            transition={{ type: "spring", damping: 26, stiffness: 350 }}
            className="fixed inset-x-4 bottom-4 top-16 md:inset-auto md:bottom-8 md:right-8 md:w-[420px] md:h-[640px] z-50 flex flex-col glass-strong rounded-3xl overflow-hidden"
          >
            {/* Header */}
            <div
              className="px-5 py-4 flex items-center gap-3 border-b border-white/[0.08] flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${activeAgent.colorFrom}18, transparent)`,
              }}
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${activeAgent.colorFrom}30, ${activeAgent.colorTo}20)`,
                }}
              >
                {activeAgent.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm truncate">
                  {activeAgent.name}
                </h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-xs">Online — antwoordt direct</span>
                </div>
              </div>
              <button
                onClick={closeChat}
                className="w-8 h-8 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-white transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              <AnimatePresence mode="popLayout">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} agent={activeAgent} />
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="glass rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="typing-dot w-2 h-2 rounded-full bg-slate-400"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-4 border-t border-white/[0.08] flex-shrink-0">
              <div className="flex gap-2.5">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Stel een vraag aan ${activeAgent.name.split(" ")[0]}...`}
                  className="flex-1 glass rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/40 transition-colors"
                  maxLength={500}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 active:scale-95"
                  style={{
                    background: `linear-gradient(135deg, ${activeAgent.colorFrom}, ${activeAgent.colorTo})`,
                  }}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
              <p className="text-center text-slate-600 text-xs mt-2">
                5 gratis berichten · Daarna €239/maand
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MessageBubble({
  message,
  agent,
}: {
  message: ChatMessage;
  agent: Agent;
}) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "text-white rounded-br-sm"
            : message.isUpsell
            ? "glass-strong border border-blue-500/20 text-slate-200 rounded-bl-sm"
            : "glass text-slate-200 rounded-bl-sm"
        }`}
        style={
          isUser
            ? {
                background: `linear-gradient(135deg, ${agent.colorFrom}dd, ${agent.colorTo}bb)`,
              }
            : undefined
        }
      >
        {message.isUpsell ? (
          <div>
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
            />
            <a
              href="#pricing"
              onClick={() => useChatStore.getState().closeChat()}
              className="mt-3 flex items-center gap-1.5 text-blue-400 text-xs font-semibold hover:text-blue-300 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Bekijk de Inwerkfase →
            </a>
          </div>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
          />
        )}
      </div>
    </motion.div>
  );
}

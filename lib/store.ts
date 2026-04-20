"use client";

import { create } from "zustand";
import type { Agent } from "./agents";

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: Date;
  isUpsell?: boolean;
}

const DEFAULT_COUNT = 5;
const STORAGE_KEY = (agentId: string) => `delta_msgs_${agentId}`;

function readCount(agentId: string): number {
  if (typeof window === "undefined") return DEFAULT_COUNT;
  const raw = localStorage.getItem(STORAGE_KEY(agentId));
  if (raw === null) return DEFAULT_COUNT;
  const parsed = parseInt(raw, 10);
  return isNaN(parsed) ? DEFAULT_COUNT : Math.max(0, parsed);
}

function writeCount(agentId: string, count: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY(agentId), String(Math.max(0, count)));
}

interface ChatStore {
  activeAgent: Agent | null;
  isOpen: boolean;
  isLoading: boolean;
  isTyping: boolean;
  remainingCount: number;
  messages: ChatMessage[];
  openChat: (agent: Agent) => void;
  closeChat: () => void;
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

// Typewriter reveal: adds message with empty content then fills it in chunks.
// Runs entirely in the store — ChatModal needs no changes.
function typewriterReveal(
  id: string,
  fullContent: string,
  set: (fn: (s: ChatStore) => Partial<ChatStore>) => void
) {
  // Adaptive speed: faster for longer messages
  const len = fullContent.length;
  const chunkSize = len < 120 ? 2 : len < 300 ? 4 : 7;
  const intervalMs = 14;

  let revealed = 0;
  const timer = setInterval(() => {
    revealed = Math.min(revealed + chunkSize, len);
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, content: fullContent.slice(0, revealed) } : m
      ),
    }));
    if (revealed >= len) clearInterval(timer);
  }, intervalMs);
}

export const useChatStore = create<ChatStore>((set, get) => ({
  activeAgent: null,
  isOpen: false,
  isLoading: false,
  isTyping: false,
  remainingCount: DEFAULT_COUNT,
  messages: [],

  openChat: (agent) =>
    set((state) => {
      const count = readCount(agent.id);
      if (state.activeAgent?.id !== agent.id) {
        return {
          activeAgent: agent,
          isOpen: true,
          remainingCount: count,
          messages: [
            {
              id: "welcome",
              role: "agent",
              content:
                agent.demoMessages[1]?.content ??
                `Hoi! Ik ben de ${agent.name}. Hoe kan ik je helpen?`,
              timestamp: new Date(),
            },
          ],
        };
      }
      return { isOpen: true, remainingCount: count };
    }),

  closeChat: () => set({ isOpen: false }),

  addMessage: (message) => {
    const id = crypto.randomUUID();
    const newMsg: ChatMessage = {
      ...message,
      id,
      timestamp: new Date(),
    };

    if (message.role === "user") {
      // Decrement counter and persist to localStorage
      set((state) => {
        const newCount = Math.max(0, state.remainingCount - 1);
        if (state.activeAgent) writeCount(state.activeAgent.id, newCount);
        return {
          messages: [...state.messages, newMsg],
          remainingCount: newCount,
        };
      });
      return;
    }

    // Upsell messages appear instantly (no typewriter)
    if (message.isUpsell) {
      set((state) => ({ messages: [...state.messages, newMsg] }));
      return;
    }

    // Agent messages: add with empty content then typewriter-reveal
    set((state) => ({
      messages: [...state.messages, { ...newMsg, content: "" }],
    }));
    typewriterReveal(id, message.content, set as Parameters<typeof typewriterReveal>[2]);
  },

  setLoading: (loading) => set({ isLoading: loading, isTyping: loading }),

  clearMessages: () => set({ messages: [] }),
}));

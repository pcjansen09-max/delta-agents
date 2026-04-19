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

interface ChatStore {
  activeAgent: Agent | null;
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  openChat: (agent: Agent) => void;
  closeChat: () => void;
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  activeAgent: null,
  isOpen: false,
  messages: [],
  isLoading: false,

  openChat: (agent) =>
    set((state) => {
      if (state.activeAgent?.id !== agent.id) {
        return {
          activeAgent: agent,
          isOpen: true,
          messages: [
            {
              id: "welcome",
              role: "agent",
              content: agent.demoMessages[1]?.content ?? `Hoi! Ik ben de ${agent.name}. Hoe kan ik je helpen?`,
              timestamp: new Date(),
            },
          ],
        };
      }
      return { isOpen: true };
    }),

  closeChat: () => set({ isOpen: false }),

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        },
      ],
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  clearMessages: () => set({ messages: [] }),
}));

import { create } from "zustand";
import { handlerLLMApi } from "../api/gemini-api";
import type { Chat, Message } from "../types/types";
import { MOCK_DOCUMENT_FOR_CHROMA } from "../shared/consts";

interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  isLoading: boolean;
  sidebarOpen: boolean;

  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  newChat: () => Promise<void>;
  initializationChat: () => Promise<void>;
  selectChat: (chatId: string) => void;
  sendMessage: (content: string) => Promise<void>;
}

const createMessage = (role: Message["role"], content: string): Message => ({
  id: crypto.randomUUID(),
  role,
  content,
});

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  currentChatId: null,
  isLoading: false,
  sidebarOpen: false,

  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  newChat: async () => {
    const { initializationChat } = get();
    await initializationChat();
    set({ sidebarOpen: false });
  },

  initializationChat: async () => {
    const { chats } = get();
    const collectionId = crypto.randomUUID();

    const result = await fetch("/api/chroma/collections", {
      method: "POST",
      body: JSON.stringify({ name: "New_Chat" + "_" + collectionId }),
    });

    const { data } = await result.json();

    const initializationChat: Chat = {
      id: data.id,
      title: "New Chat",
      messages: [],
    };

    set({ chats: [initializationChat, ...chats], currentChatId: data.id });

    await fetch("/api/chroma/records", {
      method: "POST",
      body: JSON.stringify({ id: data.id, contents: MOCK_DOCUMENT_FOR_CHROMA }),
    });
  },

  selectChat: (chatId) => set({ currentChatId: chatId, sidebarOpen: false }),

  sendMessage: async (content) => {
    const { currentChatId, chats } = get();

    if (!currentChatId) {
      console.error("No active chat to send a message to");
      return;
    }

    const userMessage = createMessage("user", content);
    const title = content.slice(0, 20) + (content.length > 20 ? "..." : "");
    const chatId = currentChatId;

    set({
      chats: chats.map((chat) => (chat.id === currentChatId ? { ...chat, messages: [...chat.messages, userMessage] } : chat)),
    });

    set({ isLoading: true });

    try {
      // 1. Request relevant context from Chroma
      const queryResponse = await fetch("/api/chroma/records/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentChatId, query: content }),
      });

      const queryJson = await queryResponse.json();
      const documents = queryJson?.data?.documents?.[0] && Array.isArray(queryJson.data.documents[0]) ? queryJson.data.documents[0] : [];

      const context = documents.length > 0 ? documents.join("\n\n---\n\n") : "";

      // 2. Build prompt with retrieved context
      const prompt = context
        ? `You are an assistant that answers questions using the provided context.\n\nContext:\n${context}\n\nUser question:\n${content}\n\nIf the answer cannot be obtained from the context, honestly say that there is not enough information and answer as carefully as possible.`
        : `You are an assistant that answers user questions.\n\nUser question:\n${content}`;

      // 3. Call LLM with RAG context
      const response = await handlerLLMApi(prompt);
      const assistantMessage = createMessage("assistant", `${response}`);

      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [...chat.messages, assistantMessage],
                title: chat.messages.length === 0 ? title : chat.title,
              }
            : chat
        ),
      }));
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Stable empty array - required by useSyncExternalStore (getServerSnapshot must be cached)
const EMPTY_MESSAGES: Message[] = [];

export const selectCurrentMessages = (state: ChatState): Message[] => {
  const { currentChatId, chats } = state;

  if (currentChatId === null) return EMPTY_MESSAGES;

  const chat = chats.find((c) => c.id === currentChatId);
  return chat?.messages ?? EMPTY_MESSAGES;
};

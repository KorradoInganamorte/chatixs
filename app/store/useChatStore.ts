import { create } from "zustand";
import { handlerLLMApi } from "../api/gemini-3-flash-preview";
import type { Chat, Message } from "../types/types";

interface ChatState {
  chats: Chat[];
  currentChatId: number | null;
  isLoading: boolean;
  sidebarOpen: boolean;

  // Actions
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  newChat: () => void;
  selectChat: (chatId: number) => void;
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

  newChat: () => set({ currentChatId: null, sidebarOpen: false }),

  selectChat: (chatId) => set({ currentChatId: chatId, sidebarOpen: false }),

  sendMessage: async (content) => {
    const { currentChatId, chats } = get();
    const userMessage = createMessage("user", content);
    const title = content.slice(0, 20) + (content.length > 20 ? "..." : "");
    const chatId = currentChatId ?? Date.now();

    if (currentChatId === null) {
      const newChat: Chat = { id: chatId, title, messages: [userMessage] };
      set({ chats: [newChat, ...chats], currentChatId: chatId });
    } else {
      set({
        chats: chats.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, userMessage] }
            : chat
        ),
      });
    }

    set({ isLoading: true });

    try {
      const response = await handlerLLMApi(content);
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

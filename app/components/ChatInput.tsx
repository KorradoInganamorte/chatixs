"use client";

import { useState } from "react";
import { useChatStore } from "../store/useChatStore";

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const isLoading = useChatStore((s) => s.isLoading);
  const sendMessage = useChatStore((s) => s.sendMessage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (trimmed && !isLoading) {
      sendMessage(trimmed);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative flex items-end gap-2 p-4 rounded-2xl bg-base-200/80 border border-base-300 shadow-lg backdrop-blur-sm">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Chatixs..."
          disabled={isLoading}
          rows={1}
          className="textarea textarea-ghost flex-1 min-h-[44px] max-h-32 resize-none py-3 px-4 focus:outline-none"
          style={{ overflow: "hidden" }}
        />
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="btn btn-primary btn-circle shrink-0"
          aria-label="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>
      <p className="text-center text-xs text-base-content/50 mt-2">
        Chatixs can make mistakes. Consider checking important information.
      </p>
    </form>
  );
}

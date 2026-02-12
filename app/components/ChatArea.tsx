"use client";

import { useChatStore, selectCurrentMessages } from "../store/useChatStore";

const SUGGESTIONS = ["Explain quantum computing", "Write a React component", "Debug my code", "Summarize this article"];

export default function ChatArea() {
  const messages = useChatStore(selectCurrentMessages);
  const isLoading = useChatStore((s) => s.isLoading);
  const sendMessage = useChatStore((s) => s.sendMessage);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">How can I help you today?</h2>
          <p className="text-base-content/70 mb-8">
            Start a conversation by typing a message below. I can help with coding, writing, analysis, and much more.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {SUGGESTIONS.map((suggestion) => (
              <button key={suggestion} className="btn btn-outline btn-sm" onClick={() => sendMessage(suggestion)}>
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="avatar placeholder shrink-0 w-8 h-8">
                <div className="flex items-center justify-center bg-primary/20 text-primary rounded-full">
                  <span className="text-xs">AI</span>
                </div>
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === "user" ? "bg-primary text-primary-content" : "bg-base-200 border border-base-300"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
            {msg.role === "user" && (
              <div className="avatar placeholder shrink-0 w-8 h-8">
                <div className="flex items-center justify-center bg-neutral text-neutral-content rounded-full">
                  <span className="text-xs">QwQ</span>
                </div>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="avatar placeholder shrink-0 w-8 h-8">
              <div className="flex items-center justify-center bg-primary/20 text-primary rounded-full">
                <span className="text-xs">AI</span>
              </div>
            </div>
            <div className="bg-base-200 border border-base-300 rounded-2xl px-4 py-3">
              <span className="loading loading-dots loading-sm"></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";

export default function Sidebar() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    queueMicrotask(() => {
      const stored = localStorage.getItem("chatixs-theme") as
        | "light"
        | "dark"
        | null;
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(stored ?? (prefersDark ? "dark" : "light"));
    });
  }, []);

  const {
    sidebarOpen,
    chats,
    currentChatId,
    closeSidebar,
    newChat,
    selectChat,
  } = useChatStore();

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("chatixs-theme", next);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-base-300/60 backdrop-blur-sm z-40 lg:hidden transition-opacity ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-base-200 border-r border-base-300 z-50 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-base-300 shrink-0">
          <button
            onClick={newChat}
            className="btn btn-sm btn-primary btn-block gap-2"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            New chat
          </button>
          <button
            className="btn btn-ghost btn-sm btn-square lg:hidden"
            onClick={closeSidebar}
            aria-label="Close sidebar"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-base-content/60 px-3 py-2">
            Recent chats
          </div>
          <ul className="space-y-1">
            {chats.map((chat) => (
              <li key={chat.id}>
                <button
                  className={`btn btn-sm justify-start w-full text-left font-normal gap-2 ${
                    currentChatId === chat.id
                      ? "btn-primary"
                      : "btn-ghost hover:bg-base-300"
                  }`}
                  onClick={() => selectChat(chat.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 shrink-0 text-base-content/60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span className="truncate">{chat.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-base-300 shrink-0 space-y-2">
          <button
            className="btn btn-ghost btn-sm w-full justify-start gap-2"
            onClick={toggleTheme}
          >
            {theme === "light" ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
                Dark mode
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                Light mode
              </>
            )}
          </button>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-base-300/50">
            <div className="avatar placeholder w-10 h-10">
              <div className="flex items-center justify-center bg-primary text-primary-content rounded-full">
                <span className="text-sm">QwQ</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">User</p>
              <p className="text-xs text-base-content/60 truncate">Free plan</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

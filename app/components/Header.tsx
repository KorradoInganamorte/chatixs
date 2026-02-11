"use client";

import { useChatStore } from "../store/useChatStore";

export default function Header() {
  const openSidebar = useChatStore((s) => s.openSidebar);

  return (
    <header className="sticky top-0 z-30 flex items-center gap-2 p-4 border-b border-base-300 bg-base-100/80 backdrop-blur-sm shrink-0">
      <button
        className="btn btn-ghost btn-square lg:hidden"
        onClick={openSidebar}
        aria-label="Open sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <h1 className="text-xl font-semibold truncate">Chatixs</h1>
    </header>
  );
}

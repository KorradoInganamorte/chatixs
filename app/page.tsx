"use client";

import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import ChatInput from "./components/ChatInput";
import ChatBackground from "./components/ChatBackground";
import Header from "./components/Header";
import { useLayoutEffect } from "react";
import { useChatStore } from "./store/useChatStore";

export default function Home() {
  const { initializationChat } = useChatStore();

  useLayoutEffect(() => {
    initializationChat();
  }, []);

  return (
    <div className="min-h-screen flex bg-base-100">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 lg:ml-72">
        <Header />

        <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
          <ChatBackground />

          <div className="relative flex-1 flex flex-col min-h-0">
            <ChatArea />

            <div className="shrink-0 p-4 pb-6 pt-4">
              <ChatInput />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

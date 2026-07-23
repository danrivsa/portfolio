"use client";

import React from "react";
import { ShineBorder } from "@/components/shine-border";

export default function AIChatButton() {
  const handleClick = () => {
    const el = document.getElementById("ai-chat");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.location.hash = "ai-chat";
  };

  return (
      <ShineBorder color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}>
        <button
          onClick={handleClick}
          className="px-4 py-2 rounded-md bg-background opacity-1"
        >
          Chat with my personal AI assistant
        </button>
      </ShineBorder>
  );
}

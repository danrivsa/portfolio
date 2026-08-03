"use client";

import { RainbowButton } from "@/components/ui/rainbow-button";

export default function AIChatButton() {
  const handleClick = () => {
    const el = document.getElementById("ai-chat");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.location.hash = "ai-chat";
  };

  return (
      <RainbowButton variant="outline" onClick={handleClick}>
          Chat with my personal AI assistant
      </RainbowButton>
  );
}

'use client';

import { useChat } from "../../hooks/useChat";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

const DEMO_PROMPTS = [
  "Show me all active campaigns",
  "How is Campaign Alpha performing?",
  "What are the budget guidelines?",
  "Increase Campaign Alpha's budget to $150",
  "Resume Campaign Gamma",
  "Pause Campaign Delta",
];

export function ChatLayout() {
  const { messages, sendMessage, isLoading } = useChat();

  return (
    <div className="flex flex-col h-full bg-white">
      <ChatHeader />
      <MessageList 
        messages={messages} 
        isLoading={isLoading}
        onSuggestionClick={sendMessage}
        suggestions={DEMO_PROMPTS}
      />
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}

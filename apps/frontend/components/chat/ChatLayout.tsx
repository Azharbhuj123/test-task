'use client';

import { useChat } from "../../hooks/useChat";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

const DEMO_PROMPTS = [
  'Show me all active campaigns',
  'How is Campaign Alpha performing?',
  'What are the budget increase guidelines?',
  'Create a new campaign called "Summer Sale 2026" with $200 budget targeting conversions',
  'Increase Campaign Alpha budget to $150',
  'Pause Campaign Delta',
  'Resume Campaign Gamma',
  'Show me recent metrics for Campaign Beta',
];

export function ChatLayout() {
  const { messages, sendMessage, isLoading } = useChat();

  return (
    <div className="flex flex-col h-full">
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

import { useEffect, useRef } from 'react';
import { ChatMessage } from "../../types/chat";
import { MessageBubble } from "./MessageBubble";
import { EmptyState } from "../ui/EmptyState";
import { Bot } from "lucide-react";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <EmptyState 
          title="AI Campaign Agent" 
          description="Ask me anything about your campaigns. Try 'Show me all campaigns' or 'Increase Campaign Alpha budget to $150'." 
        />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50">
      {messages.map(msg => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      
      {isLoading && (
        <div className="flex justify-start mb-6">
          <div className="flex max-w-[75%] flex-row">
            <div className="mr-3 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-700">
              <Bot size={16} />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white border text-gray-500 rounded-tl-none shadow-sm flex items-center gap-2 text-sm">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
              </div>
              Agent is thinking...
            </div>
          </div>
        </div>
      )}
      
      <div ref={bottomRef} />
    </div>
  );
}

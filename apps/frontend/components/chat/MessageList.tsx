import { useEffect, useRef } from 'react';
import { ChatMessage } from "../../types/chat";
import { MessageBubble } from "./MessageBubble";
import { Bot, Sparkles } from "lucide-react";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  suggestions?: string[];
  onSuggestionClick?: (msg: string) => void;
}

export function MessageList({ messages, isLoading, suggestions = [], onSuggestionClick }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center bg-slate-50/50">
        <div className="max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">AI Campaign Assistant</h2>
          <p className="text-gray-500 text-sm mb-8">
            Ask me about your campaigns, performance metrics, budget guidelines, or request actions with human oversight.
          </p>

          {suggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-center gap-1">
                <Sparkles size={12} /> Try asking
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => onSuggestionClick?.(s)}
                    className="text-left px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all duration-150 shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
      {messages.map(msg => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {isLoading && (
        <div className="flex justify-start mb-6">
          <div className="flex max-w-[75%] flex-row">
            <div className="mr-3 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
              <Bot size={16} />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white border text-gray-500 rounded-tl-none shadow-sm flex items-center gap-2 text-sm">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
              </div>
              <span className="text-gray-400">Agent is thinking...</span>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

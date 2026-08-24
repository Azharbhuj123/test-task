import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChatMessage } from "../../types/chat";
import { MessageBubble } from "./MessageBubble";
import { Sparkles } from "lucide-react";

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
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-6 bg-slate-50">
        <div className="max-w-xl w-full">

          {/* Hero block */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <Image
                src="/logo.svg"
                alt="Logosym"
                width={140}
                height={41}
                className="h-9 w-auto opacity-90"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Campaign Operations Agent</h1>
            <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
              I can read your campaigns, analyze performance, search internal guidelines,
              and safely request high-impact actions with your approval.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {['Tool Calling', 'RAG Knowledge', 'Human Approval', 'Activity Log'].map(f => (
                <span key={f} className="text-[11px] font-medium px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-full">
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest flex items-center gap-1">
              <Sparkles size={10} /> Try a prompt
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => onSuggestionClick?.(s)}
                className="text-left px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-all duration-150 shadow-sm leading-relaxed"
              >
                {s}
              </button>
            ))}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 bg-slate-50">
      {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}

      {isLoading && (
        <div className="flex justify-start mb-5">
          <div className="mr-2.5 flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Image src="/logo.svg" alt="" width={18} height={18} className="w-5 h-5 brightness-[100] invert" />
          </div>
          <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white border text-gray-400 shadow-sm flex items-center gap-2 text-xs">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
            </div>
            Agent is thinking...
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

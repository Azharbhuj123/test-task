'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { chat as sendChatMessage } from '../../lib/api';
import { getConversationMessages } from '../../lib/conversations';
import { ChatMessage, Attachment } from '../../types/chat';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { EmptyState } from './EmptyState';
import { useQueryClient } from '@tanstack/react-query';
import { Bot } from 'lucide-react';

interface ChatAreaProps {
  conversationId?: string;
  onConversationCreated: (id: string) => void;
}

export function ChatArea({ conversationId, onConversationCreated }: ChatAreaProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeConvId, setActiveConvId] = useState<string | undefined>(conversationId);
  const bottomRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Load existing conversation when switching
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveConvId(conversationId);
    if (!conversationId) {
      setMessages([]);
      return;
    }
    // Load messages for this conversation
    getConversationMessages(conversationId).then((msgs: { id: string; role: string; content: string; createdAt: string; attachments?: string }[]) => {
      setMessages(msgs.map(m => ({
        id: m.id,
        role: m.role === 'USER' ? 'user' : 'assistant',
        content: m.content,
        createdAt: m.createdAt,
        attachments: m.attachments ? JSON.parse(m.attachments) : undefined
      })));
    }).catch(() => setMessages([]));
  }, [conversationId]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = useCallback(async (text: string, attachments?: Attachment[]) => {
    if ((!text.trim() && (!attachments || attachments.length === 0)) || isLoading) return;

    const userMsg: ChatMessage = {
      id: `tmp-${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
      attachments,
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(text, activeConvId, attachments);

      // Track the new conversation ID
      if (!activeConvId && response.conversationId) {
        setActiveConvId(response.conversationId);
        onConversationCreated(response.conversationId);
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        createdAt: new Date().toISOString(),
        status: response.status,
        approvalId: response.approvalId,
      };
      setMessages(prev => [...prev, aiMsg]);

      // Refresh conversations list and approvals
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      if (response.status === 'pending_approval') {
        queryClient.invalidateQueries({ queryKey: ['approvals'] });
        queryClient.invalidateQueries({ queryKey: ['activity'] });
        queryClient.invalidateQueries({ queryKey: ['approvalStats'] });
      }
    } catch (err: unknown) {
      const errorData = (err as any)?.response?.data;
      const errorMessage = errorData?.error || errorData?.message || 'An error occurred. Please check your network or OpenAI API key.';
      
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: errorMessage,
        createdAt: new Date().toISOString(),
        isError: true,
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [activeConvId, isLoading, onConversationCreated, queryClient]);

  const SUGGESTIONS = [
    'Show me all active campaigns',
    'How is Campaign Alpha performing?',
    'What are our budget increase guidelines?',
    'Create a campaign "Summer Sale 2026" with $200 budget for conversions',
    'Increase Campaign Alpha budget to $150',
    'Pause Campaign Delta',
    'Show metrics for Campaign Beta',
    'Resume Campaign Gamma',
  ];

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Messages / Empty State */}
      <div className={`flex-1 overflow-y-auto ${messages.length === 0 ? 'flex flex-col items-center justify-center' : ''}`}>
        {messages.length === 0 ? (
          <div className="w-full flex flex-col items-center mt-[-10vh]">
            <EmptyState suggestions={SUGGESTIONS} onSuggestionClick={sendMessage} />
            <ChatInput onSend={sendMessage} disabled={isLoading} />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 w-full pb-32">
            {messages.map((msg, i) => (
              <MessageBubble key={msg.id} message={msg} isLast={i === messages.length - 1} />
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex items-start gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-200">
                  <Bot size={15} className="text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input (only fixed at bottom when not empty) */}
      {messages.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-6">
          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
      )}
    </div>
  );
}

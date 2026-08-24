import { useState } from 'react';
import { chat } from '../lib/api';
import { ChatMessage } from '../types/chat';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Optimistically add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      createdAt: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await chat(content, conversationId);
      
      if (response.conversationId) {
        setConversationId(response.conversationId);
      }

      let aiContent = response.message;
      if (response.status === 'pending_approval') {
        aiContent += `\n\n[PENDING_APPROVAL:${response.approvalId}]`;
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiContent,
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: unknown) {
      console.error(err);
      setError((err as Record<string, unknown>)?.response ? (((err as Record<string, unknown>).response as Record<string, unknown>)?.data as Record<string, unknown>)?.error as string : (err as Error)?.message || 'Failed to send message');
      
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request.',
        createdAt: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    conversationId
  };
}

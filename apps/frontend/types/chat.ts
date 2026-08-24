export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  isError?: boolean;
};

export type ChatResponse = {
  conversationId: string;
  status: 'completed' | 'pending_approval' | 'failed';
  message: string;
  approvalId?: string;
};

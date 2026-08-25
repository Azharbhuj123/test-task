export type Attachment = {
  id: string;
  type: 'image' | 'file';
  url: string; // Base64 data URL for frontend rendering
  name: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  isError?: boolean;
  status?: 'completed' | 'pending_approval' | 'failed';
  approvalId?: string;
  attachments?: Attachment[];
};

export type ChatResponse = {
  conversationId: string;
  status: 'completed' | 'pending_approval' | 'failed';
  message: string;
  approvalId?: string;
};

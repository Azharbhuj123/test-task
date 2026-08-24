import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' }
});

// Health
export const getHealth = async () => {
  const { data } = await api.get('/health');
  return data;
};

// Chat
export const chat = async (message: string, conversationId?: string) => {
  const { data } = await api.post('/api/chat', { message, conversationId });
  return data.data;
};

// Approvals
export const getPendingApprovals = async () => {
  const { data } = await api.get('/api/approvals/pending');
  return data.data;
};

export const getApprovalStats = async () => {
  const { data } = await api.get('/api/approvals/stats');
  return data.data;
};

export const getActivityLog = async () => {
  const { data } = await api.get('/api/approvals/activity');
  return data.data;
};

export const approveRequest = async (id: string) => {
  const { data } = await api.post(`/api/approvals/${id}/approve`);
  return data.data;
};

export const rejectRequest = async (id: string) => {
  const { data } = await api.post(`/api/approvals/${id}/reject`);
  return data.data;
};

// Documents
export const listDocuments = async () => {
  const { data } = await api.get('/api/documents');
  return data.data;
};

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/api/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const deleteDocument = async (name: string) => {
  const { data } = await api.delete(`/api/documents/${encodeURIComponent(name)}`);
  return data;
};

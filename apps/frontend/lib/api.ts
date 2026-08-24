import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHealth = async () => {
  const { data } = await api.get('/health');
  return data;
};

export const chat = async (message: string, conversationId?: string) => {
  const { data } = await api.post('/api/chat', { message, conversationId });
  return data.data;
};

export const getPendingApprovals = async () => {
  const { data } = await api.get('/api/approvals/pending');
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

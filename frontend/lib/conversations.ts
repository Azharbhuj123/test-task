import { api } from './api';

export const getConversations = async () => {
  const { data } = await api.get('/api/conversations');
  return data.data;
};

export const getConversationMessages = async (id: string) => {
  const { data } = await api.get(`/api/conversations/${id}/messages`);
  return data.data;
};

export const deleteConversation = async (id: string) => {
  const { data } = await api.delete(`/api/conversations/${id}`);
  return data;
};

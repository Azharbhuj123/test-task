import { api } from './api';

export const getSettings = async () => {
  const { data } = await api.get('/api/settings');
  return data.data;
};

export const updateApiKey = async (apiKey: string) => {
  const { data } = await api.post('/api/settings/api-key', { apiKey });
  return data.data;
};

export const clearApiKey = async () => {
  const { data } = await api.delete('/api/settings/api-key');
  return data;
};

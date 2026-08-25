import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSettings, updateApiKey, clearApiKey } from '../lib/settings';

export function useSettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  const updateKeyMutation = useMutation({
    mutationFn: (apiKey: string) => updateApiKey(apiKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    }
  });

  const clearKeyMutation = useMutation({
    mutationFn: () => clearApiKey(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    }
  });

  return {
    settings,
    isLoading,
    updateKey: updateKeyMutation.mutateAsync,
    isUpdating: updateKeyMutation.isPending,
    clearKey: clearKeyMutation.mutateAsync,
  };
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getConversations, deleteConversation } from '../lib/conversations';

export function useConversations() {
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
    refetchInterval: 8000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteConversation(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['conversations'] }),
  });

  return {
    conversations,
    isLoading,
    remove: deleteMutation.mutateAsync,
  };
}

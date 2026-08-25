import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPendingApprovals, approveRequest, rejectRequest } from '../lib/api';
import { Approval } from '../types/approval';

export function useApprovals() {
  const queryClient = useQueryClient();

  const { data: pendingApprovals = [], isLoading, error } = useQuery<Approval[]>({
    queryKey: ['approvals', 'pending'],
    queryFn: getPendingApprovals,
    refetchInterval: 5000 // Poll every 5s for demo robustness
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => approveRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals', 'pending'] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => rejectRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals', 'pending'] });
    }
  });

  return {
    pendingApprovals,
    isLoading,
    error,
    approve: approveMutation.mutateAsync,
    reject: rejectMutation.mutateAsync,
    isMutating: approveMutation.isPending || rejectMutation.isPending
  };
}

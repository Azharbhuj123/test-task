import { useQuery } from '@tanstack/react-query';
import { getActivityLog, getApprovalStats } from '../lib/api';

export function useActivityLog() {
  return useQuery({
    queryKey: ['activity'],
    queryFn: getActivityLog,
    refetchInterval: 5000
  });
}

export function useApprovalStats() {
  return useQuery({
    queryKey: ['approvalStats'],
    queryFn: getApprovalStats,
    refetchInterval: 5000
  });
}

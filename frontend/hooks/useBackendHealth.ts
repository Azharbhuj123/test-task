import { useQuery } from '@tanstack/react-query';
import { getHealth } from '../lib/api';

export function useBackendHealth() {
  const { data, isError } = useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    retry: false,
    refetchInterval: 30000
  });

  return {
    isConnected: !isError && data?.status === 'ok',
    serviceName: data?.service
  };
}

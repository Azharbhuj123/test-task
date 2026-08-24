import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listDocuments, uploadDocument, deleteDocument } from '../lib/api';
import { KnowledgeDocument } from '../types/documents';

export function useDocuments() {
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading, error } = useQuery<KnowledgeDocument[]>({
    queryKey: ['documents'],
    queryFn: listDocuments,
    refetchInterval: 15000
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadDocument(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] })
  });

  const deleteMutation = useMutation({
    mutationFn: (name: string) => deleteDocument(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] })
  });

  return {
    documents,
    isLoading,
    error,
    upload: uploadMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}

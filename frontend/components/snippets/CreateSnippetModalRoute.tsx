'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { createSnippet, snippetsQueryKeys } from '@/lib/api/snippets';
import { SnippetInput } from '@/types/snippet';
import { SnippetForm } from './SnippetForm';

const Modal = dynamic(
  () => import('../ui/Modal').then((mod) => mod.Modal),
  { ssr: false },
);

export function CreateSnippetModalRoute() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const closeModal = () => {
    router.back();
  };

  const createMutation = useMutation({
    mutationFn: (payload: SnippetInput) => createSnippet(payload),
    onSuccess: async (created) => {
      await queryClient.invalidateQueries({ queryKey: snippetsQueryKeys.all });
      router.replace(`/snippets/${created._id}`);
    },
  });

  return (
    <Modal title="Create snippet" onClose={closeModal}>
      <SnippetForm
        mode="create"
        submitLabel={createMutation.isPending ? 'Saving...' : 'Create snippet'}
        onSubmit={(payload) => createMutation.mutateAsync(payload)}
      />
    </Modal>
  );
}

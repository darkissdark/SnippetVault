'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  snippetByIdQueryOptions,
  snippetsQueryKeys,
  updateSnippet,
} from '@/lib/api/snippets';
import { Snippet, SnippetInput } from '@/types/snippet';
import { Modal } from '../ui/Modal';
import { SnippetForm } from './SnippetForm';
import { SnippetQueryState } from './SnippetQueryState';

export function EditSnippetModalRoute({
  id,
  initialSnippet,
}: {
  id: string;
  initialSnippet?: Snippet;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const closeModal = () => {
    router.back();
  };

  const snippetQuery = useQuery({
    ...snippetByIdQueryOptions(id),
    initialData: initialSnippet,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: SnippetInput) => updateSnippet(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: snippetsQueryKeys.detail(id),
      });
      await queryClient.invalidateQueries({ queryKey: snippetsQueryKeys.all });
      router.replace(`/snippets/${id}`);
    },
  });

  return (
    <SnippetQueryState query={snippetQuery}>
      {(snippet) => (
        <Modal title="Edit snippet" onClose={closeModal}>
          <SnippetForm
            mode="edit"
            submitLabel={
              updateMutation.isPending ? 'Saving...' : 'Save changes'
            }
            initialValues={{
              title: snippet.title,
              content: snippet.content,
              tags: snippet.tags,
              type: snippet.type,
            }}
            onSubmit={(payload) => updateMutation.mutateAsync(payload)}
          />
        </Modal>
      )}
    </SnippetQueryState>
  );
}

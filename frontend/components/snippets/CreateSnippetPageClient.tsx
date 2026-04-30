'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSnippet, snippetsQueryKeys } from '@/lib/api/snippets';
import { SnippetInput } from '@/types/snippet';
import { SnippetForm } from './SnippetForm';

export function CreateSnippetPageClient() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: SnippetInput) => createSnippet(payload),
    onSuccess: async (created) => {
      await queryClient.invalidateQueries({ queryKey: snippetsQueryKeys.all });
      router.replace(`/snippets/${created._id}`);
    },
  });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <SnippetForm
        mode="create"
        submitLabel={createMutation.isPending ? 'Saving...' : 'Create snippet'}
        onSubmit={(payload) => createMutation.mutateAsync(payload)}
      />
    </div>
  );
}

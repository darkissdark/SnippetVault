'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  snippetByIdQueryOptions,
  snippetsQueryKeys,
  updateSnippet,
} from '@/lib/api/snippets';
import { Snippet, SnippetInput } from '@/types/snippet';
import { SnippetForm } from './SnippetForm';
import { SnippetQueryState } from './SnippetQueryState';

export function EditSnippetPageClient({
  id,
  initialSnippet,
}: {
  id: string;
  initialSnippet?: Snippet;
}) {
  const queryClient = useQueryClient();
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
    },
  });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <SnippetQueryState query={snippetQuery}>
        {(snippet) => (
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
        )}
      </SnippetQueryState>
    </div>
  );
}

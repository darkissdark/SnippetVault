'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSnippet, snippetsQueryKeys } from '@/lib/api/snippets';

export function DeleteSnippetPageClient({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteSnippet(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: snippetsQueryKeys.all });
      queryClient.removeQueries({ queryKey: snippetsQueryKeys.detail(id) });
      router.replace('/');
    },
  });

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h1 className="text-lg font-semibold text-slate-900">Delete snippet</h1>
        <p className="mt-2 text-sm text-slate-700">
          Are you sure you want to delete this snippet? This action cannot be
          undone.
        </p>
        {deleteMutation.isError && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {deleteMutation.error instanceof Error
              ? deleteMutation.error.message
              : 'Failed to delete snippet'}
          </p>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <Link
            href={`/snippets/${id}`}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete snippet'}
          </button>
        </div>
      </div>
    </div>
  );
}

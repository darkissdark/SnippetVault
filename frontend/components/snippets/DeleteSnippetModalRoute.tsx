'use client';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSnippet, snippetsQueryKeys } from '@/lib/api/snippets';

const Modal = dynamic(() => import('../ui/Modal').then((mod) => mod.Modal), {
  ssr: false,
});

export function DeleteSnippetModalRoute({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const handleClose = () => {
    if (!deleteMutation.isPending) {
      router.back();
    }
  };

  const deleteMutation = useMutation({
    mutationFn: () => deleteSnippet(id),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: snippetsQueryKeys.detail(id) });
      await queryClient.invalidateQueries({ queryKey: snippetsQueryKeys.all });
      router.replace('/');
    },
  });

  return (
    <Modal
      title="Delete snippet"
      onClose={handleClose}
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={deleteMutation.isPending}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete snippet'}
          </button>
        </div>
      }
    >
      <p className="text-sm text-slate-700">
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
    </Modal>
  );
}

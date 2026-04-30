import type { Metadata } from 'next';
import { DeleteSnippetPageClient } from '@/components/snippets/DeleteSnippetPageClient';
import { getSnippetById } from '@/lib/api/snippets';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const snippet = await getSnippetById(id);
    return {
      title: `Delete ${snippet.title} | Snippet Vault`,
      description: `Confirm snippet deletion for "${snippet.title}" in Snippet Vault.`,
    };
  } catch {
    return {
      title: 'Delete Snippet | Snippet Vault',
      description: 'Confirm and delete an existing snippet in Snippet Vault.',
    };
  }
}

export default async function DeleteSnippetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DeleteSnippetPageClient id={id} />;
}

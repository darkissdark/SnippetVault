import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { EditSnippetPageClient } from '@/components/snippets/EditSnippetPageClient';
import { getSnippetById } from '@/lib/api/snippets';
import { Snippet } from '@/types/snippet';

const getSnippetByIdCached = cache((id: string) => getSnippetById(id));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const snippet = await getSnippetByIdCached(id);
    return {
      title: `Edit ${snippet.title} | Snippet Vault`,
      description: `Update snippet "${snippet.title}" including content, type, and tags.`,
    };
  } catch {
    return {
      title: 'Edit Snippet | Snippet Vault',
      description: 'Edit an existing snippet in Snippet Vault.',
    };
  }
}

export default async function EditSnippetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let initialSnippet: Snippet;
  try {
    initialSnippet = await getSnippetByIdCached(id);
  } catch {
    notFound();
  }
  return <EditSnippetPageClient id={id} initialSnippet={initialSnippet} />;
}

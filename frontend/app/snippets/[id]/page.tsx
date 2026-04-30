import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { SnippetDetailsClient } from '@/components/snippets/SnippetDetailsClient';
import { BackToListLink } from '@/components/ui/BackToListLink';
import { getSnippetById, snippetByIdQueryOptions } from '@/lib/api/snippets';
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
      title: `${snippet.title} | Snippet Vault`,
      description: snippet.content.slice(0, 155),
    };
  } catch {
    return {
      title: 'Snippet Details | Snippet Vault',
      description: 'View snippet details, tags, and metadata in Snippet Vault.',
    };
  }
}

export default async function SnippetDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const queryClient = new QueryClient();
  let initialSnippet: Snippet;
  try {
    initialSnippet = await getSnippetByIdCached(id);
  } catch {
    notFound();
  }
  queryClient.setQueryData<Snippet>(
    snippetByIdQueryOptions(id).queryKey,
    initialSnippet,
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mx-auto w-full max-w-3xl">
        <BackToListLink className="mb-4 inline-block text-sm text-slate-600 hover:underline" />
        <HydrationBoundary state={dehydrate(queryClient)}>
          <SnippetDetailsClient id={id} initialSnippet={initialSnippet} />
        </HydrationBoundary>
      </div>
    </div>
  );
}

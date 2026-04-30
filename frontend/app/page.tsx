import type { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { SnippetsPageClient } from '@/components/snippets/SnippetsPageClient';
import { snippetsListQueryOptions } from '@/lib/api/snippets';
import {
  getSearchParamPositiveNumber,
  getSearchParamString,
} from '@/lib/utils/queryParams';

const LIMIT = 12;

export const metadata: Metadata = {
  title: 'All Snippets | Snippet Vault',
  description:
    'Browse code snippets in a responsive grid with pagination, live search, and tag filtering in Snippet Vault.',
};

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const params = {
    page: getSearchParamPositiveNumber(resolvedSearchParams.page, 1),
    limit: LIMIT,
    q: getSearchParamString(resolvedSearchParams.q),
    tag: getSearchParamString(resolvedSearchParams.tag),
  };

  const queryClient = new QueryClient();
  const queryOptions = snippetsListQueryOptions(params);
  await queryClient.prefetchQuery(queryOptions);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SnippetsPageClient />
    </HydrationBoundary>
  );
}

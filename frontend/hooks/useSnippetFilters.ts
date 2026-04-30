'use client';

import { useRouter } from 'next/navigation';

export function useSnippetFilters() {
  const router = useRouter();

  const updateFilters = (query: string, tag: string) => {
    const params = new URLSearchParams();
    const normalizedQuery = query.trim();
    const normalizedTag = tag.trim();

    if (normalizedQuery) params.set('q', normalizedQuery);
    if (normalizedTag) params.set('tag', normalizedTag);
    if (normalizedQuery || normalizedTag) params.set('page', '1');

    const queryString = params.toString();
    router.replace(queryString ? `/?${queryString}` : '/');
  };

  return { updateFilters };
}

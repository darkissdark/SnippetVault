'use client';

import { ChangeEvent, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useSnippetFilters } from '@/hooks/useSnippetFilters';
import { snippetTagsQueryOptions } from '@/lib/api/snippets';
import { SNIPPET_LIMITS } from '@/lib/constants/snippets';
import { getSearchParamString } from '@/lib/utils/queryParams';

type HeaderSearchFiltersProps = {
  className?: string;
  initialTagOptions?: string[];
};

export function HeaderSearchFilters({
  className,
  initialTagOptions = [],
}: HeaderSearchFiltersProps) {
  const searchParams = useSearchParams();
  const { updateFilters } = useSnippetFilters();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queryInputRef = useRef<HTMLInputElement | null>(null);
  const tagSelectRef = useRef<HTMLSelectElement | null>(null);
  const tagsQuery = useQuery({
    ...snippetTagsQueryOptions(),
    initialData: initialTagOptions,
  });
  const tagOptions = tagsQuery.data ?? [];

  useEffect(
    () => () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    const nextQuery = getSearchParamString(searchParams.get('q'));
    const nextTag = getSearchParamString(searchParams.get('tag'));

    if (queryInputRef.current && queryInputRef.current.value !== nextQuery) {
      queryInputRef.current.value = nextQuery;
    }
    if (tagSelectRef.current && tagSelectRef.current.value !== nextTag) {
      tagSelectRef.current.value = nextTag;
    }
  }, [searchParams]);

  const applyFilters = (form: HTMLFormElement) => {
    const queryInput = form.elements.namedItem('q') as HTMLInputElement | null;
    const tagInput = form.elements.namedItem('tag') as HTMLSelectElement | null;
    const query = queryInput?.value.trim() ?? '';
    const tag = tagInput?.value.trim() ?? '';
    updateFilters(query, tag);
  };

  const onSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const form = event.currentTarget.form;
    if (!form) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      applyFilters(form);
    }, SNIPPET_LIMITS.DEBOUNCE_SEARCH_MS);
  };

  const onTagChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const form = event.currentTarget.form;
    if (!form) return;
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    applyFilters(form);
  };

  return (
    <div className={className}>
      <form className="grid gap-2 md:grid-cols-[1fr_220px]">
        <input
          ref={queryInputRef}
          name="q"
          type="search"
          defaultValue=""
          onChange={onSearchInputChange}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          placeholder="Search by title or content"
        />
        <select
          ref={tagSelectRef}
          name="tag"
          defaultValue=""
          onChange={onTagChange}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        >
          <option value="">All tags</option>
          {tagOptions.map((tagOption) => (
            <option key={tagOption} value={tagOption}>
              {tagOption}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
}

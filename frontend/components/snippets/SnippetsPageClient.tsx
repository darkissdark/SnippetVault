'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { snippetsListQueryOptions } from '@/lib/api/snippets';
import {
  getSearchParamPositiveNumber,
  getSearchParamString,
} from '@/lib/utils/queryParams';
import { SnippetList } from './SnippetList';
import { Pagination } from '../ui/Pagination';
import { StatusState } from '../ui/StatusState';

const LIMIT = 12;

export function SnippetsPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = getSearchParamPositiveNumber(searchParams.get('page'), 1);
  const q = getSearchParamString(searchParams.get('q'));
  const tag = getSearchParamString(searchParams.get('tag'));

  const params = { page, limit: LIMIT, q, tag };

  const listQuery = useQuery({
    ...snippetsListQueryOptions(params),
  });
  const listData = listQuery.data;
  const hasData = Boolean(listData && listData.items.length > 0);
  const isEmpty =
    listQuery.isSuccess && (!listData || listData.items.length === 0);
  const isUpdatingResults = listQuery.isFetching && hasData;

  const updateSearch = (updates: Record<string, string>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) next.delete(key);
      else next.set(key, value);
    });
    if (updates.page === undefined) next.delete('page');
    const queryString = next.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Snippets</h2>

        {listQuery.isLoading && !hasData && (
          <StatusState variant="loading" message="Loading snippets..." />
        )}

        {listQuery.isError && !hasData && (
          <StatusState
            variant="error"
            message={
              listQuery.error instanceof Error
                ? listQuery.error.message
                : 'Failed to load snippets'
            }
          />
        )}

        {listData && listData.items.length > 0 && (
          <div
            className={`space-y-4 transition-opacity duration-200 ${
              isUpdatingResults
                ? 'pointer-events-none opacity-50'
                : 'opacity-100'
            }`}
          >
            <SnippetList snippets={listData.items} />
            <div className="flex items-center justify-between gap-3">
              <Pagination
                page={listData.page}
                totalPages={listData.totalPages}
                onPageChange={(nextPage) =>
                  updateSearch({ page: String(nextPage) })
                }
              />
              {isUpdatingResults && (
                <span className="animate-pulse text-xs text-slate-500">
                  Updating snippets...
                </span>
              )}
            </div>
          </div>
        )}

        {isEmpty && !isUpdatingResults && (
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-slate-700">
            <p>No snippets found for current filters.</p>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="mt-3 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

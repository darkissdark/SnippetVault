'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { snippetByIdQueryOptions } from '@/lib/api/snippets';
import { formatDateTimeUTC } from '@/lib/utils/date';
import { Snippet } from '@/types/snippet';
import { SnippetQueryState } from './SnippetQueryState';

export function SnippetDetailsClient({
  id,
  initialSnippet,
}: {
  id: string;
  initialSnippet?: Snippet;
}) {
  const snippetQuery = useQuery({
    ...snippetByIdQueryOptions(id),
    initialData: initialSnippet,
  });

  return (
    <SnippetQueryState query={snippetQuery}>
      {(snippet) => (
        <article className="mx-auto w-full max-w-3xl space-y-4 rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              {snippet.title}
            </h1>
            <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">
              {snippet.type}
            </span>
          </div>

          <p className="whitespace-pre-wrap text-slate-700">
            {snippet.content}
          </p>

          <div className="flex flex-wrap gap-2">
            {snippet.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
              >
                #{tag}
              </span>
            ))}
          </div>

          <p className="text-sm text-slate-500">
            {formatDateTimeUTC(snippet.updatedAt)}
          </p>

          <div className="flex gap-3">
            <Link
              href={`/snippets/${id}/edit`}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
            >
              Edit
            </Link>
            <Link
              href={`/snippets/${id}/delete`}
              className="rounded-md border border-red-300 px-4 py-2 text-sm text-red-700 hover:bg-red-50"
            >
              Delete
            </Link>
          </div>
        </article>
      )}
    </SnippetQueryState>
  );
}

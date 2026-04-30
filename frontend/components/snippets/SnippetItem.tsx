import Link from 'next/link';
import { Snippet } from '@/types/snippet';
import { formatDateUTC } from '@/lib/utils/date';

export function SnippetItem({ snippet }: { snippet: Snippet }) {
  return (
    <li className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-900">
          {snippet.title}
        </h3>
        <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
          {snippet.type}
        </span>
      </div>
      <p className="mb-3 line-clamp-3 text-sm text-slate-700">
        {snippet.content}
      </p>
      <div className="mb-3 flex flex-wrap gap-2">
        {snippet.tags.map((tag) => (
          <span
            key={`${snippet._id}-${tag}`}
            className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
          >
            #{tag}
          </span>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between text-sm">
        <span className="text-slate-500">
          {formatDateUTC(snippet.updatedAt)}
        </span>
        <Link
          href={`/snippets/${snippet._id}`}
          className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 font-medium text-white hover:bg-blue-700"
        >
          Open
        </Link>
      </div>
    </li>
  );
}

'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export function CreateSnippetButton() {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const href = queryString ? `/snippets/new?${queryString}` : '/snippets/new';

  return (
    <Link
      href={href}
      className="order-2 inline-flex items-center justify-center gap-2 rounded-md bg-emerald-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-emerald-800 md:order-3"
    >
      <span
        aria-hidden="true"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-base leading-none"
      >
        +
      </span>
      Create snippet
    </Link>
  );
}

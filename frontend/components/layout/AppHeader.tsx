import { Suspense } from 'react';
import Link from 'next/link';
import { CreateSnippetButton } from './CreateSnippetButton';
import { HeaderSearchFilters } from './HeaderSearchFilters';

export function AppHeader({
  initialTagOptions,
}: {
  initialTagOptions: string[];
}) {
  const filtersClassName =
    'order-3 col-span-2 grid gap-2 md:order-2 md:col-span-1 md:grid-cols-[1fr_auto]';

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-3 px-4 py-4 md:grid-cols-[auto_1fr_auto]">
        <Link
          href="/"
          title="Go to Snippet Vault homepage"
          aria-label="Go to Snippet Vault homepage"
          className="flex items-center gap-3"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-lg font-extrabold text-white shadow-sm">
            <span className="text-cyan-100">S</span>
            <span className="text-amber-200">V</span>
          </span>
        </Link>

        <Suspense
          fallback={
            <Link
              href="/snippets/new"
              className="order-2 inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-emerald-700 md:order-3"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-base leading-none"
              >
                +
              </span>
              Create snippet
            </Link>
          }
        >
          <CreateSnippetButton />
        </Suspense>
        <Suspense
          fallback={
            <div className={filtersClassName}>
              <div className="h-10 rounded-md bg-slate-100" />
            </div>
          }
        >
          <HeaderSearchFilters
            initialTagOptions={initialTagOptions}
            className={filtersClassName}
          />
        </Suspense>
      </div>
    </header>
  );
}

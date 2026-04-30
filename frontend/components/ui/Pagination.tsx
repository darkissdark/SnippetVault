import Link from 'next/link';

interface PaginationProps {
  page: number;
  totalPages: number;
  pathname: string;
  q?: string;
  tag?: string;
}

const PAGE_SIBLING_COUNT = 2;

const pageControlBase =
  'inline-flex min-h-8 min-w-8 items-center justify-center rounded-md border px-2.5 text-sm no-underline';
const pageControlLink =
  'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer';
const pageControlActive =
  'border-slate-900 bg-slate-900 text-white cursor-default';
const pageControlDisabled = 'cursor-not-allowed opacity-45 pointer-events-none';

function buildPageItems(
  currentPage: number,
  totalPages: number,
): Array<number | 'ellipsis'> {
  const set = new Set<number>();
  set.add(1);
  set.add(totalPages);
  for (
    let p = Math.max(1, currentPage - PAGE_SIBLING_COUNT);
    p <= Math.min(totalPages, currentPage + PAGE_SIBLING_COUNT);
    p++
  ) {
    set.add(p);
  }

  const sorted = Array.from(set).sort((a, b) => a - b);
  const items: Array<number | 'ellipsis'> = [];
  let prev: number | null = null;
  for (const value of sorted) {
    if (prev !== null && value - prev > 1) items.push('ellipsis');
    items.push(value);
    prev = value;
  }
  return items;
}

function buildListHref(
  pathname: string,
  targetPage: number,
  q?: string,
  tag?: string,
): string {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (tag) params.set('tag', tag);
  if (targetPage > 1) params.set('page', String(targetPage));
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function Pagination({
  page,
  totalPages,
  pathname,
  q,
  tag,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const items = buildPageItems(page, totalPages);
  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  return (
    <nav aria-label="Pagination">
      <ul className="m-0 flex list-none items-center justify-center gap-1.5 p-0">
        <li className="inline-flex">
          {canGoPrevious ? (
            <Link
              href={buildListHref(pathname, page - 1, q, tag)}
              className={`${pageControlBase} ${pageControlLink}`}
              aria-label="Previous page"
            >
              ‹
            </Link>
          ) : (
            <span
              className={`${pageControlBase} ${pageControlLink} ${pageControlDisabled}`}
              aria-hidden="true"
            >
              ‹
            </span>
          )}
        </li>

        {items.map((item, index) => (
          <li
            key={typeof item === 'number' ? `p-${item}` : `e-${index}`}
            className="inline-flex"
          >
            {item === 'ellipsis' ? (
              <span
                className="inline-flex min-h-8 min-w-8 select-none items-center justify-center px-0.5 text-sm text-slate-500"
                aria-hidden="true"
              >
                …
              </span>
            ) : item === page ? (
              <span
                className={`${pageControlBase} ${pageControlActive}`}
                aria-current="page"
              >
                {item}
              </span>
            ) : (
              <Link
                href={buildListHref(pathname, item, q, tag)}
                className={`${pageControlBase} ${pageControlLink}`}
                aria-label={`Go to page ${item}`}
              >
                {item}
              </Link>
            )}
          </li>
        ))}

        <li className="inline-flex">
          {canGoNext ? (
            <Link
              href={buildListHref(pathname, page + 1, q, tag)}
              className={`${pageControlBase} ${pageControlLink}`}
              aria-label="Next page"
            >
              ›
            </Link>
          ) : (
            <span
              className={`${pageControlBase} ${pageControlLink} ${pageControlDisabled}`}
              aria-hidden="true"
            >
              ›
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}

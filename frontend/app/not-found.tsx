import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Snippet Vault - Page not found',
  description: 'Sorry, the page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-6xl items-center justify-center px-4">
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">
          404 - Page not found
        </h1>
        <p className="mt-3 text-slate-600">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}

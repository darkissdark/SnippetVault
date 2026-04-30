import type { Metadata } from 'next';
import './globals.css';
import TanStackProvider from '@/components/providers/TanStackProvider';
import { AppHeader } from '@/components/layout/AppHeader';
import { listSnippetTags } from '@/lib/api/snippets';

export const metadata: Metadata = {
  title: 'Snippet Vault - Developer Snippet Workspace',
  description:
    'Snippet Vault is a searchable workspace for code snippets with tagging, fast filtering, modal editing, and clean API-backed pagination.',
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  let initialTagOptions: string[] = [];
  try {
    initialTagOptions = await listSnippetTags();
  } catch {
    initialTagOptions = [];
  }

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 text-slate-900">
        <TanStackProvider>
          <AppHeader initialTagOptions={initialTagOptions} />
          <main>{children}</main>
          {modal}
        </TanStackProvider>
      </body>
    </html>
  );
}

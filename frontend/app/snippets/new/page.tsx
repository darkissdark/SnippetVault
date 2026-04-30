import type { Metadata } from 'next';
import { CreateSnippetPageClient } from '@/components/snippets/CreateSnippetPageClient';

export const metadata: Metadata = {
  title: 'Create Snippet | Snippet Vault',
  description:
    'Create a new snippet with title, content, tags, and type. Save reusable notes, links, and commands.',
};

export default function NewSnippetPage() {
  return <CreateSnippetPageClient />;
}

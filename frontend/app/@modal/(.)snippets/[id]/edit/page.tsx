import { notFound } from 'next/navigation';
import { EditSnippetModalRoute } from '@/components/snippets/EditSnippetModalRoute';
import { getSnippetById } from '@/lib/api/snippets';
import { Snippet } from '@/types/snippet';

export default async function EditSnippetModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let initialSnippet: Snippet;
  try {
    initialSnippet = await getSnippetById(id);
  } catch {
    notFound();
  }
  return <EditSnippetModalRoute id={id} initialSnippet={initialSnippet} />;
}

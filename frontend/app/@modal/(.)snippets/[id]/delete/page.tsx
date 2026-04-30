import { DeleteSnippetModalRoute } from '@/components/snippets/DeleteSnippetModalRoute';

export default async function DeleteSnippetModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DeleteSnippetModalRoute id={id} />;
}

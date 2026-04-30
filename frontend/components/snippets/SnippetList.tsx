import { Snippet } from '@/types/snippet';
import { SnippetItem } from './SnippetItem';

export function SnippetList({ snippets }: { snippets: Snippet[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {snippets.map((snippet) => (
        <SnippetItem key={snippet._id} snippet={snippet} />
      ))}
    </ul>
  );
}

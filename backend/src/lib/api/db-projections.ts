import { SNIPPET_LIMITS } from '../constants/snippets';

export const getSnippetListProjection = () => ({
  title: 1,
  tags: 1,
  type: 1,
  createdAt: 1,
  updatedAt: 1,
  content: {
    $substrCP: [{ $ifNull: ['$content', ''] }, 0, SNIPPET_LIMITS.PREVIEW_CHARS],
  },
});

export const getSnippetListFindProjection = () => ({
  title: 1,
  tags: 1,
  type: 1,
  createdAt: 1,
  updatedAt: 1,
  content: 1,
});

import { apiFetch } from './client';
import { Snippet, SnippetInput, SnippetListResponse } from '@/types/snippet';

export interface ListSnippetsParams {
  page: number;
  limit: number;
  q?: string;
  tag?: string;
}

export const listSnippets = async (
  params: ListSnippetsParams,
): Promise<SnippetListResponse> =>
  apiFetch<SnippetListResponse>('/snippets', {
    method: 'GET',
    params: { ...params },
  });

export const getSnippetById = async (id: string): Promise<Snippet> =>
  apiFetch<Snippet>(`/snippets/${id}`, { method: 'GET' });

export const listSnippetTags = async (): Promise<string[]> =>
  apiFetch<string[]>('/snippets/tags', { method: 'GET' });

export const createSnippet = async (payload: SnippetInput): Promise<Snippet> =>
  apiFetch<Snippet>('/snippets', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateSnippet = async (
  id: string,
  payload: Partial<SnippetInput>,
): Promise<Snippet> =>
  apiFetch<Snippet>(`/snippets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

export const deleteSnippet = async (id: string): Promise<void> =>
  apiFetch<void>(`/snippets/${id}`, { method: 'DELETE' });

export const snippetsQueryKeys = {
  all: ['snippets'] as const,
  list: (params: ListSnippetsParams) => ['snippets', 'list', params] as const,
  detail: (id: string) => ['snippet', id] as const,
  tags: ['snippets', 'tags'] as const,
};

export const snippetsListQueryOptions = (params: ListSnippetsParams) => ({
  queryKey: snippetsQueryKeys.list(params),
  queryFn: () => listSnippets(params),
});

export const snippetByIdQueryOptions = (id: string) => ({
  queryKey: snippetsQueryKeys.detail(id),
  queryFn: () => getSnippetById(id),
  staleTime: 30_000,
});

export const snippetTagsQueryOptions = () => ({
  queryKey: snippetsQueryKeys.tags,
  queryFn: listSnippetTags,
  staleTime: 5 * 60_000,
});

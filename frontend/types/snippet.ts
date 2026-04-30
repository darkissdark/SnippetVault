export type SnippetType = 'link' | 'note' | 'command';

export interface Snippet {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  type: SnippetType;
  createdAt: string;
  updatedAt: string;
}

export interface SnippetListResponse {
  items: Snippet[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SnippetInput {
  title: string;
  content: string;
  tags: string[];
  type: SnippetType;
}

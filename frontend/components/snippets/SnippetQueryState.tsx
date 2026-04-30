'use client';

import { ReactNode } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { Snippet } from '@/types/snippet';
import { StatusState } from '../ui/StatusState';

type SnippetQueryStateProps = {
  query: UseQueryResult<Snippet, Error>;
  children: (snippet: Snippet) => ReactNode;
  loadingMessage?: string;
  errorFallbackMessage?: string;
  notFoundMessage?: string;
};

export function SnippetQueryState({
  query,
  children,
  loadingMessage = 'Loading snippet...',
  errorFallbackMessage = 'Failed to load snippet',
  notFoundMessage = 'Snippet not found',
}: SnippetQueryStateProps) {
  if (query.isLoading) {
    return <StatusState variant="loading" message={loadingMessage} />;
  }

  if (query.isError) {
    return (
      <StatusState
        variant="error"
        message={
          query.error instanceof Error
            ? query.error.message
            : errorFallbackMessage
        }
      />
    );
  }

  if (!query.data) {
    return <StatusState variant="empty" message={notFoundMessage} />;
  }

  return <>{children(query.data)}</>;
}

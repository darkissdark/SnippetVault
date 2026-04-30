const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

type RequestOptions = RequestInit & {
  params?: Record<string, string | number | undefined>;
};

const buildUrl = (path: string, params?: RequestOptions['params']) => {
  const url = new URL(path, API_BASE_URL);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
};

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { params, headers, ...init } = options;
  const response = await fetch(buildUrl(path, params), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      message?: string | string[];
    } | null;
    const message = Array.isArray(data?.message)
      ? data.message.join(', ')
      : (data?.message ?? `Request failed with status ${response.status}`);
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

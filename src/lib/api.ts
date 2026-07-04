import type { ApiResponse } from '@/lib/errors';

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const body = (await res.json()) as ApiResponse<T>;

  if (!body.success) {
    throw new Error(body.error?.message ?? 'Lỗi không xác định');
  }

  return body.data as T;
}

export const api = {
  get: <T>(url: string) => fetchJson<T>(url),
  post: <T>(url: string, data?: unknown) =>
    fetchJson<T>(url, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
  put: <T>(url: string, data?: unknown) =>
    fetchJson<T>(url, { method: 'PUT', body: data ? JSON.stringify(data) : undefined }),
  delete: (url: string) => fetchJson<void>(url, { method: 'DELETE' }),
};

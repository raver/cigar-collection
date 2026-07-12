const API_BASE = import.meta.env.VITE_API_URL || '';

export interface Cigar {
  id: number;
  name: string;
  factory: string;
  era: string;
  theme: string;
  imageWatermarked: string;
  imageOriginal?: string;
  orientation: 'portrait' | 'landscape';
  slug: string;
  createdAt: string;
}

export interface Comment {
  id: number;
  cigarId: number | null;
  authorName: string;
  content: string;
  quoteId: number | null;
  createdAt: string;
  quote?: { id: number; authorName: string; content: string } | null;
}

export class ApiError extends Error {
  status: number;
  body: unknown;
  field: string | null;

  constructor(status: number, message: string, body?: unknown, field?: string | null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
    this.field = field ?? null;
  }
}

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    let body: unknown;
    try { body = await res.json(); } catch { /* ignore */ }

    // 优先用服务端返回的错误信息
    const serverMsg = body && typeof body === 'object' && 'error' in body
      ? String((body as Record<string, unknown>).error)
      : null;
    const field = body && typeof body === 'object' && 'field' in body
      ? String((body as Record<string, unknown>).field)
      : null;

    throw new ApiError(
      res.status,
      serverMsg || `请求失败 (${res.status})`,
      body,
      field,
    );
  }
  return res.json();
}

export const api = {
  getCigars: () => fetchApi<Cigar[]>('/api/cigars'),
  getCigar: (slug: string) => fetchApi<Cigar>(`/api/cigars/${slug}`),
  getCigarComments: (id: number) => fetchApi<Comment[]>(`/api/cigars/${id}/comments`),
  getGuestbook: (page = 1) => fetchApi<{ comments: Comment[]; total: number; page: number; totalPages: number }>(`/api/guestbook?page=${page}`),
  postComment: (data: { cigar_id?: number | null; author_name: string; author_email?: string; content: string; quote_id?: number | null }) =>
    fetchApi<Comment>('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
};

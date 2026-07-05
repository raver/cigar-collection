const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface Cigar {
  id: number;
  name: string;
  factory: string;
  era: string;
  theme: string;
  imageWatermarked: string;
  imageOriginal?: string;
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

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getCigars: () => fetchApi<Cigar[]>('/api/cigars'),
  getCigar: (slug: string) => fetchApi<Cigar>(`/api/cigars/${slug}`),
  getCigarComments: (id: number) => fetchApi<Comment[]>(`/api/cigars/${id}/comments`),
  getGuestbook: (page = 1) => fetchApi<{ comments: Comment[]; total: number; page: number; totalPages: number }>(`/api/guestbook?page=${page}`),
  postComment: (data: { cigar_id?: number | null; author_name: string; author_email: string; content: string; quote_id?: number | null }) =>
    fetchApi<Comment>('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
};

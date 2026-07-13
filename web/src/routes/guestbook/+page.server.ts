import type { PageServerLoad } from './$types';

const API_BASE = process.env.API_TARGET || 'http://localhost:3001';

export const load: PageServerLoad = async ({ fetch, url }) => {
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  try {
    const res = await fetch(`${API_BASE}/api/guestbook?page=${page}`);
    if (!res.ok) throw new Error(`API responded with ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[SSR] Failed to fetch guestbook:', err);
    return { comments: [], total: 0, page: 1, totalPages: 0 };
  }
};
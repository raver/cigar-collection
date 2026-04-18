import type { PageServerLoad } from './$types';
import { api } from '$lib/api.js';

export const load: PageServerLoad = async ({ url }) => {
  const page = parseInt(url.searchParams.get('page') || '1');
  try {
    const data = await api.getGuestbook(page);
    return data;
  } catch {
    return { comments: [], total: 0, page: 1, totalPages: 0 };
  }
};

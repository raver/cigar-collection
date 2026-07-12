import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

const API_BASE = process.env.API_TARGET || 'http://localhost:3001';

export const load: PageServerLoad = async ({ params, fetch }) => {
  try {
    const cigarRes = await fetch(`${API_BASE}/api/cigars/${params.slug}`);
    if (cigarRes.status === 404) throw error(404, { message: '未找到该烟标' });
    if (!cigarRes.ok) throw new Error(`API responded with ${cigarRes.status}`);
    const cigar = await cigarRes.json();

    const commentsRes = await fetch(`${API_BASE}/api/cigars/${cigar.id}/comments`);
    if (!commentsRes.ok) throw new Error(`API responded with ${commentsRes.status}`);
    const comments = await commentsRes.json();

    return { cigar, comments };
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'status' in e && (e as any).status === 404) {
      throw e; // 重新抛出 SvelteKit 404
    }
    console.error('[SSR] Failed to load cigar detail:', e);
    throw error(500, { message: '加载失败，请稍后再试' });
  }
};

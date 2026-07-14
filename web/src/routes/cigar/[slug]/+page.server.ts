import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

const API_BASE = process.env.API_TARGET || 'http://localhost:3001';

export const load: PageServerLoad = async ({ params, url, fetch }) => {
  try {
    // 先获取烟标详情（需要拿到 numeric id 才能查留言）
    const cigarRes = await fetch(`${API_BASE}/api/cigars/${params.slug}`);
    if (cigarRes.status === 404) throw error(404, { message: '未找到该烟标' });
    if (!cigarRes.ok) throw new Error(`API responded with ${cigarRes.status}`);
    const cigar = await cigarRes.json();

    // 并行获取：留言 + 邻居信息
    const [commentsRes, neighborsRes] = await Promise.all([
      fetch(`${API_BASE}/api/cigars/${cigar.id}/comments`).catch(() => null),
      fetch(`${API_BASE}/api/cigars/${params.slug}/neighbors${url.search}`).catch(() => null),
    ]);

    let comments: unknown[] = [];
    if (commentsRes && commentsRes.ok) {
      comments = await commentsRes.json();
    }

    let neighbors = { prev: null, next: null, total: 0, current: 0 };
    if (neighborsRes && neighborsRes.ok) {
      neighbors = await neighborsRes.json();
    }

    return { cigar, comments, neighbors };
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'status' in e && (e as any).status === 404) {
      throw e;
    }
    console.error('[SSR] Failed to load cigar detail:', e);
    throw error(500, { message: '加载失败，请稍后再试' });
  }
};

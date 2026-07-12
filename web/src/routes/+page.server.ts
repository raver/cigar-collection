import type { PageServerLoad } from './$types';

// Docker Compose 内部：cigar-web → cigar-api:3001
// 开发环境：Vite proxy 将 /api 转发到 localhost:3001
const API_BASE = process.env.API_TARGET || 'http://localhost:3001';

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const res = await fetch(`${API_BASE}/api/cigars`);
    if (!res.ok) throw new Error(`API responded with ${res.status}`);
    const cigars: Array<{ name: string }> = await res.json();
    const shuffled = cigars.sort(() => Math.random() - 0.5);
    return { randomCigars: shuffled.slice(0, 6) };
  } catch (err) {
    console.error('[SSR] Failed to fetch cigars for homepage:', err);
    return { randomCigars: [] };
  }
};

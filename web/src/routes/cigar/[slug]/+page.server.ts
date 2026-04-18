import type { PageServerLoad } from './$types';
import { api } from '$lib/api.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const cigar = await api.getCigar(params.slug);
    const comments = await api.getCigarComments(cigar.id);
    return { cigar, comments };
  } catch (e: any) {
    if (e?.message?.includes('404')) {
      throw error(404, { message: '未找到该烟标' });
    }
    throw error(500, { message: '加载失败，请稍后再试' });
  }
};

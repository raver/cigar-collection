import type { PageServerLoad } from './$types';
import { api } from '$lib/api.js';

export const load: PageServerLoad = async ({ params }) => {
  const cigar = await api.getCigar(params.slug);
  const comments = await api.getCigarComments(cigar.id);
  return { cigar, comments };
};

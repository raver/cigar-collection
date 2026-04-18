import type { PageServerLoad } from './$types';
import { api } from '$lib/api.js';

export const load: PageServerLoad = async () => {
  try {
    const cigars = await api.getCigars();
    const shuffled = cigars.sort(() => Math.random() - 0.5);
    return { randomCigars: shuffled.slice(0, 6) };
  } catch {
    return { randomCigars: [] };
  }
};

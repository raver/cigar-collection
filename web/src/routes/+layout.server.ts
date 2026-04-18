import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url }) => {
  return {
    isAdmin: url.pathname.startsWith('/admin')
  };
};

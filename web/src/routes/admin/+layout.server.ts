import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  if (url.pathname === '/admin/login') return;
  const session = cookies.get('admin_session');
  if (!session) throw redirect(302, '/admin/login');
};

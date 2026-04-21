import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  if (url.pathname === '/admin/login') return;
  // Note: This only checks cookie existence for UX (redirect unauthenticated users).
  // Actual security is enforced by Hono authMiddleware on the API layer,
  // which validates the HMAC signature on every request.
  const session = cookies.get('cigar_session');
  if (!session) throw redirect(302, '/admin/login');
};

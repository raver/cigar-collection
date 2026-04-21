import { createMiddleware } from 'hono/factory';
import { getCookie } from 'hono/cookie';
import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-change-me';

function signToken(payload: string): string {
  const hmac = crypto.createHmac('sha256', SESSION_SECRET);
  hmac.update(payload);
  return `${payload}.${hmac.digest('hex')}`;
}

function verifyToken(token: string): string | null {
  const dotIndex = token.indexOf('.');
  if (dotIndex === -1) return null;
  const payload = token.substring(0, dotIndex);
  const sig = token.substring(dotIndex + 1);
  const expected = signToken(payload);
  const expectedSig = expected.substring(dotIndex + 1);
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;
  return payload;
}

export function createSession(username: string): string {
  return signToken(username);
}

export const authMiddleware = createMiddleware(async (c, next) => {
  const token = getCookie(c, 'cigar_session');
  if (!token) return c.json({ error: 'Unauthorized' }, 401);
  const username = verifyToken(token);
  if (!username) return c.json({ error: 'Invalid session' }, 401);
  c.set('adminUser', username);
  await next();
});

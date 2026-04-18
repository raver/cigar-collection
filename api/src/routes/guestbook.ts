import { Hono } from 'hono';
import { db } from '../db/index.js';
import { comments } from '../db/schema.js';
import { eq, desc, and, isNull, count, sql } from 'drizzle-orm';

const app = new Hono();

// GET /api/guestbook — 公共留言（分页）
app.get('/guestbook', async (c) => {
  const page = Math.max(1, parseInt(c.req.query('page') || '1'));
  const limit = 20;
  const offset = (page - 1) * limit;

  const [{ total }] = await db.select({ total: count() })
    .from(comments)
    .where(and(isNull(comments.cigarId), eq(comments.status, 'approved')));

  const rows = await db.select({
    id: comments.id, authorName: comments.authorName,
    content: comments.content, quoteId: comments.quoteId, createdAt: comments.createdAt,
  }).from(comments)
    .where(and(isNull(comments.cigarId), eq(comments.status, 'approved')))
    .orderBy(desc(comments.createdAt))
    .limit(limit).offset(offset);

  return c.json({ comments: rows, total, page, totalPages: Math.ceil(total / limit) });
});

export default app;

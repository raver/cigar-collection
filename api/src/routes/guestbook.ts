import { Hono } from 'hono';
import { db } from '../db/index.js';
import { comments } from '../db/schema.js';
import { eq, desc, and, isNull, count, inArray } from 'drizzle-orm';

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

  // 获取所有被引用的留言
  const quoteIds = rows.map(r => r.quoteId).filter((id): id is number => id !== null);
  const quotes = quoteIds.length > 0
    ? await db.select({
        id: comments.id,
        authorName: comments.authorName,
        content: comments.content,
      }).from(comments)
      .where(inArray(comments.id, quoteIds))
    : [];

  const quoteMap = new Map(quotes.map(q => [q.id, q]));

  // 组装引用信息
  const result = rows.map(row => ({
    ...row,
    quote: row.quoteId ? quoteMap.get(row.quoteId) ?? null : null,
  }));

  return c.json({ comments: result, total, page, totalPages: Math.ceil(total / limit) });
});

export default app;

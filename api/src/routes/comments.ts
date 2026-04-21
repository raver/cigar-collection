import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db/index.js';
import { comments } from '../db/schema.js';
import { eq, desc, and, inArray } from 'drizzle-orm';

const app = new Hono();

const commentSchema = z.object({
  cigar_id: z.number().nullable().optional(),
  author_name: z.string().min(1).max(50),
  author_email: z.string().email().max(100),
  content: z.string().min(1).max(1000),
  quote_id: z.number().nullable().optional(),
});

// POST /comments — 提交留言
app.post('/comments', async (c) => {
  const body = await c.req.json();
  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const { cigar_id, author_name, author_email, content, quote_id } = parsed.data;
  const [row] = await db.insert(comments).values({
    cigarId: cigar_id ?? null,
    authorName: author_name,
    authorEmail: author_email,
    content,
    quoteId: quote_id ?? null,
  }).returning();
  return c.json(row, 201);
});

// GET /cigars/:id/comments — 某烟标的已审核留言
app.get('/cigars/:id/comments', async (c) => {
  const id = parseInt(c.req.param('id'));
  const rows = await db.select({
    id: comments.id, cigarId: comments.cigarId, authorName: comments.authorName,
    content: comments.content, quoteId: comments.quoteId, createdAt: comments.createdAt,
  }).from(comments)
    .where(and(eq(comments.cigarId, id), eq(comments.status, 'approved')))
    .orderBy(desc(comments.createdAt));

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

  return c.json(result);
});

export default app;

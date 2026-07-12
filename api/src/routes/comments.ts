import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db/index.js';
import { comments } from '../db/schema.js';
import { eq, desc, and, inArray } from 'drizzle-orm';
import { rateLimit } from '../middleware/rate-limit.js';

const app = new Hono();

// 评论提交限流：每 IP 每分钟最多 5 条
app.use('/comments', rateLimit());

const commentSchema = z.object({
  cigar_id: z.number().nullable().optional(),
  author_name: z.string({ required_error: '请输入姓名' })
    .min(1, '请输入姓名')
    .max(50, '姓名不能超过 50 个字'),
  author_email: z.string()
    .email('邮箱格式不正确')
    .max(100, '邮箱不能超过 100 个字符')
    .optional()
    .nullable()
    .or(z.literal('')),
  content: z.string({ required_error: '请输入留言内容' })
    .min(1, '请输入留言内容')
    .max(1000, '留言内容不能超过 1000 个字'),
  quote_id: z.number().nullable().optional(),
});

// POST /comments — 提交留言
app.post('/comments', async (c) => {
  const body = await c.req.json();
  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) {
    // 将 Zod 校验错误转成友好的中文提示，并带字段名
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstKey = Object.keys(fieldErrors)[0];
    const firstError = firstKey ? String((fieldErrors as Record<string, string[] | undefined>)[firstKey]?.[0] || '') : '';
    return c.json({
      error: firstError || '请检查输入内容',
      field: firstKey || undefined,
    }, 400);
  }

  const { cigar_id, author_name, author_email, content, quote_id } = parsed.data;
  const email = author_email && typeof author_email === 'string' && author_email.trim()
    ? author_email.trim()
    : null;

  try {
    const [row] = await db.insert(comments).values({
      cigarId: cigar_id ?? null,
      authorName: author_name,
      authorEmail: email,
      content,
      quoteId: quote_id ?? null,
    }).returning();
    return c.json(row, 201);
  } catch (err) {
    console.error('Comment insert failed:', err);
    return c.json({ error: '留言提交失败，请稍后再试。如果问题持续，请联系管理员。' }, 500);
  }
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

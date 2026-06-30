import { Hono } from 'hono';
import { setCookie, deleteCookie } from 'hono/cookie';
import bcrypt from 'bcryptjs';
import { db } from '../db/index.js';
import { admins, cigars, comments } from '../db/schema.js';
import { asc, desc, eq, inArray } from 'drizzle-orm';
import { authMiddleware, createSession } from '../middleware/auth.js';
import { buildCigarNameSortKey } from '../services/cigar-sort.js';

const app = new Hono();

// POST /admin/api/login
app.post('/login', async (c) => {
  const { username, password } = await c.req.json();
  if (!username || !password) return c.json({ error: 'Invalid credentials' }, 401);
  const [admin] = await db.select().from(admins).where(eq(admins.username, username));
  if (!admin || !admin.passwordHash) return c.json({ error: 'Invalid credentials' }, 401);
  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return c.json({ error: 'Invalid credentials' }, 401);
  const token = createSession(username);
  setCookie(c, 'cigar_session', token, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    maxAge: 86400 * 7, path: '/',
  });
  return c.json({ ok: true });
});

// POST /admin/api/logout
app.post('/logout', (c) => {
  deleteCookie(c, 'cigar_session', { path: '/' });
  return c.json({ ok: true });
});

// All routes below require auth
app.use('/*', authMiddleware);

// GET /admin/api/cigars — 按名称排序后的烟标列表
app.get('/cigars', async (c) => {
  const rows = await db.select({
    id: cigars.id,
    name: cigars.name,
    factory: cigars.factory,
    era: cigars.era,
    theme: cigars.theme,
    slug: cigars.slug,
    imageWatermarked: cigars.imageWatermarked,
  }).from(cigars).orderBy(asc(cigars.nameSortKey), asc(cigars.id));

  return c.json(rows);
});

// GET /admin/api/comments?status=pending
app.get('/comments', async (c) => {
  const status = c.req.query('status') || 'pending';
  const rows = await db.select().from(comments)
    .where(eq(comments.status, status as any))
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

// PATCH /admin/api/comments/:id — 审核
app.patch('/comments/:id', async (c) => {
  const { status } = await c.req.json();
  if (!['approved', 'rejected', 'hidden'].includes(status)) {
    return c.json({ error: 'Invalid status' }, 400);
  }
  await db.update(comments).set({ status: status as any })
    .where(eq(comments.id, parseInt(c.req.param('id'))));
  return c.json({ ok: true });
});

// DELETE /admin/api/comments/:id — 逻辑删除
app.delete('/comments/:id', async (c) => {
  await db.update(comments).set({ status: 'deleted' })
    .where(eq(comments.id, parseInt(c.req.param('id'))));
  return c.json({ ok: true });
});

// POST /admin/api/cigars — 添加烟标（含图片上传）
// 注意：图片处理在 Task 5 实现，这里先做 FormData 解析和数据库插入
app.post('/cigars', async (c) => {
  const formData = await c.req.formData();
  const name = formData.get('name') as string;
  const factory = formData.get('factory') as string;
  const era = formData.get('era') as string;
  const theme = formData.get('theme') as string;
  const imageFile = formData.get('image') as File | null;

  if (!name || !factory || !era || !theme || !imageFile) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  const { nanoid } = await import('nanoid');
  const nameSortKey = buildCigarNameSortKey(name);
  const slugBase = nameSortKey || 'cigar';
  const slug = `${slugBase}-${nanoid(6)}`;

  const { processAndUpload } = await import('../services/image.js');
  const { originalPath, watermarkedPath } = await processAndUpload(imageFile, slug);

  const [row] = await db.insert(cigars).values({
    name, nameSortKey, factory, era: era as any, theme,
    imageOriginal: originalPath, imageWatermarked: watermarkedPath, slug,
  }).returning();
  return c.json(row, 201);
});

// POST /admin/api/cigars/sort-by-name — 为全部烟标重建名称排序键和 slug
app.post('/cigars/sort-by-name', async (c) => {
  const rows = await db.select({
    id: cigars.id,
    name: cigars.name,
    nameSortKey: cigars.nameSortKey,
    slug: cigars.slug,
  }).from(cigars);

  let updatedCount = 0;

  for (const row of rows) {
    const nextSortKey = buildCigarNameSortKey(row.name);
    if (nextSortKey === row.nameSortKey) continue;

    const lastDashIndex = row.slug.lastIndexOf('-');
    const nanoidPart = lastDashIndex >= 0 ? row.slug.slice(lastDashIndex) : `-${Math.random().toString(36).slice(2, 8)}`;
    const newSlug = nextSortKey + nanoidPart;

    await db.update(cigars)
      .set({ nameSortKey: nextSortKey, slug: newSlug })
      .where(eq(cigars.id, row.id));
    updatedCount += 1;
  }

  return c.json({ ok: true, updatedCount });
});

// PUT /admin/api/cigars/:id — 编辑属性
app.put('/cigars/:id', async (c) => {
  const body = await c.req.json();
  const updates: Record<string, unknown> = {};
  for (const key of ['name', 'factory', 'era', 'theme'] as const) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  if (typeof body.name === 'string') {
    updates.nameSortKey = buildCigarNameSortKey(body.name);

    const [existing] = await db.select({ slug: cigars.slug })
      .from(cigars)
      .where(eq(cigars.id, parseInt(c.req.param('id'))));

    if (existing) {
      const lastDashIndex = existing.slug.lastIndexOf('-');
      const nanoidPart = lastDashIndex >= 0 ? existing.slug.slice(lastDashIndex) : `-${Math.random().toString(36).slice(2, 8)}`;
      updates.slug = updates.nameSortKey + nanoidPart;
    }
  }
  if (Object.keys(updates).length === 0) return c.json({ error: 'No fields to update' }, 400);
  await db.update(cigars).set(updates as any)
    .where(eq(cigars.id, parseInt(c.req.param('id'))));
  return c.json({ ok: true });
});

// DELETE /admin/api/cigars/:id — 物理删除（CASCADE 删除留言）
app.delete('/cigars/:id', async (c) => {
  await db.delete(cigars).where(eq(cigars.id, parseInt(c.req.param('id'))));
  return c.json({ ok: true });
});

export default app;

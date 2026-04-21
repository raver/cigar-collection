import { Hono } from 'hono';
import { setCookie, deleteCookie } from 'hono/cookie';
import bcrypt from 'bcryptjs';
import { db } from '../db/index.js';
import { admins, cigars, comments } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { authMiddleware, createSession } from '../middleware/auth.js';

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

// GET /admin/api/comments?status=pending
app.get('/comments', async (c) => {
  const status = c.req.query('status') || 'pending';
  const rows = await db.select().from(comments)
    .where(eq(comments.status, status as any))
    .orderBy(desc(comments.createdAt));
  return c.json(rows);
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
  const slug = `${name.toLowerCase().replace(/[\s]+/g, '-')}-${nanoid(6)}`;

  const { processAndUpload } = await import('../services/image.js');
  const { originalPath, watermarkedPath } = await processAndUpload(imageFile, slug);

  const [row] = await db.insert(cigars).values({
    name, factory, era: era as any, theme,
    imageOriginal: originalPath, imageWatermarked: watermarkedPath, slug,
  }).returning();
  return c.json(row, 201);
});

// PUT /admin/api/cigars/:id — 编辑属性
app.put('/cigars/:id', async (c) => {
  const body = await c.req.json();
  const updates: Record<string, unknown> = {};
  for (const key of ['name', 'factory', 'era', 'theme'] as const) {
    if (body[key] !== undefined) updates[key] = body[key];
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

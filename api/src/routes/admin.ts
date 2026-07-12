import { Hono } from 'hono';
import { setCookie, deleteCookie } from 'hono/cookie';
import bcrypt from 'bcryptjs';
import { db } from '../db/index.js';
import { admins, cigars, comments, type NewCigar } from '../db/schema.js';
import { asc, desc, eq, inArray } from 'drizzle-orm';
import { authMiddleware, createSession } from '../middleware/auth.js';
import { buildCigarNameSortKey } from '../services/cigar-sort.js';

// ── 类型安全的 enum 常量 ──
const STATUSES = ['pending', 'approved', 'rejected', 'hidden', 'deleted'] as const;
type CommentStatus = typeof STATUSES[number];

const ERAS = ['80年代', '90年代', '2000年以后', '不详'] as const;
type CigarEra = typeof ERAS[number];

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
    sameSite: 'Lax',  // 单人后台，SameSite 已覆盖 95% CSRF 场景，暂不加 Token
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
    orientation: cigars.orientation,
    slug: cigars.slug,
    imageWatermarked: cigars.imageWatermarked,
  }).from(cigars).orderBy(asc(cigars.nameSortKey), asc(cigars.id));

  return c.json(rows);
});

// GET /admin/api/cigars/:id — 单条烟标详情（编辑页预填）
app.get('/cigars/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400);
  const [row] = await db.select().from(cigars).where(eq(cigars.id, id));
  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json(row);
});

// GET /admin/api/comments?status=pending
app.get('/comments', async (c) => {
  const rawStatus = c.req.query('status') || 'pending';
  const status: CommentStatus = STATUSES.includes(rawStatus as CommentStatus)
    ? (rawStatus as CommentStatus)
    : 'pending';
  const rows = await db.select({
    id: comments.id,
    cigarId: comments.cigarId,
    authorName: comments.authorName,
    authorEmail: comments.authorEmail,
    content: comments.content,
    status: comments.status,
    quoteId: comments.quoteId,
    createdAt: comments.createdAt,
    cigarName: cigars.name,
    cigarSlug: cigars.slug,
  }).from(comments)
    .leftJoin(cigars, eq(comments.cigarId, cigars.id))
    .where(eq(comments.status, status))
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
  const { status: rawStatus } = await c.req.json();
  if (!['approved', 'rejected', 'hidden'].includes(rawStatus)) {
    return c.json({ error: 'Invalid status' }, 400);
  }
  const status = rawStatus as 'approved' | 'rejected' | 'hidden';
  await db.update(comments).set({ status })
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
  const eraRaw = formData.get('era') as string;
  const theme = formData.get('theme') as string;
  const imageFile = formData.get('image') as File | null;
  const orientationRaw = formData.get('orientation') as string;
  const orientation = (orientationRaw === 'landscape' ? 'landscape' : 'portrait') as 'portrait' | 'landscape';

  if (!name || !factory || !eraRaw || !theme || !imageFile) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  if (!ERAS.includes(eraRaw as CigarEra)) {
    return c.json({ error: `Invalid era. Must be one of: ${ERAS.join(', ')}` }, 400);
  }
  const era = eraRaw as CigarEra;

  const { nanoid } = await import('nanoid');
  const nameSortKey = buildCigarNameSortKey(name);
  const slugBase = nameSortKey || 'cigar';
  const slug = `${slugBase}-${nanoid(6)}`;

  const { processAndUpload } = await import('../services/image.js');
  const { originalPath, watermarkedPath } = await processAndUpload(imageFile, slug, orientation);

  const [row] = await db.insert(cigars).values({
    name, nameSortKey, factory, era, theme,
    imageOriginal: originalPath, imageWatermarked: watermarkedPath,
    orientation, slug,
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

// PUT /admin/api/cigars/:id — 编辑属性 + 可选替换图片
// 支持两种请求格式：
//   - JSON: { name?, factory?, era?, theme?, orientation? }
//   - FormData: 字段同上 + 可选 image 文件
app.put('/cigars/:id', async (c) => {
  const cigarId = parseInt(c.req.param('id'));
  if (isNaN(cigarId)) return c.json({ error: 'Invalid id' }, 400);

  const contentType = c.req.header('content-type') || '';
  const isFormData = contentType.includes('multipart/form-data');

  const updates: Record<string, unknown> = {};

  if (isFormData) {
    const formData = await c.req.formData();

    for (const key of ['name', 'factory', 'era', 'theme', 'orientation'] as const) {
      const val = formData.get(key);
      if (val !== null && typeof val === 'string' && val !== '') {
        updates[key] = key === 'orientation'
          ? (val === 'landscape' ? 'landscape' : 'portrait')
          : val;
      }
    }

    // 可选图片替换
    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.size > 0) {
      // 读取 name 字段（可能已在 updates 中，也可能在 formData 里）
      const name = typeof updates.name === 'string' ? updates.name : formData.get('name') as string;
      const orientation = (updates.orientation as string) || (formData.get('orientation') as string) || 'portrait';

      // 获取现有记录用于 slug 和 orientation
      const [existing] = await db.select({
        slug: cigars.slug,
        orientation: cigars.orientation,
      }).from(cigars).where(eq(cigars.id, cigarId));

      const slug = existing?.slug || `${buildCigarNameSortKey(name || 'cigar')}-unknown`;
      const orient = (orientation === 'landscape' ? 'landscape' : 'portrait') as 'portrait' | 'landscape';

      const { processAndUpload } = await import('../services/image.js');
      const { originalPath, watermarkedPath } = await processAndUpload(imageFile, slug, orient);
      updates.imageOriginal = originalPath;
      updates.imageWatermarked = watermarkedPath;
    }
  } else {
    const body = await c.req.json();
    for (const key of ['name', 'factory', 'era', 'theme', 'orientation'] as const) {
      if (body[key] !== undefined) updates[key] = body[key];
    }
  }

  // 名称变更时重算 nameSortKey 和 slug
  if (typeof updates.name === 'string') {
    updates.nameSortKey = buildCigarNameSortKey(updates.name as string);

    const [existing] = await db.select({ slug: cigars.slug })
      .from(cigars)
      .where(eq(cigars.id, cigarId));

    if (existing) {
      const lastDashIndex = existing.slug.lastIndexOf('-');
      const nanoidPart = lastDashIndex >= 0 ? existing.slug.slice(lastDashIndex) : `-${Math.random().toString(36).slice(2, 8)}`;
      updates.slug = updates.nameSortKey + nanoidPart;
    }
  }

  if (Object.keys(updates).length === 0) return c.json({ error: 'No fields to update' }, 400);
  await db.update(cigars).set(updates as Partial<NewCigar>).where(eq(cigars.id, cigarId));
  return c.json({ ok: true });
});

// DELETE /admin/api/cigars/:id — 物理删除（CASCADE 删除留言）
app.delete('/cigars/:id', async (c) => {
  await db.delete(cigars).where(eq(cigars.id, parseInt(c.req.param('id'))));
  return c.json({ ok: true });
});

export default app;

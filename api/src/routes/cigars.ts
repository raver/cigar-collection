import { Hono } from 'hono';
import { db } from '../db/index.js';
import { cigars } from '../db/schema.js';
import { asc, eq } from 'drizzle-orm';

const app = new Hono();

// GET /api/cigars — 所有烟标（前端一次性加载）
app.get('/', async (c) => {
  const rows = await db.select({
    id: cigars.id, name: cigars.name, factory: cigars.factory,
    era: cigars.era, theme: cigars.theme,
    imageWatermarked: cigars.imageWatermarked, slug: cigars.slug,
  }).from(cigars).orderBy(asc(cigars.nameSortKey), asc(cigars.id));
  return c.json(rows);
});

// GET /api/cigars/:slug — 单个烟标详情
app.get('/:slug', async (c) => {
  const { slug } = c.req.param();
  const rows = await db.select().from(cigars).where(eq(cigars.slug, slug));
  if (rows.length === 0) return c.json({ error: 'Not found' }, 404);
  return c.json(rows[0]);
});

export default app;

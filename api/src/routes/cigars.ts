import { Hono } from 'hono';
import { db } from '../db/index.js';
import { cigars } from '../db/schema.js';
import { asc, eq, and, ilike, type SQL } from 'drizzle-orm';

const app = new Hono();

const ERA_VALUES = ['80年代', '90年代', '2000年以后', '不详'] as const;
type Era = (typeof ERA_VALUES)[number];

function isEra(value: string): value is Era {
  return (ERA_VALUES as readonly string[]).includes(value);
}

// GET /api/cigars — 所有烟标（前端一次性加载）
app.get('/', async (c) => {
  const rows = await db.select({
    id: cigars.id, name: cigars.name, factory: cigars.factory,
    era: cigars.era, theme: cigars.theme,
    imageWatermarked: cigars.imageWatermarked,
    orientation: cigars.orientation,
    slug: cigars.slug,
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

// GET /api/cigars/:slug/neighbors — 获取前后相邻烟标（支持筛选）
app.get('/:slug/neighbors', async (c) => {
  const { slug } = c.req.param();
  const { name, factory, era, theme } = c.req.query();

  if (era && !isEra(era)) {
    return c.json({ error: 'Invalid era filter' }, 400);
  }
  const eraFilter: Era | undefined = era && isEra(era) ? era : undefined;

  const conditions: SQL[] = [];
  if (factory) conditions.push(eq(cigars.factory, factory));
  if (eraFilter) conditions.push(eq(cigars.era, eraFilter));
  if (theme) conditions.push(eq(cigars.theme, theme));
  if (name) conditions.push(ilike(cigars.name, `%${name}%`));

  const rows = await db
    .select({
      slug: cigars.slug,
      name: cigars.name,
      imageWatermarked: cigars.imageWatermarked,
    })
    .from(cigars)
    .where(and(...conditions))
    .orderBy(asc(cigars.nameSortKey), asc(cigars.id));

  const idx = rows.findIndex((r) => r.slug === slug);
  if (idx === -1) return c.json({ error: 'Not found' }, 404);

  return c.json({
    prev: idx > 0 ? rows[idx - 1] : null,
    next: idx < rows.length - 1 ? rows[idx + 1] : null,
    total: rows.length,
    current: idx + 1,
  });
});

export default app;

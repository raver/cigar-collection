# 烟标详情页导航优化方案（终稿）

> 综合 Kimi K2.7 方案 + Copilot 初版方案，取两者之长，补两者之短。

## 0. 两份方案对比

| 维度 | Kimi K2.7 方案 | Copilot 初版方案 | 终稿采用 |
|------|---------------|-----------------|---------|
| 返回按钮定位 | 移动 `fixed` / PC `sticky`，分开处理 | 统一 sticky top bar | **Kimi** — 更精细 |
| 筛选条件传递 | 直接拼 `$page.url.search` | 用 `?ref=` 参数包一层 | **Kimi** — 更简洁 |
| 上下文来源 | sessionStorage 优先，API 兜底 | 纯 API 调用 | **Kimi** — 零请求更优 |
| API 设计 | 扩展现有 `/api/cigars` | 新增 `/neighbors` 端点 | **两者结合** — 先复用现有 API，同步新增 neighbors 端点 |
| PC prev/next 位置 | 图片两侧或下方 | 顶部 sticky bar 内 | **Copilot** — 顶部 bar 更统一，省空间 |
| 移动端手势 | touchstart/touchend | 同 | **一致** |
| 切换动画 | key block + 淡入淡出 | replaceState | **Kimi + 增强** — Svelte crossfade |
| 方案 B（弹层） | 明确分析并拒绝 | 未讨论 | **保留 Kimi 的分析** |
| 预加载 | 未涉及 | 未涉及 | **新增** — 预加载相邻图片 |
| 移动端底部导航 | 未涉及 | 提及 | **新增** — 拇指友好操作区 |
| 无障碍 | 未涉及 | 未涉及 | **新增** — ARIA + 焦点管理 |
| 验收标准 | ✅ 完整 | 无 | **保留 Kimi** |

---

## 1. 需求梳理

| 痛点 | 目标 |
|------|------|
| 详情页滚动后，左上角"返回"按钮被顶上去，移动端尤其明显 | 返回按钮始终可点，不随内容滚动消失 |
| 查看多个烟标要反复"详情 → 返回 → 再点"，操作流程断裂 | 在详情页直接"上一个 / 下一个"切换 |
| 移动端没有 PC 的按钮方便 | 支持左右滑动手势 + 底部导航栏 |
| 图库有筛选条件时，切换要保证范围一致 | 详情页 prev/next 必须在当前筛选结果集内移动 |
| 未来可能分页 | 方案兼容后端分页，不依赖一次性加载全部数据 |

---

## 2. 设计原则

- **不破坏现有 SEO**：每个烟标仍保留独立 URL `/cigar/[slug]`，SSR 正常渲染。
- **筛选条件即 URL**：图库的筛选参数放在 query string，详情页通过 query string 重建同一份结果集。
- **渐进增强**：当前 100~500 条可前端过滤；未来切后端分页时，只改数据获取层，交互层不变。
- **双路径上下文**：从图库进入 → sessionStorage 快照（零请求）；直接打开 → URL 参数调 API 重建。
- **移动端优先手势、PC 优先按钮**：两者同时提供，互为补充。
- **视觉克制**：导航元素沿用现有纸墨金配色（`--color-paper` / `--color-gold` / `--color-ink`），不新增第三种强调色。
- **性能优先**：预加载相邻图片，切换瞬时完成。

---

## 3. 最终方案：详情页"上下文导航"

### 3.1 整体架构

```
图库页 (/gallery?factory=昆明卷烟厂&era=80年代)
  │
  ├─ 点击卡片前：把 filtered.slugs + filters 写入 sessionStorage
  │
  └─ 点击卡片 → 跳转 /cigar/hongtashan?factory=昆明卷烟厂&era=80年代
                    │
                    ├─ 读 sessionStorage（优先）→ 拿到 slugs 列表 → 算 prev/next
                    │
                    └─ 无 sessionStorage（直接打开/分享链接）→ URL 参数调 API 重建列表
```

### 3.2 UI 布局

**PC 端：**

```
┌─ Header (sticky top-0 z-50, 58px) ─────────────────────────┐
│  烟标记忆    首页  图库  留言  关于              🌙         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─ 详情页 Nav Bar (sticky top-[58px] z-40) ────────────┐  │
│  │ ← 返回图库    红塔山 (3/27)    ← 上一个 | 下一个 →  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────┐  ┌──────────────────┐                    │
│  │              │  │  红塔山           │                    │
│  │   [图片]     │  │  昆明卷烟厂       │                    │
│  │              │  │  80年代           │                    │
│  │              │  │  山水主题         │                    │
│  │              │  │                  │                    │
│  │              │  │  [留言区]         │                    │
│  └──────────────┘  └──────────────────┘                    │
│                                                             │
├─ Footer ───────────────────────────────────────────────────┤
```

**移动端：**

```
┌─ Header (sticky) ───────────┐
│  烟标记忆            🌙  ☰  │
├─────────────────────────────┤
│                             │
│  ┌─ Nav (sticky) ────────┐  │
│  │ ← 返回  红塔山 (3/27) │  │
│  └───────────────────────┘  │
│                             │
│  ┌─────────────────────┐    │
│  │                     │    │
│  │   [图片 — 可滑动]   │    │  ← touch 左右滑动切换
│  │                     │    │
│  └─────────────────────┘    │
│                             │
│  红塔山                     │
│  昆明卷烟厂 · 80年代        │
│                             │
│  [留言区]                   │
│                             │
├─ 底部导航栏 (fixed bottom) ─┤
│  ← 上一个  │  ↑ 返回顶  │ 下一个 →  │
└─────────────────────────────┘
```

### 3.3 导航栏设计要点

PC 端导航栏 (`sticky top-[58px]`)：
- 高度约 44px，半透明纸色背景 `bg-paper/85 dark:bg-night/85 backdrop-blur-sm`
- 左：返回按钮（← 返回图库）
- 中：当前烟标名称 + 位置（如 "红塔山 (3/27)"）
- 右：← 上一个 / 下一个 →
- 底部淡墨分割线

移动端导航栏：
- 顶部 sticky 栏：精简为 ← 返回 + 名称 + 位置
- 底部 fixed 栏：← 上一个 / 下一个 → + 返回，拇指友好
- 两个栏都用 `backdrop-blur` 半透明，不遮挡内容
- 底部栏适配 `safe-area-inset-bottom`（iPhone 刘海屏）

---

## 4. 具体实施步骤

### 步骤 1：API — 新增 neighbors 端点

新增 `GET /api/cigars/:slug/neighbors?name=&factory=&era=&theme=`

> **设计理由**：虽然当前数据量小可以前端全量过滤，但现在就加上这个端点有以下好处：
> 1. 未来分页时无需改前端，只换这个端点的实现
> 2. 直接打开详情页（无 sessionStorage）时，只需一次轻量请求而非拉全量
> 3. 实现极其简单（约 30 行），没有维护负担

**`api/src/routes/cigars.ts` 新增：**

```typescript
import { and, eq, asc, ilike, or, SQL } from 'drizzle-orm';

// GET /api/cigars/:slug/neighbors — 获取前后相邻烟标
app.get('/:slug/neighbors', async (c) => {
  const { slug } = c.req.param();
  const { name, factory, era, theme } = c.req.query();

  // 构建与图库一致的筛选条件
  const conditions: SQL[] = [];
  if (factory) conditions.push(eq(cigars.factory, factory));
  if (era) conditions.push(eq(cigars.era, era));
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
    current: idx + 1, // 1-based position
  });
});
```

> 注：`name` 模糊搜索用 `ilike` 下推到 SQL（前端过滤器已有的行为）。

### 步骤 2：图库页 — CigarCard 携带筛选参数跳转

**`web/src/lib/components/CigarCard.svelte`** 改动：

```svelte
<script lang="ts">
  import { page } from '$app/stores';
  import type { Cigar } from '$lib/api.js';

  let { cigar }: { cigar: Cigar } = $props();
</script>

<!-- 原 href="/cigar/{cigar.slug}" 改为： -->
<a
  href="/cigar/{cigar.slug}{$page.url.search}"
  class="group block ..."
>
  <!-- 现有卡片内容不变 -->
</a>
```

### 步骤 3：图库页 — 存入 sessionStorage 快照

**`web/src/routes/gallery/+page.svelte`** 新增：

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  // ... 现有 imports

  let cigars: Cigar[] = $state([]);
  let filtered: Cigar[] = $state([]);
  let loading = $state(true);

  // ... 现有 onMount, handleFiltered

  /**
   * 在跳转详情页前，把当前筛选上下文写入 sessionStorage。
   * 用事件委托在外层容器上，避免给每个 CigarCard 加 onclick。
   */
  function beforeNavigate() {
    const filters: Record<string, string> = {};
    for (const [k, v] of $page.url.searchParams) {
      filters[k] = v;
    }
    try {
      sessionStorage.setItem('cigar-context', JSON.stringify({
        filters,
        slugs: filtered.map(c => c.slug),
      }));
    } catch { /* quota exceeded, ignore */ }
  }
</script>

<!-- 卡片网格外包一层，委托点击事件 -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
  onclick={beforeNavigate}
  onkeydown={(e) => e.key === 'Enter' && beforeNavigate()}
>
  {#each filtered as cigar (cigar.id)}
    <CigarCard {cigar} />
  {/each}
</div>
```

### 步骤 4：详情页 — SSR 获取 neighbors

**`web/src/routes/cigar/[slug]/+page.server.ts`** 改为并行获取：

```typescript
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

const API_BASE = process.env.API_TARGET || 'http://localhost:3001';

export const load: PageServerLoad = async ({ params, url, fetch }) => {
  try {
    // 并行获取：烟标详情 + 留言 + 邻居信息
    const [cigarRes, commentsRes, neighborsRes] = await Promise.all([
      fetch(`${API_BASE}/api/cigars/${params.slug}`),
      fetch(`${API_BASE}/api/cigars/${params.slug}/comments`).catch(() => null),
      fetch(`${API_BASE}/api/cigars/${params.slug}/neighbors${url.search}`).catch(() => null),
    ]);

    if (cigarRes.status === 404) throw error(404, { message: '未找到该烟标' });
    if (!cigarRes.ok) throw new Error(`API responded with ${cigarRes.status}`);

    const cigar = await cigarRes.json();

    let comments = [];
    if (commentsRes && commentsRes.ok) {
      comments = await commentsRes.json();
    }

    let neighbors = { prev: null, next: null, total: 0, current: 0 };
    if (neighborsRes && neighborsRes.ok) {
      neighbors = await neighborsRes.json();
    }

    return { cigar, comments, neighbors };
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'status' in e && (e as any).status === 404) throw e;
    console.error('[SSR] Failed to load cigar detail:', e);
    throw error(500, { message: '加载失败，请稍后再试' });
  }
};
```

### 步骤 5：详情页 — 核心 UI 重写

**`web/src/routes/cigar/[slug]/+page.svelte`** 完整变更：

```svelte
<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import Lightbox from '$lib/components/Lightbox.svelte';
  import CommentList from '$lib/components/CommentList.svelte';
  import CommentForm from '$lib/components/CommentForm.svelte';
  import type { Comment, Cigar } from '$lib/api.js';

  interface NeighborInfo {
    slug: string;
    name: string;
    imageWatermarked: string;
  }

  let { data }: {
    data: {
      cigar: Cigar;
      comments: Comment[];
      neighbors: {
        prev: NeighborInfo | null;
        next: NeighborInfo | null;
        total: number;
        current: number;
      } | null;
    };
  } = $props();

  let lightboxOpen = $state(false);
  let commentForm: CommentForm | undefined;
  let quoteComment: Comment | null = $state(null);

  // ── 导航状态 ──
  // 从 SSR data 初始化（首次渲染正确）；$effect 在客户端导航时重新同步
  let prevSlug: string | null = $state(data.neighbors?.prev?.slug ?? null);
  let nextSlug: string | null = $state(data.neighbors?.next?.slug ?? null);
  let position: number = $state(data.neighbors?.current ?? 0);
  let total: number = $state(data.neighbors?.total ?? 0);

  const search = $page.url.search; // 保持筛选参数

  // 客户端导航时 data 会变但 $state 初始值不会自动更新 → $effect 同步
  $effect(() => {
    if (data.neighbors && data.neighbors.total > 0) {
      prevSlug = data.neighbors.prev?.slug ?? null;
      nextSlug = data.neighbors.next?.slug ?? null;
      position = data.neighbors.current;
      total = data.neighbors.total;
    }
  });

  // 如果 SSR 没有 neighbors（可能 API 未就绪），客户端 fallback
  onMount(async () => {
    // 初始化滑动提示状态
    swipeHintDismissed = sessionStorage.getItem('cigar-swipe-hint-dismissed') === '1';

    if (data.neighbors && data.neighbors.total > 0) return; // SSR 已提供

    const stored = sessionStorage.getItem('cigar-context');
    let slugs: string[] = [];

    if (stored) {
      try {
        const ctx = JSON.parse(stored);
        slugs = ctx.slugs || [];
      } catch { /* ignore */ }
    }

    if (slugs.length === 0) {
      // 调 neighbors API 兜底
      try {
        const res = await fetch(`/api/cigars/${data.cigar.slug}/neighbors${search}`);
        if (res.ok) {
          const n = await res.json();
          prevSlug = n.prev?.slug ?? null;
          nextSlug = n.next?.slug ?? null;
          total = n.total;
          position = n.current;
          return;
        }
      } catch { /* fall through */ }
    }

    // 用 sessionStorage 快照计算
    const idx = slugs.indexOf(data.cigar.slug);
    prevSlug = idx > 0 ? slugs[idx - 1] : null;
    nextSlug = idx < slugs.length - 1 ? slugs[idx + 1] : null;
    total = slugs.length;
    position = idx + 1;
  });

  // ── 预加载相邻图片 ──
  function preloadNeighbor(slug: string | null) {
    if (!slug) return;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'image';
    link.href = `/cigar/${slug}`;
    document.head.appendChild(link);
  }
  $effect(() => {
    preloadNeighbor(prevSlug);
    preloadNeighbor(nextSlug);
  });

  // ── 导航函数 ──
  function goNeighbor(slug: string | null) {
    if (!slug) return;
    goto(`/cigar/${slug}${search}`, { noScroll: true, replaceState: true });
  }

  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      goto(`/gallery${search}`);
    }
  }

  // ── 键盘导航 ──
  function onKeydown(e: KeyboardEvent) {
    // 输入框中不触发
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.key === 'ArrowLeft') goNeighbor(prevSlug);
    if (e.key === 'ArrowRight') goNeighbor(nextSlug);
  }

  // ── 滑动提示 ──
  let swipeHintDismissed = $state(false);

  function dismissSwipeHint() {
    if (swipeHintDismissed) return;
    swipeHintDismissed = true;
    try { sessionStorage.setItem('cigar-swipe-hint-dismissed', '1'); } catch { /* ignore */ }
  }

  // 移动端手势
  let touchStartX = 0;
  let touchStartY = 0;
  const SWIPE_THRESHOLD = 50;

  function onTouchStart(e: TouchEvent) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  function onTouchEnd(e: TouchEvent) {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    // 只在水平滑动为主时触发（避免和垂直滚动冲突）
    if (Math.abs(dx) < Math.abs(dy)) return;
    if (dx < -SWIPE_THRESHOLD && nextSlug) { dismissSwipeHint(); goNeighbor(nextSlug); }
    if (dx > SWIPE_THRESHOLD && prevSlug) { dismissSwipeHint(); goNeighbor(prevSlug); }
  }

  function handleQuote(comment: Comment) {
    quoteComment = comment;
    commentForm?.setQuote(comment);
  }

  function handleCancelQuote() {
    quoteComment = null;
    commentForm?.cancelQuote();
  }
</script>

<svelte:window onkeydown={onKeydown} />

<svelte:head>
  <title>{data.cigar.name} — 烟标记忆</title>
  <meta name="description" content="{data.cigar.name}，{data.cigar.factory}，{data.cigar.era}。{data.cigar.theme}主题烟标收藏。" />
</svelte:head>

<!-- ═══════════════════════════════════════════ -->
<!-- 详情页导航栏（sticky，header 下方）           -->
<!-- ═══════════════════════════════════════════ -->
<nav
  class="sticky top-[58px] z-40 bg-paper/85 dark:bg-night/85 backdrop-blur-sm
         border-b border-border/50 dark:border-night-border/50
         px-4 md:px-6 py-2.5 transition-colors duration-500"
  aria-label="烟标导航"
>
  <div class="max-w-[900px] mx-auto flex items-center justify-between gap-2">
    <!-- 左：返回 -->
    <button
      onclick={goBack}
      class="inline-flex items-center gap-1.5 text-sm text-ink-light/70 dark:text-night-text/50
             tracking-wider hover:text-gold dark:hover:text-gold-light transition-colors duration-300
             cursor-pointer group shrink-0 min-h-[44px]"
      aria-label="返回图库"
    >
      <span class="text-base leading-none transition-transform duration-300 group-hover:-translate-x-1">←</span>
      <span class="hidden sm:inline">返回</span>
    </button>

    <!-- 中：烟标名 + 位置 -->
    <span class="font-serif text-sm text-ink dark:text-night-text tracking-wide truncate text-center">
      {data.cigar.name}
      {#if total > 0}
        <span class="text-ink-light/40 dark:text-night-text/35 text-xs ml-1">({position}/{total})</span>
      {/if}
    </span>

    <!-- 右：prev/next（PC） -->
    <div class="hidden md:flex items-center gap-3 shrink-0">
      <button
        onclick={() => goNeighbor(prevSlug)}
        disabled={!prevSlug}
        class="text-sm text-ink-light/60 dark:text-night-text/40 tracking-wider
               hover:text-gold dark:hover:text-gold-light transition-colors duration-300
               disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer min-h-[44px]"
        aria-label="上一个烟标"
      >
        ← 上一个
      </button>
      <span class="text-ink-light/20 dark:text-night-text/20 select-none">|</span>
      <button
        onclick={() => goNeighbor(nextSlug)}
        disabled={!nextSlug}
        class="text-sm text-ink-light/60 dark:text-night-text/40 tracking-wider
               hover:text-gold dark:hover:text-gold-light transition-colors duration-300
               disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer min-h-[44px]"
        aria-label="下一个烟标"
      >
        下一个 →
      </button>
    </div>
  </div>
</nav>

<!-- ═══════════════════════════════════════════ -->
<!-- 主体内容区                                  -->
<!-- ═══════════════════════════════════════════ -->
<section class="py-8 md:py-12 px-6">
  <div class="max-w-[900px] mx-auto">

    <!-- PC: left image, right info; Mobile: top image, bottom info -->
    <div class="grid md:grid-cols-2 gap-8">
      <!-- Left: Image（移动端绑定了手势） -->
      <div class="flex items-center self-stretch">
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="cursor-pointer rounded-sm overflow-hidden border border-border dark:border-[#36332E]
                 shadow-sm hover:shadow-md transition-shadow duration-300 w-full
                 touch-pan-y"
          onclick={() => (lightboxOpen = true)}
          ontouchstart={onTouchStart}
          ontouchend={onTouchEnd}
          role="button"
          tabindex="0"
          aria-label="放大查看图片，左右滑动可切换烟标"
        >
          <img
            src={data.cigar.imageWatermarked}
            alt={data.cigar.name + '烟标'}
            class="w-full block"
          />
        </div>

        <!-- 移动端滑动提示（首次显示，滑动后消失） -->
        {#if !swipeHintDismissed && (prevSlug || nextSlug)}
          <p
            class="md:hidden text-center mt-3 text-xs text-ink-light/30 dark:text-night-text/20 tracking-[3px]"
            aria-hidden="true"
          >
            ← 左右滑动切换烟标 →
          </p>
        {/if}
      </div>

      <!-- Right: Info -->
      <div>
        <h1 class="font-display text-3xl text-ink dark:text-night-text tracking-[4px] mb-6">
          {data.cigar.name}
        </h1>

        <div class="space-y-3 mb-6">
          <div class="flex items-start gap-3">
            <span class="text-xs text-ink-light/55 dark:text-night-text/40 tracking-wider min-w-[56px] pt-0.5">卷烟厂</span>
            <span class="font-serif text-sm text-ink dark:text-night-text tracking-wide">{data.cigar.factory}</span>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-xs text-ink-light/55 dark:text-night-text/40 tracking-wider min-w-[56px] pt-0.5">年代</span>
            <span class="font-serif text-sm text-ink dark:text-night-text tracking-wide">{data.cigar.era}</span>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-xs text-ink-light/55 dark:text-night-text/40 tracking-wider min-w-[56px] pt-0.5">主题</span>
            <span class="font-serif text-sm text-ink dark:text-night-text tracking-wide">{data.cigar.theme}</span>
          </div>
        </div>

        <div class="border-t border-border dark:border-[#36332E] my-6"></div>

        <h3 class="font-serif font-bold text-lg text-ink dark:text-night-text tracking-wider mb-4">留言</h3>
        <CommentList comments={data.comments} onQuote={handleQuote} />
        <CommentForm bind:this={commentForm} cigarId={data.cigar.id} {quoteComment} />
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════ -->
<!-- 移动端底部导航栏                            -->
<!-- ═══════════════════════════════════════════ -->
<nav
  class="md:hidden fixed bottom-0 left-0 right-0 z-40
         bg-paper/90 dark:bg-night/90 backdrop-blur-sm
         border-t border-border/50 dark:border-night-border/50
         px-4 py-2.5 flex items-center justify-between
         transition-colors duration-500"
  aria-label="移动端导航"
  style="padding-bottom: max(0.625rem, env(safe-area-inset-bottom, 0px));"
>
  <button
    onclick={() => goNeighbor(prevSlug)}
    disabled={!prevSlug}
    class="flex items-center gap-1 text-sm text-ink-light/70 dark:text-night-text/50
           tracking-wider disabled:opacity-25 disabled:cursor-not-allowed
           active:text-gold transition-colors cursor-pointer min-h-[44px] min-w-[44px]"
    aria-label="上一个烟标"
  >
    <span class="text-base">←</span>
    <span>上一个</span>
  </button>

  <button
    onclick={goBack}
    class="flex items-center gap-1 text-sm text-ink-light/60 dark:text-night-text/40
           tracking-wider active:text-gold transition-colors cursor-pointer min-h-[44px] min-w-[44px]"
    aria-label="返回图库"
  >
    <span class="text-base">↩</span>
    <span>返回</span>
  </button>

  <button
    onclick={() => goNeighbor(nextSlug)}
    disabled={!nextSlug}
    class="flex items-center gap-1 text-sm text-ink-light/70 dark:text-night-text/50
           tracking-wider disabled:opacity-25 disabled:cursor-not-allowed
           active:text-gold transition-colors cursor-pointer min-h-[44px] min-w-[44px]"
    aria-label="下一个烟标"
  >
    <span>下一个</span>
    <span class="text-base">→</span>
  </button>
</nav>

<Lightbox
  src={data.cigar.imageWatermarked}
  alt={data.cigar.name + '烟标'}
  name={data.cigar.name}
  meta={`${data.cigar.factory} · ${data.cigar.era}`}
  bind:open={lightboxOpen}
/>
```

### 步骤 6：切换动画（可选增强）

如果希望切换时有视觉过渡，可以给图片区包 `{#key}` block：

```svelte
<script lang="ts">
  import { blur } from 'svelte/transition';
</script>

{#key data.cigar.id}
  <div class="..." transition:blur={{ duration: 200 }}>
    <img src={data.cigar.imageWatermarked} alt="..." />
  </div>
{/key}
```

> **注意**：transition 在客户端导航（`goto`）时触发。`{#key data.cigar.id}` 确保 data 变化时 DOM 重建并播放过渡。`prefers-reduced-motion` 下应跳过。

### 步骤 7：边界与降级一览

| 场景 | 处理 |
|------|------|
| 第一个烟标，无 prev | 按钮 `disabled`，`opacity: 0.25`，`cursor-not-allowed` |
| 最后一个烟标，无 next | 同上 |
| 客户端导航后位置 (N/M) 不更新 | 添加 `$effect` 同步 `data.neighbors` → 自动更新 |
| 移动端首次进入无滑动提示 | sessionStorage 记录 `cigar-swipe-hint-dismissed`，第一次显示提示文字 |
| 直接打开详情页（分享链接），无筛选参数 | neighbors API 返回全量列表中的位置 |
| 直接打开详情页，有筛选参数 | neighbors API 用筛选条件重建列表 |
| sessionStorage 中 slugs 不包含当前 slug | 自动 fallback 到 URL 参数调 neighbors API |
| 移动端垂直滚动与水平滑动冲突 | `abs(dx) > abs(dy)` 时才触发切换 |
| 键盘焦点在输入框（留言）时 | 检查 `e.target.tagName`，输入框内不触发 |
| `prefers-reduced-motion` | 跳过 transition 动画 |
| sessionStorage 满了 | try/catch，静默降级到 API |

---

## 5. 方案 B（备选但拒绝）：图库内弹层/抽屉

保持图库页不变，点击卡片后当前页面打开覆盖层展示详情。

**优点**：筛选状态和滚动位置天然保留，无需传参。

**不采用的原因**：
1. 需要维护"弹层内状态"和"独立详情页"两套渲染路径，代码量翻倍
2. URL 管理混乱 — 弹层内切换烟标是否更新 URL？如果不更新，刷新丢失；如果更新，弹层关闭时需要清理历史记录
3. 弹层内的留言表单、灯箱等交互组件需要额外适配
4. 对 100~500 张的规模属于过度设计

---

## 6. 国内参考应用

| 产品 | 可借鉴点 |
|------|----------|
| **小红书** | 图片详情全屏，左右滑动/点击切换同话题内容；上滑看评论；筛选/标签跟随 URL |
| **图虫 / 500px** | PC 左右箭头/键盘切换，移动端滑动；筛选上下文保留 |
| **花瓣网** | 瀑布流 + 详情弹层，关闭后回原列表位置；筛选不丢失 |
| **站酷海洛** | 搜索结果进入素材详情，"上一个/下一个"导航，URL 带搜索参数 |
| **微信相册** | 手机端滑动手势自然，顶部固定返回按钮 |
| **LOFTER** | PC 端图片两侧半透明箭头，hover 显示，筛选标签内 prev/next 范围正确 |

共同规律：**列表状态放进 URL，详情页只负责在当前状态里前后移动**。

---

## 7. 未来分页兼容

当数据量增长到需要后端分页时：

| 改动层 | 变更 |
|--------|------|
| `GET /api/cigars` | 新增 `page` / `limit` 参数，返回 `{ data, total, page, totalPages }` |
| `GET /api/cigars/:slug/neighbors` | 新增 `page` / `limit` 参数，返回当前页内的邻居；跨页边界时触发前后页预取 |
| 图库页 `FilterBar` | 加 `page` 到 URL query params |
| `CigarCard` 链接 | 自动携带 `page` 参数（已在 `$page.url.search` 中） |
| 详情页 `+page.server.ts` | 传给 neighbors API 的参数加入 `page` |
| **交互层不变** | PC 按钮、移动端手势、键盘导航、返回逻辑均不受影响 ✅ |

---

## 8. 验收标准

- [ ] 详情页滚动到任意位置，返回按钮始终可见且可点击（PC sticky + 移动端 bottom bar）
- [ ] PC 端详情页顶部导航栏出现"上一个/下一个"按钮，点击后 URL 筛选参数保持不变
- [ ] 移动端底部导航栏出现"上一个/下一个/返回"按钮，拇指可轻松触及
- [ ] 移动端在图片上左右滑动可切换烟标（水平滑动不与垂直滚动冲突）
- [ ] 键盘左右方向键可切换烟标（输入框中不触发）
- [ ] 从图库带筛选进入详情，prev/next 只在筛选结果内移动
- [ ] 直接打开详情页（无上下文）时，prev/next 基于全部烟标或 URL 筛选条件工作
- [ ] 切换时页面不闪白、不丢失筛选条件，`noScroll: true` 保持阅读位置
- [ ] 到达第一个/最后一个时，对应按钮禁用
- [ ] 相邻图片通过 `<link rel="prefetch">` 预加载
- [ ] 客户端导航（点击 prev/next）后位置指示器 (N/M) 正确更新
- [ ] 移动端首次进入显示"← 左右滑动切换烟标 →"提示，滑动后不再显示
- [ ] 暗色模式下所有导航元素视觉正确
- [ ] `prefers-reduced-motion` 下无多余动画
- [ ] 移动端底部栏适配 iPhone 安全区（`safe-area-inset-bottom`）
- [ ] 独立 URL `/cigar/[slug]` 的 SSR/SEO 不受影响
- [ ] 触摸按钮有 44px 最小点击区域（WCAG 2.1）
```


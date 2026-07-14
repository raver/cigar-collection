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
          onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lightboxOpen = true; } }}
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

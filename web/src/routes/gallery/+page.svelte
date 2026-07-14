<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { api, type Cigar } from '$lib/api.js';
  import CigarCard from '$lib/components/CigarCard.svelte';
  import FilterBar from '$lib/components/FilterBar.svelte';

  let cigars: Cigar[] = $state([]);
  let filtered: Cigar[] = $state([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      cigars = await api.getCigars();
      filtered = cigars;
    } catch {
      cigars = [];
      filtered = [];
    } finally {
      loading = false;
    }
  });

  function handleFiltered(items: Cigar[]) {
    filtered = items;
  }

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

<svelte:head>
  <title>图库 — 烟标记忆</title>
  <meta name="description" content="浏览全部烟标收藏，按名称、卷烟厂、年代、主题筛选。" />
</svelte:head>

<!-- Page Hero -->
<section class="relative overflow-hidden bg-paper dark:bg-night py-14 md:py-16 px-6 text-center transition-colors duration-500">
  <!-- SVG 水墨晕染（轻量版） -->
  <div class="absolute inset-0 z-0 opacity-[0.06] dark:opacity-[0.04] pointer-events-none">
    <svg viewBox="0 0 900 300" preserveAspectRatio="xMidYMid slice" class="w-full h-full">
      <defs>
        <filter id="inkBleedG" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G"/>
          <feGaussianBlur stdDeviation="2"/>
        </filter>
        <linearGradient id="inkGradG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#262626;stop-opacity:0.7"/>
          <stop offset="100%" style="stop-color:#262626;stop-opacity:0"/>
        </linearGradient>
      </defs>
      <path d="M-50,100 C150,60 250,160 400,130 C550,100 600,50 750,90 C900,130 950,70 1000,100"
            fill="none" stroke="url(#inkGradG)" stroke-width="30" stroke-linecap="round" filter="url(#inkBleedG)"/>
      <ellipse cx="200" cy="160" rx="40" ry="25" fill="url(#inkGradG)" filter="url(#inkBleedG)"/>
      <ellipse cx="700" cy="140" rx="35" ry="20" fill="url(#inkGradG)" filter="url(#inkBleedG)"/>
    </svg>
  </div>

  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.03)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.15)_100%)] pointer-events-none"></div>
  <div class="relative z-10 max-w-[700px] mx-auto">
    <h1 class="font-handwritten text-[40px] md:text-[44px] text-ink dark:text-night-text tracking-[14px] md:tracking-[18px] mb-2.5">图 库</h1>
    <p class="font-serif font-extralight text-[15px] text-ink-light dark:text-night-text/55 tracking-[4px]">在这里，翻阅旧时光</p>
  </div>
</section>

{#if !loading}
  <FilterBar {cigars} onFiltered={handleFiltered} />
{/if}

<!-- Card Grid -->
<section class="bg-paper-deep dark:bg-night-header py-6 px-6 pb-16 transition-colors duration-500">
  <div class="max-w-[1100px] mx-auto">
    {#if loading}
      <div class="text-center py-20 text-ink-light/50 dark:text-night-text/40 text-sm tracking-wider">加载中...</div>
    {:else if filtered.length === 0}
      <div class="text-center py-20 text-ink-light/50 dark:text-night-text/40 text-sm tracking-wider">没有找到匹配的烟标。</div>
    {:else}
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

      {#if filtered.length > 0}
        <div class="text-center mt-10 text-xs text-ink-light/50 dark:text-night-text/40 tracking-wider">共 {filtered.length} 枚烟标</div>
      {/if}
    {/if}
  </div>
</section>

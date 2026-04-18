<script lang="ts">
  import { onMount } from 'svelte';
  import { api, type Cigar } from '$lib/api.js';
  import CigarCard from '$lib/components/CigarCard.svelte';
  import FilterBar from '$lib/components/FilterBar.svelte';
  import Lightbox from '$lib/components/Lightbox.svelte';

  let cigars: Cigar[] = $state([]);
  let filtered: Cigar[] = $state([]);
  let loading = $state(true);
  let lightboxOpen = $state(false);
  let lightboxSrc = $state('');
  let lightboxAlt = $state('');
  let lightboxName = $state('');
  let lightboxMeta = $state('');

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

  function openLightbox(cigar: Cigar) {
    lightboxSrc = cigar.imageWatermarked;
    lightboxAlt = cigar.name + '烟标';
    lightboxName = cigar.name;
    lightboxMeta = `${cigar.factory} · ${cigar.era}`;
    lightboxOpen = true;
  }
</script>

<svelte:head>
  <title>图库 — 烟标记忆</title>
  <meta name="description" content="浏览全部烟标收藏，按名称、卷烟厂、年代、主题筛选。" />
</svelte:head>

<!-- Page Hero -->
<section class="relative overflow-hidden bg-gradient-to-br from-ink to-ink-light dark:from-night dark:to-night-header py-14 md:py-16 px-6 text-center transition-colors duration-500">
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,.1)_100%)] pointer-events-none"></div>
  <div class="relative z-10 max-w-[700px] mx-auto">
    <h1 class="font-display text-[36px] md:text-[40px] text-warm dark:text-sea-green tracking-[8px] md:tracking-[14px] mb-2.5">图 库</h1>
    <p class="font-serif font-extralight text-[15px] text-warm/72 dark:text-sea-green/62 tracking-wider">在这里，翻阅旧时光</p>
  </div>
</section>

{#if !loading}
  <FilterBar {cigars} onFiltered={handleFiltered} />
{/if}

<!-- Card Grid -->
<section class="bg-parchment dark:bg-night-header py-6 px-6 pb-16 transition-colors duration-500">
  <div class="max-w-[1100px] mx-auto">
    {#if loading}
      <div class="text-center py-20 text-pale dark:text-sage-dark text-sm tracking-wider">加载中...</div>
    {:else if filtered.length === 0}
      <div class="text-center py-20 text-pale dark:text-sage-dark text-sm tracking-wider">没有找到匹配的烟标。</div>
    {:else}
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-[18px]">
        {#each filtered as cigar (cigar.id)}
          <!-- Card wrapper: intercept click for lightbox -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <div class="cursor-pointer" role="button" tabindex="0" onclick={() => openLightbox(cigar)} onkeydown={(e) => { if (e.key === 'Enter') openLightbox(cigar); }}>
            <div class="bg-white dark:bg-night-card rounded border border-ink/8 dark:border-sea-green/8 shadow hover:-translate-y-1 hover:shadow-lg transition-transform duration-400 ease-out">
              <div class="aspect-square overflow-hidden">
                <img
                  src={cigar.imageWatermarked}
                  alt={cigar.name + '烟标'}
                  class="w-full h-full object-cover block transition-transform duration-600 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div class="px-4 py-3.5">
                <div class="font-serif font-semibold text-[15px] text-ink dark:text-sea-green tracking-wider mb-1">
                  {cigar.name}
                </div>
                <div class="text-xs text-pale dark:text-sage-dark tracking-wide">
                  {cigar.factory} · {cigar.era}
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>

      {#if filtered.length > 0}
        <div class="text-center mt-10 text-xs text-pale dark:text-sage-dark tracking-wider">共 {filtered.length} 枚烟标</div>
      {/if}
    {/if}
  </div>
</section>

<Lightbox
  src={lightboxSrc}
  alt={lightboxAlt}
  name={lightboxName}
  meta={lightboxMeta}
  bind:open={lightboxOpen}
/>

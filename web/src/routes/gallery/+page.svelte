<script lang="ts">
  import { onMount } from 'svelte';
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
          <CigarCard {cigar} />
        {/each}
      </div>

      {#if filtered.length > 0}
        <div class="text-center mt-10 text-xs text-pale dark:text-sage-dark tracking-wider">共 {filtered.length} 枚烟标</div>
      {/if}
    {/if}
  </div>
</section>

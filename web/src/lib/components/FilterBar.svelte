<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import type { Cigar } from '$lib/api.js';

  let { cigars, onFiltered }: { cigars: Cigar[]; onFiltered: (filtered: Cigar[]) => void } = $props();

  // 从 URL 查询参数初始化筛选状态（支持前进/后退恢复状态）
  let nameFilter = $state($page.url.searchParams.get('name') ?? '');
  let factoryFilter = $state($page.url.searchParams.get('factory') ?? '');
  let eraFilter = $state($page.url.searchParams.get('era') ?? '');
  let themeFilter = $state($page.url.searchParams.get('theme') ?? '');

  // Derive unique options from data
  let factories = $derived([...new Set(cigars.map((c) => c.factory).filter(Boolean))].sort());
  let themes = $derived([...new Set(cigars.map((c) => c.theme).filter(Boolean))].sort());

  let filtered = $derived.by(() => {
    const name = nameFilter.toLowerCase();
    return cigars.filter(
      (c) =>
        (!name || c.name.toLowerCase().includes(name)) &&
        (!factoryFilter || c.factory === factoryFilter) &&
        (!eraFilter || c.era === eraFilter) &&
        (!themeFilter || c.theme === themeFilter)
    );
  });

  let count = $derived(filtered.length);

  $effect(() => {
    onFiltered(filtered);
  });

  // 筛选条件变化 → 同步到 URL（replaceState 避免每次输入都产生历史记录）
  $effect(() => {
    const params = new URLSearchParams();
    if (nameFilter) params.set('name', nameFilter);
    if (factoryFilter) params.set('factory', factoryFilter);
    if (eraFilter) params.set('era', eraFilter);
    if (themeFilter) params.set('theme', themeFilter);

    const qs = params.toString();
    const newUrl = qs ? `?${qs}` : window.location.pathname;
    goto(newUrl, { replaceState: true, keepFocus: true, noScroll: true });
  });

  function reset() {
    nameFilter = '';
    factoryFilter = '';
    eraFilter = '';
    themeFilter = '';
  }
</script>

<div class="py-7 px-6 pb-2.5 bg-paper-deep dark:bg-night-header transition-colors duration-500">
  <div class="max-w-[1100px] mx-auto grid grid-cols-2 md:flex md:flex-wrap gap-3.5 items-end">
    <!-- Name search -->
    <div class="flex flex-col gap-1.5 col-span-2 md:flex-[1.5] md:min-w-[140px]">
      <label for="filter-name" class="text-xs text-ink-light/60 dark:text-night-text/40 tracking-wider">名称</label>
      <input
        id="filter-name"
        type="text"
        placeholder="搜索烟标名称..."
        bind:value={nameFilter}
        class="bg-paper-card dark:bg-night-card border border-border dark:border-[#36332E] rounded-sm px-3 py-2 font-serif text-sm text-ink dark:text-night-text placeholder:text-ink-light/35 dark:placeholder:text-night-text/25 outline-none transition-colors duration-300 focus:border-gold dark:focus:border-gold-light"
      />
    </div>

    <!-- Factory select -->
    <div class="flex flex-col gap-1.5 col-span-1 md:flex-1 md:min-w-[140px]">
      <label for="filter-factory" class="text-xs text-ink-light/60 dark:text-night-text/40 tracking-wider">卷烟厂</label>
      <select
        id="filter-factory"
        bind:value={factoryFilter}
        class="bg-paper-card dark:bg-night-card border border-border dark:border-[#36332E] rounded-sm px-3 py-2 pr-8 font-serif text-sm text-ink dark:text-night-text outline-none transition-colors duration-300 focus:border-gold dark:focus:border-gold-light appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%235C5650%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center]"
      >
        <option value="">全部</option>
        {#each factories as factory}
          <option value={factory}>{factory}</option>
        {/each}
      </select>
    </div>

    <!-- Era select -->
    <div class="flex flex-col gap-1.5 col-span-1 md:flex-1 md:min-w-[140px]">
      <label for="filter-era" class="text-xs text-ink-light/60 dark:text-night-text/40 tracking-wider">年代</label>
      <select
        id="filter-era"
        bind:value={eraFilter}
        class="bg-paper-card dark:bg-night-card border border-border dark:border-[#36332E] rounded-sm px-3 py-2 pr-8 font-serif text-sm text-ink dark:text-night-text outline-none transition-colors duration-300 focus:border-gold dark:focus:border-gold-light appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%235C5650%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center]"
      >
        <option value="">全部</option>
        <option value="80年代">80年代</option>
        <option value="90年代">90年代</option>
        <option value="2000年以后">2000年以后</option>
        <option value="不详">不详</option>
      </select>
    </div>

    <!-- Theme select -->
    <div class="flex flex-col gap-1.5 col-span-1 md:flex-1 md:min-w-[140px]">
      <label for="filter-theme" class="text-xs text-ink-light/60 dark:text-night-text/40 tracking-wider">主题</label>
      <select
        id="filter-theme"
        bind:value={themeFilter}
        class="bg-paper-card dark:bg-night-card border border-border dark:border-[#36332E] rounded-sm px-3 py-2 pr-8 font-serif text-sm text-ink dark:text-night-text outline-none transition-colors duration-300 focus:border-gold dark:focus:border-gold-light appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%235C5650%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center]"
      >
        <option value="">全部</option>
        {#each themes as theme}
          <option value={theme}>{theme}</option>
        {/each}
      </select>
    </div>

    <!-- Reset button -->
    <button
      onclick={reset}
      class="col-span-1 md:w-auto border border-gold dark:border-gold-light text-gold dark:text-gold-light hover:bg-gold hover:text-paper-card dark:hover:bg-gold-light dark:hover:text-night rounded-sm px-5 py-2 font-serif text-sm tracking-widest cursor-pointer transition-all duration-300 whitespace-nowrap min-h-[44px] inline-flex items-center justify-center"
    >
      重 置
    </button>
  </div>

  <div class="max-w-[1100px] mx-auto mt-4 text-[13px] text-ink-light/55 dark:text-night-text/40 tracking-wide">
    共 {count} 枚烟标
  </div>
</div>

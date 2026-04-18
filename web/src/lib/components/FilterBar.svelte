<script lang="ts">
  import type { Cigar } from '$lib/api.js';

  let { cigars, onFiltered }: { cigars: Cigar[]; onFiltered: (filtered: Cigar[]) => void } = $props();

  let nameFilter = $state('');
  let factoryFilter = $state('');
  let eraFilter = $state('');
  let themeFilter = $state('');

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

  function reset() {
    nameFilter = '';
    factoryFilter = '';
    eraFilter = '';
    themeFilter = '';
  }
</script>

<div class="py-7 px-6 pb-2.5 bg-parchment dark:bg-night-header transition-colors duration-500">
  <div class="max-w-[1100px] mx-auto flex gap-3.5 items-end flex-wrap">
    <!-- Name search -->
    <div class="flex flex-col gap-1.5 flex-[1.5] min-w-[140px]">
      <label for="filter-name" class="text-xs text-pale dark:text-sage-dark tracking-wider">名称</label>
      <input
        id="filter-name"
        type="text"
        placeholder="搜索烟标名称..."
        bind:value={nameFilter}
        oninput={() => {}}
        class="bg-white dark:bg-night-card border border-ink/12 dark:border-sea-green/12 rounded px-3 py-2 font-serif text-sm text-ink dark:text-sea-green placeholder:text-pale dark:placeholder:text-sage-dark outline-none transition-colors duration-300 focus:border-moss dark:focus:border-glow"
      />
    </div>

    <!-- Factory select -->
    <div class="flex flex-col gap-1.5 flex-1 min-w-[140px]">
      <label for="filter-factory" class="text-xs text-pale dark:text-sage-dark tracking-wider">卷烟厂</label>
      <select
        id="filter-factory"
        bind:value={factoryFilter}
        onchange={() => {}}
        class="bg-white dark:bg-night-card border border-ink/12 dark:border-sea-green/12 rounded px-3 py-2 pr-8 font-serif text-sm text-ink dark:text-sea-green outline-none transition-colors duration-300 focus:border-moss dark:focus:border-glow appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%238A9A90%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center]"
      >
        <option value="">全部</option>
        {#each factories as factory}
          <option value={factory}>{factory}</option>
        {/each}
      </select>
    </div>

    <!-- Era select -->
    <div class="flex flex-col gap-1.5 flex-1 min-w-[140px]">
      <label for="filter-era" class="text-xs text-pale dark:text-sage-dark tracking-wider">年代</label>
      <select
        id="filter-era"
        bind:value={eraFilter}
        onchange={() => {}}
        class="bg-white dark:bg-night-card border border-ink/12 dark:border-sea-green/12 rounded px-3 py-2 pr-8 font-serif text-sm text-ink dark:text-sea-green outline-none transition-colors duration-300 focus:border-moss dark:focus:border-glow appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%238A9A90%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center]"
      >
        <option value="">全部</option>
        <option value="80年代">80年代</option>
        <option value="90年代">90年代</option>
        <option value="2000年以后">2000年以后</option>
        <option value="不详">不详</option>
      </select>
    </div>

    <!-- Theme select -->
    <div class="flex flex-col gap-1.5 flex-1 min-w-[140px]">
      <label for="filter-theme" class="text-xs text-pale dark:text-sage-dark tracking-wider">主题</label>
      <select
        id="filter-theme"
        bind:value={themeFilter}
        onchange={() => {}}
        class="bg-white dark:bg-night-card border border-ink/12 dark:border-sea-green/12 rounded px-3 py-2 pr-8 font-serif text-sm text-ink dark:text-sea-green outline-none transition-colors duration-300 focus:border-moss dark:focus:border-glow appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%238A9A90%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center]"
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
      class="border border-moss dark:border-sea-green text-moss dark:text-sea-green hover:bg-moss hover:text-white dark:hover:bg-sea-green dark:hover:text-night rounded px-5 py-2 font-serif text-sm tracking-widest cursor-pointer transition-all duration-300 whitespace-nowrap"
    >
      重 置
    </button>
  </div>

  <div class="max-w-[1100px] mx-auto mt-4 text-[13px] text-pale dark:text-sage-dark tracking-wide">
    共 {count} 枚烟标
  </div>
</div>

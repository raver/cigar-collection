<script lang="ts">
  import { onMount } from 'svelte';

  interface CigarItem {
    id: number;
    name: string;
    factory: string;
    era: string;
    theme: string;
    slug: string;
    imageWatermarked: string;
  }

  let cigars: CigarItem[] = $state([]);
  let loading = $state(true);
  let error = $state('');
  let deletingId: number | null = $state(null);

  async function loadCigars() {
    try {
      const res = await fetch('/api/cigars');
      if (!res.ok) throw new Error();
      cigars = await res.json();
    } catch {
      error = '加载烟标列表失败';
    } finally {
      loading = false;
    }
  }

  async function deleteCigar(id: number, name: string) {
    if (!confirm(`确定要删除烟标「${name}」吗？此操作不可恢复。`)) return;
    deletingId = id;
    try {
      const res = await fetch(`/admin/api/cigars/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      cigars = cigars.filter(c => c.id !== id);
    } catch {
      alert('删除失败，请重试');
    } finally {
      deletingId = null;
    }
  }

  onMount(loadCigars);
</script>

<svelte:head>
  <title>烟标管理 — 烟标记忆管理</title>
</svelte:head>

<div class="p-6 md:p-8">
  <div class="flex items-center justify-between mb-6">
    <h1 class="font-display text-2xl text-ink dark:text-sea-green tracking-widest">烟标管理</h1>
    <a
      href="/admin/cigars/new"
      class="px-4 py-2 bg-moss dark:bg-sea-green text-warm dark:text-night text-sm tracking-wider rounded hover:bg-moss-deep dark:hover:bg-glow transition-colors"
    >
      + 添加烟标
    </a>
  </div>

  {#if error}
    <p class="text-sm text-red-600 dark:text-red-400">{error}</p>
  {/if}

  {#if loading}
    <p class="text-sm text-concrete dark:text-pale tracking-wider animate-pulse">加载中...</p>
  {:else if cigars.length === 0}
    <p class="text-sm text-concrete dark:text-pale tracking-wider">暂无烟标数据</p>
  {:else}
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-ink/10 dark:border-sea-green/10 text-left">
            <th class="pb-3 text-xs text-concrete dark:text-pale tracking-wider font-normal">名称</th>
            <th class="pb-3 text-xs text-concrete dark:text-pale tracking-wider font-normal">卷烟厂</th>
            <th class="pb-3 text-xs text-concrete dark:text-pale tracking-wider font-normal">年代</th>
            <th class="pb-3 text-xs text-concrete dark:text-pale tracking-wider font-normal">主题</th>
            <th class="pb-3 text-xs text-concrete dark:text-pale tracking-wider font-normal text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          {#each cigars as cigar (cigar.id)}
            <tr class="border-b border-ink/5 dark:border-sea-green/5 hover:bg-warm/60 dark:hover:bg-night-card/60 transition-colors">
              <td class="py-3 text-ink dark:text-sea-green">{cigar.name}</td>
              <td class="py-3 text-concrete dark:text-pale">{cigar.factory}</td>
              <td class="py-3 text-concrete dark:text-pale">{cigar.era}</td>
              <td class="py-3 text-concrete dark:text-pale">{cigar.theme}</td>
              <td class="py-3 text-right">
                <button
                  onclick={() => deleteCigar(cigar.id, cigar.name)}
                  disabled={deletingId === cigar.id}
                  class="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 tracking-wider disabled:opacity-40 transition-colors"
                >
                  {deletingId === cigar.id ? '删除中...' : '删除'}
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <p class="mt-4 text-xs text-concrete dark:text-pale tracking-wider">共 {cigars.length} 条</p>
  {/if}
</div>

<script lang="ts">
  import { onMount } from 'svelte';

  let pendingCount = $state<number | null>(null);
  let cigarCount = $state<number | null>(null);
  let error = $state('');

  onMount(async () => {
    try {
      const [pendingRes, cigarsRes] = await Promise.all([
        fetch('/admin/api/comments?status=pending'),
        fetch('/api/cigars'),
      ]);

      if (pendingRes.ok) {
        const pendingData = await pendingRes.json();
        pendingCount = pendingData.length;
      } else {
        pendingCount = 0;
      }

      if (cigarsRes.ok) {
        const cigarsData = await cigarsRes.json();
        cigarCount = cigarsData.length;
      } else {
        cigarCount = 0;
      }
    } catch {
      error = '加载统计数据失败';
    }
  });
</script>

<svelte:head>
  <title>仪表盘 — 烟标记忆管理</title>
</svelte:head>

<div class="p-6 md:p-8">
  <h1 class="font-display text-2xl text-ink dark:text-sea-green tracking-widest mb-8">仪表盘</h1>

  {#if error}
    <p class="text-sm text-red-600 dark:text-red-400">{error}</p>
  {/if}

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
    <!-- Pending Comments Card -->
    <a
      href="/admin/comments"
      class="block bg-warm dark:bg-night-card border border-ink/10 dark:border-sea-green/10 rounded-lg p-6 hover:shadow-md transition-shadow"
    >
      <div class="text-xs text-concrete dark:text-pale tracking-wider mb-2">待审核留言</div>
      <div class="text-3xl font-display text-ink dark:text-sea-green tracking-wider">
        {#if pendingCount !== null}
          {pendingCount}
        {:else}
          <span class="text-sm text-concrete dark:text-pale animate-pulse">加载中...</span>
        {/if}
      </div>
      {#if pendingCount !== null && pendingCount > 0}
        <div class="mt-2 text-xs text-moss dark:text-glow tracking-wider">点击查看 →</div>
      {/if}
    </a>

    <!-- Cigar Count Card -->
    <a
      href="/admin/cigars"
      class="block bg-warm dark:bg-night-card border border-ink/10 dark:border-sea-green/10 rounded-lg p-6 hover:shadow-md transition-shadow"
    >
      <div class="text-xs text-concrete dark:text-pale tracking-wider mb-2">烟标总数</div>
      <div class="text-3xl font-display text-ink dark:text-sea-green tracking-wider">
        {#if cigarCount !== null}
          {cigarCount}
        {:else}
          <span class="text-sm text-concrete dark:text-pale animate-pulse">加载中...</span>
        {/if}
      </div>
      <div class="mt-2 text-xs text-moss dark:text-glow tracking-wider">点击管理 →</div>
    </a>
  </div>
</div>

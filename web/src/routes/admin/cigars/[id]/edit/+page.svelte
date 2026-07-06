<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  const eraOptions = ['80年代', '90年代', '2000年以后', '不详'];

  interface CigarDetail {
    id: number;
    name: string;
    factory: string;
    era: string;
    theme: string;
    orientation: 'portrait' | 'landscape';
    imageWatermarked: string;
  }

  let cigar: CigarDetail | null = $state(null);
  let name = $state('');
  let factory = $state('');
  let era = $state(eraOptions[0]);
  let theme = $state('');
  let orientation: string = $state('portrait');
  let imageFile: File | null = $state(null);
  let error = $state('');
  let loading = $state(false);
  let pageLoading = $state(true);

  const cigarId = $derived(page.params.id);

  onMount(async () => {
    try {
      const res = await fetch(`/admin/api/cigars/${cigarId}`);
      if (!res.ok) {
        if (res.status === 404) { error = '烟标不存在'; return; }
        throw new Error();
      }
      cigar = await res.json();
      name = cigar.name;
      factory = cigar.factory;
      era = cigar.era;
      theme = cigar.theme;
      orientation = cigar.orientation;
    } catch {
      error = '加载烟标数据失败';
    } finally {
      pageLoading = false;
    }
  });

  function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    imageFile = target.files?.[0] || null;
  }

  async function handleSubmit() {
    if (!name || !factory || !era || !theme) {
      error = '名称、卷烟厂、年代、主题为必填';
      return;
    }

    error = '';
    loading = true;

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('factory', factory);
      formData.append('era', era);
      formData.append('theme', theme);
      formData.append('orientation', orientation);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await fetch(`/admin/api/cigars/${cigarId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        error = data.error || '保存失败';
        return;
      }

      goto('/admin/cigars');
    } catch {
      error = '网络错误，请重试';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>编辑烟标 — 烟标记忆管理</title>
</svelte:head>

<div class="p-6 md:p-8 max-w-lg">
  <div class="flex items-center gap-4 mb-6">
    <a href="/admin/cigars" class="text-sm text-concrete dark:text-pale hover:text-ink dark:hover:text-sea-green tracking-wider transition-colors">
      ← 返回列表
    </a>
  </div>
  <h1 class="font-display text-2xl text-ink dark:text-sea-green tracking-widest mb-8">编辑烟标</h1>

  {#if pageLoading}
    <p class="text-sm text-concrete dark:text-pale tracking-wider animate-pulse">加载中...</p>
  {:else if error && !cigar}
    <p class="text-sm text-red-600 dark:text-red-400">{error}</p>
  {:else}
    <!-- 当前图片预览 -->
    {#if cigar?.imageWatermarked}
      <div class="mb-6">
        <p class="text-xs text-concrete dark:text-pale tracking-wider mb-2">当前图片</p>
        <img
          src={cigar.imageWatermarked}
          alt={cigar.name}
          class="max-w-[200px] rounded border border-ink/10 dark:border-sea-green/10"
        />
        <p class="mt-1 text-xs text-concrete/60 dark:text-pale/60">上传新图片将替换当前图片，不选则保留原图</p>
      </div>
    {/if}

    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-5">
      <div>
        <label for="name" class="block text-xs text-concrete dark:text-pale tracking-wider mb-1.5">名称</label>
        <input
          id="name"
          type="text"
          bind:value={name}
          required
          class="w-full px-3 py-2 bg-warm dark:bg-night border border-ink/15 dark:border-sea-green/20 rounded text-sm text-ink dark:text-sea-green focus:outline-none focus:border-moss dark:focus:border-glow transition-colors"
        />
      </div>

      <div>
        <label for="factory" class="block text-xs text-concrete dark:text-pale tracking-wider mb-1.5">卷烟厂</label>
        <input
          id="factory"
          type="text"
          bind:value={factory}
          required
          class="w-full px-3 py-2 bg-warm dark:bg-night border border-ink/15 dark:border-sea-green/20 rounded text-sm text-ink dark:text-sea-green focus:outline-none focus:border-moss dark:focus:border-glow transition-colors"
        />
      </div>

      <div>
        <label for="era" class="block text-xs text-concrete dark:text-pale tracking-wider mb-1.5">年代</label>
        <select
          id="era"
          bind:value={era}
          class="w-full px-3 py-2 bg-warm dark:bg-night border border-ink/15 dark:border-sea-green/20 rounded text-sm text-ink dark:text-sea-green focus:outline-none focus:border-moss dark:focus:border-glow transition-colors"
        >
          {#each eraOptions as opt}
            <option value={opt}>{opt}</option>
          {/each}
        </select>
      </div>

      <div>
        <label for="theme" class="block text-xs text-concrete dark:text-pale tracking-wider mb-1.5">主题</label>
        <input
          id="theme"
          type="text"
          bind:value={theme}
          required
          class="w-full px-3 py-2 bg-warm dark:bg-night border border-ink/15 dark:border-sea-green/20 rounded text-sm text-ink dark:text-sea-green focus:outline-none focus:border-moss dark:focus:border-glow transition-colors"
        />
      </div>

      <div>
        <label for="orientation" class="block text-xs text-concrete dark:text-pale tracking-wider mb-1.5">方向</label>
        <select
          id="orientation"
          bind:value={orientation}
          class="w-full px-3 py-2 bg-warm dark:bg-night border border-ink/15 dark:border-sea-green/20 rounded text-sm text-ink dark:text-sea-green focus:outline-none focus:border-moss dark:focus:border-glow transition-colors"
        >
          <option value="portrait">纵向</option>
          <option value="landscape">横向</option>
        </select>
      </div>

      <div>
        <label for="image" class="block text-xs text-concrete dark:text-pale tracking-wider mb-1.5">替换图片（可选）</label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onchange={handleFileChange}
          class="w-full text-sm text-ink dark:text-sea-green file:mr-4 file:py-2 file:px-3 file:rounded file:border-0 file:text-xs file:tracking-wider file:bg-moss/15 file:text-moss dark:file:bg-sea-green/15 dark:file:text-sea-green file:cursor-pointer"
        />
        {#if imageFile}
          <p class="mt-1 text-xs text-moss dark:text-sea-green">已选择: {imageFile.name}</p>
        {/if}
      </div>

      {#if error}
        <p class="text-sm text-red-600 dark:text-red-400 tracking-wider">{error}</p>
      {/if}

      <button
        type="submit"
        disabled={loading}
        class="w-full py-2.5 bg-moss dark:bg-sea-green text-warm dark:text-night rounded text-sm tracking-widest font-medium hover:bg-moss-deep dark:hover:bg-glow transition-colors disabled:opacity-50"
      >
        {loading ? '保存中...' : '保存修改'}
      </button>
    </form>
  {/if}
</div>

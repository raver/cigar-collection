<script lang="ts">
  import { goto } from '$app/navigation';

  const eraOptions = ['80年代', '90年代', '2000年以后', '不详'];

  let name = $state('');
  let factory = $state('');
  let era = $state(eraOptions[0]);
  let theme = $state('');
  let imageFile: File | null = $state(null);
  let error = $state('');
  let loading = $state(false);

  function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    imageFile = target.files?.[0] || null;
  }

  async function handleSubmit() {
    if (!name || !factory || !era || !theme || !imageFile) {
      error = '所有字段均为必填';
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
      formData.append('image', imageFile);

      const res = await fetch('/admin/api/cigars', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        error = data.error || '添加失败';
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
  <title>添加烟标 — 烟标记忆管理</title>
</svelte:head>

<div class="p-6 md:p-8 max-w-lg">
  <div class="flex items-center gap-4 mb-6">
    <a href="/admin/cigars" class="text-sm text-concrete dark:text-pale hover:text-ink dark:hover:text-sea-green tracking-wider transition-colors">
      ← 返回列表
    </a>
  </div>
  <h1 class="font-display text-2xl text-ink dark:text-sea-green tracking-widest mb-8">添加烟标</h1>

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
      <label for="image" class="block text-xs text-concrete dark:text-pale tracking-wider mb-1.5">烟标图片</label>
      <input
        id="image"
        type="file"
        accept="image/*"
        onchange={handleFileChange}
        required
        class="w-full text-sm text-ink dark:text-sea-green file:mr-4 file:py-2 file:px-3 file:rounded file:border-0 file:text-xs file:tracking-wider file:bg-moss/15 file:text-moss dark:file:bg-sea-green/15 dark:file:text-sea-green file:cursor-pointer"
      />
    </div>

    {#if error}
      <p class="text-sm text-red-600 dark:text-red-400 tracking-wider">{error}</p>
    {/if}

    <button
      type="submit"
      disabled={loading}
      class="w-full py-2.5 bg-moss dark:bg-sea-green text-warm dark:text-night rounded text-sm tracking-widest font-medium hover:bg-moss-deep dark:hover:bg-glow transition-colors disabled:opacity-50"
    >
      {loading ? '上传中...' : '添加烟标'}
    </button>
  </form>
</div>

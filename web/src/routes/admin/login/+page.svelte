<script lang="ts">
  import { goto } from '$app/navigation';

  let username = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  async function handleLogin() {
    error = '';
    loading = true;
    try {
      const res = await fetch('/admin/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      console.log('login response:', res.status, data);
      if (!res.ok) {
        error = data.error || '登录失败';
        return;
      }
      console.log('about to goto /admin');
      await goto('/admin');
      console.log('goto returned');
    } catch (err) {
      console.error('login error:', err);
      error = '网络错误，请重试';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>管理员登录 — 烟标记忆</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-ink dark:bg-night px-4">
  <div class="w-full max-w-sm bg-parchment dark:bg-night-card rounded-lg shadow-lg p-8">
    <h1 class="font-display text-xl text-ink dark:text-sea-green tracking-widest text-center mb-8">
      管理员登录
    </h1>

    <form onsubmit={(e) => { e.preventDefault(); handleLogin(); }} class="space-y-5">
      <div>
        <label for="username" class="block text-xs text-concrete dark:text-pale tracking-wider mb-1.5">用户名</label>
        <input
          id="username"
          type="text"
          bind:value={username}
          autocomplete="username"
          required
          class="w-full px-3 py-2 bg-warm dark:bg-night border border-ink/15 dark:border-sea-green/20 rounded text-sm text-ink dark:text-sea-green focus:outline-none focus:border-moss dark:focus:border-glow transition-colors"
        />
      </div>

      <div>
        <label for="password" class="block text-xs text-concrete dark:text-pale tracking-wider mb-1.5">密码</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          autocomplete="current-password"
          required
          class="w-full px-3 py-2 bg-warm dark:bg-night border border-ink/15 dark:border-sea-green/20 rounded text-sm text-ink dark:text-sea-green focus:outline-none focus:border-moss dark:focus:border-glow transition-colors"
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
        {loading ? '登录中...' : '登 录'}
      </button>
    </form>
  </div>
</div>

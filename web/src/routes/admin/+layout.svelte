<script lang="ts">
  import { page } from '$app/state';

  let { children } = $props();

  const isLoginPage = $derived(page.url.pathname === '/admin/login');

  const navItems = [
    { href: '/admin', label: '仪表盘', icon: 'grid' },
    { href: '/admin/cigars', label: '烟标管理', icon: 'box' },
    { href: '/admin/comments', label: '留言审核', icon: 'message' },
  ];
</script>

{#if isLoginPage}
  {@render children()}
{:else}
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <aside class="w-56 shrink-0 bg-ink dark:bg-night-header text-warm dark:text-sea-green flex flex-col">
      <!-- Logo -->
      <div class="px-5 py-6 border-b border-warm/10 dark:border-sea-green/10">
        <a href="/admin" class="font-display text-lg tracking-widest block">
          烟标记忆 <span class="text-xs font-serif opacity-60 tracking-wider">管理</span>
        </a>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-4">
        {#each navItems as item}
          <a
            href={item.href}
            class="flex items-center gap-3 px-5 py-2.5 text-sm tracking-wider transition-colors duration-200
              {page.url.pathname === item.href
                ? 'bg-warm/12 dark:bg-sea-green/12 text-glow'
                : 'hover:bg-warm/6 dark:hover:bg-sea-green/6'}"
          >
            {#if item.icon === 'grid'}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
              </svg>
            {:else if item.icon === 'box'}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            {:else}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            {/if}
            {item.label}
          </a>
        {/each}
      </nav>

      <!-- Logout -->
      <div class="px-5 py-4 border-t border-warm/10 dark:border-sea-green/10">
        <button
          onclick={async () => {
            await fetch('/admin/api/logout', { method: 'POST' }).catch(() => {});
            window.location.href = '/admin/login';
          }}
          class="flex items-center gap-3 text-sm tracking-wider opacity-60 hover:opacity-100 transition-opacity"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          退出登录
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 bg-parchment dark:bg-night overflow-auto">
      {@render children()}
    </main>
  </div>
{/if}

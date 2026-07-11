<script lang="ts">
  import ThemeToggle from './ThemeToggle.svelte';
  import { page } from '$app/stores';

  const links = [
    { href: '/', label: '首页' },
    { href: '/gallery', label: '图库' },
    { href: '/guestbook', label: '留言' },
    { href: '/about', label: '关于' },
  ];

  let mobileMenuOpen = $state(false);

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
  }
</script>

<header class="sticky top-0 z-50 bg-paper/92 dark:bg-night/92 backdrop-blur-sm transition-colors duration-500">
  <!-- 顶部淡墨线 -->
  <div class="h-px bg-gradient-to-r from-transparent via-ink/50 dark:via-night-text/30 to-transparent"></div>

  <div class="max-w-[1100px] mx-auto flex justify-between items-center h-[58px] px-6">
    <a href="/" class="group flex items-center gap-2.5 text-ink dark:text-night-text font-handwritten text-[26px] tracking-[4px] relative no-underline">
      <span class="inline-flex items-center justify-center w-[22px] h-[22px] text-gold/60">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" class="w-full h-full">
          <!-- 折纸鹤 — 文艺、含蓄、安静 -->
          <!-- 左翼 -->
          <path d="M50 56 C34 28, 16 36, 16 36 C16 36, 28 48, 50 70Z"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.8"/>
          <!-- 右翼 -->
          <path d="M50 56 C66 28, 84 36, 84 36 C84 36, 72 48, 50 70Z"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.8"/>
          <!-- 头颈 -->
          <path d="M50 70 C50 70, 44 56, 28 44"
                stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.85"/>
          <!-- 尾部 -->
          <path d="M50 70 C50 70, 68 52, 76 64"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"/>
          <!-- 身体中线 -->
          <line x1="50" y1="56" x2="50" y2="70" stroke="currentColor" stroke-width="1.2" opacity="0.3"/>
        </svg>
      </span>
      <span>烟标记忆</span>
      <!-- 淡墨下划线 -->
      <span class="absolute bottom-0.5 left-0 right-0 h-px bg-gradient-to-r from-gold/50 to-transparent opacity-40 group-hover:opacity-70 transition-opacity"></span>
    </a>
    <div class="flex items-center gap-4 md:gap-6">
      <!-- Desktop nav -->
      <nav class="hidden md:flex gap-5">
        {#each links as link}
          <a
            href={link.href}
            class="text-ink-light dark:text-night-text/60 text-sm tracking-[2px] opacity-75 hover:opacity-100 relative min-h-[44px] flex items-center pb-1
              after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full
              after:h-px after:bg-gold after:transition-all after:duration-400
              {$page.url.pathname === link.href ? '!opacity-100 after:!w-full text-ink dark:text-night-text' : ''}"
          >{link.label}</a>
        {/each}
      </nav>

      <ThemeToggle />

      <!-- Mobile menu button -->
      <button
        type="button"
        onclick={toggleMobileMenu}
        aria-expanded={mobileMenuOpen}
        aria-label={mobileMenuOpen ? '关闭菜单' : '打开菜单'}
        class="md:hidden min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-ink-light dark:text-night-text"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          {#if mobileMenuOpen}
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          {:else}
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          {/if}
        </svg>
      </button>
    </div>
  </div>

  <!-- Mobile nav dropdown -->
  {#if mobileMenuOpen}
    <nav class="md:hidden border-t border-border dark:border-night-text/10 bg-paper/95 dark:bg-night/95 backdrop-blur-sm">
      <div class="max-w-[1100px] mx-auto px-6 py-3 flex flex-col">
        {#each links as link}
          <a
            href={link.href}
            onclick={closeMobileMenu}
            class="py-3 text-ink-light dark:text-night-text/70 text-[15px] tracking-wider opacity-80 hover:opacity-100 border-b border-border/60 dark:border-night-text/8 last:border-0
              {$page.url.pathname === link.href ? '!opacity-100 !text-ink dark:!text-night-text font-semibold' : ''}"
          >{link.label}</a>
        {/each}
      </div>
    </nav>
  {/if}
</header>

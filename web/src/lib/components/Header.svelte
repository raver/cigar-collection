<script lang="ts">
  import ThemeToggle from './ThemeToggle.svelte';
  import { page } from '$app/stores';

  const links = [
    { href: '/', label: '首页' },
    { href: '/gallery', label: '图库' },
    { href: '/guestbook', label: '留言' },
    { href: '/about', label: '关于' },
  ];
</script>

<header class="sticky top-0 z-50 bg-ink dark:bg-night-header transition-colors duration-500">
  <div class="max-w-[1100px] mx-auto flex justify-between items-center h-[58px] px-6">
    <a href="/" class="flex items-center gap-2.5 text-glow dark:text-sea-green font-serif text-lg font-semibold tracking-[2px]">
      <span class="inline-flex items-center justify-center w-[22px] h-[22px]">
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
    </a>
    <div class="flex items-center gap-6">
      <nav class="flex gap-5">
        {#each links as link}
          <a
            href={link.href}
            class="text-glow dark:text-sea-green text-sm tracking-wider opacity-75 hover:opacity-100 relative
              after:absolute after:bottom-[-4px] after:left-0 after:w-0 hover:after:w-full
              after:h-px after:bg-glow dark:after:bg-sea-green after:transition-all after:duration-300
              {$page.url.pathname === link.href ? '!opacity-100 after:!w-full' : ''}"
          >{link.label}</a>
        {/each}
      </nav>
      <ThemeToggle />
    </div>
  </div>
</header>

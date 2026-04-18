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
      <span class="text-xl opacity-85">🚲</span>
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

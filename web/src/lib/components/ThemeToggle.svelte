<script lang="ts">
  import { theme } from '$lib/theme.js';
</script>

<button
  onclick={() => theme.toggle()}
  class="bg-paper-card dark:bg-night-card text-ink-light dark:text-night-text/70 border border-border dark:border-night-text/15
    px-4 py-1.5 rounded-sm text-[13px] cursor-pointer font-serif min-h-[44px] inline-flex items-center tracking-[2px]
    hover:bg-paper-deep dark:hover:bg-night-header transition-colors duration-300 shadow-sm"
>
  {#if $theme === 'day'}🌙 夜晚{:else}☀️ 白天{/if}
</button>

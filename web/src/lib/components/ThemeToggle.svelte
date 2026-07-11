<script lang="ts">
  import { theme } from '$lib/theme.js';
</script>

<button
  onclick={() => theme.toggle()}
  class="bg-white/10 text-glow dark:text-sea-green border border-white/14
    px-4 py-1.5 rounded-full text-[13px] cursor-pointer font-serif min-h-[44px] inline-flex items-center
    hover:bg-white/18 transition-colors duration-300"
>
  {#if $theme === 'day'}🌙 夜晚{:else}☀️ 白天{/if}
</button>

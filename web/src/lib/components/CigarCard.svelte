<script lang="ts">
  import type { Cigar } from '$lib/api.js';

  let { cigar }: { cigar: Cigar } = $props();
</script>

<a
  href="/cigar/{cigar.slug}"
  class="block bg-white dark:bg-night-card rounded border border-ink/8 dark:border-sea-green/8 shadow hover:-translate-y-1 hover:shadow-lg transition-transform duration-400 ease-out"
>
  <div class="aspect-[3/4] overflow-hidden bg-ink/3 dark:bg-white/3 flex items-center justify-center rounded-t">
    <img
      src={cigar.imageWatermarked}
      alt={cigar.name + '烟标'}
      class="w-full h-full object-contain block"
      loading="lazy"
    />
  </div>
  <div class="px-4 py-3.5">
    <div class="font-serif font-semibold text-sm md:text-[15px] text-ink dark:text-sea-green tracking-wider mb-1">
      {cigar.name}
    </div>
    <div class="text-xs text-pale dark:text-sage-dark tracking-wide">
      {cigar.factory} · {cigar.era}
    </div>
  </div>
</a>

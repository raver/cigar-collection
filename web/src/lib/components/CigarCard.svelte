<script lang="ts">
  import type { Cigar } from '$lib/api.js';

  let { cigar }: { cigar: Cigar } = $props();
</script>

<a
  href="/cigar/{cigar.slug}"
  class="group block bg-paper-card dark:bg-night-card border border-border dark:border-[#36332E] p-[14px] pb-[22px] relative
    shadow-[2px_3px_8px_rgba(0,0,0,0.05),inset_0_0_80px_rgba(184,134,11,0.03)]
    dark:shadow-[2px_3px_8px_rgba(0,0,0,0.15),inset_0_0_80px_rgba(201,162,39,0.02)]
    rotate-[0.4deg] even:rotate-[-0.5deg]
    hover:rotate-[-1deg] hover:-translate-y-1.5
    hover:shadow-[8px_14px_30px_rgba(0,0,0,0.1),inset_0_0_80px_rgba(184,134,11,0.05)]
    dark:hover:shadow-[8px_14px_30px_rgba(0,0,0,0.25),inset_0_0_80px_rgba(201,162,39,0.04)]
    transition-all duration-600 ease-out"
>
  <!-- 泛黄胶带 -->
  <span class="absolute -top-[10px] left-1/2 -translate-x-1/2 -rotate-2 w-[52px] h-[22px]
    bg-[rgba(232,222,196,0.65)] dark:bg-[rgba(60,55,48,0.55)]
    border border-gold-dark/10 dark:border-gold-light/6
    shadow-[0_1px_2px_rgba(0,0,0,0.05)] z-10"></span>

  <!-- 藏书印章 -->
  <span class="absolute top-[22px] right-[20px] w-[38px] h-[38px] border-2 border-gold/35 rounded-[3px]
    flex items-center justify-center text-[10px] tracking-[1px] text-gold/35
    -rotate-12 font-handwritten z-10">旧藏</span>

  <!-- 旧污渍（右下角） -->
  <span class="absolute bottom-[14px] right-[14px] w-[32px] h-[32px] rounded-full
    bg-[radial-gradient(circle,rgba(139,105,20,0.06)_0%,transparent_70%)]
    pointer-events-none z-0"></span>

  <!-- 图片区 -->
  <div class="aspect-[3/4] overflow-hidden mb-5 border border-border dark:border-[#36332E] relative
    bg-[linear-gradient(160deg,var(--color-paper-stain)_0%,var(--color-paper-deep)_100%)]
    dark:bg-[linear-gradient(160deg,#2D2B27_0%,#252320_100%)]">
    <!-- 底部渐变遮罩 -->
    <span class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gold-fade pointer-events-none z-[1]"></span>
    <img
      src={cigar.imageWatermarked}
      alt={cigar.name + ' 烟标'}
      class="w-full h-full object-contain block
        [filter:sepia(18%)_saturate(85%)_contrast(95%)_brightness(99%)]
        group-hover:[filter:sepia(8%)_saturate(92%)_contrast(98%)_brightness(100%)]
        transition-[filter] duration-500"
      loading="lazy"
    />
  </div>

  <!-- 名称 -->
  <div class="font-handwritten text-[24px] tracking-[3px] text-ink dark:text-night-text mb-1.5 leading-tight">
    {cigar.name}
  </div>

  <!-- 元信息 -->
  <div class="text-[12px] tracking-[1.5px] text-ink-light dark:text-night-text/50">
    {cigar.factory} · {cigar.era}
  </div>
</a>

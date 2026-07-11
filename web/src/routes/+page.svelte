<script lang="ts">
  import SmokeAnimation from '$lib/components/SmokeAnimation.svelte';
  import CigarCard from '$lib/components/CigarCard.svelte';

  let { data }: { data: { randomCigars: import('$lib/api.js').Cigar[] } } = $props();
</script>

<svelte:head>
  <title>烟标记忆 — 往事如烟 岁月盲盒</title>
  <meta name="description" content="收藏80年代的旧烟标，一段回不去的时光。烟标记忆，往事如烟，岁月盲盒。" />
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden bg-gradient-to-br from-ink to-ink-light dark:from-night dark:to-night-header py-28 md:py-[110px] px-6 text-center transition-colors duration-500">
  <div class="absolute inset-0 z-0">
    <SmokeAnimation />
  </div>
  <!-- vignette overlay -->
  <div class="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.15)_100%)] pointer-events-none"></div>

  <div class="relative z-10 max-w-[700px] mx-auto">
    <h1 class="font-display text-warm dark:text-sea-green mb-8 leading-[1.45]">
      <span class="block text-[38px] md:text-[54px] tracking-[8px] md:tracking-[14px] opacity-0 animate-[rise_1s_ease_forwards_0.3s]">往事如烟</span>
      <span class="block text-[38px] md:text-[54px] tracking-[8px] md:tracking-[14px] opacity-0 animate-[rise_1s_ease_forwards_0.7s]">岁月盲盒</span>
    </h1>
    <p class="font-serif font-extralight text-base md:text-[17px] text-warm/72 dark:text-sea-green/62 tracking-wider leading-[1.9] mb-11 opacity-0 animate-[rise_1s_ease_forwards_1.1s]">
      一枚枚褪色烟标，藏着一整个 80 年代的烟火与人间。
    </p>
    <a
      href="/gallery"
      class="inline-block bg-transparent text-warm dark:text-sea-green border border-warm/38 dark:border-sea-green/38 px-10 py-3 rounded-sm font-serif text-[15px] tracking-[4px] cursor-pointer transition-all duration-400 opacity-0 animate-[rise_1s_ease_forwards_1.4s] hover:bg-warm/10 hover:border-warm/65 dark:hover:bg-sea-green/10 dark:hover:border-sea-green/65"
    >
      浏览全部收藏
    </a>
  </div>
</section>

<!-- Divider -->
<div class="text-center py-12 text-pale dark:text-sage-dark text-xs tracking-[14px] opacity-45 select-none">◇ ◇ ◇</div>

<!-- Intro -->
<section class="px-6 pb-14">
  <div class="max-w-[660px] mx-auto relative before:content-[''] before:absolute before:left-0 md:before:left-[-20px] before:top-1 before:bottom-1 before:w-[2px] before:bg-moss/35 before:rounded">
    <div class="font-serif text-[15px] md:text-base text-sage dark:text-sea-green text-left md:text-justify tracking-wide leading-[2.1] md:leading-[2.3] pl-5 md:pl-0">
      <p>那些被时光揉皱的纸烟盒，早已不是商品，而是一段段散不去的记忆。每一枚烟标，都是岁月拆开的盲盒，装着旧时光、老街道、寻常人家的晨昏，也装着回不去的年少与人间烟火。</p>
      <p class="mt-[1.6em]">往事如烟，飘散在风里；岁月如盒，封存在方寸之间。这里收藏的不只是烟标，是一个时代淡淡的余温与感伤。</p>
    </div>
  </div>
</section>

<!-- Divider -->
<div class="text-center py-12 text-pale dark:text-sage-dark text-xs tracking-[14px] opacity-45 select-none">◇ ◇ ◇</div>

<!-- Random Picks -->
<section class="bg-parchment dark:bg-night-header py-5 px-6 pb-16 transition-colors duration-500">
  <div class="max-w-[1100px] mx-auto mb-8">
    <h2 class="font-serif font-bold text-[22px] text-ink dark:text-sea-green tracking-[3px] mb-1.5">随机挑选</h2>
    <p class="text-[13px] text-pale dark:text-sage-dark tracking-wider">每次刷新，都是一次时光回溯</p>
  </div>

  <div class="max-w-[1100px] mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-[18px]">
    {#each data.randomCigars as cigar (cigar.id)}
      <CigarCard {cigar} />
    {/each}
  </div>

  {#if data.randomCigars.length > 0}
    <div class="text-center mt-10">
      <a
        href="/gallery"
        class="font-serif text-sm text-moss dark:text-sea-green tracking-[3px] inline-flex items-center gap-1.5 py-2 border-b border-moss dark:border-sea-green transition-colors duration-300 hover:text-moss-deep dark:hover:text-glow hover:border-moss-deep dark:hover:border-glow min-h-[44px]"
      >
        查看全部收藏 →
      </a>
    </div>
  {/if}
</section>

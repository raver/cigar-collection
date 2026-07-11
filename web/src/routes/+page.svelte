<script lang="ts">
  import SmokeAnimation from '$lib/components/SmokeAnimation.svelte';
  import CigarCard from '$lib/components/CigarCard.svelte';
  import Divider from '$lib/components/Divider.svelte';

  let { data }: { data: { randomCigars: import('$lib/api.js').Cigar[] } } = $props();
</script>

<svelte:head>
  <title>烟标记忆 — 往事如烟 岁月盲盒</title>
  <meta name="description" content="收藏80年代的旧烟标，一段回不去的时光。烟标记忆，往事如烟，岁月盲盒。" />
</svelte:head>

<!-- Hero — 宣纸底 + 水墨晕染 -->
<section class="relative overflow-hidden bg-paper dark:bg-night py-24 md:py-[100px] px-6 text-center transition-colors duration-500">
  <!-- SVG 水墨晕染背景 -->
  <div class="absolute inset-0 z-0 opacity-[0.09] dark:opacity-[0.06] pointer-events-none">
    <svg viewBox="0 0 900 500" preserveAspectRatio="xMidYMid slice" class="w-full h-full">
      <defs>
        <filter id="inkBleed" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="5" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="25" xChannelSelector="R" yChannelSelector="G"/>
          <feGaussianBlur stdDeviation="2.5"/>
        </filter>
        <linearGradient id="inkGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#262626;stop-opacity:0.9"/>
          <stop offset="60%" style="stop-color:#3D3D3D;stop-opacity:0.6"/>
          <stop offset="100%" style="stop-color:#262626;stop-opacity:0"/>
        </linearGradient>
        <linearGradient id="inkGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#1A1A1A;stop-opacity:0.8"/>
          <stop offset="50%" style="stop-color:#3D3D3D;stop-opacity:0.5"/>
          <stop offset="100%" style="stop-color:#262626;stop-opacity:0"/>
        </linearGradient>
      </defs>
      <!-- 主墨脉 -->
      <path d="M-50,120 C80,80 180,180 280,150 C380,120 420,60 520,90 C620,120 700,50 850,80"
            fill="none" stroke="url(#inkGrad1)" stroke-width="45" stroke-linecap="round" filter="url(#inkBleed)"/>
      <path d="M-30,380 C120,340 220,420 340,380 C460,340 520,280 650,320 C780,360 850,300 950,340"
            fill="none" stroke="url(#inkGrad2)" stroke-width="38" stroke-linecap="round" filter="url(#inkBleed)"/>
      <path d="M680,-20 C700,60 650,140 720,200 C790,260 750,340 820,420"
            fill="none" stroke="url(#inkGrad1)" stroke-width="28" stroke-linecap="round" filter="url(#inkBleed)"/>
      <!-- 墨点晕染 -->
      <ellipse cx="140" cy="200" rx="55" ry="35" fill="url(#inkGrad1)" filter="url(#inkBleed)"/>
      <ellipse cx="220" cy="240" rx="30" ry="20" fill="url(#inkGrad2)" filter="url(#inkBleed)"/>
      <ellipse cx="750" cy="180" rx="45" ry="28" fill="url(#inkGrad2)" filter="url(#inkBleed)"/>
      <ellipse cx="680" cy="260" rx="25" ry="18" fill="url(#inkGrad1)" filter="url(#inkBleed)"/>
      <ellipse cx="120" cy="420" rx="40" ry="25" fill="url(#inkGrad2)" filter="url(#inkBleed)"/>
      <ellipse cx="480" cy="440" rx="35" ry="22" fill="url(#inkGrad1)" filter="url(#inkBleed)"/>
      <!-- 飞白细线 -->
      <path d="M100,300 Q200,280 300,310 T500,290 T700,320"
            fill="none" stroke="#262626" stroke-width="2" opacity="0.25" filter="url(#inkBleed)"/>
      <path d="M550,100 Q650,130 750,110 T920,130"
            fill="none" stroke="#262626" stroke-width="1.5" opacity="0.2" filter="url(#inkBleed)"/>
    </svg>
  </div>

  <!-- 淡烟动画层 -->
  <div class="absolute inset-0 z-0 opacity-30 dark:opacity-20">
    <SmokeAnimation />
  </div>

  <div class="relative z-10 max-w-[700px] mx-auto">
    <h1 class="font-handwritten text-[56px] md:text-[66px] leading-[1.35] mb-6 tracking-[14px] md:tracking-[20px]">
      <span class="block text-ink dark:text-night-text opacity-0 animate-[rise_1s_ease_forwards_0.3s]">往事如烟</span>
      <span class="block opacity-0 animate-[rise_1s_ease_forwards_0.7s]"
        style="background: linear-gradient(135deg, #E8C547 0%, #D4AF37 25%, #B8860B 50%, #D4AF37 75%, #E8C547 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(2px 3px 2px rgba(0,0,0,0.12));"
      >岁月盲盒</span>
    </h1>
    <p class="font-serif font-extralight text-base md:text-[16px] text-ink-light dark:text-night-text/60 tracking-[4px] leading-[1.9] mb-11 opacity-0 animate-[rise_1s_ease_forwards_1.1s]">
      一枚枚褪色烟标，藏着一整个 80 年代的烟火与人间。
    </p>
    <a
      href="/gallery"
      class="inline-block border border-ink dark:border-night-text text-ink dark:text-night-text px-10 py-3 font-serif text-[15px] tracking-[6px] cursor-pointer transition-all duration-500 opacity-0 animate-[rise_1s_ease_forwards_1.4s] bg-paper-card/40 dark:bg-night-card/40 hover:bg-ink hover:text-paper-card dark:hover:bg-night-text dark:hover:text-night hover:border-ink dark:hover:border-night-text"
    >
      浏览全部收藏
    </a>
  </div>
</section>

<Divider />

<!-- 引言区 -->
<section class="px-6 pb-10">
  <div class="max-w-[600px] mx-auto relative">
    <!-- 中式引号装饰 -->
    <span class="absolute -top-4 -left-1 font-display text-[80px] text-gold/20 leading-none select-none pointer-events-none">&#x201C;</span>
    <div class="font-serif text-[15px] md:text-base text-ink-light dark:text-night-text/55 text-justify tracking-wide leading-[2.5] md:leading-[2.7]">
      <p>那些被时光揉皱的纸烟盒，早已不是商品，而是一段段散不去的记忆。每一枚烟标，都是岁月拆开的盲盒，装着旧时光、老街道、寻常人家的晨昏，也装着回不去的年少与人间烟火。</p>
      <p class="mt-[1.6em]">往事如烟，飘散在风里；岁月如盒，封存在方寸之间。这里收藏的不只是烟标，是一个时代淡淡的余温与感伤。</p>
    </div>
  </div>
</section>

<Divider />

<!-- 随机挑选 -->
<section class="bg-paper-deep dark:bg-night-header py-5 px-6 pb-16 transition-colors duration-500">
  <div class="max-w-[1100px] mx-auto mb-8">
    <h2 class="font-handwritten text-[32px] text-ink dark:text-night-text tracking-[8px] mb-1.5">随机挑选</h2>
    <p class="text-[13px] text-ink-light/60 dark:text-night-text/40 tracking-[3px]">每次刷新，都是一次时光回溯</p>
  </div>

  <div class="max-w-[1100px] mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 md:gap-8">
    {#each data.randomCigars as cigar (cigar.id)}
      <CigarCard {cigar} />
    {/each}
  </div>

  {#if data.randomCigars.length > 0}
    <div class="text-center mt-12">
      <a
        href="/gallery"
        class="font-serif text-sm text-gold dark:text-gold-light tracking-[3px] inline-flex items-center gap-1.5 py-2 border-b border-gold/50 dark:border-gold-light/50 transition-colors duration-300 hover:text-gold-dark dark:hover:text-gold hover:border-gold dark:hover:border-gold-light min-h-[44px]"
      >
        查看全部收藏 →
      </a>
    </div>
  {/if}
</section>

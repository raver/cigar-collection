<svelte:head>
  <title>关于 — 烟标记忆</title>
  <meta name="description" content="关于烟标记忆收藏网站和收藏者。" />
</svelte:head>

<script lang="ts">
  import Divider from '$lib/components/Divider.svelte';
</script>

<!-- Page Hero -->
<section class="relative overflow-hidden bg-paper dark:bg-night py-14 md:py-16 px-6 text-center transition-colors duration-500">
  <div class="absolute inset-0 z-0 opacity-[0.05] dark:opacity-[0.03] pointer-events-none">
    <svg viewBox="0 0 900 300" preserveAspectRatio="xMidYMid slice" class="w-full h-full">
      <defs>
        <filter id="inkAbout" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="G"/>
          <feGaussianBlur stdDeviation="2"/>
        </filter>
        <linearGradient id="inkAG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#262626;stop-opacity:0.6"/>
          <stop offset="100%" style="stop-color:#262626;stop-opacity:0"/>
        </linearGradient>
      </defs>
      <path d="M-50,150 C200,100 300,220 500,170 C700,120 800,80 1000,130"
            fill="none" stroke="url(#inkAG)" stroke-width="28" stroke-linecap="round" filter="url(#inkAbout)"/>
      <ellipse cx="300" cy="180" rx="35" ry="20" fill="url(#inkAG)" filter="url(#inkAbout)"/>
      <ellipse cx="650" cy="160" rx="30" ry="18" fill="url(#inkAG)" filter="url(#inkAbout)"/>
    </svg>
  </div>
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.03)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.12)_100%)] pointer-events-none"></div>
  <div class="relative z-10 max-w-[700px] mx-auto">
    <h1 class="font-handwritten text-[40px] md:text-[44px] text-ink dark:text-night-text tracking-[14px] md:tracking-[18px] mb-2.5">关 于</h1>
    <p class="font-serif font-extralight text-[15px] text-ink-light dark:text-night-text/55 tracking-[4px]">关于这个收藏，和收藏它的人</p>
  </div>
</section>

<!-- Divider -->
<Divider />

<!-- About Content -->
<section class="px-6 pb-16">
  <div class="max-w-[680px] mx-auto">

    <!-- Epigraph -->
    <div class="font-handwritten text-xl text-gold dark:text-gold-light text-center tracking-[4px] leading-[2] mb-12 opacity-80">
      人间烟火气，最抚凡人心。<br />
      这些不起眼的小纸片，是我与旧时光之间，最温柔的联结。
    </div>

    <!-- 关于收藏 -->
    <div class="mb-12">
      <h2 class="font-display text-[22px] text-ink dark:text-night-text tracking-[4px] mb-4 pb-2.5 border-b border-border dark:border-night-text/12">关于收藏</h2>
      <div class="font-serif text-[15px] text-ink-light dark:text-night-text/65 text-justify tracking-[0.3px] leading-[2.2]">
        <p>不知道从什么时候起，我开始留意那些被丢弃的烟盒。</p>
        <p class="mt-[1.2em]">其实我知道的——是从小时候起。</p>
        <p class="mt-[1.2em]">那时我和哥哥在路上走时，眼神总是留意地面，像两个寻宝的人。谁先看见一枚完整的烟盒，谁就能高兴一整天。那时候我们只能靠捡，没有零花钱去买一包烟，更不好意思开口向大人要空盒子。地上偶尔出现一枚没被踩烂的烟标，就是那天最好的礼物。</p>
        <p class="mt-[1.2em]">这个习惯断断续续，持续了十几年。在贫瘠而匮乏的童年里，捡烟盒几乎是唯一一件不需要花钱、却能让日子发亮的事。入迷的时候，我连做梦都在捡烟盒，梦里的地面永远干净，烟盒永远崭新。</p>
        <p class="mt-[1.2em]">但现实不是梦。因为全靠捡，收集到的终究不多，成色也参差不齐——有些边角磨白了，有些被雨水泡过又晒干，折痕深深浅浅。那些折痕不是瑕疵，是时间留下的签名，也是我们走过的路的印记。</p>
      </div>
    </div>

    <!-- 关于网站 -->
    <div class="mb-12">
      <h2 class="font-display text-[22px] text-ink dark:text-night-text tracking-[4px] mb-4 pb-2.5 border-b border-border dark:border-night-text/12">关于网站</h2>
      <div class="font-serif text-[15px] text-ink-light dark:text-night-text/65 text-justify tracking-[0.3px] leading-[2.2]">
        <p>这个网站没有多少技术含量，也没有复杂的交互。它只是一间小小的线上展柜，把我从路边、从角落、从岁月缝隙里捡回来的烟盒，一枚一枚摆好，拍清楚，放出来。</p>
        <p class="mt-[1.2em]">现在这里公开的，是其中大概一百枚。没有别的目的，只是不忍这些童年的宝贝湮没在岁月里，也不忍只有我和哥哥两个人记得它们。这些被时代遗忘的小东西，值得被人好好看一眼——哪怕只是路过时的一瞥，也胜过它们继续躺在纸箱里发黄。</p>
        <p class="mt-[1.2em]">它们来自不同的年代、不同的卷烟厂，画着不同的花、山、楼、人。放在一起看，像翻阅一本属于那个年代的民间画册，也像翻开一本属于我们这代人的、用脚走出来的童年相册。每一枚都是亲手捡的、亲手拍的、亲手整理的，不完美，但真实。</p>
        <p class="mt-[1.2em]">如果你也在这些烟标里看到了自己的记忆，或者想起了什么人、什么事，欢迎在留言墙上写几句话。哪怕只是"我记得这个"，也足够了。这些零散的记忆聚在一起，就是属于我们这一代人的烟火人间。</p>
        <p class="mt-[1.2em]">不为收藏价值，不为炫耀数量，只是想和一起长大、或一起老去的你，重新看一看那个时代——那个我们低头走路、却眼里有光的日子。</p>
      </div>
    </div>

    <!-- 关于我 -->
    <div class="mb-12">
      <h2 class="font-display text-[22px] text-ink dark:text-night-text tracking-[4px] mb-4 pb-2.5 border-b border-border dark:border-night-text/12">关于我</h2>
      <div class="font-serif text-[15px] text-ink-light dark:text-night-text/65 text-justify tracking-[0.3px] leading-[2.2]">
        <p>一个喜欢收藏旧物的开发者。相信技术不只是工具，也可以用来留住一些柔软的东西。</p>
        <p class="mt-[1.2em]">这个网站使用了 SvelteKit、Hono、PostgreSQL 和 Cloudflare R2 构建，部署在 Docker 上。</p>
      </div>
    </div>

    <!-- Tech Stack -->
    <div class="bg-paper-card dark:bg-night-card rounded-sm border border-border dark:border-[#36332E] px-7 py-7 mt-12 transition-colors duration-500">
      <h3 class="font-serif font-semibold text-[15px] text-ink-light dark:text-night-text/55 tracking-wider mb-4">技术栈</h3>
      <ul class="flex flex-wrap gap-2.5 list-none">
        <li class="px-4 py-1.5 border border-border dark:border-[#36332E] rounded-sm text-[13px] text-ink-light dark:text-night-text tracking-wider bg-paper dark:bg-night-card transition-colors duration-500">SvelteKit</li>
        <li class="px-4 py-1.5 border border-border dark:border-[#36332E] rounded-sm text-[13px] text-ink-light dark:text-night-text tracking-wider bg-paper dark:bg-night-card transition-colors duration-500">Tailwind CSS v4</li>
        <li class="px-4 py-1.5 border border-border dark:border-[#36332E] rounded-sm text-[13px] text-ink-light dark:text-night-text tracking-wider bg-paper dark:bg-night-card transition-colors duration-500">Hono</li>
        <li class="px-4 py-1.5 border border-border dark:border-[#36332E] rounded-sm text-[13px] text-ink-light dark:text-night-text tracking-wider bg-paper dark:bg-night-card transition-colors duration-500">PostgreSQL</li>
        <li class="px-4 py-1.5 border border-border dark:border-[#36332E] rounded-sm text-[13px] text-ink-light dark:text-night-text tracking-wider bg-paper dark:bg-night-card transition-colors duration-500">Cloudflare R2</li>
        <li class="px-4 py-1.5 border border-border dark:border-[#36332E] rounded-sm text-[13px] text-ink-light dark:text-night-text tracking-wider bg-paper dark:bg-night-card transition-colors duration-500">Docker</li>
        <li class="px-4 py-1.5 border border-border dark:border-[#36332E] rounded-sm text-[13px] text-ink-light dark:text-night-text tracking-wider bg-paper dark:bg-night-card transition-colors duration-500">Nginx</li>
      </ul>
    </div>

    <!-- Contact -->
    <div class="mt-10">
      <p class="font-serif text-sm text-ink-light dark:text-night-text/55">联系我：<a href="mailto:yetiscream@proton.me" class="text-gold dark:text-gold-light border-b border-gold/50 dark:border-gold-light/50 hover:text-gold-dark dark:hover:text-gold hover:border-gold dark:hover:border-gold-light transition-colors duration-300">yetiscream@proton.me</a></p>
    </div>

  </div>
</section>

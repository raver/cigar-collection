<svelte:head>
  <title>关于 — 烟标记忆</title>
  <meta name="description" content="关于这个烟标收藏，和收藏它的人。" />
</svelte:head>

<!-- Page Hero -->
<section class="relative overflow-hidden bg-gradient-to-br from-ink to-ink-light dark:from-night dark:to-night-header py-14 md:py-16 px-6 text-center transition-colors duration-500">
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,.1)_100%)] pointer-events-none"></div>
  <div class="relative z-10 max-w-[700px] mx-auto">
    <h1 class="font-display text-[36px] md:text-[40px] text-warm dark:text-sea-green tracking-[8px] md:tracking-[14px] mb-2.5">关 于</h1>
    <p class="font-serif font-extralight text-[15px] text-warm/72 dark:text-sea-green/62 tracking-wider">关于这个收藏，和收藏它的人</p>
  </div>
</section>

<!-- Divider -->
<div class="text-center py-12 text-pale dark:text-sage-dark text-xs tracking-[14px] opacity-45 select-none">◇ ◇ ◇</div>

<!-- About Content -->
<section class="px-6 pb-16">
  <div class="max-w-[680px] mx-auto">

    <!-- Epigraph -->
    <div class="font-handwritten text-xl text-sage dark:text-sea-green text-center tracking-[4px] leading-[2] mb-12 opacity-80">
      人间烟火气，最抚凡人心。<br />
      这些不起眼的小纸片，是我与旧时光之间，最温柔的联结。
    </div>

    <!-- 关于收藏 -->
    <div class="mb-12">
      <h2 class="font-display text-[22px] text-ink dark:text-sea-green tracking-[4px] mb-4 pb-2.5 border-b border-ink/12 dark:border-sea-green/12">关于收藏</h2>
      <div class="font-serif text-[15px] text-sage dark:text-sea-green/80 text-justify tracking-[0.3px] leading-[2.2]">
        <p>不知道从什么时候起，我开始留意那些被丢弃的烟盒。也许是某次搬家时翻出了爷爷的老物件，也许是在旧货市场偶然瞥见一枚泛黄的烟标，上面的图案让我想起了小时候家楼下的那面老墙。</p>
        <p class="mt-[1.2em]">后来就越收越多。从地摊上淘的，从网上找的，朋友知道了也会帮我留意。每一枚烟标到手的时候，我都会轻轻展开，拍一张清晰的正面照。有些保存得很好，有些已经折痕累累——但那些折痕本身，也是时间留下的签名。</p>
        <p class="mt-[1.2em]">现在这个收藏大概有一百来枚。不算多，但每一枚都是亲手挑选、亲手拍摄的。它们来自不同的年代，不同的卷烟厂，画着不同的花、山、楼、人。放在一起看，像是翻阅了一本那个年代的民间画册。</p>
      </div>
    </div>

    <!-- 关于网站 -->
    <div class="mb-12">
      <h2 class="font-display text-[22px] text-ink dark:text-sea-green tracking-[4px] mb-4 pb-2.5 border-b border-ink/12 dark:border-sea-green/12">关于网站</h2>
      <div class="font-serif text-[15px] text-sage dark:text-sea-green/80 text-justify tracking-[0.3px] leading-[2.2]">
        <p>这个网站，是我给这些烟标建的一个小小的家。也是我写给 80 年代的一封情书。</p>
        <p class="mt-[1.2em]">我想把这些烟标整理好，配上它们的来历、年代和故事，然后用一种温柔的方式呈现出来。不是为了研究什么，也不是为了值多少钱，只是觉得——这些被时代遗忘的小东西，值得被人好好看一眼。</p>
        <p class="mt-[1.2em]">如果你也在这些烟标里看到了自己的记忆，或者想起了什么人、什么事，欢迎在留言墙上写几句话。这些零散的记忆聚在一起，就是属于我们这一代人的烟火人间。</p>
      </div>
    </div>

    <!-- 关于我 -->
    <div class="mb-12">
      <h2 class="font-display text-[22px] text-ink dark:text-sea-green tracking-[4px] mb-4 pb-2.5 border-b border-ink/12 dark:border-sea-green/12">关于我</h2>
      <div class="font-serif text-[15px] text-sage dark:text-sea-green/80 text-justify tracking-[0.3px] leading-[2.2]">
        <p>一个喜欢收藏旧物的开发者。白天写代码，晚上翻烟标。相信技术不只是工具，也可以用来留住一些柔软的东西。</p>
        <p class="mt-[1.2em]">这个网站使用了 SvelteKit、Hono、PostgreSQL 和 Cloudflare R2 构建，部署在 Docker 上。它同时也是我的个人技术作品集的一部分。</p>
      </div>
    </div>

    <!-- Tech Stack -->
    <div class="bg-parchment dark:bg-night-header rounded border border-ink/12 dark:border-sea-green/12 px-7 py-7 mt-12 transition-colors duration-500">
      <h3 class="font-serif font-semibold text-[15px] text-pale dark:text-sage-dark tracking-wider mb-4">技术栈</h3>
      <ul class="flex flex-wrap gap-2.5 list-none">
        <li class="px-4 py-1.5 border border-ink/12 dark:border-sea-green/12 rounded-sm text-[13px] text-sage dark:text-sea-green tracking-wider bg-white dark:bg-night-card transition-colors duration-500">SvelteKit</li>
        <li class="px-4 py-1.5 border border-ink/12 dark:border-sea-green/12 rounded-sm text-[13px] text-sage dark:text-sea-green tracking-wider bg-white dark:bg-night-card transition-colors duration-500">Tailwind CSS v4</li>
        <li class="px-4 py-1.5 border border-ink/12 dark:border-sea-green/12 rounded-sm text-[13px] text-sage dark:text-sea-green tracking-wider bg-white dark:bg-night-card transition-colors duration-500">Hono</li>
        <li class="px-4 py-1.5 border border-ink/12 dark:border-sea-green/12 rounded-sm text-[13px] text-sage dark:text-sea-green tracking-wider bg-white dark:bg-night-card transition-colors duration-500">PostgreSQL</li>
        <li class="px-4 py-1.5 border border-ink/12 dark:border-sea-green/12 rounded-sm text-[13px] text-sage dark:text-sea-green tracking-wider bg-white dark:bg-night-card transition-colors duration-500">Cloudflare R2</li>
        <li class="px-4 py-1.5 border border-ink/12 dark:border-sea-green/12 rounded-sm text-[13px] text-sage dark:text-sea-green tracking-wider bg-white dark:bg-night-card transition-colors duration-500">Docker</li>
        <li class="px-4 py-1.5 border border-ink/12 dark:border-sea-green/12 rounded-sm text-[13px] text-sage dark:text-sea-green tracking-wider bg-white dark:bg-night-card transition-colors duration-500">Nginx</li>
      </ul>
    </div>

    <!-- Contact -->
    <div class="mt-10">
      <p class="font-serif text-sm text-pale dark:text-sage-dark">联系我：<a href="mailto:hello@example.com" class="text-moss dark:text-sea-green border-b border-moss dark:border-sea-green hover:text-moss-deep dark:hover:text-glow hover:border-moss-deep dark:hover:border-glow transition-colors duration-300">hello@example.com</a></p>
    </div>

  </div>
</section>

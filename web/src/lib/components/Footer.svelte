<script lang="ts">
  import Divider from '$lib/components/Divider.svelte';
</script>

<footer class="bg-paper-deep dark:bg-night transition-colors duration-500">
  <div class="max-w-[1100px] mx-auto px-6 py-14 md:py-16">
    <!-- Top divider -->
    <Divider />

    <!-- Quote -->
    <div class="text-center mb-12">
      <p class="font-handwritten text-gold dark:text-gold-light text-[30px] md:text-[34px] tracking-[8px] md:tracking-[10px] opacity-80 mb-3">
        烟消云不散 旧盒藏流年
      </p>
      <p class="text-sm text-ink-light/50 dark:text-night-text/45 tracking-[2px]">
        收藏80年代的烟火记忆
      </p>
    </div>

    <!-- Middle: nav + contact -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-10 mb-12">
      <!-- Quick links -->
      <div class="text-center md:text-left">
        <h4 class="font-display text-[15px] text-ink dark:text-night-text tracking-[3px] mb-5 opacity-90">快速链接</h4>
        <nav class="flex flex-col gap-2.5">
          <a
            href="/"
            class="text-sm text-ink-light/65 dark:text-night-text/55 tracking-[1.5px] hover:text-gold dark:hover:text-gold-light transition-colors duration-300 min-h-[44px] inline-flex items-center justify-center md:justify-start"
          >首页</a>
          <a
            href="/gallery"
            class="text-sm text-ink-light/65 dark:text-night-text/55 tracking-[1.5px] hover:text-gold dark:hover:text-gold-light transition-colors duration-300 min-h-[44px] inline-flex items-center justify-center md:justify-start"
          >图库</a>
          <a
            href="/guestbook"
            class="text-sm text-ink-light/65 dark:text-night-text/55 tracking-[1.5px] hover:text-gold dark:hover:text-gold-light transition-colors duration-300 min-h-[44px] inline-flex items-center justify-center md:justify-start"
          >留言</a>
          <a
            href="/about"
            class="text-sm text-ink-light/65 dark:text-night-text/55 tracking-[1.5px] hover:text-gold dark:hover:text-gold-light transition-colors duration-300 min-h-[44px] inline-flex items-center justify-center md:justify-start"
          >关于</a>
        </nav>
      </div>

      <!-- Contact -->
      <div class="text-center md:text-right">
        <h4 class="font-display text-[15px] text-ink dark:text-night-text tracking-[3px] mb-5 opacity-90">联系</h4>
        <div class="flex flex-col gap-2.5">
          <a
            href="mailto:yetiscream@proton.me"
            class="text-sm text-ink-light/65 dark:text-night-text/55 tracking-[1.5px] hover:text-gold dark:hover:text-gold-light transition-colors duration-300 min-h-[44px] inline-flex items-center justify-center md:justify-start"
          >yetiscream@proton.me</a>
          <a
            href="https://github.com/raver"
            target="_blank"
            rel="noopener"
            class="text-sm text-ink-light/65 dark:text-night-text/55 tracking-[1.5px] hover:text-gold dark:hover:text-gold-light transition-colors duration-300 min-h-[44px] inline-flex items-center justify-center md:justify-start"
          >GitHub</a>
        </div>
      </div>
    </div>

    <!-- Bottom line -->
    <div class="border-t border-border dark:border-night-text/10 pt-6 flex flex-col md:flex-row md:justify-between md:items-center gap-3 text-center md:text-left">
      <p class="text-xs text-ink-light/45 dark:text-night-text/35 tracking-[1.5px]">
        © 2026 烟标记忆
      </p>
      <p class="text-xs text-ink-light/45 dark:text-night-text/35 tracking-[1.5px]">
        Made with ❤️ by
        <a
          href="https://github.com/raver"
          target="_blank"
          rel="noopener"
          class="text-ink-light/65 dark:text-night-text/55 hover:text-gold dark:hover:text-gold-light transition-colors duration-300"
        >raver</a>
      </p>
    </div>
  </div>
</footer>

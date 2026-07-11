<script lang="ts">
  import CommentForm from '$lib/components/CommentForm.svelte';
  import CommentList from '$lib/components/CommentList.svelte';
  import Divider from '$lib/components/Divider.svelte';
  import type { Comment } from '$lib/api.js';

  let { data }: { data: { comments: import('$lib/api.js').Comment[]; total: number; page: number; totalPages: number } } = $props();

  let commentForm: CommentForm | undefined;
  let quoteComment: Comment | null = $state(null);

  function handleQuote(comment: Comment) {
    quoteComment = comment;
    commentForm?.setQuote(comment);
  }

  function handleCancelQuote() {
    quoteComment = null;
    commentForm?.cancelQuote();
  }
</script>

<svelte:head>
  <title>留言墙 — 烟标记忆</title>
  <meta name="description" content="在留言墙上分享你的记忆碎片。" />
</svelte:head>

<!-- Page Hero -->
<section class="relative overflow-hidden bg-paper dark:bg-night py-14 md:py-16 px-6 text-center transition-colors duration-500">
  <div class="absolute inset-0 z-0 opacity-[0.05] dark:opacity-[0.03] pointer-events-none">
    <svg viewBox="0 0 900 300" preserveAspectRatio="xMidYMid slice" class="w-full h-full">
      <defs>
        <filter id="inkGb" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="G"/>
          <feGaussianBlur stdDeviation="2"/>
        </filter>
        <linearGradient id="inkGbG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#262626;stop-opacity:0.6"/>
          <stop offset="100%" style="stop-color:#262626;stop-opacity:0"/>
        </linearGradient>
      </defs>
      <path d="M-50,150 C200,100 300,220 500,170 C700,120 800,80 1000,130"
            fill="none" stroke="url(#inkGbG)" stroke-width="28" stroke-linecap="round" filter="url(#inkGb)"/>
      <ellipse cx="300" cy="180" rx="35" ry="20" fill="url(#inkGbG)" filter="url(#inkGb)"/>
      <ellipse cx="650" cy="160" rx="30" ry="18" fill="url(#inkGbG)" filter="url(#inkGb)"/>
    </svg>
  </div>
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.03)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.12)_100%)] pointer-events-none"></div>
  <div class="relative z-10 max-w-[700px] mx-auto">
    <h1 class="font-handwritten text-[40px] md:text-[44px] text-ink dark:text-night-text tracking-[14px] md:tracking-[18px] mb-2.5">留 言 墙</h1>
    <p class="font-serif font-extralight text-[15px] text-ink-light dark:text-night-text/55 tracking-[4px]">在这里，留下你的记忆碎片</p>
  </div>
</section>

<!-- Comment Form -->
<section class="px-6 pt-10 pb-8 transition-colors duration-500">
  <div class="max-w-[660px] mx-auto">
    <CommentForm bind:this={commentForm} cigarId={null} {quoteComment} />
  </div>
</section>

<!-- Divider -->
<Divider />

<!-- Comment List -->
<section class="px-6 pb-16 transition-colors duration-500">
  <div class="max-w-[660px] mx-auto">
    <h2 class="font-serif font-semibold text-lg text-ink dark:text-night-text tracking-wider mb-7">留言 · {data.total}</h2>
    <CommentList comments={data.comments} onQuote={handleQuote} />

    {#if data.totalPages > 1}
      <div class="flex justify-center items-center gap-4 mt-10">
        {#if data.page > 1}
          <a
            href="/guestbook?page={data.page - 1}"
            class="border border-gold dark:border-gold-light text-gold dark:text-gold-light hover:bg-gold hover:text-paper-card dark:hover:bg-gold-light dark:hover:text-night rounded-sm px-5 py-2 font-serif text-sm tracking-widest transition-all duration-300 min-h-[44px] inline-flex items-center"
          >
            上一页
          </a>
        {:else}
          <span class="border border-border dark:border-[#36332E] text-ink-light/40 dark:text-night-text/30 rounded-sm px-5 py-2 font-serif text-sm tracking-widest cursor-not-allowed select-none min-h-[44px] inline-flex items-center">
            上一页
          </span>
        {/if}

        <span class="text-sm text-ink-light dark:text-night-text/55 tracking-wider">{data.page} / {data.totalPages}</span>

        {#if data.page < data.totalPages}
          <a
            href="/guestbook?page={data.page + 1}"
            class="border border-gold dark:border-gold-light text-gold dark:text-gold-light hover:bg-gold hover:text-paper-card dark:hover:bg-gold-light dark:hover:text-night rounded-sm px-5 py-2 font-serif text-sm tracking-widest transition-all duration-300 min-h-[44px] inline-flex items-center"
          >
            下一页
          </a>
        {:else}
          <span class="border border-border dark:border-[#36332E] text-ink-light/40 dark:text-night-text/30 rounded-sm px-5 py-2 font-serif text-sm tracking-widest cursor-not-allowed select-none min-h-[44px] inline-flex items-center">
            下一页
          </span>
        {/if}
      </div>
    {/if}
  </div>
</section>

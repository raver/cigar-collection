<script lang="ts">
  import CommentForm from '$lib/components/CommentForm.svelte';
  import CommentList from '$lib/components/CommentList.svelte';

  let { data }: { data: { comments: import('$lib/api.js').Comment[]; total: number; page: number; totalPages: number } } = $props();
</script>

<svelte:head>
  <title>留言墙 — 烟标记忆</title>
  <meta name="description" content="在留言墙上分享你的记忆碎片。" />
</svelte:head>

<!-- Page Hero -->
<section class="relative overflow-hidden bg-gradient-to-br from-ink to-ink-light dark:from-night dark:to-night-header py-14 md:py-16 px-6 text-center transition-colors duration-500">
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,.1)_100%)] pointer-events-none"></div>
  <div class="relative z-10 max-w-[700px] mx-auto">
    <h1 class="font-display text-[36px] md:text-[40px] text-warm dark:text-sea-green tracking-[8px] md:tracking-[14px] mb-2.5">留 言 墙</h1>
    <p class="font-serif font-extralight text-[15px] text-warm/72 dark:text-sea-green/62 tracking-wider">在这里，留下你的记忆碎片</p>
  </div>
</section>

<!-- Comment Form -->
<section class="px-6 pt-10 pb-8 transition-colors duration-500">
  <div class="max-w-[660px] mx-auto">
    <CommentForm cigarId={null} />
  </div>
</section>

<!-- Divider -->
<div class="text-center py-12 text-pale dark:text-sage-dark text-xs tracking-[14px] opacity-45 select-none">◇ ◇ ◇</div>

<!-- Comment List -->
<section class="px-6 pb-16 transition-colors duration-500">
  <div class="max-w-[660px] mx-auto">
    <h2 class="font-serif font-semibold text-lg text-ink dark:text-sea-green tracking-wider mb-7">留言 · {data.total}</h2>
    <CommentList comments={data.comments} />

    {#if data.totalPages > 1}
      <div class="flex justify-center items-center gap-4 mt-10">
        {#if data.page > 1}
          <a
            href="/guestbook?page={data.page - 1}"
            class="border border-moss dark:border-sea-green text-moss dark:text-sea-green hover:bg-moss hover:text-white dark:hover:bg-sea-green dark:hover:text-night rounded px-5 py-2 font-serif text-sm tracking-widest transition-all duration-300"
          >
            上一页
          </a>
        {:else}
          <span class="border border-ink/12 dark:border-sea-green/12 text-pale dark:text-sage-dark rounded px-5 py-2 font-serif text-sm tracking-widest opacity-40 cursor-not-allowed select-none">
            上一页
          </span>
        {/if}

        <span class="text-sm text-pale dark:text-sage-dark tracking-wider">{data.page} / {data.totalPages}</span>

        {#if data.page < data.totalPages}
          <a
            href="/guestbook?page={data.page + 1}"
            class="border border-moss dark:border-sea-green text-moss dark:text-sea-green hover:bg-moss hover:text-white dark:hover:bg-sea-green dark:hover:text-night rounded px-5 py-2 font-serif text-sm tracking-widest transition-all duration-300"
          >
            下一页
          </a>
        {:else}
          <span class="border border-ink/12 dark:border-sea-green/12 text-pale dark:text-sage-dark rounded px-5 py-2 font-serif text-sm tracking-widest opacity-40 cursor-not-allowed select-none">
            下一页
          </span>
        {/if}
      </div>
    {/if}
  </div>
</section>

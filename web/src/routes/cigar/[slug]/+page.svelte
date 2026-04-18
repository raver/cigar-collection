<script lang="ts">
  import Lightbox from '$lib/components/Lightbox.svelte';
  import CommentList from '$lib/components/CommentList.svelte';
  import CommentForm from '$lib/components/CommentForm.svelte';

  let { data }: { data: { cigar: import('$lib/api.js').Cigar; comments: import('$lib/api.js').Comment[] } } = $props();

  let lightboxOpen = $state(false);
</script>

<svelte:head>
  <title>{data.cigar.name} — 烟标记忆</title>
  <meta name="description" content="{data.cigar.name}，{data.cigar.factory}，{data.cigar.era}。{data.cigar.theme}主题烟标收藏。" />
</svelte:head>

<section class="py-10 md:py-14 px-6">
  <div class="max-w-[900px] mx-auto">
    <!-- PC: left image, right info; Mobile: top image, bottom info -->
    <div class="grid md:grid-cols-2 gap-8">
      <!-- Left: Image -->
      <div>
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div
          class="cursor-pointer rounded overflow-hidden border border-ink/8 dark:border-sea-green/8 shadow-sm hover:shadow-lg transition-shadow duration-300"
          onclick={() => (lightboxOpen = true)}
          role="button"
          tabindex="0"
          aria-label="放大查看图片"
        >
          <img
            src={data.cigar.imageWatermarked}
            alt={data.cigar.name}
            class="w-full block"
          />
        </div>
      </div>

      <!-- Right: Info -->
      <div>
        <!-- Name -->
        <h1 class="font-display text-3xl text-ink dark:text-sea-green tracking-[4px] mb-6">
          {data.cigar.name}
        </h1>

        <!-- Attribute list -->
        <div class="space-y-3 mb-6">
          <div class="flex items-start gap-3">
            <span class="text-xs text-pale dark:text-sage-dark tracking-wider min-w-[56px] pt-0.5">卷烟厂</span>
            <span class="font-serif text-sm text-ink dark:text-sea-green tracking-wide">{data.cigar.factory}</span>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-xs text-pale dark:text-sage-dark tracking-wider min-w-[56px] pt-0.5">年代</span>
            <span class="font-serif text-sm text-ink dark:text-sea-green tracking-wide">{data.cigar.era}</span>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-xs text-pale dark:text-sage-dark tracking-wider min-w-[56px] pt-0.5">主题</span>
            <span class="font-serif text-sm text-ink dark:text-sea-green tracking-wide">{data.cigar.theme}</span>
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t border-ink/8 dark:border-sea-green/8 my-6"></div>

        <!-- Comments -->
        <h3 class="font-serif font-bold text-lg text-ink dark:text-sea-green tracking-wider mb-4">留言</h3>
        <CommentList comments={data.comments} />
        <CommentForm cigarId={data.cigar.id} />
      </div>
    </div>
  </div>
</section>

<Lightbox
  src={data.cigar.imageWatermarked}
  alt={data.cigar.name}
  name={data.cigar.name}
  meta={`${data.cigar.factory} · ${data.cigar.era}`}
  bind:open={lightboxOpen}
/>

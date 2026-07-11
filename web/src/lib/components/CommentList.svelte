<script lang="ts">
  import type { Comment } from '$lib/api.js';

  let { comments, onQuote }: { comments: Comment[]; onQuote?: (comment: Comment) => void } = $props();

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
</script>

<div class="space-y-4">
  {#if comments.length === 0}
    <p class="text-sm text-ink-light/50 dark:text-night-text/40 tracking-wide py-4">暂无留言。</p>
  {:else}
    {#each comments as comment (comment.id)}
      <div class="bg-paper-card dark:bg-night-card border border-border dark:border-[#36332E] rounded-sm shadow-sm p-4">
        <!-- Quote block -->
        {#if comment.quote}
          <div class="border-l-2 border-gold dark:border-gold-light bg-paper-deep dark:bg-night-header rounded-r-sm p-3 mb-3">
            <div class="text-xs text-ink-light/60 dark:text-night-text/40 tracking-wider mb-1">
              @{comment.quote.authorName}
            </div>
            <div class="text-sm text-ink-light dark:text-night-text/60 tracking-wide line-clamp-2">
              {comment.quote.content}
            </div>
          </div>
        {/if}

        <!-- Comment content -->
        <div class="font-serif text-sm text-ink dark:text-night-text tracking-wide leading-relaxed whitespace-pre-wrap mb-3">
          {comment.content}
        </div>

        <div class="flex items-center justify-between">
          <div class="text-xs text-ink-light/55 dark:text-night-text/40 tracking-wider">
            <span class="font-semibold">{comment.authorName}</span>
            <span class="mx-2">·</span>
            <span>{formatDate(comment.createdAt)}</span>
          </div>
          {#if onQuote}
            <button
              onclick={() => onQuote(comment)}
              class="text-xs text-gold dark:text-gold-light hover:underline tracking-wider min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-2"
            >
              引用
            </button>
          {/if}
        </div>
      </div>
    {/each}
  {/if}
</div>

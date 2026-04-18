<script lang="ts">
  import type { Comment } from '$lib/api.js';

  let { comments }: { comments: Comment[] } = $props();

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
</script>

<div class="space-y-4">
  {#if comments.length === 0}
    <p class="text-sm text-pale dark:text-sage-dark tracking-wide py-4">暂无留言。</p>
  {:else}
    {#each comments as comment (comment.id)}
      <div class="bg-white dark:bg-night-card border border-ink/8 dark:border-sea-green/8 rounded shadow-sm p-4">
        <!-- Quote block -->
        {#if comment.quote}
          <div class="border-l-2 border-moss dark:border-sea-green bg-parchment dark:bg-night-header rounded-r p-3 mb-3">
            <div class="text-xs text-pale dark:text-sage-dark tracking-wider mb-1">
              @{comment.quote.authorName}
            </div>
            <div class="text-sm text-sage dark:text-sea-green/80 tracking-wide line-clamp-2">
              {comment.quote.content}
            </div>
          </div>
        {/if}

        <!-- Comment content -->
        <div class="font-serif text-sm text-ink dark:text-sea-green tracking-wide leading-relaxed whitespace-pre-wrap">
          {comment.content}
        </div>

        <div class="flex items-center gap-3 mt-3 text-xs text-pale dark:text-sage-dark tracking-wider">
          <span class="font-semibold">{comment.authorName}</span>
          <span>{formatDate(comment.createdAt)}</span>
        </div>
      </div>
    {/each}
  {/if}
</div>

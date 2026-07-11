<script lang="ts">
  import { api } from '$lib/api.js';
  import type { Comment } from '$lib/api.js';

  let { cigarId, quoteComment }: { cigarId: number | null; quoteComment?: Comment | null } = $props();

  let authorName = $state('');
  let authorEmail = $state('');
  let content = $state('');
  let submitting = $state(false);
  let submitted = $state(false);
  let error = $state('');
  let quote = $state<Comment | null>(quoteComment ?? null);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (submitting || submitted) return;

    if (!authorName.trim()) {
      error = '请输入姓名';
      return;
    }
    if (!content.trim()) {
      error = '请输入留言内容';
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (authorEmail.trim() && !emailRegex.test(authorEmail.trim())) {
      error = '邮箱格式不正确';
      return;
    }

    submitting = true;
    error = '';

    try {
      await api.postComment({
        cigar_id: cigarId,
        author_name: authorName.trim(),
        author_email: authorEmail.trim() || undefined,
        content: content.trim(),
        quote_id: quote?.id ?? undefined,
      });
      submitted = true;
      authorName = '';
      authorEmail = '';
      content = '';
      quote = null;
    } catch (err) {
      if (err instanceof Response) {
        try { const body = await err.clone().json(); error = body.error || '提交失败，请稍后再试'; }
        catch { error = '提交失败，请稍后再试'; }
      } else if (err instanceof Error) {
        error = err.message || '提交失败，请稍后再试';
      } else {
        error = '提交失败，请稍后再试';
      }
    } finally {
      submitting = false;
    }
  }

  export function setQuote(comment: Comment) {
    quote = comment;
  }

  export function cancelQuote() {
    quote = null;
  }
</script>

<div class="mt-8">
  <h3 class="font-serif font-bold text-lg text-ink dark:text-night-text tracking-wider mb-4">留下你的回忆</h3>

  {#if submitted}
    <div class="bg-gold/8 dark:bg-gold-light/8 border border-gold/20 dark:border-gold-light/20 rounded-sm p-4 text-sm text-gold dark:text-gold-light">
      留言已提交，等待审核。
    </div>
  {:else}
    <form onsubmit={handleSubmit} class="space-y-4">
      {#if quote}
        <div class="border-l-2 border-gold dark:border-gold-light bg-paper-deep dark:bg-night-header rounded-r-sm p-3 mb-4 flex justify-between items-start gap-3">
          <div class="flex-1 min-w-0">
            <div class="text-xs text-ink-light/60 dark:text-night-text/40 tracking-wider mb-1">
              引用 @{quote.authorName}
            </div>
            <div class="text-sm text-ink-light dark:text-night-text/60 tracking-wide line-clamp-2">
              {quote.content}
            </div>
          </div>
          <button
            type="button"
            onclick={() => quote = null}
            class="text-ink-light/40 dark:text-night-text/30 hover:text-red-600 dark:hover:text-red-400 text-sm min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
            aria-label="取消引用"
          >
            ✕
          </button>
        </div>
      {/if}
      <div>
        <label for="comment-name" class="block text-xs text-ink-light/60 dark:text-night-text/40 tracking-wider mb-1.5">姓名 *</label>
        <input
          id="comment-name"
          type="text"
          bind:value={authorName}
          required
          class="w-full bg-paper-card dark:bg-night-card border border-border dark:border-[#36332E] rounded-sm px-3 py-2.5 font-serif text-sm text-ink dark:text-night-text placeholder:text-ink-light/30 dark:placeholder:text-night-text/25 outline-none transition-colors duration-300 focus:border-gold dark:focus:border-gold-light"
          placeholder="你的名字"
        />
      </div>
      <div>
        <label for="comment-email" class="block text-xs text-ink-light/60 dark:text-night-text/40 tracking-wider mb-1.5">邮箱</label>
        <input
          id="comment-email"
          type="email"
          bind:value={authorEmail}
          class="w-full bg-paper-card dark:bg-night-card border border-border dark:border-[#36332E] rounded-sm px-3 py-2.5 font-serif text-sm text-ink dark:text-night-text placeholder:text-ink-light/30 dark:placeholder:text-night-text/25 outline-none transition-colors duration-300 focus:border-gold dark:focus:border-gold-light"
          placeholder="不会公开，选填"
        />
      </div>
      <div>
        <label for="comment-content" class="block text-xs text-ink-light/60 dark:text-night-text/40 tracking-wider mb-1.5">留言 *</label>
        <textarea
          id="comment-content"
          bind:value={content}
          required
          rows={4}
          class="w-full bg-paper-card dark:bg-night-card border border-border dark:border-[#36332E] rounded-sm px-3 py-2.5 font-serif text-sm text-ink dark:text-night-text placeholder:text-ink-light/30 dark:placeholder:text-night-text/25 outline-none transition-colors duration-300 focus:border-gold dark:focus:border-gold-light resize-y"
          placeholder="写下你想说的话..."
        ></textarea>
      </div>

      {#if error}
        <div class="text-sm text-red-600 dark:text-red-400">{error}</div>
      {/if}

      <p class="text-xs text-ink-light/50 dark:text-night-text/35 tracking-wide">
        留言需审核后才会公开显示。纯文本，不支持 HTML。
      </p>

      <button
        type="submit"
        disabled={submitting}
        class="border border-gold dark:border-gold-light text-gold dark:text-gold-light hover:bg-gold hover:text-paper-card dark:hover:bg-gold-light dark:hover:text-night rounded-sm px-6 py-2.5 font-serif text-sm tracking-widest cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
      >
        {submitting ? '提交中...' : '提 交'}
      </button>
    </form>
  {/if}
</div>

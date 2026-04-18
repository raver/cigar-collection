<script lang="ts">
  import { api } from '$lib/api.js';

  let { cigarId }: { cigarId: number | null } = $props();

  let authorName = $state('');
  let authorEmail = $state('');
  let content = $state('');
  let submitting = $state(false);
  let submitted = $state(false);
  let error = $state('');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (submitting || submitted) return;

    if (!authorName.trim() || !authorEmail.trim() || !content.trim()) {
      error = '请填写姓名、邮箱和留言内容';
      return;
    }

    submitting = true;
    error = '';

    try {
      await api.postComment({
        cigar_id: cigarId,
        author_name: authorName.trim(),
        author_email: authorEmail.trim(),
        content: content.trim(),
      });
      submitted = true;
      authorName = '';
      authorEmail = '';
      content = '';
    } catch {
      error = '提交失败，请稍后再试';
    } finally {
      submitting = false;
    }
  }
</script>

<div class="mt-8">
  <h3 class="font-serif font-bold text-lg text-ink dark:text-sea-green tracking-wider mb-4">留下你的回忆</h3>

  {#if submitted}
    <div class="bg-moss/10 dark:bg-sea-green/10 border border-moss/20 dark:border-sea-green/20 rounded p-4 text-sm text-moss dark:text-sea-green">
      留言已提交，等待审核。
    </div>
  {:else}
    <form onsubmit={handleSubmit} class="space-y-4">
      <div>
        <label for="comment-name" class="block text-xs text-pale dark:text-sage-dark tracking-wider mb-1.5">姓名 *</label>
        <input
          id="comment-name"
          type="text"
          bind:value={authorName}
          required
          class="w-full bg-white dark:bg-night-card border border-ink/12 dark:border-sea-green/12 rounded px-3 py-2.5 font-serif text-sm text-ink dark:text-sea-green placeholder:text-pale dark:placeholder:text-sage-dark outline-none transition-colors duration-300 focus:border-moss dark:focus:border-glow"
          placeholder="你的名字"
        />
      </div>
      <div>
        <label for="comment-email" class="block text-xs text-pale dark:text-sage-dark tracking-wider mb-1.5">邮箱 *</label>
        <input
          id="comment-email"
          type="email"
          bind:value={authorEmail}
          required
          class="w-full bg-white dark:bg-night-card border border-ink/12 dark:border-sea-green/12 rounded px-3 py-2.5 font-serif text-sm text-ink dark:text-sea-green placeholder:text-pale dark:placeholder:text-sage-dark outline-none transition-colors duration-300 focus:border-moss dark:focus:border-glow"
          placeholder="不会公开"
        />
      </div>
      <div>
        <label for="comment-content" class="block text-xs text-pale dark:text-sage-dark tracking-wider mb-1.5">留言 *</label>
        <textarea
          id="comment-content"
          bind:value={content}
          required
          rows={4}
          class="w-full bg-white dark:bg-night-card border border-ink/12 dark:border-sea-green/12 rounded px-3 py-2.5 font-serif text-sm text-ink dark:text-sea-green placeholder:text-pale dark:placeholder:text-sage-dark outline-none transition-colors duration-300 focus:border-moss dark:focus:border-glow resize-y"
          placeholder="写下你想说的话..."
        ></textarea>
      </div>

      {#if error}
        <div class="text-sm text-red-600 dark:text-red-400">{error}</div>
      {/if}

      <p class="text-xs text-pale dark:text-sage-dark tracking-wide">
        留言需审核后才会公开显示。纯文本，不支持 HTML。
      </p>

      <button
        type="submit"
        disabled={submitting}
        class="border border-moss dark:border-sea-green text-moss dark:text-sea-green hover:bg-moss hover:text-white dark:hover:bg-sea-green dark:hover:text-night rounded px-6 py-2.5 font-serif text-sm tracking-widest cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? '提交中...' : '提 交'}
      </button>
    </form>
  {/if}
</div>

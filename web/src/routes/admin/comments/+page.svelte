<script lang="ts">
  import { onMount } from 'svelte';

  interface CommentItem {
    id: number;
    cigarId: number | null;
    cigarName: string | null;
    cigarSlug: string | null;
    authorName: string;
    authorEmail: string;
    content: string;
    status: string;
    createdAt: string;
    quote?: { id: number; authorName: string; content: string } | null;
  }

  type TabStatus = 'pending' | 'approved' | 'rejected';

  let comments: CommentItem[] = $state([]);
  let activeTab: TabStatus = $state('pending');
  let loading = $state(true);
  let error = $state('');
  let actionId: number | null = $state(null);

  const tabs: { status: TabStatus; label: string }[] = [
    { status: 'pending', label: '待审核' },
    { status: 'approved', label: '已通过' },
    { status: 'rejected', label: '已拒绝' },
  ];

  async function loadComments() {
    loading = true;
    error = '';
    try {
      const res = await fetch(`/admin/api/comments?status=${activeTab}`);
      if (!res.ok) throw new Error();
      comments = await res.json();
    } catch {
      error = '加载留言失败';
      comments = [];
    } finally {
      loading = false;
    }
  }

  async function updateStatus(id: number, status: string) {
    actionId = id;
    try {
      const res = await fetch(`/admin/api/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      comments = comments.filter(c => c.id !== id);
    } catch {
      alert('操作失败，请重试');
    } finally {
      actionId = null;
    }
  }

  async function deleteComment(id: number) {
    if (!confirm('确定要删除这条留言吗？')) return;
    actionId = id;
    try {
      const res = await fetch(`/admin/api/comments/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      comments = comments.filter(c => c.id !== id);
    } catch {
      alert('删除失败，请重试');
    } finally {
      actionId = null;
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function switchTab(status: TabStatus) {
    activeTab = status;
    loadComments();
  }

  onMount(loadComments);
</script>

<svelte:head>
  <title>留言审核 — 烟标记忆管理</title>
</svelte:head>

<div class="p-6 md:p-8">
  <h1 class="font-display text-2xl text-ink dark:text-sea-green tracking-widest mb-6">留言审核</h1>

  <!-- Tabs -->
  <div class="flex gap-1 mb-6 border-b border-ink/10 dark:border-sea-green/10">
    {#each tabs as tab}
      <button
        onclick={() => switchTab(tab.status)}
        class="px-4 py-2.5 text-sm tracking-wider transition-colors border-b-2 -mb-px
          {activeTab === tab.status
            ? 'border-moss dark:border-sea-green text-ink dark:text-sea-green'
            : 'border-transparent text-concrete dark:text-pale hover:text-ink dark:hover:text-sea-green'}"
      >
        {tab.label}
      </button>
    {/each}
  </div>

  {#if error}
    <p class="text-sm text-red-600 dark:text-red-400">{error}</p>
  {/if}

  {#if loading}
    <p class="text-sm text-concrete dark:text-pale tracking-wider animate-pulse">加载中...</p>
  {:else if comments.length === 0}
    <p class="text-sm text-concrete dark:text-pale tracking-wider py-8 text-center">
      {activeTab === 'pending' ? '没有待审核的留言' : activeTab === 'approved' ? '没有已通过的留言' : '没有已拒绝的留言'}
    </p>
  {:else}
    <div class="space-y-4">
      {#each comments as comment (comment.id)}
        <div class="bg-warm dark:bg-night-card border border-ink/8 dark:border-sea-green/8 rounded-lg p-4">
          <!-- Comment header -->
          <div class="flex items-start justify-between mb-2">
            <div class="flex flex-col gap-0.5">
              <div class="flex items-center gap-3">
                <span class="text-sm font-medium text-ink dark:text-sea-green">{comment.authorName}</span>
                <span class="text-xs text-concrete dark:text-pale">{comment.authorEmail}</span>
              </div>
              <span class="text-xs text-concrete/70 dark:text-pale/60 tracking-wide">
                {#if comment.cigarName}
                  📦 <a href="/cigar/{comment.cigarSlug}" class="hover:text-moss dark:hover:text-sea-green underline underline-offset-2">《{comment.cigarName}》</a>
                {:else}
                  🗣 留言墙
                {/if}
              </span>
            </div>
            <span class="text-xs text-concrete dark:text-pale shrink-0">{formatDate(comment.createdAt)}</span>
          </div>

          <!-- Quote block -->
          {#if comment.quote}
            <div class="border-l-2 border-moss dark:border-sea-green bg-parchment dark:bg-night-header rounded-r p-3 mb-3">
              <div class="text-xs text-pale dark:text-sage-dark tracking-wider mb-1">
                引用 @{comment.quote.authorName}
              </div>
              <div class="text-sm text-sage dark:text-sea-green/80 tracking-wide">
                {comment.quote.content}
              </div>
            </div>
          {/if}

          <!-- Comment content -->
          <p class="text-sm text-ink/80 dark:text-sea-green/80 leading-relaxed mb-3">{comment.content}</p>

          <!-- Actions -->
          <div class="flex items-center gap-3 pt-2 border-t border-ink/5 dark:border-sea-green/5">
            {#if activeTab === 'pending'}
              <button
                onclick={() => updateStatus(comment.id, 'approved')}
                disabled={actionId === comment.id}
                class="text-xs px-3 py-1.5 rounded bg-moss/15 dark:bg-sea-green/15 text-moss dark:text-sea-green tracking-wider hover:bg-moss/25 dark:hover:bg-sea-green/25 transition-colors disabled:opacity-40"
              >
                通过
              </button>
              <button
                onclick={() => updateStatus(comment.id, 'rejected')}
                disabled={actionId === comment.id}
                class="text-xs px-3 py-1.5 rounded bg-red-500/10 dark:bg-red-400/10 text-red-600 dark:text-red-400 tracking-wider hover:bg-red-500/20 dark:hover:bg-red-400/20 transition-colors disabled:opacity-40"
              >
                拒绝
              </button>
            {:else if activeTab === 'approved'}
              <button
                onclick={() => updateStatus(comment.id, 'rejected')}
                disabled={actionId === comment.id}
                class="text-xs px-3 py-1.5 rounded bg-red-500/10 dark:bg-red-400/10 text-red-600 dark:text-red-400 tracking-wider hover:bg-red-500/20 dark:hover:bg-red-400/20 transition-colors disabled:opacity-40"
              >
                拒绝
              </button>
            {:else}
              <button
                onclick={() => updateStatus(comment.id, 'approved')}
                disabled={actionId === comment.id}
                class="text-xs px-3 py-1.5 rounded bg-moss/15 dark:bg-sea-green/15 text-moss dark:text-sea-green tracking-wider hover:bg-moss/25 dark:hover:bg-sea-green/25 transition-colors disabled:opacity-40"
              >
                通过
              </button>
            {/if}

            <button
              onclick={() => deleteComment(comment.id)}
              disabled={actionId === comment.id}
              class="text-xs px-3 py-1.5 text-concrete dark:text-pale hover:text-red-600 dark:hover:text-red-400 tracking-wider transition-colors disabled:opacity-40"
            >
              删除
            </button>
          </div>
        </div>
      {/each}
    </div>
    <p class="mt-4 text-xs text-concrete dark:text-pale tracking-wider">共 {comments.length} 条</p>
  {/if}
</div>

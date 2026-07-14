<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { onMount } from 'svelte';
  import { theme } from '$lib/theme.js';
  import '../app.css';

  let { data, children }: { data: { isAdmin?: boolean }; children: any } = $props();

  onMount(() => theme.init());
</script>

<svelte:head>
  <!-- 各页面通过自己的 <svelte:head> 设置 title，layout 不设默认值 -->
</svelte:head>

{#if data.isAdmin}
  <div class="min-h-screen bg-paper dark:bg-night text-ink dark:text-night-text font-serif transition-colors duration-500">
    {@render children()}
  </div>
{:else}
  <div class="min-h-screen flex flex-col bg-paper dark:bg-night text-ink dark:text-night-text font-serif transition-colors duration-500">
    <Header />
    <main class="flex-1">
      {@render children()}
    </main>
    <Footer />
  </div>
{/if}

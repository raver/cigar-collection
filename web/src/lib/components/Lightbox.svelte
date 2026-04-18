<script lang="ts">
  import { onMount } from 'svelte';

  let {
    src,
    alt,
    name = '',
    meta = '',
    open = $bindable(false),
  }: {
    src: string;
    alt: string;
    name?: string;
    meta?: string;
    open?: boolean;
  } = $props();

  function close() {
    open = false;
  }

  function onBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      close();
    }
  }

  $effect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = open ? 'hidden' : '';
    }
  });

  onMount(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) close();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
</script>

{#if open}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_interactive_supports_focus -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/82"
    onclick={onBackdropClick}
    role="dialog"
    aria-modal="true"
    aria-label="图片放大查看"
    tabindex="-1"
  >
    <div class="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center animate-[lightboxIn_0.35s_ease]">
      <!-- Close button -->
      <button
        onclick={close}
        class="absolute -top-10 right-0 bg-transparent border-none text-white/60 text-[28px] cursor-pointer leading-none transition-colors duration-300 hover:text-white"
        aria-label="关闭"
      >
        &times;
      </button>

      <!-- Image -->
      <img
        {src}
        {alt}
        class="max-w-[90vw] max-h-[75vh] object-contain rounded shadow-[0_8px_40px_rgba(0,0,0,.4)]"
      />

      <!-- Caption -->
      {#if name}
        <div class="mt-[18px] text-center text-white/65 font-serif text-sm tracking-wider">
          <div class="text-white/90 text-lg font-semibold tracking-[3px] mb-1">{name}</div>
          {#if meta}
            <div>{meta}</div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  @keyframes lightboxIn {
    from {
      transform: scale(0.92);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>

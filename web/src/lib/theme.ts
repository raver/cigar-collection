import { browser } from '$app/environment';
import { writable } from 'svelte/store';

type Theme = 'day' | 'night';

function createThemeStore() {
  const initial: Theme = browser
    ? (document.documentElement.getAttribute('data-theme') as Theme) || 'day'
    : 'day';
  const { subscribe, set } = writable<Theme>(initial);

  return {
    subscribe,
    toggle() {
      if (!browser) return;
      const current = document.documentElement.getAttribute('data-theme');
      const next: Theme = current === 'day' ? 'night' : 'day';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      set(next);
    },
    init() {
      if (!browser) return;
      const saved = localStorage.getItem('theme') as Theme | null;
      if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
        set(saved);
      }
    }
  };
}

export const theme = createThemeStore();

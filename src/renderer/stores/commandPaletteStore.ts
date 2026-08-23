import { writable } from 'svelte/store';

const { subscribe, set, update } = writable(false);

export const commandPaletteStore = {
  subscribe,
  open: () => set(true),
  close: () => set(false),
  toggle: () => update((isOpen) => !isOpen),
};

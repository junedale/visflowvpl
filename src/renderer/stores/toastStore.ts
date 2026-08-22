import { writable } from 'svelte/store';

export interface ToastItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export const toasts = writable<ToastItem[]>([]);

export function showToast(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', duration: number = 3000) {
  const id = Math.random().toString(36).substring(2, 9);
  toasts.update((items) => [...items, { id, type, message }]);

  setTimeout(() => {
    toasts.update((items) => items.filter((t) => t.id !== id));
  }, duration);
}

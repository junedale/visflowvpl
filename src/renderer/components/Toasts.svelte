<script lang="ts">
  import { toasts } from '../stores/toastStore.js';
</script>

<div class="fixed top-4 right-4 z-50 pointer-events-none space-y-2 max-w-sm w-full">
  {#each $toasts as toast (toast.id)}
    <div
      class="pointer-events-auto p-3.5 rounded-2xl shadow-m3-3 border backdrop-blur-md flex items-center gap-3 transition-all animate-in fade-in slide-in-from-top-2 {toast.type === 'error' ? 'bg-surface-container-high border-m3-error/50 text-m3-error' : toast.type === 'success' ? 'bg-surface-container-high border-m3-tertiary/50 text-m3-tertiary' : toast.type === 'warning' ? 'bg-surface-container-high border-m3-secondary/50 text-m3-secondary' : 'bg-surface-container-high border-m3-primary/50 text-m3-primary'}"
      role="alert"
    >
      <!-- Icon Indicator -->
      <div class="w-2 h-2 rounded-full flex-shrink-0 {toast.type === 'error' ? 'bg-m3-error' : toast.type === 'success' ? 'bg-m3-tertiary' : toast.type === 'warning' ? 'bg-m3-secondary' : 'bg-m3-primary'}"></div>

      <!-- Message -->
      <div class="text-xs font-medium text-m3-on-surface flex-1">
        {toast.message}
      </div>
    </div>
  {/each}
</div>

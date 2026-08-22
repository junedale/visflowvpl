<script lang="ts">
  import { consoleStore } from '../../stores/consoleStore.js';
  import { showToast } from '../../stores/toastStore.js';

  export let show = false;

  function copyCode() {
    navigator.clipboard.writeText($consoleStore.lastGeneratedCode);
    showToast('Code copied to clipboard!', 'success');
  }
</script>

{#if show}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in select-none">
    <div class="w-full max-w-2xl bg-surface-container border border-surface-container-high rounded-3xl p-6 shadow-m3-4 space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <h3 class="text-base font-semibold text-m3-on-surface">Generated VisLang Code</h3>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-m3-primary/10 text-m3-primary border border-m3-primary/30">VisLang v1</span>
        </div>
        <button
          class="w-7 h-7 flex items-center justify-center rounded-full text-m3-outline hover:text-m3-on-surface hover:bg-surface-container-high transition-colors"
          on:click={() => (show = false)}
        >
          ✕
        </button>
      </div>

      <!-- Code Container -->
      <div class="rounded-2xl overflow-hidden border border-surface-container-highest bg-surface-dim">
        <pre class="p-4 m-0 font-mono text-xs text-m3-primary overflow-x-auto max-h-[380px] leading-relaxed select-text">
{$consoleStore.lastGeneratedCode || '// No code generated yet. Click "Run" or open this dialog to view synthesized VisLang code.'}
        </pre>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          class="m3-btn-tonal"
          on:click={copyCode}
        >
          Copy Code
        </button>
        <button
          type="button"
          class="m3-btn-primary"
          on:click={() => (show = false)}
        >
          Done
        </button>
      </div>
    </div>
  </div>
{/if}

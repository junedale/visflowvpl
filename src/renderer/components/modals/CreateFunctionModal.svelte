<script lang="ts">
  import { graphStore } from '../../stores/graphStore.js';
  import { showToast } from '../../stores/toastStore.js';
  import type { FunctionParam } from '../../../types/flow.js';

  export let show = false;

  let funName = '';
  let paramsInput = '';

  function handleSave() {
    const trimmed = funName.trim();
    if (!trimmed) {
      showToast('Function name cannot be empty', 'error');
      return;
    }
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed)) {
      showToast('Function name must start with a letter and contain only alphanumeric characters', 'error');
      return;
    }

    const params: FunctionParam[] = paramsInput
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0)
      .map((name) => ({ name, dataType: 'any' }));

    graphStore.addFunction({
      name: trimmed,
      params,
    });

    showToast(`Function '${trimmed}' created and added to canvas!`, 'success');
    funName = '';
    paramsInput = '';
    show = false;
  }
</script>

{#if show}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in select-none">
    <div class="w-full max-w-md bg-surface-container border border-surface-container-high rounded-3xl p-6 shadow-m3-4 space-y-5">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold text-m3-on-surface">Create New Function</h3>
        <button
          class="w-7 h-7 flex items-center justify-center rounded-full text-m3-outline hover:text-m3-on-surface hover:bg-surface-container-high transition-colors"
          on:click={() => (show = false)}
        >
          ✕
        </button>
      </div>

      <!-- Form Inputs -->
      <div class="space-y-4">
        <div class="space-y-1.5">
          <label class="text-xs font-medium text-m3-on-surface-variant block" for="fun-name">Function Name</label>
          <input
            id="fun-name"
            type="text"
            class="m3-input font-mono"
            placeholder="e.g. calculateArea, formatOutput"
            bind:value={funName}
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-medium text-m3-on-surface-variant block" for="fun-params">Parameters (comma-separated)</label>
          <input
            id="fun-params"
            type="text"
            class="m3-input font-mono"
            placeholder="e.g. width, height, scale"
            bind:value={paramsInput}
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          class="m3-btn-text"
          on:click={() => (show = false)}
        >
          Cancel
        </button>
        <button
          type="button"
          class="m3-btn-primary"
          on:click={handleSave}
        >
          Create Function
        </button>
      </div>
    </div>
  </div>
{/if}

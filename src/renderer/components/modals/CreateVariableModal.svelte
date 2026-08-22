<script lang="ts">
  import { graphStore } from '../../stores/graphStore.js';
  import { showToast } from '../../stores/toastStore.js';
  import type { DataType } from '../../../types/flow.js';

  export let show = false;

  let varName = '';
  let dataType: DataType = 'number';
  let initialValue = '0';

  function handleSave() {
    const trimmed = varName.trim();
    if (!trimmed) {
      showToast('Variable name cannot be empty', 'error');
      return;
    }
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed)) {
      showToast('Variable name must start with a letter and contain only alphanumeric characters', 'error');
      return;
    }

    graphStore.addVariable({
      name: trimmed,
      dataType,
      value: initialValue,
    });

    showToast(`Variable '${trimmed}' created and added to canvas!`, 'success');
    varName = '';
    initialValue = '0';
    show = false;
  }
</script>

{#if show}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in select-none">
    <div class="w-full max-w-md bg-surface-container border border-surface-container-high rounded-3xl p-6 shadow-m3-4 space-y-5">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold text-m3-on-surface">Create New Variable</h3>
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
          <label class="text-xs font-medium text-m3-on-surface-variant block" for="var-name">Variable Name</label>
          <input
            id="var-name"
            type="text"
            class="m3-input font-mono"
            placeholder="e.g. counter, totalSum"
            bind:value={varName}
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-medium text-m3-on-surface-variant block" for="var-type">Data Type</label>
          <select id="var-type" class="m3-input" bind:value={dataType}>
            <option value="number">Number</option>
            <option value="string">String</option>
            <option value="boolean">Boolean</option>
            <option value="array">Array</option>
          </select>
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-medium text-m3-on-surface-variant block" for="var-init">Initial Value</label>
          <input
            id="var-init"
            type="text"
            class="m3-input font-mono"
            placeholder="0, true, 'hello', 1,2,3"
            bind:value={initialValue}
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
          Create Variable
        </button>
      </div>
    </div>
  </div>
{/if}

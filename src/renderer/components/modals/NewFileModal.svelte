<script lang="ts">
  import { fileStore } from '../../stores/fileStore.js';
  import { showToast } from '../../stores/toastStore.js';

  export let show = false;
  let fileName = '';

  async function handleCreate() {
    const trimmed = fileName.trim();
    if (!trimmed) {
      showToast('File name cannot be empty', 'error');
      return;
    }

    await fileStore.newFile(trimmed);
    showToast(`Created new file '${trimmed}'`, 'success');
    fileName = '';
    show = false;
  }
</script>

{#if show}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in select-none">
    <div class="w-full max-w-md bg-surface-container border border-surface-container-high rounded-3xl p-6 shadow-m3-4 space-y-5">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold text-m3-on-surface">New VisFlow File</h3>
        <button
          class="w-7 h-7 flex items-center justify-center rounded-full text-m3-outline hover:text-m3-on-surface hover:bg-surface-container-high transition-colors"
          on:click={() => (show = false)}
        >
          ✕
        </button>
      </div>

      <!-- Input -->
      <div class="space-y-1.5">
        <label class="text-xs font-medium text-m3-on-surface-variant block" for="new-filename">File Name</label>
        <div class="flex items-center rounded-xl bg-surface-container-low border border-m3-outline-variant focus-within:border-m3-primary focus-within:ring-1 focus-within:ring-m3-primary overflow-hidden transition-all">
          <input
            id="new-filename"
            type="text"
            class="flex-1 bg-transparent px-3 py-2 text-sm text-m3-on-surface focus:outline-none"
            placeholder="main"
            bind:value={fileName}
            on:keydown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <span class="px-3 py-2 text-xs font-mono text-m3-outline bg-surface-container-high/50 border-l border-m3-outline-variant/50">
            .visflow
          </span>
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
          on:click={handleCreate}
        >
          Create File
        </button>
      </div>
    </div>
  </div>
{/if}

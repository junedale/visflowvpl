<script lang="ts">
  import { afterUpdate } from 'svelte';
  import { consoleStore } from '../stores/consoleStore.js';
  import { showToast } from '../stores/toastStore.js';

  let logContainer: HTMLDivElement;

  afterUpdate(() => {
    if (logContainer) {
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  });

  function copyLogs() {
    const text = $consoleStore.logs.map((l) => `[${l.timestamp}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(text);
    showToast('Logs copied to clipboard!', 'success');
  }
</script>

{#if $consoleStore.isOpen}
  <div class="h-64 min-h-[180px] bg-surface-container border-t border-surface-container-high flex flex-col z-30 shadow-m3-4 select-none">
    <!-- Header -->
    <div class="h-10 px-4 flex items-center justify-between border-b border-surface-container-high bg-surface-container-low/80">
      <div class="flex items-center gap-2.5">
        <span class="font-semibold text-xs text-m3-on-surface tracking-wide">Execution Terminal</span>
        {#if $consoleStore.isRunning}
          <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-m3-secondary-container text-m3-on-secondary-container border border-m3-secondary/40 flex items-center gap-1.5 animate-pulse">
            <span class="w-1.5 h-1.5 rounded-full bg-m3-secondary"></span>
            <span>Running</span>
          </span>
        {:else if $consoleStore.executionTime > 0}
          <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-m3-tertiary-container text-m3-on-tertiary-container border border-m3-tertiary/40">
            {$consoleStore.executionTime.toFixed(2)}ms
          </span>
        {/if}
      </div>

      <div class="flex items-center gap-1.5">
        <button
          class="px-2.5 py-1 rounded-full text-[11px] font-medium text-m3-on-surface-variant hover:text-m3-on-surface hover:bg-surface-container-high active:scale-95 transition-all"
          on:click={copyLogs}
        >
          Copy
        </button>
        <button
          class="px-2.5 py-1 rounded-full text-[11px] font-medium text-m3-on-surface-variant hover:text-m3-on-surface hover:bg-surface-container-high active:scale-95 transition-all"
          on:click={consoleStore.clear}
        >
          Clear
        </button>
        <button
          class="w-6 h-6 flex items-center justify-center rounded-full text-m3-outline hover:text-m3-on-surface hover:bg-surface-container-high active:scale-95 transition-all text-xs ml-1"
          on:click={() => consoleStore.toggleOpen(false)}
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Terminal Output -->
    <div
      bind:this={logContainer}
      class="flex-1 p-3 overflow-y-auto font-mono text-xs bg-surface-dim select-text space-y-1"
    >
      {#if $consoleStore.logs.length === 0}
        <div class="text-m3-outline/60 italic py-2 select-none">
          Click "▶ Run" to execute your visual flow. Output will stream here.
        </div>
      {:else}
        {#each $consoleStore.logs as log (log.id)}
          <div
            class="flex items-start gap-2 leading-relaxed break-all font-mono {log.type === 'stderr' ? 'text-m3-error' : log.type === 'info' ? 'text-m3-primary' : log.type === 'success' ? 'text-m3-tertiary' : 'text-m3-on-surface'}"
          >
            <span class="text-m3-outline/50 select-none text-[10px] pt-0.5">[{log.timestamp}]</span>
            <span class="flex-1 whitespace-pre-wrap">{log.text}</span>
          </div>
        {/each}
      {/if}
    </div>
  </div>
{/if}

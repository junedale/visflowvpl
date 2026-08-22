<script lang="ts">
  import { afterUpdate } from 'svelte';
  import { consoleStore } from '../stores/consoleStore.js';
  import { drawingStore } from '../stores/drawingStore.js';
  import { showToast } from '../stores/toastStore.js';
  import { globalRunner } from '../../interpreter/runner.js';
  import DrawingCanvas from './DrawingCanvas.svelte';

  type BottomTab = 'terminal' | 'drawing' | 'watch';
  let activeTab: BottomTab = 'terminal';

  let logContainer: HTMLDivElement;
  let userInputValue = '';
  let userInputEl: HTMLInputElement;

  afterUpdate(() => {
    if (logContainer) {
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  });

  $: if ($consoleStore.awaitingInput && userInputEl) {
    setTimeout(() => userInputEl?.focus(), 50);
  }

  // Automatically switch to drawing canvas tab if turtle drawing commands are executing
  $: if ($drawingStore.commands.length > 0 && activeTab === 'terminal' && $consoleStore.isRunning) {
    activeTab = 'drawing';
  }

  function handleInputSubmit() {
    const val = userInputValue;
    userInputValue = '';
    consoleStore.log(`> ${val}`, 'info');
    consoleStore.setAwaitingInput(false);
    globalRunner.provideInput(val);
  }

  function copyLogs() {
    const text = $consoleStore.logs.map((l) => `[${l.timestamp}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(text);
    showToast('Logs copied to clipboard!', 'success');
  }
</script>

{#if $consoleStore.isOpen}
  <div class="h-72 min-h-[220px] bg-surface-container border-t border-surface-container-high flex flex-col z-30 shadow-m3-4 select-none">
    <!-- Header with Tabs -->
    <div class="h-10 px-3 flex items-center justify-between border-b border-surface-container-high bg-surface-container-low/90">
      <div class="flex items-center gap-1">
        <button
          class="px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 {activeTab === 'terminal' ? 'bg-m3-primary text-m3-on-primary shadow-sm' : 'text-m3-on-surface-variant hover:text-m3-on-surface hover:bg-surface-container-high'}"
          on:click={() => (activeTab = 'terminal')}
        >
          <span>💬</span>
          <span>Terminal</span>
          {#if $consoleStore.isRunning}
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping"></span>
          {/if}
        </button>

        <button
          class="px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 {activeTab === 'drawing' ? 'bg-m3-primary text-m3-on-primary shadow-sm' : 'text-m3-on-surface-variant hover:text-m3-on-surface hover:bg-surface-container-high'}"
          on:click={() => (activeTab = 'drawing')}
        >
          <span>🎨</span>
          <span>Turtle Canvas</span>
          {#if $drawingStore.commands.length > 0}
            <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-400/20 text-sky-300 font-mono">
              {$drawingStore.commands.length}
            </span>
          {/if}
        </button>

        <button
          class="px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 {activeTab === 'watch' ? 'bg-m3-primary text-m3-on-primary shadow-sm' : 'text-m3-on-surface-variant hover:text-m3-on-surface hover:bg-surface-container-high'}"
          on:click={() => (activeTab = 'watch')}
        >
          <span>👁</span>
          <span>Live Watch</span>
          {#if Object.keys($consoleStore.watchedVariables).length > 0}
            <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-400/20 text-emerald-300 font-mono">
              {Object.keys($consoleStore.watchedVariables).length}
            </span>
          {/if}
        </button>
      </div>

      <div class="flex items-center gap-1.5 text-xs">
        {#if $consoleStore.isRunning}
          <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 animate-pulse mr-2">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Running</span>
          </span>
        {:else if $consoleStore.executionTime > 0}
          <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-container-highest text-m3-outline border border-surface-container-highest font-mono mr-2">
            {$consoleStore.executionTime.toFixed(2)}ms
          </span>
        {/if}

        {#if activeTab === 'terminal'}
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
        {/if}

        <button
          class="w-6 h-6 flex items-center justify-center rounded-full text-m3-outline hover:text-m3-on-surface hover:bg-surface-container-high active:scale-95 transition-all text-xs ml-1"
          on:click={() => consoleStore.toggleOpen(false)}
          title="Minimize Dock"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Tab 1: Terminal Output -->
    {#if activeTab === 'terminal'}
      <div class="flex-1 flex flex-col min-h-0 relative">
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

        <!-- Interactive User Input Bar -->
        {#if $consoleStore.awaitingInput}
          <div class="px-3 py-2 bg-surface-container-highest/95 border-t border-m3-primary/40 flex items-center gap-2">
            <span class="text-xs font-semibold text-m3-primary flex items-center gap-1.5">
              <span>💬</span>
              <span>{$consoleStore.inputPrompt || 'Input required:'}</span>
            </span>
            <form class="flex-1 flex items-center gap-2" on:submit|preventDefault={handleInputSubmit}>
              <input
                bind:this={userInputEl}
                bind:value={userInputValue}
                type="text"
                placeholder="Type value and press Enter..."
                class="flex-1 bg-surface-container-low px-3 py-1 text-xs text-m3-on-surface rounded-full border border-m3-outline-variant/60 focus:outline-none focus:border-m3-primary font-mono"
              />
              <button
                type="submit"
                class="px-3 py-1 rounded-full text-xs font-bold bg-m3-primary text-m3-on-primary hover:bg-m3-primary/90 active:scale-95 transition-all"
              >
                Submit
              </button>
            </form>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Tab 2: Turtle Drawing Canvas -->
    {#if activeTab === 'drawing'}
      <div class="flex-1 min-h-0 relative">
        <DrawingCanvas />
      </div>
    {/if}

    <!-- Tab 3: Live Variable Watch -->
    {#if activeTab === 'watch'}
      <div class="flex-1 p-3 overflow-y-auto bg-surface-dim font-mono text-xs">
        {#if Object.keys($consoleStore.watchedVariables).length === 0}
          <div class="text-m3-outline/60 italic py-4 text-center">
            No active variables yet. Run in step or timed mode to inspect variables in real-time.
          </div>
        {:else}
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {#each Object.entries($consoleStore.watchedVariables) as [varName, varVal]}
              <div class="p-2.5 rounded-2xl bg-surface-container border border-surface-container-high flex flex-col gap-1 shadow-sm">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-m3-primary">{varName}</span>
                  <span class="text-[10px] text-m3-outline uppercase font-sans">
                    {Array.isArray(varVal) ? `Array(${varVal.length})` : typeof varVal}
                  </span>
                </div>
                <div class="text-[11px] text-m3-on-surface bg-surface-dim p-1.5 rounded-lg overflow-x-auto whitespace-pre-wrap break-all border border-surface-container-highest">
                  {typeof varVal === 'object' ? JSON.stringify(varVal) : String(varVal)}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </div>
{/if}


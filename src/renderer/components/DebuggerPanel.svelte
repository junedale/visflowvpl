<script lang="ts">
  import { debugStore } from '../stores/debugStore.js';
  import { consoleStore } from '../stores/consoleStore.js';
  import { graphStore } from '../stores/graphStore.js';
  import { globalRunner } from '../../interpreter/runner.js';
  export let width = 320;

  function nodeName(nodeId: string) {
    return $graphStore.nodes.find((node) => node.id === nodeId)?.title ?? 'Deleted node';
  }

  function continueRun() {
    consoleStore.setPaused(false);
    debugStore.clearPause();
    globalRunner.resume();
  }

  function step() {
    consoleStore.setPaused(false);
    debugStore.clearPause();
    globalRunner.stepNext();
  }
</script>

<aside class="min-w-60 max-w-[40vw] bg-surface-container-low border-l border-surface-container-high flex flex-col shadow-m3-2 z-20" style:width={`${width}px`} aria-label="Debugger">
  <header class="h-11 px-3 flex items-center justify-between border-b border-surface-container-high">
    <div><p class="text-xs font-semibold text-m3-on-surface">Debug</p><p class="text-[10px] text-m3-outline">Trace and runtime state</p></div>
    <button class="w-7 h-7 rounded-lg text-m3-outline hover:bg-surface-container-high" on:click={() => debugStore.toggleDebugPanel(false)} aria-label="Close Debug panel">×</button>
  </header>
  <div class="p-3 space-y-4 overflow-y-auto">
    <section class="rounded-xl bg-surface-container border border-surface-container-high p-3">
      <p class="text-[10px] font-bold uppercase tracking-wider text-m3-outline">Execution</p>
      <p class="mt-1 text-xs text-m3-on-surface">{$consoleStore.isPaused ? `Paused before ${nodeName($consoleStore.activeNodeId ?? '')}` : $consoleStore.isRunning ? 'Running' : 'Ready to run'}</p>
      {#if $consoleStore.isPaused}
        <div class="mt-3 flex gap-2"><button class="m3-btn-primary text-xs" on:click={continueRun}>Continue</button><button class="m3-btn-tonal text-xs" on:click={step}>Next step</button></div>
      {/if}
    </section>
    <section>
      <div class="flex items-center justify-between"><p class="text-[10px] font-bold uppercase tracking-wider text-m3-outline">Breakpoints</p><span class="text-[10px] text-m3-outline">{$debugStore.breakpointNodeIds.length}</span></div>
      {#if $debugStore.breakpointNodeIds.length === 0}<p class="mt-2 text-xs text-m3-outline">Hover a node and select its dot to pause before it runs.</p>{:else}<div class="mt-2 space-y-1">{#each $debugStore.breakpointNodeIds as nodeId}<button class="w-full px-2 py-1.5 rounded-lg bg-surface-container text-left text-xs text-m3-on-surface hover:bg-surface-container-high" on:click={() => debugStore.toggleBreakpoint(nodeId)}>● {nodeName(nodeId)}</button>{/each}</div>{/if}
    </section>
    <section>
      <div class="flex items-center justify-between"><p class="text-[10px] font-bold uppercase tracking-wider text-m3-outline">Execution trace</p><span class="text-[10px] text-m3-outline">{$debugStore.trace.length}/200</span></div>
      {#if $debugStore.trace.length === 0}<p class="mt-2 text-xs text-m3-outline">Run a graph to see the nodes it visits.</p>{:else}<ol class="mt-2 space-y-1">{#each [...$debugStore.trace].reverse() as entry}<li class="rounded-lg bg-surface-container p-2 text-xs"><span class="text-m3-primary font-medium">{nodeName(entry.nodeId)}</span><span class="ml-2 text-[10px] text-m3-outline">{entry.reason}</span></li>{/each}</ol>{/if}
    </section>
  </div>
</aside>

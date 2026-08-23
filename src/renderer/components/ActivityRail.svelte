<script lang="ts">
  import { debugStore } from '../stores/debugStore.js';
  import { commandPaletteStore } from '../stores/commandPaletteStore.js';

  export let onLearn: () => void = () => {};
</script>

<nav class="w-12 shrink-0 bg-surface-container-low border-r border-surface-container-high flex flex-col items-center py-2 gap-1 select-none" aria-label="Workspace tools">
  <button class="w-9 h-9 rounded-xl bg-m3-primary/15 text-m3-primary hover:bg-m3-primary/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-m3-primary" title="Build workspace" aria-label="Build workspace">◈</button>
  <button class="w-9 h-9 rounded-xl text-m3-outline hover:text-m3-on-surface hover:bg-surface-container-high focus-visible:outline focus-visible:outline-2 focus-visible:outline-m3-primary" on:click={commandPaletteStore.open} title="Command palette (Ctrl+P)" aria-label="Open command palette">⌕</button>
  <button class="w-9 h-9 rounded-xl text-m3-outline hover:text-m3-on-surface hover:bg-surface-container-high focus-visible:outline focus-visible:outline-2 focus-visible:outline-m3-primary" on:click={() => debugStore.toggleDebugPanel()} title="Open Debug panel" aria-label="Open Debug panel">▷</button>
  <button class="w-9 h-9 rounded-xl text-m3-outline hover:text-m3-on-surface hover:bg-surface-container-high focus-visible:outline focus-visible:outline-2 focus-visible:outline-m3-primary" on:click={() => debugStore.toggleInspector()} title="Open Inspector" aria-label="Open Inspector">ⓘ</button>
  <button class="w-9 h-9 rounded-xl text-m3-outline hover:text-m3-on-surface hover:bg-surface-container-high focus-visible:outline focus-visible:outline-2 focus-visible:outline-m3-primary" on:click={onLearn} title="Show learning hints" aria-label="Show learning hints">?</button>
</nav>

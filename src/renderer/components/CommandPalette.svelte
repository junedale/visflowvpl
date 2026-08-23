<script lang="ts">
  import { tick } from 'svelte';
  import { PALETTE_CATEGORIES } from '../../canvas/nodeTemplates.js';
  import { graphStore } from '../stores/graphStore.js';
  import { fileStore } from '../stores/fileStore.js';
  import { debugStore } from '../stores/debugStore.js';
  import { consoleStore } from '../stores/consoleStore.js';
  import { commandPaletteStore } from '../stores/commandPaletteStore.js';
  import { workspaceLayoutStore } from '../stores/workspaceLayoutStore.js';

  export let getInsertPosition: () => { x: number; y: number } = () => ({ x: 280, y: 160 });
  export let onRun: () => void = () => {};
  export let onSave: () => void = () => {};
  export let onBeautify: () => void = () => {};
  export let onFit: () => void = () => {};

  interface PaletteAction { id: string; label: string; detail: string; execute: () => void; }
  let query = '';
  let selectedIndex = 0;
  let searchInput: HTMLInputElement;

  $: actions = [
    ...PALETTE_CATEGORIES.flatMap((group) => group.items.map((item): PaletteAction => ({
      id: `node:${item.id}`, label: `Add ${item.name}`, detail: group.name,
      execute: () => graphStore.addNode(item.id, getInsertPosition()),
    }))),
    { id: 'run', label: 'Run program', detail: 'Execute the current graph', execute: onRun },
    { id: 'save', label: 'Save file', detail: 'Save the current project', execute: onSave },
    { id: 'beautify', label: 'Beautify graph', detail: 'Auto-layout nodes', execute: onBeautify },
    { id: 'fit', label: 'Fit graph', detail: 'Center the current graph', execute: onFit },
    { id: 'debug', label: 'Open Debug panel', detail: 'Trace and breakpoints', execute: () => debugStore.toggleDebugPanel(true) },
    { id: 'inspect', label: 'Open Inspector', detail: 'Configure selected node', execute: () => debugStore.toggleInspector(true) },
    { id: 'terminal', label: 'Open Terminal', detail: 'Program output', execute: () => consoleStore.openDock('terminal') },
    { id: 'problems', label: 'Open Problems', detail: 'Graph diagnostics', execute: () => consoleStore.openDock('problems') },
    { id: 'reset-layout', label: 'Reset workspace layout', detail: 'Restore default panel sizes', execute: workspaceLayoutStore.reset },
    ...$graphStore.functions.map((fn): PaletteAction => ({ id: `function:${fn.name}`, label: `Open function ${fn.name}`, detail: 'Function graph', execute: () => graphStore.openFunction(fn.name) })),
    ...$fileStore.fileList.map((file): PaletteAction => ({ id: `file:${file.filePath}`, label: `Open ${file.fileName}`, detail: 'Workspace file', execute: () => fileStore.openFile(file.fileName) })),
  ];
  $: normalizedQuery = query.trim().toLowerCase();
  $: results = actions.filter((action) => !normalizedQuery || `${action.label} ${action.detail}`.toLowerCase().includes(normalizedQuery)).sort((a, b) => Number(!a.label.toLowerCase().startsWith(normalizedQuery)) - Number(!b.label.toLowerCase().startsWith(normalizedQuery)));
  $: if (selectedIndex >= results.length) selectedIndex = 0;

  async function focusSearch() { await tick(); searchInput?.focus(); }
  focusSearch();

  function choose(action: PaletteAction | undefined) {
    if (!action) return;
    action.execute();
    commandPaletteStore.close();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') { event.preventDefault(); commandPaletteStore.close(); }
    if (event.key === 'ArrowDown') { event.preventDefault(); selectedIndex = Math.min(selectedIndex + 1, results.length - 1); }
    if (event.key === 'ArrowUp') { event.preventDefault(); selectedIndex = Math.max(selectedIndex - 1, 0); }
    if (event.key === 'Enter') { event.preventDefault(); choose(results[selectedIndex]); }
  }
</script>

<div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm p-4 flex items-start justify-center" role="presentation" on:mousedown={(event) => event.target === event.currentTarget && commandPaletteStore.close()}>
  <div class="mt-[12vh] w-full max-w-xl overflow-hidden rounded-2xl border border-surface-container-high bg-surface-container shadow-m3-4" role="dialog" aria-modal="true" aria-label="Command palette">
    <input bind:this={searchInput} bind:value={query} on:input={() => (selectedIndex = 0)} on:keydown={handleKeydown} class="w-full border-0 border-b border-surface-container-high bg-transparent px-4 py-3 text-sm text-m3-on-surface outline-none" placeholder="Search commands, nodes, files, and functions..." aria-label="Search commands" />
    <div class="max-h-80 overflow-y-auto p-2">
      {#if results.length === 0}
        <p class="px-3 py-8 text-center text-xs text-m3-outline">No matching command. Try a node name or action.</p>
      {:else}
        {#each results as action, index (action.id)}
          <button class="w-full rounded-xl px-3 py-2 text-left transition-colors {index === selectedIndex ? 'bg-m3-primary text-m3-on-primary' : 'text-m3-on-surface hover:bg-surface-container-high'}" on:mouseenter={() => (selectedIndex = index)} on:click={() => choose(action)}>
            <span class="block text-xs font-medium">{action.label}</span><span class="block text-[10px] opacity-70">{action.detail}</span>
          </button>
        {/each}
      {/if}
    </div>
    <footer class="flex gap-3 border-t border-surface-container-high px-4 py-2 text-[10px] text-m3-outline"><span>↑↓ Navigate</span><span>Enter select</span><span>Esc close</span></footer>
  </div>
</div>

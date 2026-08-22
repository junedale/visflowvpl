<script lang="ts">
  import { graphStore } from '../stores/graphStore.js';
  import { fileStore } from '../stores/fileStore.js';
  import { consoleStore } from '../stores/consoleStore.js';
  import { PALETTE_CATEGORIES } from '../../canvas/nodeTemplates.js';
  import { CategoryColors } from '../../canvas/constants.js';
  import CreateVariableModal from './modals/CreateVariableModal.svelte';
  import CreateFunctionModal from './modals/CreateFunctionModal.svelte';

  type SidebarTab = 'palette' | 'variables' | 'watch' | 'functions' | 'files';
  let activeTab: SidebarTab = 'palette';
  export let collapsed = false;
  let nodeSearch = '';
  let collapsedCategories = new Set<string>();

  let showVariableModal = false;
  let showFunctionModal = false;

  function handleAddNode(templateId: string) {
    graphStore.addNode(templateId, { x: 280, y: 160 });
  }

  function toggleCategory(name: string) {
    collapsedCategories = new Set(collapsedCategories);
    collapsedCategories.has(name) ? collapsedCategories.delete(name) : collapsedCategories.add(name);
  }

  function removeVariable(name: string) {
    if (window.confirm(`Delete variable “${name}”? Nodes using it will also be removed.`)) {
      graphStore.removeVariable(name);
    }
  }

  function removeFunction(name: string) {
    if (window.confirm(`Delete function “${name}”? Call nodes using it will also be removed.`)) {
      graphStore.removeFunction(name);
    }
  }
</script>

<aside class="{collapsed ? 'w-12 min-w-12' : 'w-72 min-w-72'} h-full bg-surface-container-low border-r border-surface-container flex flex-col z-20 select-none transition-[width] duration-200">
  {#if collapsed}
    <button class="m-2 w-8 h-8 rounded-xl text-m3-primary hover:bg-surface-container-high focus-visible:outline focus-visible:outline-2 focus-visible:outline-m3-primary" on:click={() => (collapsed = false)} aria-label="Expand palette" title="Expand palette">›</button>
    <div class="mt-2 flex flex-col items-center gap-3 text-[10px] font-bold text-m3-outline">
      <span title="Nodes">◈</span><span title="Variables">V</span><span title="Live Watch">👁</span><span title="Functions">ƒ</span><span title="Files">□</span>
    </div>
  {:else}
  <div class="h-11 px-3 flex items-center justify-between border-b border-surface-container-high">
    <span class="text-xs font-semibold text-m3-on-surface">Build & Debug</span>
    <button class="w-7 h-7 rounded-lg text-m3-outline hover:text-m3-on-surface hover:bg-surface-container-high focus-visible:outline focus-visible:outline-2 focus-visible:outline-m3-primary" on:click={() => (collapsed = true)} aria-label="Collapse palette" title="Collapse palette">‹</button>
  </div>
  <!-- Tab Navigation -->
  <div class="p-1.5 border-b border-surface-container bg-surface-container/60 flex items-center gap-0.5" role="tablist" aria-label="Workspace panels">
    <button
      class="flex-1 py-1.5 text-[11px] font-medium rounded-full transition-all text-center {activeTab === 'palette' ? 'bg-m3-primary text-m3-on-primary font-semibold shadow-m3-1' : 'text-m3-on-surface-variant hover:text-m3-on-surface hover:bg-surface-container-high'}"
      on:click={() => (activeTab = 'palette')}
      role="tab"
      aria-selected={activeTab === 'palette'}
    >
      Nodes
    </button>
    <button
      class="flex-1 py-1.5 text-[11px] font-medium rounded-full transition-all text-center {activeTab === 'variables' ? 'bg-m3-primary text-m3-on-primary font-semibold shadow-m3-1' : 'text-m3-on-surface-variant hover:text-m3-on-surface hover:bg-surface-container-high'}"
      on:click={() => (activeTab = 'variables')}
      role="tab"
      aria-selected={activeTab === 'variables'}
    >
      Vars
    </button>
    <button
      class="flex-1 py-1.5 text-[11px] font-medium rounded-full transition-all text-center {activeTab === 'watch' ? 'bg-m3-primary text-m3-on-primary font-semibold shadow-m3-1' : 'text-m3-on-surface-variant hover:text-m3-on-surface hover:bg-surface-container-high'} relative"
      on:click={() => (activeTab = 'watch')}
      role="tab"
      aria-selected={activeTab === 'watch'}
    >
      <span>Watch</span>
      {#if $consoleStore.isRunning}
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-1 right-1 animate-ping"></span>
      {/if}
    </button>
    <button
      class="flex-1 py-1.5 text-[11px] font-medium rounded-full transition-all text-center {activeTab === 'functions' ? 'bg-m3-primary text-m3-on-primary font-semibold shadow-m3-1' : 'text-m3-on-surface-variant hover:text-m3-on-surface hover:bg-surface-container-high'}"
      on:click={() => (activeTab = 'functions')}
      role="tab"
      aria-selected={activeTab === 'functions'}
    >
      Funcs
    </button>
    <button
      class="flex-1 py-1.5 text-[11px] font-medium rounded-full transition-all text-center {activeTab === 'files' ? 'bg-m3-primary text-m3-on-primary font-semibold shadow-m3-1' : 'text-m3-on-surface-variant hover:text-m3-on-surface hover:bg-surface-container-high'}"
      on:click={() => (activeTab = 'files')}
      role="tab"
      aria-selected={activeTab === 'files'}
    >
      Files
    </button>
  </div>

  <!-- Tab Content Area -->
  <div class="flex-1 overflow-y-auto p-3 space-y-3">
    <!-- Palette Tab -->
    {#if activeTab === 'palette'}
      <div class="space-y-4">
        <label class="sr-only" for="node-search">Search nodes</label>
        <input id="node-search" class="m3-input" type="search" placeholder="Search nodes…" bind:value={nodeSearch} autocomplete="off" />
        {#each PALETTE_CATEGORIES as categoryGroup}
          {@const matchingItems = categoryGroup.items.filter((item) => item.name.toLowerCase().includes(nodeSearch.toLowerCase()) || item.description.toLowerCase().includes(nodeSearch.toLowerCase()))}
          {#if matchingItems.length > 0}
          <div class="space-y-1.5">
            <!-- Category Header -->
            <button class="w-full flex items-center gap-2 px-1 text-[11px] font-bold text-m3-outline uppercase tracking-wider text-left hover:text-m3-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-m3-primary rounded" on:click={() => toggleCategory(categoryGroup.name)} aria-expanded={!collapsedCategories.has(categoryGroup.name)}>
              <span class="w-2 h-2 rounded-full" style="background-color: {CategoryColors[categoryGroup.category]};"></span>
              <span class="flex-1">{categoryGroup.name}</span><span aria-hidden="true">{collapsedCategories.has(categoryGroup.name) ? '+' : '−'}</span>
            </button>

            <!-- Items -->
            {#if !collapsedCategories.has(categoryGroup.name)}
            <div class="grid grid-cols-1 gap-1">
              {#each matchingItems as item}
                <button
                  class="w-full px-3 py-2 rounded-xl text-left flex items-center justify-between text-xs text-m3-on-surface bg-surface-container/40 hover:bg-surface-container-high active:scale-[0.98] border border-transparent hover:border-surface-container-highest transition-all group"
                  on:click={() => handleAddNode(item.id)}
                  title={item.description}
                >
                  <span class="font-medium">{item.name}</span>
                  <span class="text-m3-outline group-hover:text-m3-primary text-sm font-semibold transition-colors">+</span>
                </button>
              {/each}
            </div>
            {/if}
          </div>
          {/if}
        {/each}
      </div>
    {/if}

    <!-- Variables Tab -->
    {#if activeTab === 'variables'}
      <div class="space-y-2.5">
        <button
          class="w-full py-2 px-3 rounded-full text-xs font-semibold text-m3-primary bg-m3-primary/10 border border-m3-primary/30 hover:bg-m3-primary/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          on:click={() => (showVariableModal = true)}
        >
          <span>+</span>
          <span>Create Variable</span>
        </button>

        {#if $graphStore.variables.length === 0}
          <div class="text-m3-outline text-center py-8 text-xs">
            No variables yet. Create one to reuse a value in your graph.
          </div>
        {:else}
          <div class="space-y-1.5">
            {#each $graphStore.variables as variable (variable.name)}
              <div class="p-2.5 rounded-2xl bg-surface-container border border-surface-container-high flex items-center justify-between shadow-sm">
                <div
                  class="flex-1 cursor-pointer text-left"
                  role="button"
                  tabindex="0"
                  on:click={() => graphStore.addVariableNode(variable.name)}
                  on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && graphStore.addVariableNode(variable.name)}
                >
                  <div class="font-semibold text-m3-primary text-xs flex items-center gap-1.5">
                    <span>{variable.name}</span>
                    <span class="px-1.5 py-0.5 rounded-md text-[10px] font-normal bg-surface-container-highest text-m3-on-surface-variant">+ Add</span>
                  </div>
                  <div class="text-[11px] text-m3-outline mt-0.5 font-mono">
                    {variable.dataType} = {String(variable.value)}
                  </div>
                </div>
                <button
                  class="w-6 h-6 flex items-center justify-center text-xs text-m3-error/70 hover:text-m3-error hover:bg-m3-error/10 rounded-full transition-colors ml-1"
                  title="Delete Variable"
                  on:click={() => removeVariable(variable.name)}
                  aria-label={`Delete variable ${variable.name}`}
                >
                  ✕
                </button>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}

    <!-- Live Variable Watch Tab -->
    {#if activeTab === 'watch'}
      <div class="space-y-2.5">
        <div class="flex items-center justify-between px-1">
          <span class="text-[11px] font-bold text-m3-outline uppercase tracking-wider">Live Variable Watch</span>
          {#if $consoleStore.isRunning}
            <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Live
            </span>
          {/if}
        </div>

        {#if Object.keys($consoleStore.watchedVariables).length === 0}
          <div class="text-m3-outline text-center py-8 text-xs">
            No active runtime variables yet.<br />Run a program in step or timed mode to watch variables update in real-time.
          </div>
        {:else}
          <div class="space-y-1.5 font-mono text-xs">
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

    <!-- Functions Tab -->
    {#if activeTab === 'functions'}
      <div class="space-y-2.5">
        <button
          class="w-full py-2 px-3 rounded-full text-xs font-semibold text-m3-tertiary bg-m3-tertiary/10 border border-m3-tertiary/30 hover:bg-m3-tertiary/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          on:click={() => (showFunctionModal = true)}
        >
          <span>+</span>
          <span>Create Function</span>
        </button>

        {#if $graphStore.functions.length === 0}
          <div class="text-m3-outline text-center py-8 text-xs">
            No functions yet. Functions group a reusable visual flow.
          </div>
        {:else}
          <div class="space-y-1.5">
            {#each $graphStore.functions as fn (fn.name)}
              <div class="p-2.5 rounded-2xl bg-surface-container border border-surface-container-high space-y-2 shadow-sm">
                <div class="flex items-center justify-between">
                  <div class="font-semibold text-m3-tertiary text-xs flex items-center gap-1.5">
                    <span>⚡ {fn.name}()</span>
                  </div>
                  <button
                    class="w-6 h-6 flex items-center justify-center text-xs text-m3-error/70 hover:text-m3-error hover:bg-m3-error/10 rounded-full transition-colors"
                    title="Delete Function"
                    on:click={() => removeFunction(fn.name)}
                    aria-label={`Delete function ${fn.name}`}
                  >
                    ✕
                  </button>
                </div>

                <div class="text-[11px] text-m3-outline">
                  Params: {fn.params.map((p) => p.name).join(', ') || 'none'}
                </div>

                <div class="flex items-center gap-1.5 pt-1 border-t border-surface-container-high/60">
                  <button
                    class="flex-1 py-1 px-2 rounded-xl text-[11px] font-semibold text-m3-tertiary bg-m3-tertiary/10 hover:bg-m3-tertiary/20 active:scale-95 transition-all text-center"
                    on:click={() => graphStore.openFunction(fn.name)}
                    title="Edit Function Sub-Graph"
                  >
                    ✏ Edit Body
                  </button>
                  <button
                    class="flex-1 py-1 px-2 rounded-xl text-[11px] font-semibold text-m3-on-surface-variant bg-surface-container-high hover:bg-surface-container-highest active:scale-95 transition-all text-center"
                    on:click={() => graphStore.addFunctionNode(fn.name)}
                    title="Add Function Call Node to Canvas"
                  >
                    + Add Call
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}

    <!-- Files Tab -->
    {#if activeTab === 'files'}
      <div class="space-y-2">
        <div class="text-[11px] font-bold text-m3-outline uppercase px-1 tracking-wider">
          Workspace Files
        </div>

        {#if $fileStore.fileList.length === 0}
          <div class="text-m3-outline text-center py-8 text-xs">
            No files in workspace.<br />Click "Open Folder" to load.
          </div>
        {:else}
          <div class="space-y-1">
          {#each $fileStore.fileList as file (file.filePath)}
              <button
                class="w-full px-3 py-2 rounded-xl text-left text-xs flex items-center justify-between transition-[background-color,color,border-color] {file.fileName === $fileStore.currentFileName ? 'bg-m3-primary/15 text-m3-primary font-semibold border border-m3-primary/30' : 'text-m3-on-surface bg-surface-container/30 hover:bg-surface-container-high border border-transparent'}"
                on:click={() => fileStore.openFile(file.fileName)}
              >
                <div class="flex items-center gap-2 truncate">
                  <svg class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  <span class="truncate">{file.fileName}</span>
                </div>
                {#if file.fileName === $fileStore.currentFileName}
                  <span class="w-1.5 h-1.5 rounded-full bg-m3-primary flex-shrink-0"></span>
                {/if}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </div>
  {/if}
</aside>

<CreateVariableModal bind:show={showVariableModal} />
<CreateFunctionModal bind:show={showFunctionModal} />

<script lang="ts">
  import { graphStore } from '../stores/graphStore.js';
  import { consoleStore } from '../stores/consoleStore.js';
  import { fileStore } from '../stores/fileStore.js';
  import { showToast } from '../stores/toastStore.js';
  import { CodeGenerator } from '../../compiler/generator.js';
  import { GraphValidator } from '../../compiler/validator.js';
  import { globalRunner } from '../../interpreter/runner.js';
  import NewFileModal from './modals/NewFileModal.svelte';
  import CodeModal from './modals/CodeModal.svelte';

  export let onZoomIn: () => void = () => {};
  export let onZoomOut: () => void = () => {};
  export let onFitGraph: () => void = () => {};
  export let onToggleTheme: () => void = () => {};
  export let theme: 'dark' | 'light' = 'dark';
  export let getStageTransform: () => { position: { x: number; y: number }; scale: { x: number; y: number } } = () => ({
    position: { x: 0, y: 0 },
    scale: { x: 1, y: 1 },
  });

  let showNewFileModal = false;
  let showCodeModal = false;

  async function handleSave() {
    const { position, scale } = getStageTransform();
    await fileStore.saveCurrentFile(position, scale);
    showToast('File saved successfully!', 'success');
  }

  async function handleRun() {
    const state = $graphStore;
    const validationIssues = GraphValidator.validate(state.nodes, state.wires, state.variables, state.functions);

    const errors = validationIssues.filter((i) => i.type === 'error');
    if (errors.length > 0) {
      errors.forEach((e) => showToast(e.message, 'error'));
      return;
    }

    const warnings = validationIssues.filter((i) => i.type === 'warning');
    warnings.forEach((w) => showToast(w.message, 'warning'));

    const generator = new CodeGenerator(state.nodes, state.wires, state.variables, state.functions);
    const code = generator.generate();

    consoleStore.setGeneratedCode(code);
    consoleStore.clear();
    consoleStore.setRunning(true);
    consoleStore.log(`[VisFlow] Starting execution...`, 'info');

    const result = await globalRunner.run(code, {
      onOutput: (chunk) => consoleStore.log(chunk, 'stdout'),
      onError: (err) => consoleStore.log(err, 'stderr'),
    });

    consoleStore.setRunning(false);
    consoleStore.setExecutionTime(result.executionTimeMs);

    if (result.success) {
      consoleStore.log(`[VisFlow] Execution finished in ${result.executionTimeMs.toFixed(2)}ms`, 'success');
    } else {
      consoleStore.log(`[VisFlow] Execution failed.`, 'stderr');
    }
  }

  function handleShowCode() {
    const state = $graphStore;
    const generator = new CodeGenerator(state.nodes, state.wires, state.variables, state.functions);
    const code = generator.generate();
    consoleStore.setGeneratedCode(code);
    showCodeModal = true;
  }

  function handleStop() {
    globalRunner.stop();
    consoleStore.setRunning(false);
    consoleStore.log(`[VisFlow] Execution stopped by user.`, 'warning');
  }
</script>

  <header class="min-h-14 bg-surface-container border-b border-surface-container-high px-3 lg:px-4 flex items-center justify-between gap-2 shadow-m3-1 z-30 select-none">
  <!-- Left: Brand & File Name -->
    <div class="flex items-center gap-2 min-w-0">
    <div class="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-surface-container-highest border border-surface-container-high text-m3-primary font-bold text-sm tracking-wide">
      <svg class="w-4 h-4 text-m3-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
        <polyline points="2 17 12 22 22 17"></polyline>
        <polyline points="2 12 12 17 22 12"></polyline>
      </svg>
      <span>VisFlow</span>
    </div>

    <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low border border-m3-outline-variant/40 text-xs text-m3-on-surface-variant">
      <span class="w-1.5 h-1.5 rounded-full bg-m3-primary"></span>
      <span class="font-medium">{$fileStore.currentFileName || 'Untitled.visflow'}</span>
    </div>

    <!-- Breadcrumb Navigation -->
    <div class="flex items-center gap-1.5 text-xs">
      {#if $graphStore.activeScope.type === 'main'}
        <span class="px-2.5 py-1 rounded-full bg-surface-container-high text-m3-on-surface text-xs font-medium flex items-center gap-1.5">
          <span>🏠</span>
          <span>Main Graph</span>
        </span>
      {:else}
        <button
          class="px-2.5 py-1 rounded-full bg-surface-container-low hover:bg-surface-container-high text-m3-outline hover:text-m3-on-surface text-xs font-medium flex items-center gap-1 transition-all"
          on:click={graphStore.closeFunction}
          title="Back to Main Graph"
        >
          <span>🏠 Main Graph</span>
        </button>
        <span class="text-m3-outline text-xs">›</span>
        <div class="px-2.5 py-1 rounded-full bg-m3-tertiary-container/80 text-m3-on-tertiary-container border border-m3-tertiary/40 text-xs font-semibold flex items-center gap-1.5">
          <span>⚡ fun {$graphStore.activeScope.name}()</span>
          <button
            class="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-m3-tertiary text-m3-on-tertiary hover:opacity-90 active:scale-95 transition-all shadow-sm"
            on:click={graphStore.closeFunction}
            title="Return to Main Canvas"
          >
            ← Back to Main
          </button>
        </div>
      {/if}
    </div>
  </div>

  <!-- Center: Action Island & View Controls -->
    <div class="hidden xl:flex items-center gap-2">
    <!-- File Actions -->
    <div class="flex items-center bg-surface-container-low rounded-full p-0.5 border border-m3-outline-variant/30">
      <button
          class="px-3 py-1 text-xs font-medium rounded-full text-m3-on-surface hover:bg-surface-container-high active:scale-95 transition-[background-color,transform] focus-visible:outline focus-visible:outline-2 focus-visible:outline-m3-primary"
        on:click={() => (showNewFileModal = true)}
        title="New File"
      >
        + New
      </button>
      <button
          class="px-3 py-1 text-xs font-medium rounded-full text-m3-on-surface hover:bg-surface-container-high active:scale-95 transition-[background-color,transform] focus-visible:outline focus-visible:outline-2 focus-visible:outline-m3-primary"
        on:click={fileStore.openFolder}
        title="Open Workspace Folder"
      >
        Open Folder
      </button>
      <button
          class="px-3 py-1 text-xs font-medium rounded-full text-m3-primary bg-surface-container-high hover:bg-surface-container-highest active:scale-95 transition-[background-color,transform] focus-visible:outline focus-visible:outline-2 focus-visible:outline-m3-primary"
        on:click={handleSave}
        title="Save File"
      >
        Save
      </button>
    </div>

    <div class="h-4 w-px bg-m3-outline-variant/30 mx-1"></div>

    <!-- History (Undo/Redo) -->
    <div class="flex items-center bg-surface-container-low rounded-full p-0.5 border border-m3-outline-variant/30">
        <button
          class="w-7 h-7 flex items-center justify-center text-xs rounded-full text-m3-on-surface hover:bg-surface-container-high active:scale-95 transition-[background-color,transform] focus-visible:outline focus-visible:outline-2 focus-visible:outline-m3-primary"
          title="Undo (Ctrl+Z)"
          aria-label="Undo"
        on:click={graphStore.undo}
      >
        ↺
      </button>
        <button
          class="w-7 h-7 flex items-center justify-center text-xs rounded-full text-m3-on-surface hover:bg-surface-container-high active:scale-95 transition-[background-color,transform] focus-visible:outline focus-visible:outline-2 focus-visible:outline-m3-primary"
          title="Redo (Ctrl+Y)"
          aria-label="Redo"
        on:click={graphStore.redo}
      >
        ↻
      </button>
    </div>

    <div class="h-4 w-px bg-m3-outline-variant/30 mx-1"></div>

    <!-- Zoom Controls -->
    <div class="flex items-center bg-surface-container-low rounded-full p-0.5 border border-m3-outline-variant/30 text-xs">
        <button
          class="w-7 h-7 flex items-center justify-center font-bold rounded-full text-m3-on-surface hover:bg-surface-container-high active:scale-95 transition-[background-color,transform] focus-visible:outline focus-visible:outline-2 focus-visible:outline-m3-primary"
          title="Zoom Out"
          aria-label="Zoom out"
        on:click={onZoomOut}
      >
        −
      </button>
        <button
          class="px-2 h-7 flex items-center justify-center text-[11px] font-mono text-m3-on-surface-variant hover:text-m3-on-surface hover:bg-surface-container-high rounded-full transition-[background-color,color] focus-visible:outline focus-visible:outline-2 focus-visible:outline-m3-primary"
          title="Fit graph to canvas"
          on:click={onFitGraph}
        >
          Fit
      </button>
        <button
          class="w-7 h-7 flex items-center justify-center font-bold rounded-full text-m3-on-surface hover:bg-surface-container-high active:scale-95 transition-[background-color,transform] focus-visible:outline focus-visible:outline-2 focus-visible:outline-m3-primary"
          title="Zoom In"
          aria-label="Zoom in"
        on:click={onZoomIn}
      >
        +
      </button>
    </div>
  </div>

  <!-- Right: Execution & Modals -->
    <div class="flex items-center gap-1.5 shrink-0">
    <!-- View Code Button -->
      <button
        class="hidden sm:inline-flex px-3 py-1.5 rounded-full text-xs font-medium text-m3-primary border border-m3-primary/30 hover:bg-m3-primary/10 active:scale-95 transition-[background-color,transform] focus-visible:outline focus-visible:outline-2 focus-visible:outline-m3-primary"
      on:click={handleShowCode}
    >
      Code
    </button>

    <!-- Console Toggle Button -->
    <button
      class="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all border {$consoleStore.isOpen ? 'bg-m3-secondary-container text-m3-on-secondary-container border-m3-secondary/50' : 'bg-surface-container-low text-m3-on-surface-variant border-m3-outline-variant/40 hover:bg-surface-container-high'}"
      on:click={() => consoleStore.toggleOpen()}
    >
      <span>Terminal</span>
      {#if $consoleStore.logs.length > 0}
        <span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-surface-container-highest text-m3-on-surface">
          {$consoleStore.logs.length}
        </span>
      {/if}
    </button>

    <!-- Run / Stop Elevated Extended FAB -->
    {#if $consoleStore.isRunning}
      <button
        class="px-4 py-1.5 rounded-full text-xs font-semibold text-m3-on-error bg-m3-error hover:bg-m3-error/90 active:scale-95 shadow-m3-2 flex items-center gap-1.5 transition-all"
        on:click={handleStop}
      >
        <span class="w-2.5 h-2.5 border-2 border-m3-on-error border-t-transparent rounded-full animate-spin"></span>
        <span>Stop</span>
      </button>

      <button
        class="w-8 h-8 inline-flex items-center justify-center rounded-full text-m3-on-surface-variant hover:text-m3-on-surface hover:bg-surface-container-high focus-visible:outline focus-visible:outline-2 focus-visible:outline-m3-primary"
        on:click={onToggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {theme === 'dark' ? '☀' : '◐'}
      </button>
    {:else}
      <button
        class="px-4 py-1.5 rounded-full text-xs font-semibold text-m3-on-primary bg-m3-primary hover:bg-m3-primary/90 active:scale-95 shadow-m3-2 flex items-center gap-1.5 transition-all"
        on:click={handleRun}
      >
        <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
        <span>Run</span>
      </button>
    {/if}
  </div>
</header>

<NewFileModal bind:show={showNewFileModal} />
<CodeModal bind:show={showCodeModal} />

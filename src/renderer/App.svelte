<script lang="ts">
  import { onMount } from 'svelte';
  import Navbar from './components/Navbar.svelte';
  import Sidebar from './components/Sidebar.svelte';
  import Canvas from './components/Canvas.svelte';
  import Console from './components/Console.svelte';
  import Toasts from './components/Toasts.svelte';
  import ActivityRail from './components/ActivityRail.svelte';
  import DebuggerPanel from './components/DebuggerPanel.svelte';
  import InspectorPanel from './components/InspectorPanel.svelte';
  import LearnHints from './components/LearnHints.svelte';
  import StatusBar from './components/StatusBar.svelte';
  import CommandPalette from './components/CommandPalette.svelte';
  import { debugStore } from './stores/debugStore.js';
  import { consoleStore } from './stores/consoleStore.js';
  import { commandPaletteStore } from './stores/commandPaletteStore.js';
  import { workspaceLayoutStore } from './stores/workspaceLayoutStore.js';

  let canvasRef: Canvas;
  let navbarRef: Navbar;
  let theme: 'dark' | 'light' = 'dark';
  let showGettingStarted = false;
  let showLearnHints = false;
  let isCompact = false;

  onMount(() => {
    const savedTheme = localStorage.getItem('visflow-theme');
    theme = savedTheme === 'light' ? 'light' : 'dark';
    showGettingStarted = localStorage.getItem('visflow-onboarding-complete') !== 'true';
    showLearnHints = localStorage.getItem('visflow-learn-hints-dismissed') !== 'true';

    const handleCommandPalette = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.ctrlKey && event.key.toLowerCase() === 'p' && !target?.closest('input, textarea, select, [contenteditable="true"]')) {
        event.preventDefault();
        commandPaletteStore.toggle();
      }
    };
    const updateViewport = () => (isCompact = window.innerWidth < 900);
    updateViewport();
    window.addEventListener('keydown', handleCommandPalette);
    window.addEventListener('resize', updateViewport);
    return () => {
      window.removeEventListener('keydown', handleCommandPalette);
      window.removeEventListener('resize', updateViewport);
    };
  });

  $: if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('visflow-theme', theme);
  }

  function handleZoomIn() {
    canvasRef?.zoomIn();
  }

  function handleZoomOut() {
    canvasRef?.zoomOut();
  }

  function handleResetZoom() {
    canvasRef?.resetZoom();
  }

  function handleFitGraph() {
    canvasRef?.fitGraph();
  }

  function completeGettingStarted() {
    localStorage.setItem('visflow-onboarding-complete', 'true');
    showGettingStarted = false;
  }

  function getStageTransform() {
    return canvasRef?.getStageTransform() || { position: { x: 0, y: 0 }, scale: { x: 1, y: 1 } };
  }

  function focusDiagnostic(nodeId: string) {
    canvasRef?.focusNode(nodeId);
  }

  function getInsertPosition() {
    return canvasRef?.getViewportCenter() ?? { x: 280, y: 160 };
  }

  function startResize(event: MouseEvent, key: 'sidebarWidth' | 'inspectorWidth' | 'debuggerWidth' | 'dockHeight', direction: 1 | -1, vertical = false) {
    event.preventDefault();
    const startPosition = vertical ? event.clientY : event.clientX;
    const startSize = $workspaceLayoutStore[key];
    const move = (moveEvent: MouseEvent) => {
      const delta = (vertical ? moveEvent.clientY : moveEvent.clientX) - startPosition;
      workspaceLayoutStore.setSize(key, startSize + delta * direction);
    };
    const stop = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', stop);
      document.body.style.cursor = '';
    };
    document.body.style.cursor = vertical ? 'ns-resize' : 'ew-resize';
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stop);
  }
</script>

<main class="w-screen h-screen flex flex-col bg-surface text-m3-on-surface overflow-hidden relative font-sans">
  <!-- M3 Floating Top App Bar -->
  <Navbar
    bind:this={navbarRef}
    onZoomIn={handleZoomIn}
    onZoomOut={handleZoomOut}
    onFitGraph={handleFitGraph}
    onToggleTheme={() => (theme = theme === 'dark' ? 'light' : 'dark')}
    {theme}
    {getStageTransform}
  />

  <!-- Main Workspace -->
  <div class="flex-1 flex flex-row overflow-hidden relative">
    <ActivityRail onLearn={() => (showLearnHints = true)} />
    <!-- M3 Navigation Drawer -->
    <div class="relative shrink-0">
      <Sidebar collapsed={$workspaceLayoutStore.sidebarCollapsed} width={$workspaceLayoutStore.sidebarWidth} onCollapseChange={workspaceLayoutStore.setSidebarCollapsed} />
      {#if !$workspaceLayoutStore.sidebarCollapsed}
        <button type="button" class="absolute right-0 top-0 h-full w-1 cursor-ew-resize hover:bg-m3-primary/60" on:mousedown={(event) => startResize(event, 'sidebarWidth', 1)} aria-label="Resize sidebar"></button>
      {/if}
    </div>

    <!-- Canvas Viewport -->
    <div class="flex-1 h-full relative overflow-hidden bg-surface-dim">
      <Canvas bind:this={canvasRef} />
      <LearnHints visible={showLearnHints} onClose={() => (showLearnHints = false)} />
      {#if showGettingStarted}
        <section class="absolute left-5 bottom-5 max-w-sm rounded-3xl bg-surface-container border border-m3-primary/30 shadow-m3-4 p-5 select-none">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[11px] font-bold tracking-[0.16em] uppercase text-m3-primary">First program</p>
              <h1 class="mt-1 text-lg font-semibold text-m3-on-surface">Make the graph speak</h1>
            </div>
            <button class="text-m3-outline hover:text-m3-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-m3-primary rounded-full" on:click={completeGettingStarted} aria-label="Dismiss getting started guide">✕</button>
          </div>
          <ol class="mt-3 space-y-2 text-xs leading-relaxed text-m3-on-surface-variant">
            <li><span class="mr-2 text-m3-primary font-bold">1</span>Use the existing <strong class="text-m3-on-surface">Start</strong> and <strong class="text-m3-on-surface">Println</strong> nodes.</li>
            <li><span class="mr-2 text-m3-primary font-bold">2</span>Drag from Start’s square port to Println’s square port.</li>
            <li><span class="mr-2 text-m3-primary font-bold">3</span>Set Println’s Text value, then select <strong class="text-m3-on-surface">Run</strong>.</li>
          </ol>
          <div class="mt-4 flex items-center gap-2">
            <button class="m3-btn-primary" on:click={completeGettingStarted}>I’m ready</button>
            <button class="m3-btn-text" on:click={handleFitGraph}>Show the graph</button>
          </div>
        </section>
      {/if}
    </div>
    {#if $debugStore.isDebugPanelOpen}
      <div class="{isCompact ? 'fixed right-0 top-14 bottom-1/2 z-40 shadow-m3-4' : 'relative shrink-0'}">
        {#if !isCompact}<button type="button" class="absolute left-0 top-0 h-full w-1 cursor-ew-resize hover:bg-m3-primary/60 z-30" on:mousedown={(event) => startResize(event, 'debuggerWidth', -1)} aria-label="Resize Debug panel"></button>{/if}
        <DebuggerPanel width={$workspaceLayoutStore.debuggerWidth} />
      </div>
    {/if}
    {#if $debugStore.isInspectorOpen}
      <div class="{isCompact ? 'fixed right-0 top-1/2 bottom-6 z-40 shadow-m3-4' : 'relative shrink-0'}">
        {#if !isCompact}<button type="button" class="absolute left-0 top-0 h-full w-1 cursor-ew-resize hover:bg-m3-primary/60 z-30" on:mousedown={(event) => startResize(event, 'inspectorWidth', -1)} aria-label="Resize Inspector"></button>{/if}
        <InspectorPanel width={$workspaceLayoutStore.inspectorWidth} onFocusNode={focusDiagnostic} />
      </div>
    {/if}
  </div>

  <StatusBar />
  <!-- M3 Collapsible Docked Console Bottom Sheet -->
  <div class="relative shrink-0">
    {#if $consoleStore.isOpen}<button type="button" class="absolute left-0 top-0 w-full h-1 cursor-ns-resize hover:bg-m3-primary/60 z-40" on:mousedown={(event) => startResize(event, 'dockHeight', -1, true)} aria-label="Resize bottom dock"></button>{/if}
    <Console height={$workspaceLayoutStore.dockHeight} onFocusDiagnostic={focusDiagnostic} />
  </div>

  <!-- M3 Snackbars / Toast Notifications -->
  <Toasts />
  {#if $commandPaletteStore}
    <CommandPalette
      {getInsertPosition}
      onRun={() => navbarRef?.runProgram()}
      onSave={() => navbarRef?.saveFile()}
      onBeautify={() => navbarRef?.beautifyGraph()}
      onFit={handleFitGraph}
    />
  {/if}
</main>

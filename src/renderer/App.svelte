<script lang="ts">
  import { onMount } from 'svelte';
  import Navbar from './components/Navbar.svelte';
  import Sidebar from './components/Sidebar.svelte';
  import Canvas from './components/Canvas.svelte';
  import Console from './components/Console.svelte';
  import Toasts from './components/Toasts.svelte';

  let canvasRef: Canvas;
  let sidebarCollapsed = false;
  let theme: 'dark' | 'light' = 'dark';
  let showGettingStarted = false;

  onMount(() => {
    const savedTheme = localStorage.getItem('visflow-theme');
    theme = savedTheme === 'light' ? 'light' : 'dark';
    showGettingStarted = localStorage.getItem('visflow-onboarding-complete') !== 'true';
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
</script>

<main class="w-screen h-screen flex flex-col bg-surface text-m3-on-surface overflow-hidden relative font-sans">
  <!-- M3 Floating Top App Bar -->
  <Navbar
    onZoomIn={handleZoomIn}
    onZoomOut={handleZoomOut}
    onFitGraph={handleFitGraph}
    onToggleTheme={() => (theme = theme === 'dark' ? 'light' : 'dark')}
    {theme}
    {getStageTransform}
  />

  <!-- Main Workspace -->
  <div class="flex-1 flex flex-row overflow-hidden relative">
    <!-- M3 Navigation Drawer -->
    <Sidebar bind:collapsed={sidebarCollapsed} />

    <!-- Canvas Viewport -->
    <div class="flex-1 h-full relative overflow-hidden bg-surface-dim">
      <Canvas bind:this={canvasRef} />
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
  </div>

  <!-- M3 Collapsible Docked Console Bottom Sheet -->
  <Console />

  <!-- M3 Snackbars / Toast Notifications -->
  <Toasts />
</main>

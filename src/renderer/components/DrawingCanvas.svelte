<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { drawingStore } from '../stores/drawingStore.js';

  let canvasEl: HTMLCanvasElement;
  let zoom = 1;
  let panX = 0;
  let panY = 0;
  let isPanning = false;
  let startPan = { x: 0, y: 0 };

  function renderDrawing() {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;

    const width = canvasEl.width;
    const height = canvasEl.height;

    ctx.clearRect(0, 0, width, height);

    // Dark grid background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    // Center origin (0, 0)
    ctx.translate(width / 2 + panX, height / 2 + panY);
    ctx.scale(zoom, zoom);

    // Draw subtle coordinate axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1 / zoom;
    ctx.beginPath();
    ctx.moveTo(-2000, 0);
    ctx.lineTo(2000, 0);
    ctx.moveTo(0, -2000);
    ctx.lineTo(0, 2000);
    ctx.stroke();

    // Execute draw commands
    const cmds = $drawingStore.commands;
    for (const cmd of cmds) {
      if (cmd.type === 'line' && cmd.x1 !== undefined && cmd.y1 !== undefined && cmd.x2 !== undefined && cmd.y2 !== undefined) {
        ctx.strokeStyle = cmd.color || '#38bdf8';
        ctx.lineWidth = Math.max(1, cmd.size || 2);
        ctx.lineCap = 'round';
        ctx.beginPath();
        // Invert Y coordinate so positive Y is up
        ctx.moveTo(cmd.x1, -cmd.y1);
        ctx.lineTo(cmd.x2, -cmd.y2);
        ctx.stroke();
      } else if (cmd.type === 'circle' && cmd.x !== undefined && cmd.y !== undefined && cmd.radius !== undefined) {
        ctx.beginPath();
        ctx.arc(cmd.x, -cmd.y, cmd.radius, 0, Math.PI * 2);
        if (cmd.fill) {
          ctx.fillStyle = cmd.color || '#38bdf8';
          ctx.fill();
        } else {
          ctx.strokeStyle = cmd.color || '#38bdf8';
          ctx.lineWidth = Math.max(1, cmd.size || 2);
          ctx.stroke();
        }
      } else if (cmd.type === 'rect' && cmd.x !== undefined && cmd.y !== undefined && cmd.width !== undefined && cmd.height !== undefined) {
        const rx = cmd.x - cmd.width / 2;
        const ry = -(cmd.y + cmd.height / 2);
        if (cmd.fill) {
          ctx.fillStyle = cmd.color || '#38bdf8';
          ctx.fillRect(rx, ry, cmd.width, cmd.height);
        } else {
          ctx.strokeStyle = cmd.color || '#38bdf8';
          ctx.lineWidth = Math.max(1, cmd.size || 2);
          ctx.strokeRect(rx, ry, cmd.width, cmd.height);
        }
      }
    }

    // Draw Turtle Indicator Arrow
    const tx = $drawingStore.x;
    const ty = -$drawingStore.y;
    const rad = -($drawingStore.heading * Math.PI) / 180;

    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(rad);

    ctx.fillStyle = '#4ade80';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5 / zoom;

    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(-8, -6);
    ctx.lineTo(-4, 0);
    ctx.lineTo(-8, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
    ctx.restore();
  }

  function handleResize() {
    if (!canvasEl || !canvasEl.parentElement) return;
    const rect = canvasEl.parentElement.getBoundingClientRect();
    canvasEl.width = rect.width;
    canvasEl.height = Math.max(200, rect.height);
    renderDrawing();
  }

  function handleWheel(e: WheelEvent) {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    zoom = Math.max(0.2, Math.min(5, zoom * factor));
    renderDrawing();
  }

  function handleMouseDown(e: MouseEvent) {
    if (e.button === 0 || e.button === 1) {
      isPanning = true;
      startPan = { x: e.clientX - panX, y: e.clientY - panY };
    }
  }

  function handleMouseMove(e: MouseEvent) {
    if (isPanning) {
      panX = e.clientX - startPan.x;
      panY = e.clientY - startPan.y;
      renderDrawing();
    }
  }

  function handleMouseUp() {
    isPanning = false;
  }

  function handleExportPng() {
    if (!canvasEl) return;
    const url = canvasEl.toDataURL('image/png');
    const a = document.createElement('a');
    a.download = `visflow-drawing-${Date.now()}.png`;
    a.href = url;
    a.click();
  }

  onMount(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  $: if ($drawingStore) {
    renderDrawing();
  }
</script>

<div class="w-full h-full relative overflow-hidden bg-surface-dim flex flex-col select-none">
  <!-- Toolbar Header -->
  <div class="h-9 px-3 bg-surface-container/80 border-b border-surface-container-high flex items-center justify-between flex-shrink-0 text-xs">
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-1.5 font-semibold text-m3-on-surface">
        <span>🎨</span>
        <span>Turtle Graphics Canvas</span>
      </div>
      <span class="text-[11px] font-mono text-m3-outline">
        Pos: ({Math.round($drawingStore.x)}, {Math.round($drawingStore.y)}) • Angle: {Math.round($drawingStore.heading)}° • Shapes: {$drawingStore.commands.length}
      </span>
    </div>

    <div class="flex items-center gap-1.5">
      <button
        class="px-2 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-m3-on-surface text-[11px] font-medium transition-colors"
        on:click={() => { zoom = 1; panX = 0; panY = 0; renderDrawing(); }}
        title="Reset View"
      >
        Center
      </button>
      <button
        class="px-2 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-m3-on-surface text-[11px] font-medium transition-colors"
        on:click={() => drawingStore.clearCanvas()}
        title="Clear Canvas"
      >
        Clear
      </button>
      <button
        class="px-2 py-1 rounded-lg bg-m3-primary/10 hover:bg-m3-primary/20 text-m3-primary border border-m3-primary/30 text-[11px] font-medium transition-colors flex items-center gap-1"
        on:click={handleExportPng}
        title="Save PNG"
      >
        <span>↓</span>
        <span>Save PNG</span>
      </button>
    </div>
  </div>

  <!-- Drawing Surface -->
  <div class="flex-1 w-full h-full relative">
    <canvas
      bind:this={canvasEl}
      on:wheel={handleWheel}
      on:mousedown={handleMouseDown}
      on:mousemove={handleMouseMove}
      on:mouseup={handleMouseUp}
      on:mouseleave={handleMouseUp}
      class="w-full h-full cursor-crosshair block"
    ></canvas>
  </div>
</div>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { graphStore } from '../stores/graphStore.js';
  import { consoleStore } from '../stores/consoleStore.js';
  import { debugStore } from '../stores/debugStore.js';
  import { StageManager } from '../../canvas/stageManager.js';
  import type { WireData } from '../../types/flow.js';
  import ContextMenu from './ContextMenu.svelte';

  let canvasContainer: HTMLDivElement;
  let stageManager: StageManager | null = null;
  let unsubscribeGraph: (() => void) | null = null;
  let unsubscribeConsole: (() => void) | null = null;
  let unsubscribeDebug: (() => void) | null = null;

  let lastRenderSignature = '';
  let contextMenuData: {
    screenPos: { x: number; y: number };
    canvasPos: { x: number; y: number };
    connectingPort?: any;
  } | null = null;

  export function zoomIn() {
    stageManager?.zoomIn();
  }

  export function zoomOut() {
    stageManager?.zoomOut();
  }

  export function resetZoom() {
    stageManager?.resetView();
  }

  export function fitGraph() {
    stageManager?.fitGraph();
  }

  export function focusNode(nodeId: string) {
    stageManager?.selectNode(nodeId);
    stageManager?.highlightNode(nodeId, true);
  }

  export function getViewportCenter() {
    return stageManager?.getViewportCenter() ?? { x: 280, y: 160 };
  }

  export function getStageTransform() {
    return stageManager?.getTransform() || { position: { x: 0, y: 0 }, scale: { x: 1, y: 1 } };
  }

  onMount(() => {
    if (!canvasContainer) return;

    stageManager = new StageManager(canvasContainer, {
      onNodeMove: (nodeId, pos) => {
        graphStore.updateNodePosition(nodeId, pos);
      },
      onNodesMove: (moves) => {
        graphStore.updateNodesPosition(moves);
      },
      onNodeSelect: (nodeId, multiIds) => {
        if (nodeId) debugStore.toggleInspector(true);
        if (multiIds && multiIds.length > 1) {
          graphStore.selectNodes(multiIds);
        } else {
          graphStore.selectNode(nodeId);
        }
      },
      onWireCreate: (wire: WireData) => {
        graphStore.createWire(wire);
      },
      onWireDelete: (wireId: string) => {
        graphStore.removeWire(wireId);
      },
      onPortValueChange: (nodeId, portId, val) => {
        graphStore.setPortValue(nodeId, portId, val);
      },
      onFunctionEdit: (funName: string) => {
        graphStore.openFunction(funName);
      },
      onCommentChange: (nodeId, text) => {
        graphStore.setCommentText(nodeId, text);
      },
      onToggleBreakpoint: (nodeId) => {
        debugStore.toggleBreakpoint(nodeId);
      },
      onContextMenu: (screenPos, canvasPos) => {
        contextMenuData = { screenPos, canvasPos };
      },
      onWireDropOnCanvas: (screenPos, canvasPos, connectingPort) => {
        contextMenuData = { screenPos, canvasPos, connectingPort };
      },
    });

    unsubscribeGraph = graphStore.subscribe((state) => {
      if (!stageManager) return;

      const scopeKey = state.activeScope.type === 'main' ? 'main' : `fn:${state.activeScope.name}`;
      const nodeIds = state.nodes.map((n) => `${n.id}:${n.title}:${n.position?.x ?? 0}:${n.position?.y ?? 0}:${n.commentText ?? ''}`).join('|');
      const wireIds = state.wires.map((w) => `${w.id}:${w.originPortId}->${w.targetPortId}`).join('|');
      const portVals = state.nodes.map((n) => Object.values(n.input || {}).map((p) => `${p.id}:${p.value}`).join(',')).join('|');
      const currentSignature = `${scopeKey}__${nodeIds}__${wireIds}__${portVals}`;

      if (currentSignature !== lastRenderSignature) {
        lastRenderSignature = currentSignature;
        stageManager.renderGraph(state.nodes, state.wires);
      }
    });

    unsubscribeConsole = consoleStore.subscribe((cState) => {
      if (!stageManager) return;
      stageManager.highlightNode(cState.activeNodeId);
      stageManager.setExecuting(cState.isRunning);
      if (cState.isPaused && cState.activeNodeId) debugStore.toggleInspector(true);
    });

    unsubscribeDebug = debugStore.subscribe((state) => {
      stageManager?.setBreakpoints(state.breakpointNodeIds);
    });

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selectedIds = $graphStore.selectedNodeIds.length > 0 ? $graphStore.selectedNodeIds : ($graphStore.selectedNodeId ? [$graphStore.selectedNodeId] : []);
        if (selectedIds.length > 0) {
          selectedIds.forEach((id) => graphStore.removeNode(id));
        }
      } else if (e.ctrlKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        graphStore.duplicateSelectedNodes();
      } else if (e.ctrlKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          graphStore.redo();
        } else {
          graphStore.undo();
        }
      } else if (e.ctrlKey && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        graphStore.redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  onDestroy(() => {
    unsubscribeGraph?.();
    unsubscribeConsole?.();
    unsubscribeDebug?.();
    stageManager?.destroy();
  });
</script>

<div
  bind:this={canvasContainer}
  class="w-full h-full relative overflow-hidden bg-surface-dim select-none"
  style="background-image: radial-gradient(#262a36 1.5px, transparent 1.5px); background-size: 28px 28px;"
>
  {#if $graphStore.nodes.length === 0}
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none p-6 rounded-3xl bg-surface-container/60 border border-surface-container-high backdrop-blur-sm shadow-m3-2">
      <div class="w-12 h-12 mx-auto mb-3 rounded-2xl bg-surface-container-highest flex items-center justify-center text-m3-primary">
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <div class="text-base font-semibold text-m3-on-surface mb-1">Canvas is empty</div>
        <div class="text-xs text-m3-outline max-w-xs">
         Right-click anywhere to quick-add, or drag a node from the palette.
      </div>
    </div>
  {/if}

  {#if contextMenuData}
    <ContextMenu
      screenPos={contextMenuData.screenPos}
      canvasPos={contextMenuData.canvasPos}
      connectingPort={contextMenuData.connectingPort}
      onClose={() => (contextMenuData = null)}
    />
  {/if}
</div>

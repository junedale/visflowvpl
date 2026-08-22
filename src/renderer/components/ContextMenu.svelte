<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { nanoid } from 'nanoid';
  import { PALETTE_CATEGORIES } from '../../canvas/nodeTemplates.js';
  import { graphStore } from '../stores/graphStore.js';
  import { CategoryColors } from '../../canvas/constants.js';

  export let screenPos: { x: number; y: number } = { x: 0, y: 0 };
  export let canvasPos: { x: number; y: number } = { x: 100, y: 100 };
  export let connectingPort: any = null;
  export let onClose: () => void;

  let searchQuery = '';
  let selectedIndex = 0;
  let inputEl: HTMLInputElement;
  let menuContainer: HTMLDivElement;
  let canDismiss = false;

  // Flatten palette items
  $: allItems = PALETTE_CATEGORIES.flatMap((cat) => cat.items);

  $: filteredItems = searchQuery.trim() === ''
    ? allItems
    : allItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  $: if (filteredItems.length > 0 && selectedIndex >= filteredItems.length) {
    selectedIndex = 0;
  }

  function handleSelect(item: { id: string }) {
    const prevNodeIds = new Set($graphStore.nodes.map((n) => n.id));
    graphStore.addNode(item.id, canvasPos);

    // Smart Wire-Drop: Automatically wire up newly created node!
    if (connectingPort) {
      setTimeout(() => {
        const newNode = $graphStore.nodes.find((n) => !prevNodeIds.has(n.id));
        if (newNode) {
          if (connectingPort.isExec) {
            if (!connectingPort.isInput) {
              const targetPrevPort = Object.values(newNode.previous || {})[0];
              if (targetPrevPort) {
                graphStore.createWire({
                  id: `wire_${nanoid(8)}`,
                  originPortId: connectingPort.portId,
                  targetPortId: targetPrevPort.id,
                });
              }
            } else {
              const originNextPort = Object.values(newNode.next || {})[0];
              if (originNextPort) {
                graphStore.createWire({
                  id: `wire_${nanoid(8)}`,
                  originPortId: originNextPort.id,
                  targetPortId: connectingPort.portId,
                });
              }
            }
          } else {
            if (!connectingPort.isInput) {
              const targetInputPort =
                Object.values(newNode.input || {}).find(
                  (p) =>
                    p.dataType === 'any' ||
                    !connectingPort.dataType ||
                    connectingPort.dataType === 'any' ||
                    p.dataType === connectingPort.dataType
                ) || Object.values(newNode.input || {})[0];

              if (targetInputPort) {
                graphStore.createWire({
                  id: `wire_${nanoid(8)}`,
                  originPortId: connectingPort.portId,
                  targetPortId: targetInputPort.id,
                });
              }
            } else {
              const originOutPort =
                Object.values(newNode.output || {}).find(
                  (p) =>
                    p.dataType === 'any' ||
                    !connectingPort.dataType ||
                    connectingPort.dataType === 'any' ||
                    p.dataType === connectingPort.dataType
                ) || Object.values(newNode.output || {})[0];

              if (originOutPort) {
                graphStore.createWire({
                  id: `wire_${nanoid(8)}`,
                  originPortId: originOutPort.id,
                  targetPortId: connectingPort.portId,
                });
              }
            }
          }
        }
      }, 30);
    }

    onClose();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % Math.max(1, filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + filteredItems.length) % Math.max(1, filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  }

  function handleOutside(e: MouseEvent) {
    if (!canDismiss) return;
    const target = e.target as HTMLElement;
    if (menuContainer && !menuContainer.contains(target)) {
      onClose();
    }
  }

  onMount(() => {
    setTimeout(() => {
      inputEl?.focus();
      canDismiss = true;
    }, 50);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleOutside, true);
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('mousedown', handleOutside, true);
  });
</script>

<div
  bind:this={menuContainer}
  role="dialog"
  aria-modal="true"
  tabindex="-1"
  on:keydown|stopPropagation
  on:mousedown|stopPropagation
  on:click|stopPropagation
  on:contextmenu|preventDefault|stopPropagation
  class="context-menu-container fixed z-50 w-72 bg-surface-container-high/95 border border-surface-container-highest rounded-2xl shadow-m3-4 backdrop-blur-md overflow-hidden flex flex-col p-2 text-sm"
  style="top: {Math.max(10, Math.min(screenPos.y, window.innerHeight - 380))}px; left: {Math.max(10, Math.min(screenPos.x, window.innerWidth - 300))}px;"
>
  <div class="flex items-center px-2 py-1.5 bg-surface-container-highest/60 rounded-xl mb-2 border border-surface-container-highest">
    <svg class="w-4 h-4 text-m3-primary mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
    <input
      bind:this={inputEl}
      bind:value={searchQuery}
      placeholder="Quick Add node (type to search)..."
      class="w-full bg-transparent text-xs text-m3-on-surface placeholder:text-m3-outline focus:outline-none"
    />
  </div>

  <div class="max-h-64 overflow-y-auto flex flex-col gap-0.5 custom-scrollbar">
    {#if filteredItems.length === 0}
      <div class="text-xs text-m3-outline text-center py-4">No matching nodes found</div>
    {:else}
      {#each filteredItems as item, idx}
        <button
          class="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors {idx === selectedIndex ? 'bg-m3-primary/20 text-m3-primary' : 'hover:bg-surface-container-highest/50 text-m3-on-surface'}"
          on:click={() => handleSelect(item)}
          on:mouseenter={() => (selectedIndex = idx)}
        >
          <span
            class="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style="background-color: {CategoryColors[item.category] || CategoryColors.void};"
          ></span>
          <div class="flex flex-col min-w-0 flex-1">
            <span class="text-xs font-semibold truncate leading-tight">{item.name}</span>
            <span class="text-[10px] text-m3-outline truncate leading-tight">{item.description}</span>
          </div>
          <span class="text-[9px] px-1.5 py-0.5 rounded bg-surface-container-highest text-m3-outline capitalize">
            {item.category}
          </span>
        </button>
      {/each}
    {/if}
  </div>
</div>


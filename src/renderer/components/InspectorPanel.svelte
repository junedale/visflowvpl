<script lang="ts">
  import type { NodeData, PortData } from '../../types/flow.js';
  import { debugStore } from '../stores/debugStore.js';
  import { consoleStore } from '../stores/consoleStore.js';
  import { graphStore } from '../stores/graphStore.js';

  export let onFocusNode: (nodeId: string) => void = () => {};
  export let width = 320;

  interface PortRow {
    port: PortData;
    direction: 'input' | 'output' | 'exec input' | 'exec output';
    editable: boolean;
  }

  $: inspectedId = $consoleStore.activeNodeId ?? $graphStore.selectedNodeId;
  $: node = $graphStore.nodes.find((item) => item.id === inspectedId);
  $: isRunning = $consoleStore.isRunning;

  let editError = '';

  function portRows(currentNode: NodeData | undefined): PortRow[] {
    if (!currentNode) return [];
    return [
      ...Object.values(currentNode.previous).map((port) => ({ port, direction: 'exec input' as const, editable: false })),
      ...Object.values(currentNode.next).map((port) => ({ port, direction: 'exec output' as const, editable: false })),
      ...Object.values(currentNode.input).map((port) => ({ port, direction: 'input' as const, editable: true })),
      ...Object.values(currentNode.output).map((port) => ({ port, direction: 'output' as const, editable: false })),
    ];
  }

  function findConnection(portId: string) {
    const wire = $graphStore.wires.find((item) => item.originPortId === portId || item.targetPortId === portId);
    if (!wire) return null;
    const remotePortId = wire.originPortId === portId ? wire.targetPortId : wire.originPortId;
    for (const candidate of $graphStore.nodes) {
      for (const ports of [candidate.previous, candidate.next, candidate.input, candidate.output]) {
        const port = Object.values(ports).find((item) => item.id === remotePortId);
        if (port) return { wireId: wire.id, nodeId: candidate.id, nodeTitle: candidate.title, portTitle: port.title || 'Port' };
      }
    }
    return { wireId: wire.id, nodeId: '', nodeTitle: 'Missing node', portTitle: 'Port' };
  }

  function updatePortValue(port: PortData, rawValue: string | boolean) {
    if (!node) return;
    editError = '';
    let value: any = rawValue;
    if (port.dataType === 'number') {
      value = Number(rawValue);
      if (!Number.isFinite(value)) {
        editError = `${port.title || 'This input'} needs a valid number.`;
        return;
      }
    } else if (port.dataType === 'array' || port.dataType === 'any') {
      const text = String(rawValue).trim();
      if (text.startsWith('[') || text.startsWith('{')) {
        try {
          value = JSON.parse(text);
        } catch {
          editError = `${port.title || 'This input'} needs valid JSON.`;
          return;
        }
      }
    }
    graphStore.setPortValue(node.id, port.id, value);
  }

  function displayValue(port: PortData): string {
    return typeof port.value === 'object' ? JSON.stringify(port.value ?? []) : String(port.value ?? '');
  }
</script>

<aside class="min-w-60 max-w-[40vw] bg-surface-container-low border-l border-surface-container-high flex flex-col shadow-m3-2 z-20" style:width={`${width}px`} aria-label="Inspector">
  <header class="h-11 px-3 flex items-center justify-between border-b border-surface-container-high">
    <div><p class="text-xs font-semibold text-m3-on-surface">Inspect</p><p class="text-[10px] text-m3-outline">Configure nodes and connections</p></div>
    <button class="w-7 h-7 rounded-lg text-m3-outline hover:bg-surface-container-high" on:click={() => debugStore.toggleInspector(false)} aria-label="Close Inspector">×</button>
  </header>

  <div class="p-3 overflow-y-auto space-y-4">
    {#if node}
      <section class="space-y-2">
        <label class="text-[10px] font-bold uppercase tracking-wider text-m3-outline" for="node-title">Node name</label>
        <input id="node-title" class="m3-input w-full" value={node.title} disabled={isRunning || node.category === 'start' || node.type === 'function'} on:change={(event) => graphStore.setNodeTitle(node!.id, event.currentTarget.value)} />
        {#if node.category === 'start' || node.type === 'function'}<p class="text-[10px] text-m3-outline">This name identifies a program entry point or function and cannot be changed here.</p>{/if}
      </section>

      {#if node.type === 'comment'}
        <section class="space-y-2"><label class="text-[10px] font-bold uppercase tracking-wider text-m3-outline" for="node-comment">Note text</label><textarea id="node-comment" class="m3-input w-full min-h-24" value={node.commentText ?? ''} disabled={isRunning} on:change={(event) => graphStore.setCommentText(node!.id, event.currentTarget.value)}></textarea></section>
      {/if}

      <section>
        <p class="text-[10px] font-bold uppercase tracking-wider text-m3-outline">Ports and connections</p>
        <div class="mt-2 space-y-2">
          {#each portRows(node) as row (row.port.id)}
            {@const connection = findConnection(row.port.id)}
            <div class="rounded-xl bg-surface-container border border-surface-container-high p-2.5 space-y-2">
              <div class="flex items-center justify-between gap-2"><span class="text-xs font-medium text-m3-on-surface">{row.port.title || 'Port'}</span><span class="text-[10px] text-m3-outline">{row.direction}{row.port.dataType ? ` · ${row.port.dataType}` : ''}</span></div>
              {#if row.editable && !connection}
                {#if row.port.dataType === 'boolean'}
                  <select class="m3-input w-full" disabled={isRunning} value={String(row.port.value ?? false)} on:change={(event) => updatePortValue(row.port, event.currentTarget.value === 'true')}><option value="true">true</option><option value="false">false</option></select>
                {:else if row.port.dataType === 'array' || row.port.dataType === 'any'}
                  <textarea class="m3-input w-full min-h-16 font-mono" disabled={isRunning} value={displayValue(row.port)} on:change={(event) => updatePortValue(row.port, event.currentTarget.value)}></textarea>
                {:else}
                  <input class="m3-input w-full" type={row.port.dataType === 'number' ? 'number' : 'text'} disabled={isRunning} value={displayValue(row.port)} on:change={(event) => updatePortValue(row.port, event.currentTarget.value)} />
                {/if}
              {/if}
              {#if connection}
                <div class="flex items-center justify-between gap-2 text-[11px]"><span class="truncate text-m3-on-surface-variant">Connected to {connection.nodeTitle} · {connection.portTitle}</span><span class="flex shrink-0 gap-1"><button class="text-m3-primary hover:underline" disabled={!connection.nodeId} on:click={() => connection.nodeId && onFocusNode(connection.nodeId)}>Jump</button><button class="text-m3-error hover:underline" disabled={isRunning} on:click={() => graphStore.removeWire(connection.wireId)}>Disconnect</button></span></div>
                {#if row.editable}<p class="text-[10px] text-m3-primary">Value is supplied by this connection.</p>{/if}
              {:else}
                <p class="text-[11px] text-m3-outline">Not connected. Drag from a compatible port to connect it.</p>
              {/if}
            </div>
          {/each}
        </div>
      </section>

      {#if editError}<p class="rounded-lg bg-m3-error/10 px-2 py-1.5 text-xs text-m3-error">{editError}</p>{/if}
      {#if !isRunning && node.category !== 'start'}<button class="text-xs text-m3-error hover:underline" on:click={() => graphStore.removeNode(node!.id)}>Delete node</button>{/if}
      {#if isRunning}<p class="text-[11px] text-m3-outline">Stop the program before changing this node.</p>{/if}
    {:else}
      <p class="pt-8 text-center text-xs text-m3-outline">Select a node or pause execution to inspect it.</p>
    {/if}
  </div>
</aside>

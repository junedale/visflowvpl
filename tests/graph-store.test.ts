import { beforeEach, describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import { graphStore } from '../src/renderer/stores/graphStore.js';

describe('Graph store history', () => {
  beforeEach(() => graphStore.reset());

  it('restores a disconnected wire with Undo and removes it again with Redo', () => {
    const initial = get(graphStore);
    const start = initial.nodes.find((node) => node.category === 'start')!;
    const print = initial.nodes.find((node) => node.title === 'Println')!;
    const wire = {
      id: 'test-wire',
      originPortId: Object.values(start.next)[0].id,
      targetPortId: Object.values(print.previous)[0].id,
    };

    graphStore.createWire(wire);
    graphStore.removeWire(wire.id);
    expect(get(graphStore).wires).toEqual([]);

    graphStore.undo();
    expect(get(graphStore).wires).toEqual([wire]);

    graphStore.redo();
    expect(get(graphStore).wires).toEqual([]);
  });

  it('records Inspector title edits in history', () => {
    const node = get(graphStore).nodes.find((item) => item.title === 'Println')!;

    graphStore.setNodeTitle(node.id, 'Show result');
    expect(get(graphStore).nodes.find((item) => item.id === node.id)?.title).toBe('Show result');

    graphStore.undo();
    expect(get(graphStore).nodes.find((item) => item.id === node.id)?.title).toBe('Println');
  });
});

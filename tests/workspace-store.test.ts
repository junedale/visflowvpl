import { describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import { commandPaletteStore } from '../src/renderer/stores/commandPaletteStore.js';
import { consoleStore } from '../src/renderer/stores/consoleStore.js';
import { workspaceLayoutStore } from '../src/renderer/stores/workspaceLayoutStore.js';
import { fileStore } from '../src/renderer/stores/fileStore.js';
import { graphStore } from '../src/renderer/stores/graphStore.js';

describe('Workspace controls', () => {
  it('opens and closes the command palette', () => {
    commandPaletteStore.close();
    commandPaletteStore.open();
    expect(get(commandPaletteStore)).toBe(true);

    commandPaletteStore.close();
    expect(get(commandPaletteStore)).toBe(false);
  });

  it('opens a requested dock tab', () => {
    consoleStore.toggleOpen(false);
    consoleStore.openDock('terminal');

    expect(get(consoleStore)).toMatchObject({ isOpen: true, activeDockTab: 'terminal' });
  });

  it('clamps layout sizes and restores defaults', () => {
    workspaceLayoutStore.setSize('sidebarWidth', 10);
    expect(get(workspaceLayoutStore).sidebarWidth).toBe(200);

    workspaceLayoutStore.reset();
    expect(get(workspaceLayoutStore)).toMatchObject({ sidebarWidth: 288, dockHeight: 288 });
  });

  it('marks the file dirty after a graph edit', () => {
    graphStore.reset();
    const node = get(graphStore).nodes.find((item) => item.title === 'Println')!;
    graphStore.setNodeTitle(node.id, 'Updated output');

    expect(get(fileStore).isDirty).toBe(true);
  });
});

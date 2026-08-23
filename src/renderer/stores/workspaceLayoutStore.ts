import { writable } from 'svelte/store';

export interface WorkspaceLayout {
  sidebarWidth: number;
  sidebarCollapsed: boolean;
  inspectorWidth: number;
  debuggerWidth: number;
  dockHeight: number;
}

const storageKey = 'visflow-workspace-layout';
const defaults: WorkspaceLayout = {
  sidebarWidth: 288,
  sidebarCollapsed: false,
  inspectorWidth: 320,
  debuggerWidth: 320,
  dockHeight: 288,
};

function clamp(value: unknown, minimum: number, maximum: number, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.min(maximum, Math.max(minimum, value)) : fallback;
}

function loadLayout(): WorkspaceLayout {
  if (typeof localStorage === 'undefined') return defaults;
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return {
      sidebarWidth: clamp(stored.sidebarWidth, 200, 480, defaults.sidebarWidth),
      sidebarCollapsed: Boolean(stored.sidebarCollapsed),
      inspectorWidth: clamp(stored.inspectorWidth, 240, 560, defaults.inspectorWidth),
      debuggerWidth: clamp(stored.debuggerWidth, 240, 560, defaults.debuggerWidth),
      dockHeight: clamp(stored.dockHeight, 180, 600, defaults.dockHeight),
    };
  } catch {
    return defaults;
  }
}

const { subscribe, set, update } = writable<WorkspaceLayout>(loadLayout());
subscribe((layout) => {
  if (typeof localStorage !== 'undefined') localStorage.setItem(storageKey, JSON.stringify(layout));
});

export const workspaceLayoutStore = {
  subscribe,
  setSidebarCollapsed: (sidebarCollapsed: boolean) => update((layout) => ({ ...layout, sidebarCollapsed })),
  setSize: (key: 'sidebarWidth' | 'inspectorWidth' | 'debuggerWidth' | 'dockHeight', value: number) => update((layout) => ({
    ...layout,
    [key]: key === 'dockHeight' ? clamp(value, 180, 600, layout[key]) : clamp(value, key === 'sidebarWidth' ? 200 : 240, key === 'sidebarWidth' ? 480 : 560, layout[key]),
  })),
  reset: () => set({ ...defaults }),
};

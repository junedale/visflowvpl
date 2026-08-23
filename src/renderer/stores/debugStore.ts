import { writable } from 'svelte/store';

export interface TraceEntry {
  id: string;
  nodeId: string;
  timestamp: number;
  variables: Record<string, any>;
  reason: 'step' | 'breakpoint';
}

export interface DebugState {
  breakpointNodeIds: string[];
  trace: TraceEntry[];
  pausedEntry: TraceEntry | null;
  isDebugPanelOpen: boolean;
  isInspectorOpen: boolean;
}

const initialState: DebugState = {
  breakpointNodeIds: [],
  trace: [],
  pausedEntry: null,
  isDebugPanelOpen: false,
  isInspectorOpen: false,
};

function createDebugStore() {
  const { subscribe, update } = writable<DebugState>(initialState);
  const maxTraceEntries = 200;

  return {
    subscribe,
    toggleBreakpoint: (nodeId: string) => update((state) => ({
      ...state,
      breakpointNodeIds: state.breakpointNodeIds.includes(nodeId)
        ? state.breakpointNodeIds.filter((id) => id !== nodeId)
        : [...state.breakpointNodeIds, nodeId],
    })),
    removeBreakpointsForNodes: (nodeIds: string[]) => update((state) => ({
      ...state,
      breakpointNodeIds: state.breakpointNodeIds.filter((id) => !nodeIds.includes(id)),
    })),
    recordStep: (nodeId: string, variables: Record<string, any>, reason: TraceEntry['reason']) => update((state) => {
      const entry: TraceEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        nodeId,
        timestamp: Date.now(),
        variables: { ...variables },
        reason,
      };
      return {
        ...state,
        trace: [...state.trace, entry].slice(-maxTraceEntries),
        pausedEntry: reason === 'breakpoint' ? entry : state.pausedEntry,
      };
    }),
    clearRun: () => update((state) => ({ ...state, trace: [], pausedEntry: null })),
    clearPause: () => update((state) => ({ ...state, pausedEntry: null })),
    toggleDebugPanel: (open?: boolean) => update((state) => ({ ...state, isDebugPanelOpen: open ?? !state.isDebugPanelOpen })),
    toggleInspector: (open?: boolean) => update((state) => ({ ...state, isInspectorOpen: open ?? !state.isInspectorOpen })),
  };
}

export const debugStore = createDebugStore();

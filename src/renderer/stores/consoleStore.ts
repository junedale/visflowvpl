import { writable } from 'svelte/store';

export interface ConsoleLog {
  id: string;
  text: string;
  type: 'stdout' | 'stderr' | 'info' | 'success';
  timestamp: string;
}

export type DockTab = 'terminal' | 'drawing' | 'watch' | 'problems';

export interface ConsoleState {
  isOpen: boolean;
  isRunning: boolean;
  isPaused: boolean;
  activeNodeId: string | null;
  watchedVariables: Record<string, any>;
  awaitingInput: boolean;
  inputPrompt: string;
  executionSpeedMs: number;
  logs: ConsoleLog[];
  executionTime: number;
  lastGeneratedCode: string;
  activeDockTab: DockTab;
}

const initialState: ConsoleState = {
  isOpen: false,
  isRunning: false,
  isPaused: false,
  activeNodeId: null,
  watchedVariables: {},
  awaitingInput: false,
  inputPrompt: '',
  executionSpeedMs: 0,
  logs: [],
  executionTime: 0,
  lastGeneratedCode: '',
  activeDockTab: 'terminal',
};

function createConsoleStore() {
  const { subscribe, set, update } = writable<ConsoleState>(initialState);

  return {
    subscribe,
    set,
    update,

    toggleOpen: (open?: boolean) => {
      update((s) => ({ ...s, isOpen: open !== undefined ? open : !s.isOpen }));
    },

    openDock: (tab: DockTab) => {
      update((s) => ({ ...s, isOpen: true, activeDockTab: tab }));
    },

    setDockTab: (tab: DockTab) => {
      update((s) => ({ ...s, activeDockTab: tab }));
    },

    setRunning: (running: boolean) => {
      update((s) => ({
        ...s,
        isRunning: running,
        isPaused: false,
        activeNodeId: running ? s.activeNodeId : null,
        awaitingInput: running ? s.awaitingInput : false,
        // Running a beginner's program should not unexpectedly replace their canvas.
        isOpen: s.isOpen,
      }));
    },

    setPaused: (paused: boolean) => {
      update((s) => ({ ...s, isPaused: paused }));
    },

    setActiveNodeId: (nodeId: string | null) => {
      update((s) => ({ ...s, activeNodeId: nodeId }));
    },

    setWatchedVariables: (vars: Record<string, any>) => {
      update((s) => ({ ...s, watchedVariables: { ...vars } }));
    },

    setVariableValue: (name: string, value: any) => {
      update((s) => ({
        ...s,
        watchedVariables: { ...s.watchedVariables, [name]: value },
      }));
    },

    setAwaitingInput: (awaiting: boolean, prompt: string = '') => {
      update((s) => ({
        ...s,
        awaitingInput: awaiting,
        inputPrompt: prompt,
        isOpen: awaiting ? true : s.isOpen,
      }));
    },

    setExecutionSpeed: (speedMs: number) => {
      update((s) => ({ ...s, executionSpeedMs: speedMs }));
    },

    log: (text: string, type: 'stdout' | 'stderr' | 'info' | 'success' = 'stdout') => {
      const entry: ConsoleLog = {
        id: Math.random().toString(36).substring(2, 9),
        text,
        type,
        timestamp: new Date().toLocaleTimeString(),
      };
      update((s) => ({
        ...s,
        logs: [...s.logs, entry],
      }));
    },

    setExecutionTime: (ms: number) => {
      update((s) => ({ ...s, executionTime: ms }));
    },

    setGeneratedCode: (code: string) => {
      update((s) => ({ ...s, lastGeneratedCode: code }));
    },

    clear: () => {
      update((s) => ({
        ...s,
        logs: [],
        executionTime: 0,
        activeNodeId: null,
        watchedVariables: {},
        awaitingInput: false,
      }));
    },
  };
}

export const consoleStore = createConsoleStore();

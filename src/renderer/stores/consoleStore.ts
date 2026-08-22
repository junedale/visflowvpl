import { writable } from 'svelte/store';

export interface ConsoleLog {
  id: string;
  text: string;
  type: 'stdout' | 'stderr' | 'info' | 'success';
  timestamp: string;
}

export interface ConsoleState {
  isOpen: boolean;
  isRunning: boolean;
  logs: ConsoleLog[];
  executionTime: number;
  lastGeneratedCode: string;
}

const initialState: ConsoleState = {
  isOpen: false,
  isRunning: false,
  logs: [],
  executionTime: 0,
  lastGeneratedCode: '',
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

    setRunning: (running: boolean) => {
      update((s) => ({ ...s, isRunning: running, isOpen: running ? true : s.isOpen }));
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
      update((s) => ({ ...s, logs: [], executionTime: 0 }));
    },
  };
}

export const consoleStore = createConsoleStore();

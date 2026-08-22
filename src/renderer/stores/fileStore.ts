import { writable, get } from 'svelte/store';
import { FileItem, VisflowFile } from '../../types/flow.js';
import { graphStore } from './graphStore.js';

export interface FileState {
  currentFileName: string | null;
  projectPath: string | null;
  fileList: FileItem[];
  isDirty: boolean;
}

const initialState: FileState = {
  currentFileName: 'Untitled.visflow',
  projectPath: null,
  fileList: [],
  isDirty: false,
};

declare global {
  interface Window {
    VisFlow?: {
      openDir: () => Promise<FileItem[]>;
      newFile: (fileName: string, data: string) => Promise<FileItem[]>;
      openFile: (fileName: string) => Promise<VisflowFile>;
      saveFile: (fileName: string, data: string) => Promise<void>;
    };
  }
}

function createFileStore() {
  const { subscribe, set, update } = writable<FileState>(initialState);

  return {
    subscribe,
    set,
    update,

    openFolder: async () => {
      if (!window.VisFlow) return;
      try {
        const files = await window.VisFlow.openDir();
        if (files) {
          update((s) => ({
            ...s,
            fileList: files.filter((f) => f.fileName.endsWith('.visflow')),
          }));
        }
      } catch (err) {
        console.error('Failed to open directory:', err);
      }
    },

    openFile: async (fileName: string) => {
      if (!window.VisFlow) return;
      try {
        const data = await window.VisFlow.openFile(fileName);
        if (data) {
          graphStore.loadProject(data);
          update((s) => ({
            ...s,
            currentFileName: fileName,
            isDirty: false,
          }));
        }
      } catch (err) {
        console.error('Failed to open file:', err);
      }
    },

    saveCurrentFile: async (stagePosition: { x: number; y: number }, stageScale: { x: number; y: number }) => {
      const state = get(fileStore);
      if (!state.currentFileName) return;

      const graph = get(graphStore);
      const fileData: VisflowFile = {
        stageData: {
          position: stagePosition,
          scale: stageScale,
        },
        nodes: {
          nodeData: graph.mainNodes,
          wireData: graph.mainWires,
        },
        variables: graph.variables,
        functions: graph.functions,
      };

      if (window.VisFlow) {
        await window.VisFlow.saveFile(state.currentFileName, JSON.stringify(fileData, null, 2));
      } else {
        // Browser fallback / download
        const blob = new Blob([JSON.stringify(fileData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = state.currentFileName;
        a.click();
        URL.revokeObjectURL(url);
      }

      update((s) => ({ ...s, isDirty: false }));
    },

    newFile: async (fileName: string) => {
      const safeName = fileName.endsWith('.visflow') ? fileName : `${fileName}.visflow`;
      graphStore.reset();

      const initialData: VisflowFile = {
        stageData: { position: { x: 0, y: 0 }, scale: { x: 1, y: 1 } },
        nodes: { nodeData: get(graphStore).nodes, wireData: [] },
        variables: [],
        functions: [],
      };

      if (window.VisFlow) {
        const updatedFiles = await window.VisFlow.newFile(safeName, JSON.stringify(initialData, null, 2));
        if (updatedFiles) {
          update((s) => ({
            ...s,
            currentFileName: safeName,
            fileList: updatedFiles.filter((f) => f.fileName.endsWith('.visflow')),
            isDirty: false,
          }));
          return;
        }
      }

      update((s) => ({
        ...s,
        currentFileName: safeName,
        isDirty: false,
      }));
    },
  };
}

export const fileStore = createFileStore();

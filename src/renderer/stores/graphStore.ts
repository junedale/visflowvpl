import { writable, get } from 'svelte/store';
import { nanoid } from 'nanoid';
import { NodeData, WireData, VariableData, FunctionData, VisflowFile, ActiveScope } from '../../types/flow.js';
import {
  createNodeFromTemplate,
  createVariableNode,
  createFunctionNode,
  createFunctionEntryNode,
  createReturnNode,
} from '../../canvas/nodeTemplates.js';

export interface GraphState {
  mainNodes: NodeData[];
  mainWires: WireData[];
  nodes: NodeData[]; // Active view nodes on canvas
  wires: WireData[]; // Active view wires on canvas
  variables: VariableData[];
  functions: FunctionData[];
  selectedNodeId: string | null;
  activeScope: ActiveScope;
  history: { nodes: NodeData[]; wires: WireData[] }[];
  historyIndex: number;
}

const defaultMainNodes: NodeData[] = [
  createNodeFromTemplate('start', { x: 100, y: 150 }),
  createNodeFromTemplate('println', { x: 340, y: 150 }),
  createNodeFromTemplate('string', { x: 100, y: 320 }),
];

const initialState: GraphState = {
  mainNodes: defaultMainNodes,
  mainWires: [],
  nodes: defaultMainNodes,
  wires: [],
  variables: [],
  functions: [],
  selectedNodeId: null,
  activeScope: { type: 'main' },
  history: [],
  historyIndex: -1,
};

function createGraphStore() {
  const { subscribe, set, update } = writable<GraphState>(initialState);

  function pushHistory(state: GraphState) {
    const maxHistory = 30;
    const historySlice = state.history.slice(0, state.historyIndex + 1);
    const newEntry = {
      nodes: JSON.parse(JSON.stringify(state.nodes)),
      wires: JSON.parse(JSON.stringify(state.wires)),
    };
    return {
      history: [...historySlice, newEntry].slice(-maxHistory),
      historyIndex: Math.min(historySlice.length, maxHistory - 1),
    };
  }

  function syncScope(state: GraphState, newNodes: NodeData[], newWires: WireData[]): Partial<GraphState> {
    if (state.activeScope.type === 'main') {
      return {
        mainNodes: newNodes,
        mainWires: newWires,
        nodes: newNodes,
        wires: newWires,
      };
    } else {
      const fnName = state.activeScope.name;
      return {
        nodes: newNodes,
        wires: newWires,
        functions: state.functions.map((f) =>
          f.name === fnName ? { ...f, nodes: newNodes, wires: newWires } : f
        ),
      };
    }
  }

  return {
    subscribe,
    set,
    update,

    openFunction: (functionName: string) => {
      update((s) => {
        const targetFn = s.functions.find((f) => f.name === functionName);
        if (!targetFn) return s;

        // Initialize function nodes if empty
        let fnNodes = targetFn.nodes && targetFn.nodes.length > 0 ? targetFn.nodes : [];
        let fnWires = targetFn.wires || [];
        if (fnNodes.length === 0) {
          const entryNode = createFunctionEntryNode(targetFn.name, targetFn.params.map((p) => p.name), { x: 100, y: 150 });
          const returnNode = createReturnNode({ x: 420, y: 150 });
          fnNodes = [entryNode, returnNode];
          const entryNext = Object.values(entryNode.next)[0]?.id;
          const returnPrev = Object.values(returnNode.previous)[0]?.id;
          if (entryNext && returnPrev) {
            fnWires = [{ id: `wire_${nanoid(8)}`, originPortId: entryNext, targetPortId: returnPrev }];
          }
        }

        return {
          ...s,
          activeScope: { type: 'function', name: functionName },
          nodes: fnNodes,
          wires: fnWires,
          selectedNodeId: null,
          functions: s.functions.map((f) =>
            f.name === functionName ? { ...f, nodes: fnNodes, wires: fnWires } : f
          ),
        };
      });
    },

    closeFunction: () => {
      update((s) => {
        if (s.activeScope.type === 'main') return s;

        return {
          ...s,
          activeScope: { type: 'main' },
          nodes: s.mainNodes,
          wires: s.mainWires,
          selectedNodeId: null,
        };
      });
    },

    addNode: (templateId: string, position: { x: number; y: number } = { x: 250, y: 200 }) => {
      const newNode = createNodeFromTemplate(templateId, position);
      update((s) => {
        const newNodes = [...s.nodes, newNode];
        const synced = syncScope(s, newNodes, s.wires);
        const hist = pushHistory(s);
        return {
          ...s,
          ...synced,
          ...hist,
          selectedNodeId: newNode.id,
        };
      });
    },

    removeNode: (nodeId: string) => {
      update((s) => {
        const nodeToRemove = s.nodes.find((n) => n.id === nodeId);
        // Prevent deleting start or function entry nodes
        if (!nodeToRemove || nodeToRemove.category === 'start') return s;

        const portIds = new Set<string>();
        if (nodeToRemove.previous) Object.values(nodeToRemove.previous).forEach((p) => portIds.add(p.id));
        if (nodeToRemove.next) Object.values(nodeToRemove.next).forEach((p) => portIds.add(p.id));
        if (nodeToRemove.input) Object.values(nodeToRemove.input).forEach((p) => portIds.add(p.id));
        if (nodeToRemove.output) Object.values(nodeToRemove.output).forEach((p) => portIds.add(p.id));

        const newNodes = s.nodes.filter((n) => n.id !== nodeId);
        const newWires = s.wires.filter((w) => !portIds.has(w.originPortId) && !portIds.has(w.targetPortId));
        const synced = syncScope(s, newNodes, newWires);
        const hist = pushHistory(s);

        return {
          ...s,
          ...synced,
          ...hist,
          selectedNodeId: s.selectedNodeId === nodeId ? null : s.selectedNodeId,
        };
      });
    },

    updateNodePosition: (nodeId: string, position: { x: number; y: number }) => {
      update((s) => {
        const newNodes = s.nodes.map((n) => (n.id === nodeId ? { ...n, position } : n));
        const synced = syncScope(s, newNodes, s.wires);
        return {
          ...s,
          ...synced,
        };
      });
    },

    createWire: (wire: WireData) => {
      update((s) => {
        const filteredWires = s.wires.filter((w) => w.targetPortId !== wire.targetPortId);
        const newWires = [...filteredWires, wire];
        const synced = syncScope(s, s.nodes, newWires);
        const hist = pushHistory(s);
        return {
          ...s,
          ...synced,
          ...hist,
        };
      });
    },

    removeWire: (wireId: string) => {
      update((s) => {
        const newWires = s.wires.filter((w) => w.id !== wireId);
        const synced = syncScope(s, s.nodes, newWires);
        const hist = pushHistory(s);
        return {
          ...s,
          ...synced,
          ...hist,
        };
      });
    },

    setPortValue: (nodeId: string, portId: string, value: any) => {
      update((s) => {
        const newNodes = s.nodes.map((n) => {
          if (n.id !== nodeId) return n;
          const updatedInput = { ...n.input };
          for (const key of Object.keys(updatedInput)) {
            if (updatedInput[key].id === portId) {
              updatedInput[key] = { ...updatedInput[key], value };
            }
          }
          return { ...n, input: updatedInput };
        });
        const synced = syncScope(s, newNodes, s.wires);
        return {
          ...s,
          ...synced,
        };
      });
    },

    addVariable: (variable: VariableData) => {
      update((s) => {
        const varNode = createVariableNode(variable.name, variable.dataType, variable.value, {
          x: 200 + Math.random() * 40,
          y: 200 + Math.random() * 40,
        });
        const newNodes = [...s.nodes, varNode];
        const synced = syncScope(s, newNodes, s.wires);
        const hist = pushHistory(s);
        return {
          ...s,
          ...synced,
          ...hist,
          variables: [...s.variables.filter((v) => v.name !== variable.name), variable],
          selectedNodeId: varNode.id,
        };
      });
    },

    addVariableNode: (name: string, position: { x: number; y: number } = { x: 220, y: 220 }) => {
      update((s) => {
        const targetVar = s.variables.find((v) => v.name === name);
        const varNode = createVariableNode(
          name,
          targetVar?.dataType || 'number',
          targetVar?.value ?? 0,
          position
        );
        const newNodes = [...s.nodes, varNode];
        const synced = syncScope(s, newNodes, s.wires);
        const hist = pushHistory(s);
        return {
          ...s,
          ...synced,
          ...hist,
          selectedNodeId: varNode.id,
        };
      });
    },

    removeVariable: (name: string) => {
      update((s) => {
        const hist = pushHistory(s);
        const newNodes = s.nodes.filter((n) => !(n.type === 'variable' && n.title === name));
        const synced = syncScope(s, newNodes, s.wires);
        return {
          ...s,
          ...synced,
          ...hist,
          variables: s.variables.filter((v) => v.name !== name),
        };
      });
    },

    addFunction: (fn: FunctionData) => {
      update((s) => {
        const fnNode = createFunctionNode(
          fn.name,
          fn.params.map((p) => p.name),
          { x: 200 + Math.random() * 40, y: 200 + Math.random() * 40 }
        );

        const entryNode = createFunctionEntryNode(fn.name, fn.params.map((p) => p.name), { x: 100, y: 150 });
        const returnNode = createReturnNode({ x: 420, y: 150 });
        const initialFnNodes = [entryNode, returnNode];
        const entryNext = Object.values(entryNode.next)[0]?.id;
        const returnPrev = Object.values(returnNode.previous)[0]?.id;
        const initialFnWires: WireData[] = [];
        if (entryNext && returnPrev) {
          initialFnWires.push({ id: `wire_${nanoid(8)}`, originPortId: entryNext, targetPortId: returnPrev });
        }

        const initializedFn: FunctionData = {
          ...fn,
          nodes: initialFnNodes,
          wires: initialFnWires,
        };

        const newNodes = [...s.nodes, fnNode];
        const synced = syncScope(s, newNodes, s.wires);
        const hist = pushHistory(s);

        return {
          ...s,
          ...synced,
          ...hist,
          functions: [...s.functions.filter((f) => f.name !== fn.name), initializedFn],
          selectedNodeId: fnNode.id,
        };
      });
    },

    addFunctionNode: (name: string, position: { x: number; y: number } = { x: 220, y: 220 }) => {
      update((s) => {
        const targetFn = s.functions.find((f) => f.name === name);
        const fnNode = createFunctionNode(
          name,
          targetFn?.params.map((p) => p.name) || [],
          position
        );
        const newNodes = [...s.nodes, fnNode];
        const synced = syncScope(s, newNodes, s.wires);
        const hist = pushHistory(s);
        return {
          ...s,
          ...synced,
          ...hist,
          selectedNodeId: fnNode.id,
        };
      });
    },

    removeFunction: (name: string) => {
      update((s) => {
        const hist = pushHistory(s);
        const newNodes = s.nodes.filter((n) => !(n.type === 'function' && n.title === name));
        const synced = syncScope(s, newNodes, s.wires);
        return {
          ...s,
          ...synced,
          ...hist,
          functions: s.functions.filter((f) => f.name !== name),
        };
      });
    },

    selectNode: (nodeId: string | null) => {
      update((s) => ({ ...s, selectedNodeId: nodeId }));
    },

    undo: () => {
      update((s) => {
        if (s.historyIndex <= 0) return s;
        const newIndex = s.historyIndex - 1;
        const entry = s.history[newIndex];
        const synced = syncScope(s, entry.nodes, entry.wires);
        return {
          ...s,
          ...synced,
          historyIndex: newIndex,
        };
      });
    },

    redo: () => {
      update((s) => {
        if (s.historyIndex >= s.history.length - 1) return s;
        const newIndex = s.historyIndex + 1;
        const entry = s.history[newIndex];
        const synced = syncScope(s, entry.nodes, entry.wires);
        return {
          ...s,
          ...synced,
          historyIndex: newIndex,
        };
      });
    },

    loadProject: (fileData: VisflowFile) => {
      const mainNodes = fileData.nodes?.nodeData || defaultMainNodes;
      const mainWires = fileData.nodes?.wireData || [];
      const functions = fileData.functions || [];

      set({
        mainNodes,
        mainWires,
        nodes: mainNodes,
        wires: mainWires,
        variables: fileData.variables || [],
        functions,
        selectedNodeId: null,
        activeScope: { type: 'main' },
        history: [],
        historyIndex: -1,
      });
    },

    reset: () => {
      set(initialState);
    },
  };
}

export const graphStore = createGraphStore();

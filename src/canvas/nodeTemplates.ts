import { nanoid } from 'nanoid';
import { NodeData, Category, DataType, PortData } from '../types/flow.js';

export function createNodeFromTemplate(templateId: string, position: { x: number; y: number } = { x: 100, y: 100 }): NodeData {
  const baseId = `node_${nanoid(8)}`;

  switch (templateId) {
    case 'start':
      return {
        id: baseId,
        title: 'Start',
        type: 'core',
        category: 'start',
        width: 160,
        position,
        previous: {},
        next: {
          0: { id: `port_${nanoid(8)}`, title: 'Exec', order: 0 },
        },
        input: {},
        output: {},
      };

    case 'print':
      return {
        id: baseId,
        title: 'Print',
        type: 'core',
        category: 'void',
        width: 170,
        position,
        previous: {
          0: { id: `port_${nanoid(8)}`, title: 'Exec' },
        },
        next: {
          0: { id: `port_${nanoid(8)}`, title: 'Exec', order: 0 },
        },
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Text', value: '', dataType: 'any' },
        },
        output: {},
      };

    case 'println':
      return {
        id: baseId,
        title: 'Println',
        type: 'core',
        category: 'void',
        width: 170,
        position,
        previous: {
          0: { id: `port_${nanoid(8)}`, title: 'Exec' },
        },
        next: {
          0: { id: `port_${nanoid(8)}`, title: 'Exec', order: 0 },
        },
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Text', value: '', dataType: 'any' },
        },
        output: {},
      };

    case 'add':
      return {
        id: baseId,
        title: 'Add',
        type: 'core',
        category: 'math',
        width: 170,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'A', value: 0, dataType: 'number' },
          1: { id: `port_${nanoid(8)}`, title: 'B', value: 0, dataType: 'number' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Result', dataType: 'number' },
        },
      };

    case 'subtract':
      return {
        id: baseId,
        title: 'Subtract',
        type: 'core',
        category: 'math',
        width: 170,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'A', value: 0, dataType: 'number' },
          1: { id: `port_${nanoid(8)}`, title: 'B', value: 0, dataType: 'number' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Result', dataType: 'number' },
        },
      };

    case 'multiply':
      return {
        id: baseId,
        title: 'Multiply',
        type: 'core',
        category: 'math',
        width: 170,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'A', value: 0, dataType: 'number' },
          1: { id: `port_${nanoid(8)}`, title: 'B', value: 0, dataType: 'number' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Result', dataType: 'number' },
        },
      };

    case 'divide':
      return {
        id: baseId,
        title: 'Divide',
        type: 'core',
        category: 'math',
        width: 170,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'A', value: 0, dataType: 'number' },
          1: { id: `port_${nanoid(8)}`, title: 'B', value: 1, dataType: 'number' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Result', dataType: 'number' },
        },
      };

    case 'modulo':
      return {
        id: baseId,
        title: 'Modulo',
        type: 'core',
        category: 'math',
        width: 170,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'A', value: 0, dataType: 'number' },
          1: { id: `port_${nanoid(8)}`, title: 'B', value: 2, dataType: 'number' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Result', dataType: 'number' },
        },
      };

    case 'greaterthan':
      return {
        id: baseId,
        title: 'Greater Than',
        type: 'core',
        category: 'logic',
        width: 180,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'A', value: 0, dataType: 'number' },
          1: { id: `port_${nanoid(8)}`, title: 'B', value: 0, dataType: 'number' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Result', dataType: 'boolean' },
        },
      };

    case 'lessthan':
      return {
        id: baseId,
        title: 'Less Than',
        type: 'core',
        category: 'logic',
        width: 180,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'A', value: 0, dataType: 'number' },
          1: { id: `port_${nanoid(8)}`, title: 'B', value: 0, dataType: 'number' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Result', dataType: 'boolean' },
        },
      };

    case 'equal':
      return {
        id: baseId,
        title: 'Equal',
        type: 'core',
        category: 'logic',
        width: 170,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'A', value: '', dataType: 'any' },
          1: { id: `port_${nanoid(8)}`, title: 'B', value: '', dataType: 'any' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Result', dataType: 'boolean' },
        },
      };

    case 'notequal':
      return {
        id: baseId,
        title: 'Not Equal',
        type: 'core',
        category: 'logic',
        width: 170,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'A', value: '', dataType: 'any' },
          1: { id: `port_${nanoid(8)}`, title: 'B', value: '', dataType: 'any' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Result', dataType: 'boolean' },
        },
      };

    case 'and':
      return {
        id: baseId,
        title: 'And',
        type: 'core',
        category: 'logic',
        width: 160,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'A', value: true, dataType: 'boolean' },
          1: { id: `port_${nanoid(8)}`, title: 'B', value: true, dataType: 'boolean' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Result', dataType: 'boolean' },
        },
      };

    case 'or':
      return {
        id: baseId,
        title: 'Or',
        type: 'core',
        category: 'logic',
        width: 160,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'A', value: false, dataType: 'boolean' },
          1: { id: `port_${nanoid(8)}`, title: 'B', value: false, dataType: 'boolean' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Result', dataType: 'boolean' },
        },
      };

    case 'not':
      return {
        id: baseId,
        title: 'Not',
        type: 'core',
        category: 'logic',
        width: 160,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'A', value: false, dataType: 'boolean' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Result', dataType: 'boolean' },
        },
      };

    case 'ifelse':
      return {
        id: baseId,
        title: 'If Else',
        type: 'core',
        category: 'conditional',
        width: 200,
        position,
        previous: {
          0: { id: `port_${nanoid(8)}`, title: 'Exec' },
        },
        next: {
          0: { id: `port_${nanoid(8)}`, title: 'After', order: 0 },
          1: { id: `port_${nanoid(8)}`, title: 'True', order: 1 },
          2: { id: `port_${nanoid(8)}`, title: 'False', order: 2 },
        },
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Condition', value: true, dataType: 'boolean' },
        },
        output: {},
      };

    case 'whileloop':
      return {
        id: baseId,
        title: 'While Loop',
        type: 'core',
        category: 'loop',
        width: 200,
        position,
        previous: {
          0: { id: `port_${nanoid(8)}`, title: 'Exec' },
        },
        next: {
          0: { id: `port_${nanoid(8)}`, title: 'Completed', order: 0 },
          1: { id: `port_${nanoid(8)}`, title: 'Body', order: 1 },
        },
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Condition', value: false, dataType: 'boolean' },
        },
        output: {},
      };

    case 'forloop':
      return {
        id: baseId,
        title: 'For Loop',
        type: 'core',
        category: 'loop',
        width: 200,
        position,
        previous: {
          0: { id: `port_${nanoid(8)}`, title: 'Exec' },
        },
        next: {
          0: { id: `port_${nanoid(8)}`, title: 'Completed', order: 0 },
          1: { id: `port_${nanoid(8)}`, title: 'Body', order: 1 },
        },
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Start', value: 0, dataType: 'number' },
          1: { id: `port_${nanoid(8)}`, title: 'End', value: 5, dataType: 'number' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Index', dataType: 'number' },
        },
      };

    case 'number':
      return {
        id: baseId,
        title: 'Number',
        type: 'core',
        category: 'math',
        width: 180,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Val', value: 10, dataType: 'number' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Out', dataType: 'number' },
        },
      };

    case 'string':
      return {
        id: baseId,
        title: 'String',
        type: 'core',
        category: 'math',
        width: 180,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Val', value: 'Hello', dataType: 'string' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Out', dataType: 'string' },
        },
      };

    case 'return':
      return {
        id: baseId,
        title: 'Return',
        type: 'core',
        category: 'function',
        width: 180,
        position,
        previous: {
          0: { id: `port_${nanoid(8)}`, title: 'Exec' },
        },
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Value', value: 0, dataType: 'any' },
        },
        output: {},
      };

    default:
      return {
        id: baseId,
        title: templateId,
        type: 'core',
        category: 'void',
        width: 170,
        position,
        previous: {},
        next: {},
        input: {},
        output: {},
      };
  }
}

export function createVariableNode(
  varName: string,
  dataType: DataType = 'number',
  value: any = 0,
  position: { x: number; y: number } = { x: 200, y: 200 }
): NodeData {
  const baseId = `node_${nanoid(8)}`;
  return {
    id: baseId,
    title: varName,
    type: 'variable',
    category: 'variable',
    dataType,
    width: 180,
    position,
    previous: {
      0: { id: `port_${nanoid(8)}`, title: 'Exec' },
    },
    next: {
      0: { id: `port_${nanoid(8)}`, title: 'Exec', order: 0 },
    },
    input: {
      0: { id: `port_${nanoid(8)}`, title: 'Set', value: value ?? 0, dataType },
    },
    output: {
      0: { id: `port_${nanoid(8)}`, title: 'Get', dataType, order: 0 },
    },
  };
}

export function createFunctionNode(
  funName: string,
  params: string[] = [],
  position: { x: number; y: number } = { x: 200, y: 200 }
): NodeData {
  const baseId = `node_${nanoid(8)}`;
  const inputPorts: Record<number, PortData> = {};
  params.forEach((paramName, idx) => {
    inputPorts[idx] = {
      id: `port_${nanoid(8)}`,
      title: paramName,
      value: 0,
      dataType: 'any',
    };
  });

  return {
    id: baseId,
    title: funName,
    type: 'function',
    category: 'function',
    width: 180,
    position,
    previous: {
      0: { id: `port_${nanoid(8)}`, title: 'Exec' },
    },
    next: {
      0: { id: `port_${nanoid(8)}`, title: 'Exec', order: 0 },
    },
    input: inputPorts,
    output: {
      0: { id: `port_${nanoid(8)}`, title: 'Result', dataType: 'any', order: 0 },
    },
  };
}

export function createFunctionEntryNode(
  funName: string,
  params: string[] = [],
  position: { x: number; y: number } = { x: 100, y: 150 }
): NodeData {
  const baseId = `node_${nanoid(8)}`;
  const outputPorts: Record<number, PortData> = {};
  params.forEach((paramName, idx) => {
    outputPorts[idx] = {
      id: `port_${nanoid(8)}`,
      title: paramName,
      dataType: 'any',
      order: idx,
    };
  });

  return {
    id: baseId,
    title: `Entry: ${funName}`,
    type: 'core',
    category: 'start',
    width: 180,
    position,
    previous: {},
    next: {
      0: { id: `port_${nanoid(8)}`, title: 'Exec', order: 0 },
    },
    input: {},
    output: outputPorts,
  };
}

export function createReturnNode(position: { x: number; y: number } = { x: 420, y: 150 }): NodeData {
  const baseId = `node_${nanoid(8)}`;
  return {
    id: baseId,
    title: 'Return',
    type: 'core',
    category: 'function',
    width: 170,
    position,
    previous: {
      0: { id: `port_${nanoid(8)}`, title: 'Exec' },
    },
    next: {},
    input: {
      0: { id: `port_${nanoid(8)}`, title: 'Value', value: 0, dataType: 'any' },
    },
    output: {},
  };
}

export interface NodePaletteItem {
  id: string;
  name: string;
  category: Category;
  description: string;
}

export const PALETTE_CATEGORIES: { name: string; category: Category; items: NodePaletteItem[] }[] = [
  {
    name: 'Flow Control',
    category: 'start',
    items: [
      { id: 'start', name: 'Start', category: 'start', description: 'Execution entry point' },
      { id: 'ifelse', name: 'If Else', category: 'conditional', description: 'Conditional branch' },
      { id: 'whileloop', name: 'While Loop', category: 'loop', description: 'Repeat while condition is true' },
      { id: 'forloop', name: 'For Loop', category: 'loop', description: 'Counted loop' },
    ],
  },
  {
    name: 'I/O',
    category: 'void',
    items: [
      { id: 'println', name: 'Println', category: 'void', description: 'Print value with newline to console' },
      { id: 'print', name: 'Print', category: 'void', description: 'Print value to console' },
    ],
  },
  {
    name: 'Math',
    category: 'math',
    items: [
      { id: 'add', name: 'Add (+)', category: 'math', description: 'Add two numbers' },
      { id: 'subtract', name: 'Subtract (-)', category: 'math', description: 'Subtract B from A' },
      { id: 'multiply', name: 'Multiply (*)', category: 'math', description: 'Multiply two numbers' },
      { id: 'divide', name: 'Divide (/)', category: 'math', description: 'Divide A by B' },
      { id: 'modulo', name: 'Modulo (%)', category: 'math', description: 'Remainder of A / B' },
      { id: 'number', name: 'Number Constant', category: 'math', description: 'Numeric constant' },
      { id: 'string', name: 'String Constant', category: 'math', description: 'Text constant' },
    ],
  },
  {
    name: 'Logic & Comparison',
    category: 'logic',
    items: [
      { id: 'equal', name: 'Equal (==)', category: 'logic', description: 'Check equality' },
      { id: 'notequal', name: 'Not Equal (!=)', category: 'logic', description: 'Check inequality' },
      { id: 'greaterthan', name: 'Greater Than (>)', category: 'logic', description: 'Check if A > B' },
      { id: 'lessthan', name: 'Less Than (<)', category: 'logic', description: 'Check if A < B' },
      { id: 'and', name: 'And (&&)', category: 'logic', description: 'Logical AND' },
      { id: 'or', name: 'Or (||)', category: 'logic', description: 'Logical OR' },
      { id: 'not', name: 'Not (!)', category: 'logic', description: 'Logical NOT' },
    ],
  },
  {
    name: 'Functions',
    category: 'function',
    items: [
      { id: 'return', name: 'Return', category: 'function', description: 'Return value from function' },
    ],
  },
];

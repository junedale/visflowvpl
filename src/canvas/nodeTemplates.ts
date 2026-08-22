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

    case 'input':
      return {
        id: baseId,
        title: 'Input Prompt',
        type: 'core',
        category: 'void',
        width: 180,
        position,
        previous: {
          0: { id: `port_${nanoid(8)}`, title: 'Exec' },
        },
        next: {
          0: { id: `port_${nanoid(8)}`, title: 'Exec', order: 0 },
        },
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Prompt', value: 'Enter value: ', dataType: 'string' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Value', dataType: 'string' },
        },
      };

    case 'sleep':
      return {
        id: baseId,
        title: 'Sleep (ms)',
        type: 'core',
        category: 'timing',
        width: 170,
        position,
        previous: {
          0: { id: `port_${nanoid(8)}`, title: 'Exec' },
        },
        next: {
          0: { id: `port_${nanoid(8)}`, title: 'Exec', order: 0 },
        },
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Duration', value: 500, dataType: 'number' },
        },
        output: {},
      };

    case 'random':
      return {
        id: baseId,
        title: 'Random (Min, Max)',
        type: 'core',
        category: 'math',
        width: 180,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Min', value: 1, dataType: 'number' },
          1: { id: `port_${nanoid(8)}`, title: 'Max', value: 100, dataType: 'number' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Result', dataType: 'number' },
        },
      };

    case 'round':
      return {
        id: baseId,
        title: 'Round',
        type: 'core',
        category: 'math',
        width: 160,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Val', value: 0.5, dataType: 'number' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Result', dataType: 'number' },
        },
      };

    case 'floor':
      return {
        id: baseId,
        title: 'Floor',
        type: 'core',
        category: 'math',
        width: 160,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Val', value: 0, dataType: 'number' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Result', dataType: 'number' },
        },
      };

    case 'ceil':
      return {
        id: baseId,
        title: 'Ceil',
        type: 'core',
        category: 'math',
        width: 160,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Val', value: 0, dataType: 'number' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Result', dataType: 'number' },
        },
      };

    case 'abs':
      return {
        id: baseId,
        title: 'Absolute Value',
        type: 'core',
        category: 'math',
        width: 170,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Val', value: -5, dataType: 'number' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Result', dataType: 'number' },
        },
      };

    case 'min':
      return {
        id: baseId,
        title: 'Min',
        type: 'core',
        category: 'math',
        width: 160,
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

    case 'max':
      return {
        id: baseId,
        title: 'Max',
        type: 'core',
        category: 'math',
        width: 160,
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

    case 'power':
      return {
        id: baseId,
        title: 'Power (A^B)',
        type: 'core',
        category: 'math',
        width: 170,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Base', value: 2, dataType: 'number' },
          1: { id: `port_${nanoid(8)}`, title: 'Exponent', value: 3, dataType: 'number' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Result', dataType: 'number' },
        },
      };

    case 'sqrt':
      return {
        id: baseId,
        title: 'Square Root',
        type: 'core',
        category: 'math',
        width: 170,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Val', value: 9, dataType: 'number' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Result', dataType: 'number' },
        },
      };

    case 'stringlength':
      return {
        id: baseId,
        title: 'String Length',
        type: 'core',
        category: 'string',
        width: 170,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Text', value: '', dataType: 'string' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Length', dataType: 'number' },
        },
      };

    case 'substring':
      return {
        id: baseId,
        title: 'Substring',
        type: 'core',
        category: 'string',
        width: 180,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Text', value: '', dataType: 'string' },
          1: { id: `port_${nanoid(8)}`, title: 'Start', value: 0, dataType: 'number' },
          2: { id: `port_${nanoid(8)}`, title: 'End', value: 5, dataType: 'number' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Result', dataType: 'string' },
        },
      };

    case 'toupper':
      return {
        id: baseId,
        title: 'To Uppercase',
        type: 'core',
        category: 'string',
        width: 170,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Text', value: '', dataType: 'string' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Result', dataType: 'string' },
        },
      };

    case 'tolower':
      return {
        id: baseId,
        title: 'To Lowercase',
        type: 'core',
        category: 'string',
        width: 170,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Text', value: '', dataType: 'string' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Result', dataType: 'string' },
        },
      };

    case 'concat':
      return {
        id: baseId,
        title: 'Concat Strings',
        type: 'core',
        category: 'string',
        width: 180,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'A', value: 'Hello ', dataType: 'string' },
          1: { id: `port_${nanoid(8)}`, title: 'B', value: 'World', dataType: 'string' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Result', dataType: 'string' },
        },
      };

    case 'contains':
      return {
        id: baseId,
        title: 'Contains',
        type: 'core',
        category: 'logic',
        width: 170,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Container', value: '', dataType: 'any' },
          1: { id: `port_${nanoid(8)}`, title: 'Item', value: '', dataType: 'any' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Result', dataType: 'boolean' },
        },
      };

    case 'createarray':
      return {
        id: baseId,
        title: 'Create Array',
        type: 'core',
        category: 'array',
        width: 180,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Item 0', value: 10, dataType: 'any' },
          1: { id: `port_${nanoid(8)}`, title: 'Item 1', value: 20, dataType: 'any' },
          2: { id: `port_${nanoid(8)}`, title: 'Item 2', value: 30, dataType: 'any' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Array', dataType: 'array' },
        },
      };

    case 'arrayget':
      return {
        id: baseId,
        title: 'Get Array Item',
        type: 'core',
        category: 'array',
        width: 180,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Array', dataType: 'array' },
          1: { id: `port_${nanoid(8)}`, title: 'Index', value: 0, dataType: 'number' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Item', dataType: 'any' },
        },
      };

    case 'arrayset':
      return {
        id: baseId,
        title: 'Set Array Item',
        type: 'core',
        category: 'array',
        width: 180,
        position,
        previous: {
          0: { id: `port_${nanoid(8)}`, title: 'Exec' },
        },
        next: {
          0: { id: `port_${nanoid(8)}`, title: 'Exec', order: 0 },
        },
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Array', dataType: 'array' },
          1: { id: `port_${nanoid(8)}`, title: 'Index', value: 0, dataType: 'number' },
          2: { id: `port_${nanoid(8)}`, title: 'Value', value: 0, dataType: 'any' },
        },
        output: {},
      };

    case 'arraylength':
      return {
        id: baseId,
        title: 'Array Length',
        type: 'core',
        category: 'array',
        width: 170,
        position,
        previous: {},
        next: {},
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Array', dataType: 'array' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Length', dataType: 'number' },
        },
      };

    case 'arraypush':
      return {
        id: baseId,
        title: 'Array Push',
        type: 'core',
        category: 'array',
        width: 180,
        position,
        previous: {
          0: { id: `port_${nanoid(8)}`, title: 'Exec' },
        },
        next: {
          0: { id: `port_${nanoid(8)}`, title: 'Exec', order: 0 },
        },
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Array', dataType: 'array' },
          1: { id: `port_${nanoid(8)}`, title: 'Value', value: 0, dataType: 'any' },
        },
        output: {},
      };

    case 'arraypop':
      return {
        id: baseId,
        title: 'Array Pop',
        type: 'core',
        category: 'array',
        width: 180,
        position,
        previous: {
          0: { id: `port_${nanoid(8)}`, title: 'Exec' },
        },
        next: {
          0: { id: `port_${nanoid(8)}`, title: 'Exec', order: 0 },
        },
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Array', dataType: 'array' },
        },
        output: {
          0: { id: `port_${nanoid(8)}`, title: 'Item', dataType: 'any' },
        },
      };

    // Turtle Graphics Templates
    case 'forward':
      return {
        id: baseId,
        title: 'Forward',
        type: 'core',
        category: 'void',
        width: 180,
        position,
        previous: { 0: { id: `port_${nanoid(8)}`, title: 'Exec' } },
        next: { 0: { id: `port_${nanoid(8)}`, title: 'Exec', order: 0 } },
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Distance', value: 50, dataType: 'number' },
        },
        output: {},
      };

    case 'backward':
      return {
        id: baseId,
        title: 'Backward',
        type: 'core',
        category: 'void',
        width: 180,
        position,
        previous: { 0: { id: `port_${nanoid(8)}`, title: 'Exec' } },
        next: { 0: { id: `port_${nanoid(8)}`, title: 'Exec', order: 0 } },
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Distance', value: 50, dataType: 'number' },
        },
        output: {},
      };

    case 'turnright':
      return {
        id: baseId,
        title: 'Turn Right',
        type: 'core',
        category: 'void',
        width: 180,
        position,
        previous: { 0: { id: `port_${nanoid(8)}`, title: 'Exec' } },
        next: { 0: { id: `port_${nanoid(8)}`, title: 'Exec', order: 0 } },
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Degrees', value: 90, dataType: 'number' },
        },
        output: {},
      };

    case 'turnleft':
      return {
        id: baseId,
        title: 'Turn Left',
        type: 'core',
        category: 'void',
        width: 180,
        position,
        previous: { 0: { id: `port_${nanoid(8)}`, title: 'Exec' } },
        next: { 0: { id: `port_${nanoid(8)}`, title: 'Exec', order: 0 } },
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Degrees', value: 90, dataType: 'number' },
        },
        output: {},
      };

    case 'pendown':
      return {
        id: baseId,
        title: 'Pen Down',
        type: 'core',
        category: 'void',
        width: 170,
        position,
        previous: { 0: { id: `port_${nanoid(8)}`, title: 'Exec' } },
        next: { 0: { id: `port_${nanoid(8)}`, title: 'Exec', order: 0 } },
        input: {},
        output: {},
      };

    case 'penup':
      return {
        id: baseId,
        title: 'Pen Up',
        type: 'core',
        category: 'void',
        width: 170,
        position,
        previous: { 0: { id: `port_${nanoid(8)}`, title: 'Exec' } },
        next: { 0: { id: `port_${nanoid(8)}`, title: 'Exec', order: 0 } },
        input: {},
        output: {},
      };

    case 'pencolor':
    case 'setpencolor':
      return {
        id: baseId,
        title: 'Set Pen Color',
        type: 'core',
        category: 'void',
        width: 190,
        position,
        previous: { 0: { id: `port_${nanoid(8)}`, title: 'Exec' } },
        next: { 0: { id: `port_${nanoid(8)}`, title: 'Exec', order: 0 } },
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Color', value: '#38bdf8', dataType: 'string' },
        },
        output: {},
      };

    case 'pensize':
    case 'setpensize':
      return {
        id: baseId,
        title: 'Set Pen Size',
        type: 'core',
        category: 'void',
        width: 180,
        position,
        previous: { 0: { id: `port_${nanoid(8)}`, title: 'Exec' } },
        next: { 0: { id: `port_${nanoid(8)}`, title: 'Exec', order: 0 } },
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Size (px)', value: 2, dataType: 'number' },
        },
        output: {},
      };

    case 'drawcircle':
      return {
        id: baseId,
        title: 'Draw Circle',
        type: 'core',
        category: 'void',
        width: 180,
        position,
        previous: { 0: { id: `port_${nanoid(8)}`, title: 'Exec' } },
        next: { 0: { id: `port_${nanoid(8)}`, title: 'Exec', order: 0 } },
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Radius', value: 25, dataType: 'number' },
        },
        output: {},
      };

    case 'drawrect':
      return {
        id: baseId,
        title: 'Draw Rect',
        type: 'core',
        category: 'void',
        width: 180,
        position,
        previous: { 0: { id: `port_${nanoid(8)}`, title: 'Exec' } },
        next: { 0: { id: `port_${nanoid(8)}`, title: 'Exec', order: 0 } },
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Width', value: 40, dataType: 'number' },
          1: { id: `port_${nanoid(8)}`, title: 'Height', value: 40, dataType: 'number' },
        },
        output: {},
      };

    case 'clearcanvas':
      return {
        id: baseId,
        title: 'Clear Canvas',
        type: 'core',
        category: 'void',
        width: 170,
        position,
        previous: { 0: { id: `port_${nanoid(8)}`, title: 'Exec' } },
        next: { 0: { id: `port_${nanoid(8)}`, title: 'Exec', order: 0 } },
        input: {},
        output: {},
      };

    case 'resetturtle':
      return {
        id: baseId,
        title: 'Reset Turtle',
        type: 'core',
        category: 'void',
        width: 170,
        position,
        previous: { 0: { id: `port_${nanoid(8)}`, title: 'Exec' } },
        next: { 0: { id: `port_${nanoid(8)}`, title: 'Exec', order: 0 } },
        input: {},
        output: {},
      };

    // WebAudio Templates
    case 'playtone':
      return {
        id: baseId,
        title: 'Play Tone',
        type: 'core',
        category: 'timing',
        width: 190,
        position,
        previous: { 0: { id: `port_${nanoid(8)}`, title: 'Exec' } },
        next: { 0: { id: `port_${nanoid(8)}`, title: 'Exec', order: 0 } },
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Freq (Hz)', value: 440, dataType: 'number' },
          1: { id: `port_${nanoid(8)}`, title: 'Duration (ms)', value: 200, dataType: 'number' },
        },
        output: {},
      };

    case 'playnote':
      return {
        id: baseId,
        title: 'Play Note',
        type: 'core',
        category: 'timing',
        width: 190,
        position,
        previous: { 0: { id: `port_${nanoid(8)}`, title: 'Exec' } },
        next: { 0: { id: `port_${nanoid(8)}`, title: 'Exec', order: 0 } },
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'Note', value: 'C4', dataType: 'string' },
          1: { id: `port_${nanoid(8)}`, title: 'Duration (ms)', value: 250, dataType: 'number' },
        },
        output: {},
      };

    case 'playsound':
      return {
        id: baseId,
        title: 'Play Sound FX',
        type: 'core',
        category: 'timing',
        width: 190,
        position,
        previous: { 0: { id: `port_${nanoid(8)}`, title: 'Exec' } },
        next: { 0: { id: `port_${nanoid(8)}`, title: 'Exec', order: 0 } },
        input: {
          0: { id: `port_${nanoid(8)}`, title: 'SFX Name', value: 'coin', dataType: 'string' },
        },
        output: {},
      };

    case 'comment':
      return {
        id: baseId,
        title: 'Note',
        type: 'comment',
        category: 'comment',
        width: 220,
        height: 130,
        commentText: 'Add explanatory note here...',
        position,
        previous: {},
        next: {},
        input: {},
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
    name: '🎨 Turtle Graphics & Art',
    category: 'void',
    items: [
      { id: 'forward', name: 'Forward', category: 'void', description: 'Move turtle forward drawing a line' },
      { id: 'backward', name: 'Backward', category: 'void', description: 'Move turtle backward' },
      { id: 'turnright', name: 'Turn Right', category: 'void', description: 'Rotate turtle clockwise in degrees' },
      { id: 'turnleft', name: 'Turn Left', category: 'void', description: 'Rotate turtle counter-clockwise' },
      { id: 'pendown', name: 'Pen Down', category: 'void', description: 'Enable drawing when turtle moves' },
      { id: 'penup', name: 'Pen Up', category: 'void', description: 'Disable drawing when turtle moves' },
      { id: 'pencolor', name: 'Set Pen Color', category: 'void', description: 'Change stroke color (#hex or name)' },
      { id: 'pensize', name: 'Set Pen Size', category: 'void', description: 'Change stroke line width' },
      { id: 'drawcircle', name: 'Draw Circle', category: 'void', description: 'Draw a circle at turtle position' },
      { id: 'drawrect', name: 'Draw Rect', category: 'void', description: 'Draw a rectangle at turtle position' },
      { id: 'clearcanvas', name: 'Clear Canvas', category: 'void', description: 'Wipe all drawings from canvas' },
      { id: 'resetturtle', name: 'Reset Turtle', category: 'void', description: 'Reset turtle to center (0, 0)' },
    ],
  },
  {
    name: '🎵 Sound & Music',
    category: 'timing',
    items: [
      { id: 'playnote', name: 'Play Note', category: 'timing', description: 'Play musical note (C4, E4, G4, A5...)' },
      { id: 'playtone', name: 'Play Tone', category: 'timing', description: 'Play custom sound frequency in Hz' },
      { id: 'playsound', name: 'Play Sound FX', category: 'timing', description: 'Retro SFX (coin, jump, laser, win...)' },
    ],
  },
  {
    name: 'I/O & Timing',
    category: 'void',
    items: [
      { id: 'println', name: 'Println', category: 'void', description: 'Print value with newline to console' },
      { id: 'print', name: 'Print', category: 'void', description: 'Print value to console' },
      { id: 'input', name: 'Input Prompt', category: 'void', description: 'Prompt user for input in terminal' },
      { id: 'sleep', name: 'Sleep / Delay', category: 'timing', description: 'Pause execution for milliseconds' },
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
      { id: 'power', name: 'Power (A^B)', category: 'math', description: 'Calculate Base to power Exponent' },
      { id: 'sqrt', name: 'Square Root', category: 'math', description: 'Calculate square root' },
      { id: 'random', name: 'Random (Min, Max)', category: 'math', description: 'Random integer between Min and Max' },
      { id: 'round', name: 'Round', category: 'math', description: 'Round number to nearest integer' },
      { id: 'floor', name: 'Floor', category: 'math', description: 'Round number down' },
      { id: 'ceil', name: 'Ceil', category: 'math', description: 'Round number up' },
      { id: 'abs', name: 'Absolute Value', category: 'math', description: 'Absolute (positive) value' },
      { id: 'min', name: 'Min', category: 'math', description: 'Smaller of two numbers' },
      { id: 'max', name: 'Max', category: 'math', description: 'Larger of two numbers' },
      { id: 'number', name: 'Number Constant', category: 'math', description: 'Numeric constant' },
      { id: 'string', name: 'String Constant', category: 'math', description: 'Text constant' },
    ],
  },
  {
    name: 'Strings',
    category: 'string',
    items: [
      { id: 'concat', name: 'Concat Strings', category: 'string', description: 'Combine two strings together' },
      { id: 'stringlength', name: 'String Length', category: 'string', description: 'Get number of characters in string' },
      { id: 'substring', name: 'Substring', category: 'string', description: 'Extract portion of text' },
      { id: 'toupper', name: 'To Uppercase', category: 'string', description: 'Convert text to uppercase' },
      { id: 'tolower', name: 'To Lowercase', category: 'string', description: 'Convert text to lowercase' },
    ],
  },
  {
    name: 'Arrays & Lists',
    category: 'array',
    items: [
      { id: 'createarray', name: 'Create Array', category: 'array', description: 'Create an array with values' },
      { id: 'arrayget', name: 'Get Item [i]', category: 'array', description: 'Get item at index from array' },
      { id: 'arrayset', name: 'Set Item [i]', category: 'array', description: 'Update item at index in array' },
      { id: 'arraylength', name: 'Array Length', category: 'array', description: 'Get number of items in array' },
      { id: 'arraypush', name: 'Array Push', category: 'array', description: 'Append item to end of array' },
      { id: 'arraypop', name: 'Array Pop', category: 'array', description: 'Remove and return last item' },
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
      { id: 'contains', name: 'Contains', category: 'logic', description: 'Check if text or array contains item' },
    ],
  },
  {
    name: 'Functions & Annotations',
    category: 'function',
    items: [
      { id: 'return', name: 'Return', category: 'function', description: 'Return value from function' },
      { id: 'comment', name: 'Sticky Note', category: 'comment', description: 'Add a visual explanatory note on canvas' },
    ],
  },
];


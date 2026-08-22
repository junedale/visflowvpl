import { NodeData, WireData, VariableData, FunctionData } from '../types/flow.js';

export interface ValidationIssue {
  type: 'error' | 'warning';
  message: string;
  nodeId?: string;
}

export class GraphValidator {
  public static validate(
    nodes: NodeData[],
    wires: WireData[],
    _variables: VariableData[],
    _functions: FunctionData[]
  ): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    const startNodes = nodes.filter(
      (n) => n.title.toLowerCase() === 'start' || n.category === 'start'
    );

    if (startNodes.length === 0) {
      issues.push({
        type: 'error',
        message: 'No Start node found on the canvas. Add a Start node to begin execution.',
      });
    } else if (startNodes.length > 1) {
      issues.push({
        type: 'error',
        message: 'Multiple Start nodes found. Please keep only one Start node for the main execution flow.',
        nodeId: startNodes[1].id,
      });
    }

    // Check required unconnected inputs on nodes
    nodes.forEach((node) => {
      if (node.input) {
        Object.values(node.input).forEach((port) => {
          const isConnected = wires.some(
            (w) => w.targetPortId === port.id || w.originPortId === port.id
          );
          const hasValue = port.value !== undefined && port.value !== null && String(port.value).trim() !== '';

          // Start node doesn't need inputs
          if (node.category !== 'start' && !isConnected && !hasValue) {
            issues.push({
              type: 'warning',
              message: `Input '${port.title || 'value'}' on node '${node.title}' is not connected or filled.`,
              nodeId: node.id,
            });
          }
        });
      }
    });

    return issues;
  }
}

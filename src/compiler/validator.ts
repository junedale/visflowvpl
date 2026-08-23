import { NodeData, WireData, VariableData, FunctionData } from '../types/flow.js';

export interface ValidationIssue {
  id: string;
  type: 'error' | 'warning';
  message: string;
  nodeId?: string;
  portId?: string;
  suggestion?: string;
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
          id: 'missing-start',
          message: 'No Start node found on the canvas. Add a Start node to begin execution.',
          suggestion: 'Add a Start node from Flow Control.',
      });
    } else if (startNodes.length > 1) {
      issues.push({
          type: 'error',
          id: `multiple-start:${startNodes[1].id}`,
          message: 'Multiple Start nodes found. Please keep only one Start node for the main execution flow.',
          nodeId: startNodes[1].id,
          suggestion: 'Keep one Start node in the main graph.',
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
              id: `unfilled-input:${node.id}:${port.id}`,
              message: `Input '${port.title || 'value'}' on node '${node.title}' is not connected or filled.`,
              nodeId: node.id,
              portId: port.id,
              suggestion: 'Enter a value or connect a compatible output port.',
            });
          }
        });
      }
    });

    if (startNodes.length === 1) {
      const startNode = startNodes[0];
      const startPorts = Object.values(startNode.next || {});
      const hasExecutionConnection = startPorts.some((port) => wires.some((wire) => wire.originPortId === port.id));
      if (startPorts.length > 0 && !hasExecutionConnection) {
        issues.push({
          id: `unconnected-start:${startNode.id}`,
          type: 'error',
          message: 'Start is not connected to an executable node, so this graph cannot run.',
          nodeId: startNode.id,
          suggestion: 'Drag from Start\'s square output port to another node\'s square input port.',
        });
      }
    }

    return issues;
  }
}

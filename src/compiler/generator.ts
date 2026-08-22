import { NodeData, WireData, VariableData, FunctionData, PortData } from '../types/flow.js';

export class CodeGenerator {
  private nodesMap: Map<string, NodeData> = new Map();
  private portToNodeMap: Map<string, { node: NodeData; port: PortData; isInput: boolean }> = new Map();
  private incomingWireMap: Map<string, WireData> = new Map(); // targetPortId -> WireData
  private outgoingWiresMap: Map<string, WireData[]> = new Map(); // originPortId -> WireData[]
  private declaredVariables: Set<string> = new Set();

  constructor(
    private nodes: NodeData[],
    private wires: WireData[],
    private variables: VariableData[] = [],
    private functions: FunctionData[] = []
  ) {
    this.buildIndices();
  }

  private buildIndices(): void {
    this.nodesMap.clear();
    this.portToNodeMap.clear();
    this.incomingWireMap.clear();
    this.outgoingWiresMap.clear();
    this.declaredVariables.clear();

    this.nodes.forEach((node) => {
      this.nodesMap.set(node.id, node);

      if (node.previous) {
        Object.values(node.previous).forEach((p) => {
          this.portToNodeMap.set(p.id, { node, port: p, isInput: true });
        });
      }
      if (node.next) {
        Object.values(node.next).forEach((p) => {
          this.portToNodeMap.set(p.id, { node, port: p, isInput: false });
        });
      }
      if (node.input) {
        Object.values(node.input).forEach((p) => {
          this.portToNodeMap.set(p.id, { node, port: p, isInput: true });
        });
      }
      if (node.output) {
        Object.values(node.output).forEach((p) => {
          this.portToNodeMap.set(p.id, { node, port: p, isInput: false });
        });
      }
    });

    this.wires.forEach((wire) => {
      this.incomingWireMap.set(wire.targetPortId, wire);
      const outgoing = this.outgoingWiresMap.get(wire.originPortId) || [];
      outgoing.push(wire);
      this.outgoingWiresMap.set(wire.originPortId, outgoing);
    });
  }

  public generate(): string {
    let script = '';

    // 1. Declare and initialize global variables
    let varScript = '';
    this.variables.forEach((v) => {
      let initialVal = v.value;
      if (v.dataType === 'string') {
        initialVal = `"${v.value ?? ''}"`;
      } else if (v.dataType === 'array') {
        initialVal = `[${v.value ?? ''}]`;
      } else if (v.dataType === 'boolean') {
        initialVal = v.value ? 'true' : 'false';
      } else if (initialVal === undefined || initialVal === null || initialVal === '') {
        initialVal = '0';
      }
      varScript += `${v.name} = ${initialVal};\n`;
      this.declaredVariables.add(v.name);
    });

    // 2. Generate Functions
    let funScript = '';
    this.functions.forEach((f) => {
      funScript += `fun ${f.name}(${f.params.map((p) => p.name).join(', ')}) {\n`;
      if (f.nodes && f.nodes.length > 0) {
        const subGenerator = new CodeGenerator(f.nodes, f.wires || [], [], []);
        const bodyCode = subGenerator.generateBodyOnly();
        funScript += this.indent(bodyCode);
      }
      funScript += `}\n\n`;
    });

    // 3. Generate main body starting from Start node
    const startNode = this.nodes.find(
      (n) => n.title.toLowerCase() === 'start' || n.category === 'start'
    );

    let bodyScript = '';
    if (startNode) {
      const nextPort = Object.values(startNode.next || {})[0];
      if (nextPort) {
        const nextNode = this.getNextNode(nextPort.id);
        bodyScript = this.traverseExecutionFlow(nextNode);
      }
    }

    script = `${varScript}${varScript ? '\n' : ''}${funScript}${bodyScript}`;
    return script.trim();
  }

  public generateBodyOnly(): string {
    const startNode = this.nodes.find(
      (n) => n.title.toLowerCase().startsWith('entry') || n.title.toLowerCase() === 'start' || n.category === 'start'
    );

    let body = '';
    if (startNode) {
      const nextPort = Object.values(startNode.next || {})[0];
      if (nextPort) {
        const nextNode = this.getNextNode(nextPort.id);
        body = this.traverseExecutionFlow(nextNode);
      }
    }

    // Fallback: If execution flow didn't include return, check for any Return node in the sub-graph
    if (!body.includes('return')) {
      const returnNode = this.nodes.find((n) => n.title.toLowerCase() === 'return');
      if (returnNode) {
        const inputPorts = Object.values(returnNode.input || {});
        const retVal = this.parseInputPort(inputPorts[0]);
        body += `return ${retVal};\n`;
      }
    }

    return body;
  }

  private traverseExecutionFlow(node: NodeData | null): string {
    if (!node) return '';

    let code = '';
    const nextPorts = Object.values(node.next || {});
    const inputPorts = Object.values(node.input || {});
    const normTitle = node.title.toLowerCase().replace(/\s+/g, '');

    if (node.type === 'core') {
      switch (normTitle) {
        case 'print':
          code += `print(${this.parseInputPort(inputPorts[0])});\n`;
          code += this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id));
          break;

        case 'println':
          code += `println(${this.parseInputPort(inputPorts[0])});\n`;
          code += this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id));
          break;

        case 'ifelse':
          const ifCond = this.parseInputPort(inputPorts[0]);
          const trueBranch = this.traverseExecutionFlow(this.getNextNode(nextPorts[1]?.id));
          const falseBranch = this.traverseExecutionFlow(this.getNextNode(nextPorts[2]?.id));
          const afterIf = this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id));

          code += `if (${ifCond}) {\n${this.indent(trueBranch)}} else {\n${this.indent(falseBranch)}}\n\n`;
          code += afterIf;
          break;

        case 'whileloop':
          const whileCond = this.parseInputPort(inputPorts[0]);
          const whileBody = this.traverseExecutionFlow(this.getNextNode(nextPorts[1]?.id));
          const afterWhile = this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id));

          code += `while (${whileCond}) {\n${this.indent(whileBody)}}\n\n`;
          code += afterWhile;
          break;

        case 'dowhileloop':
          const doCond = this.parseInputPort(inputPorts[0]);
          const doBody = this.traverseExecutionFlow(this.getNextNode(nextPorts[1]?.id));
          const afterDo = this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id));

          code += `do {\n${this.indent(doBody)}} while (${doCond});\n\n`;
          code += afterDo;
          break;

        case 'forloop':
          const startVal = this.parseInputPort(inputPorts[0]) || '0';
          const endVal = this.parseInputPort(inputPorts[1]) || '10';
          const forBody = this.traverseExecutionFlow(this.getNextNode(nextPorts[1]?.id));
          const afterFor = this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id));

          code += `for (index = ${startVal} in ${endVal}) {\n${this.indent(forBody)}}\n\n`;
          code += afterFor;
          break;

        case 'return': {
          const retVal = this.parseInputPort(inputPorts[0]);
          code += `return ${retVal};\n`;
          break;
        }

        default:
          code += this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id));
          break;
      }
    } else if (node.type === 'variable') {
      const varVal = this.parseInputPort(inputPorts[0]);
      code += `${node.title} = ${varVal};\n`;
      code += this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id));
    } else if (node.type === 'function') {
      const funCall = this.parseFunctionCall(node);
      code += `${funCall};\n`;
      code += this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id));
    }

    return code;
  }

  private parseInputPort(port?: PortData): string {
    if (!port) return '0';

    const incomingWire = this.incomingWireMap.get(port.id);
    if (!incomingWire) {
      // Direct literal value
      const rawVal = port.value !== undefined && port.value !== null ? String(port.value) : '';
      if (port.dataType === 'string') return `"${rawVal}"`;
      if (port.dataType === 'boolean') return rawVal === 'true' ? 'true' : 'false';
      if (rawVal === '') return '0';
      return rawVal;
    }

    const sourcePortEntry = this.portToNodeMap.get(incomingWire.originPortId);
    if (!sourcePortEntry) return '0';

    const sourceNode = sourcePortEntry.node;
    if (sourceNode.title.toLowerCase().startsWith('entry') && sourcePortEntry.port.title) {
      return sourcePortEntry.port.title;
    }

    const sourceInputs = Object.values(sourceNode.input || {});
    const norm = sourceNode.title.toLowerCase().replace(/\s+/g, '');

    if (sourceNode.type === 'core') {
      switch (norm) {
        case 'add':
          return `(${this.parseInputPort(sourceInputs[0])} + ${this.parseInputPort(sourceInputs[1])})`;
        case 'subtract':
          return `(${this.parseInputPort(sourceInputs[0])} - ${this.parseInputPort(sourceInputs[1])})`;
        case 'multiply':
          return `(${this.parseInputPort(sourceInputs[0])} * ${this.parseInputPort(sourceInputs[1])})`;
        case 'divide':
          return `(${this.parseInputPort(sourceInputs[0])} / ${this.parseInputPort(sourceInputs[1])})`;
        case 'modulo':
          return `(${this.parseInputPort(sourceInputs[0])} % ${this.parseInputPort(sourceInputs[1])})`;
        case 'greaterthan':
          return `(${this.parseInputPort(sourceInputs[0])} > ${this.parseInputPort(sourceInputs[1])})`;
        case 'lessthan':
          return `(${this.parseInputPort(sourceInputs[0])} < ${this.parseInputPort(sourceInputs[1])})`;
        case 'greaterorequal':
          return `(${this.parseInputPort(sourceInputs[0])} >= ${this.parseInputPort(sourceInputs[1])})`;
        case 'lessorequal':
          return `(${this.parseInputPort(sourceInputs[0])} <= ${this.parseInputPort(sourceInputs[1])})`;
        case 'equal':
          return `(${this.parseInputPort(sourceInputs[0])} == ${this.parseInputPort(sourceInputs[1])})`;
        case 'notequal':
          return `(${this.parseInputPort(sourceInputs[0])} != ${this.parseInputPort(sourceInputs[1])})`;
        case 'and':
          return `(${this.parseInputPort(sourceInputs[0])} and ${this.parseInputPort(sourceInputs[1])})`;
        case 'or':
          return `(${this.parseInputPort(sourceInputs[0])} or ${this.parseInputPort(sourceInputs[1])})`;
        case 'not':
          return `!(${this.parseInputPort(sourceInputs[0])})`;
        case 'number':
          return this.parseInputPort(sourceInputs[0]);
        case 'string':
          return `"${this.parseInputPort(sourceInputs[0]).replace(/^"|"$/g, '')}"`;
        case 'boolean':
          return this.parseInputPort(sourceInputs[0]);
        default:
          return '0';
      }
    } else if (sourceNode.type === 'variable') {
      return sourceNode.title;
    } else if (sourceNode.type === 'function') {
      return this.parseFunctionCall(sourceNode);
    }

    return '0';
  }

  private parseFunctionCall(node: NodeData): string {
    const inputs = Object.values(node.input || {});
    const args = inputs.map((port) => this.parseInputPort(port)).join(', ');
    return `${node.title}(${args})`;
  }

  private getNextNode(portId?: string): NodeData | null {
    if (!portId) return null;
    const wires = this.outgoingWiresMap.get(portId);
    if (!wires || wires.length === 0) return null;
    const targetEntry = this.portToNodeMap.get(wires[0].targetPortId);
    return targetEntry?.node ?? null;
  }

  private indent(str: string): string {
    if (!str) return '';
    return str
      .split('\n')
      .map((line) => (line.trim() ? `    ${line}` : ''))
      .join('\n');
  }
}

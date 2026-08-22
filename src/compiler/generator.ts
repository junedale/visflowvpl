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

  public generate(includeDebugSteps: boolean = false): string {
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
        const bodyCode = subGenerator.generateBodyOnly(includeDebugSteps);
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
        bodyScript = this.traverseExecutionFlow(nextNode, includeDebugSteps);
      }
    }

    script = `${varScript}${varScript ? '\n' : ''}${funScript}${bodyScript}`;
    return script.trim();
  }

  public generateBodyOnly(includeDebugSteps: boolean = false): string {
    const startNode = this.nodes.find(
      (n) => n.title.toLowerCase().startsWith('entry') || n.title.toLowerCase() === 'start' || n.category === 'start'
    );

    let body = '';
    if (startNode) {
      const nextPort = Object.values(startNode.next || {})[0];
      if (nextPort) {
        const nextNode = this.getNextNode(nextPort.id);
        body = this.traverseExecutionFlow(nextNode, includeDebugSteps);
      }
    }

    // Fallback: If execution flow didn't include return, check for any Return node in the sub-graph
    if (!body.includes('return')) {
      const returnNode = this.nodes.find((n) => n.title.toLowerCase() === 'return');
      if (returnNode) {
        const inputPorts = Object.values(returnNode.input || {});
        const retVal = this.parseInputPort(inputPorts[0]);
        if (includeDebugSteps) {
          body += `__step__("${returnNode.id}");\n`;
        }
        body += `return ${retVal};\n`;
      }
    }

    return body;
  }

  private traverseExecutionFlow(node: NodeData | null, includeDebugSteps: boolean = false): string {
    if (!node) return '';

    let code = '';
    if (includeDebugSteps && node.category !== 'start') {
      code += `__step__("${node.id}");\n`;
    }
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

        case 'input':
        case 'inputprompt':
          code += `input(${this.parseInputPort(inputPorts[0])});\n`;
          code += this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id));
          break;

        case 'sleep':
        case 'sleep(ms)':
        case 'sleep/delay':
          code += `sleep(${this.parseInputPort(inputPorts[0])});\n`;
          code += this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id));
          break;

        case 'arrayset':
        case 'setarrayitem':
        case 'setitem[i]':
          code += `${this.parseInputPort(inputPorts[0])}[${this.parseInputPort(inputPorts[1])}] = ${this.parseInputPort(inputPorts[2])};\n`;
          code += this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id));
          break;

        case 'arraypush':
          code += `push(${this.parseInputPort(inputPorts[0])}, ${this.parseInputPort(inputPorts[1])});\n`;
          code += this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id));
          break;

        case 'arraypop':
          code += `pop(${this.parseInputPort(inputPorts[0])});\n`;
          code += this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id));
          break;

        // Turtle Graphics
        case 'forward':
          code += `forward(${this.parseInputPort(inputPorts[0])});\n`;
          code += this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id), includeDebugSteps);
          break;

        case 'backward':
          code += `backward(${this.parseInputPort(inputPorts[0])});\n`;
          code += this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id), includeDebugSteps);
          break;

        case 'turnright':
          code += `turnRight(${this.parseInputPort(inputPorts[0])});\n`;
          code += this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id), includeDebugSteps);
          break;

        case 'turnleft':
          code += `turnLeft(${this.parseInputPort(inputPorts[0])});\n`;
          code += this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id), includeDebugSteps);
          break;

        case 'pendown':
          code += `penDown();\n`;
          code += this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id), includeDebugSteps);
          break;

        case 'penup':
          code += `penUp();\n`;
          code += this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id), includeDebugSteps);
          break;

        case 'setpencolor':
        case 'pencolor':
          code += `setPenColor(${this.parseInputPort(inputPorts[0])});\n`;
          code += this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id), includeDebugSteps);
          break;

        case 'setpensize':
        case 'pensize':
          code += `setPenSize(${this.parseInputPort(inputPorts[0])});\n`;
          code += this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id), includeDebugSteps);
          break;

        case 'drawcircle':
          code += `drawCircle(${this.parseInputPort(inputPorts[0])});\n`;
          code += this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id), includeDebugSteps);
          break;

        case 'drawrect':
        case 'drawrectangle':
          code += `drawRect(${this.parseInputPort(inputPorts[0])}, ${this.parseInputPort(inputPorts[1])});\n`;
          code += this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id), includeDebugSteps);
          break;

        case 'clearcanvas':
          code += `clearCanvas();\n`;
          code += this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id), includeDebugSteps);
          break;

        case 'resetturtle':
          code += `resetTurtle();\n`;
          code += this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id), includeDebugSteps);
          break;

        // WebAudio Sound & Notes
        case 'playtone':
          code += `playTone(${this.parseInputPort(inputPorts[0])}, ${this.parseInputPort(inputPorts[1])});\n`;
          code += this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id), includeDebugSteps);
          break;

        case 'playnote':
          code += `playNote(${this.parseInputPort(inputPorts[0])}, ${this.parseInputPort(inputPorts[1])});\n`;
          code += this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id), includeDebugSteps);
          break;

        case 'playsound':
        case 'playsoundfx':
        case 'playsfx':
          code += `playSound(${this.parseInputPort(inputPorts[0])});\n`;
          code += this.traverseExecutionFlow(this.getNextNode(nextPorts[0]?.id), includeDebugSteps);
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
    } else if (node.type === 'comment') {
      // Comments are skipped in execution flow
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
      if (port.dataType === 'array' && Array.isArray(port.value)) {
        return `[${port.value.map((v) => (typeof v === 'string' ? `"${v}"` : String(v))).join(', ')}]`;
      }
      if (rawVal === '') return '0';
      if (isNaN(Number(rawVal)) && rawVal !== 'true' && rawVal !== 'false' && !rawVal.startsWith('"') && !rawVal.startsWith('[')) {
        return `"${rawVal}"`;
      }
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
        // Arithmetic
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

        // Math builtins
        case 'random':
        case 'random(min,max)':
          return `random(${this.parseInputPort(sourceInputs[0])}, ${this.parseInputPort(sourceInputs[1])})`;
        case 'round':
          return `round(${this.parseInputPort(sourceInputs[0])})`;
        case 'floor':
          return `floor(${this.parseInputPort(sourceInputs[0])})`;
        case 'ceil':
          return `ceil(${this.parseInputPort(sourceInputs[0])})`;
        case 'abs':
        case 'absolutevalue':
          return `abs(${this.parseInputPort(sourceInputs[0])})`;
        case 'min':
          return `min(${this.parseInputPort(sourceInputs[0])}, ${this.parseInputPort(sourceInputs[1])})`;
        case 'max':
          return `max(${this.parseInputPort(sourceInputs[0])}, ${this.parseInputPort(sourceInputs[1])})`;
        case 'power':
        case 'power(a^b)':
          return `power(${this.parseInputPort(sourceInputs[0])}, ${this.parseInputPort(sourceInputs[1])})`;
        case 'sqrt':
        case 'squareroot':
          return `sqrt(${this.parseInputPort(sourceInputs[0])})`;

        // Strings
        case 'concat':
        case 'concatstrings':
          return `concat(${this.parseInputPort(sourceInputs[0])}, ${this.parseInputPort(sourceInputs[1])})`;
        case 'stringlength':
          return `length(${this.parseInputPort(sourceInputs[0])})`;
        case 'substring':
          return `substring(${this.parseInputPort(sourceInputs[0])}, ${this.parseInputPort(sourceInputs[1])}, ${this.parseInputPort(sourceInputs[2])})`;
        case 'toupper':
        case 'touppercase':
          return `toUpper(${this.parseInputPort(sourceInputs[0])})`;
        case 'tolower':
        case 'tolowercase':
          return `toLower(${this.parseInputPort(sourceInputs[0])})`;

        // Arrays
        case 'createarray':
          return `[${sourceInputs.map((i) => this.parseInputPort(i)).join(', ')}]`;
        case 'arrayget':
        case 'getitem[i]':
        case 'getarrayitem':
          return `(${this.parseInputPort(sourceInputs[0])}[${this.parseInputPort(sourceInputs[1])}])`;
        case 'arraylength':
          return `length(${this.parseInputPort(sourceInputs[0])})`;
        case 'arraypop':
          return `pop(${this.parseInputPort(sourceInputs[0])})`;

        // I/O
        case 'input':
        case 'inputprompt':
          return `input(${this.parseInputPort(sourceInputs[0])})`;

        // Logic & Comparison
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
        case 'contains':
          return `contains(${this.parseInputPort(sourceInputs[0])}, ${this.parseInputPort(sourceInputs[1])})`;

        // Constants
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

import { describe, it, expect } from 'vitest';
import { executeVisLang } from '../src/interpreter/runtime.js';
import { CodeGenerator } from '../src/compiler/generator.js';
import {
  createNodeFromTemplate,
  createVariableNode,
  createFunctionNode,
  createFunctionEntryNode,
  createReturnNode,
} from '../src/canvas/nodeTemplates.js';
import { WireData, FunctionData } from '../src/types/flow.js';

describe('VisLang Interpreter Runtime', () => {
  it('executes basic arithmetic and prints output', () => {
    const code = `
      a = 15;
      b = 25;
      sum = (a + b);
      println(sum);
    `;
    const res = executeVisLang(code);
    expect(res.success).toBe(true);
    expect(res.output).toEqual(['40\n']);
  });

  it('handles functions and conditionals', () => {
    const code = `
      fun doubleVal(x) {
          return (x * 2);
      }

      val = doubleVal(21);
      if (val > 40) {
          println("Passed");
      } else {
          println("Failed");
      }
    `;
    const res = executeVisLang(code);
    expect(res.success).toBe(true);
    expect(res.output).toEqual(['Passed\n']);
  });

  it('handles while loops', () => {
    const code = `
      i = 0;
      while (i < 3) {
          println(i);
          i = (i + 1);
      }
    `;
    const res = executeVisLang(code);
    expect(res.success).toBe(true);
    expect(res.output).toEqual(['0\n', '1\n', '2\n']);
  });
});

describe('Graph Code Generator', () => {
  it('generates VisLang script from Start and Println nodes', () => {
    const startNode = createNodeFromTemplate('start', { x: 100, y: 100 });
    const printNode = createNodeFromTemplate('println', { x: 300, y: 100 });
    const strNode = createNodeFromTemplate('string', { x: 100, y: 300 });

    const startNextPort = Object.values(startNode.next)[0].id;
    const printPrevPort = Object.values(printNode.previous)[0].id;
    const strOutPort = Object.values(strNode.output)[0].id;
    const printInPort = Object.values(printNode.input)[0].id;

    const wires: WireData[] = [
      { id: 'w1', originPortId: startNextPort, targetPortId: printPrevPort },
      { id: 'w2', originPortId: strOutPort, targetPortId: printInPort },
    ];

    const generator = new CodeGenerator([startNode, printNode, strNode], wires);
    const code = generator.generate();

    expect(code).toContain('println("Hello");');
  });

  it('generates VisLang script for 2 Numbers connected to Add and Println', () => {
    const startNode = createNodeFromTemplate('start', { x: 100, y: 100 });
    const printNode = createNodeFromTemplate('println', { x: 500, y: 100 });
    const addNode = createNodeFromTemplate('add', { x: 300, y: 100 });
    const num1Node = createNodeFromTemplate('number', { x: 100, y: 250 });
    const num2Node = createNodeFromTemplate('number', { x: 100, y: 350 });

    // Set custom values on the Number nodes
    num1Node.input[0].value = 15;
    num2Node.input[0].value = 25;

    const startNextPort = Object.values(startNode.next)[0].id;
    const printPrevPort = Object.values(printNode.previous)[0].id;
    const num1OutPort = Object.values(num1Node.output)[0].id;
    const num2OutPort = Object.values(num2Node.output)[0].id;
    const addInPortA = Object.values(addNode.input)[0].id;
    const addInPortB = Object.values(addNode.input)[1].id;
    const addOutPort = Object.values(addNode.output)[0].id;
    const printInPort = Object.values(printNode.input)[0].id;

    const wires: WireData[] = [
      { id: 'w1', originPortId: startNextPort, targetPortId: printPrevPort },
      { id: 'w2', originPortId: num1OutPort, targetPortId: addInPortA },
      { id: 'w3', originPortId: num2OutPort, targetPortId: addInPortB },
      { id: 'w4', originPortId: addOutPort, targetPortId: printInPort },
    ];

    const generator = new CodeGenerator([startNode, printNode, addNode, num1Node, num2Node], wires);
    const code = generator.generate();

    expect(code).toContain('println((15 + 25));');
    const result = executeVisLang(code);
    expect(result.success).toBe(true);
    expect(result.output).toEqual(['40\n']);
  });

  it('generates and executes VisLang script with Variables (setter and getter)', () => {
    const startNode = createNodeFromTemplate('start', { x: 100, y: 100 });
    const printNode = createNodeFromTemplate('println', { x: 500, y: 100 });
    const varSetterNode = createVariableNode('score', 'number', 50, { x: 300, y: 100 });
    const varGetterNode = createVariableNode('score', 'number', 50, { x: 300, y: 250 });

    const startNext = Object.values(startNode.next)[0].id;
    const varSetterPrev = Object.values(varSetterNode.previous)[0].id;
    const varSetterNext = Object.values(varSetterNode.next)[0].id;
    const printPrev = Object.values(printNode.previous)[0].id;
    const varGetterOut = Object.values(varGetterNode.output)[0].id;
    const printIn = Object.values(printNode.input)[0].id;

    const wires: WireData[] = [
      { id: 'w1', originPortId: startNext, targetPortId: varSetterPrev },
      { id: 'w2', originPortId: varSetterNext, targetPortId: printPrev },
      { id: 'w3', originPortId: varGetterOut, targetPortId: printIn },
    ];

    const variables = [{ name: 'score', dataType: 'number' as const, value: 0 }];

    const generator = new CodeGenerator([startNode, varSetterNode, varGetterNode, printNode], wires, variables);
    const code = generator.generate();

    expect(code).toContain('score = 0;');
    expect(code).toContain('score = 50;');
    expect(code).toContain('println(score);');

    const result = executeVisLang(code);
    expect(result.success).toBe(true);
    expect(result.output).toEqual(['50\n']);
  });

  it('generates and executes VisLang script with user defined Functions', () => {
    const fnDefCode = `
      fun multiplyByTwo(x) {
          return (x * 2);
      }

      ans = multiplyByTwo(21);
      println(ans);
    `;

    const result = executeVisLang(fnDefCode);
    expect(result.success).toBe(true);
    expect(result.output).toEqual(['42\n']);
  });

  it('compiles Function Sub-Graphs (Entry -> Math -> Return) and calls them from Main Graph', () => {
    // 1. Function Sub-Graph: calculateArea(w, h) -> return (w * h)
    const entryNode = createFunctionEntryNode('calculateArea', ['w', 'h'], { x: 100, y: 150 });
    const multNode = createNodeFromTemplate('multiply', { x: 300, y: 200 });
    const returnNode = createReturnNode({ x: 500, y: 150 });

    const entryNext = Object.values(entryNode.next)[0].id;
    const entryOutW = Object.values(entryNode.output)[0].id;
    const entryOutH = Object.values(entryNode.output)[1].id;
    const multInA = Object.values(multNode.input)[0].id;
    const multInB = Object.values(multNode.input)[1].id;
    const multOut = Object.values(multNode.output)[0].id;
    const returnPrev = Object.values(returnNode.previous)[0].id;
    const returnIn = Object.values(returnNode.input)[0].id;

    const fnWires: WireData[] = [
      { id: 'fw1', originPortId: entryNext, targetPortId: returnPrev },
      { id: 'fw2', originPortId: entryOutW, targetPortId: multInA },
      { id: 'fw3', originPortId: entryOutH, targetPortId: multInB },
      { id: 'fw4', originPortId: multOut, targetPortId: returnIn },
    ];

    const fnData: FunctionData = {
      name: 'calculateArea',
      params: [
        { name: 'w', dataType: 'number' },
        { name: 'h', dataType: 'number' },
      ],
      nodes: [entryNode, multNode, returnNode],
      wires: fnWires,
    };

    // 2. Main Graph: Start -> calculateArea(w=6, h=7) -> Println(calculateArea.Result)
    const startNode = createNodeFromTemplate('start', { x: 100, y: 100 });
    const fnCallNode = createFunctionNode('calculateArea', ['w', 'h'], { x: 300, y: 100 });
    fnCallNode.input[0].value = 6;
    fnCallNode.input[1].value = 7;

    const printNode = createNodeFromTemplate('println', { x: 550, y: 100 });

    const startNext = Object.values(startNode.next)[0].id;
    const fnCallPrev = Object.values(fnCallNode.previous)[0].id;
    const fnCallNext = Object.values(fnCallNode.next)[0].id;
    const fnCallOut = Object.values(fnCallNode.output)[0].id;
    const printPrev = Object.values(printNode.previous)[0].id;
    const printIn = Object.values(printNode.input)[0].id;

    const mainWires: WireData[] = [
      { id: 'mw1', originPortId: startNext, targetPortId: fnCallPrev },
      { id: 'mw2', originPortId: fnCallNext, targetPortId: printPrev },
      { id: 'mw3', originPortId: fnCallOut, targetPortId: printIn },
    ];

    const generator = new CodeGenerator([startNode, fnCallNode, printNode], mainWires, [], [fnData]);
    const generatedCode = generator.generate();

    expect(generatedCode).toContain('fun calculateArea(w, h) {');
    expect(generatedCode).toContain('return (w * h);');
    expect(generatedCode).toContain('calculateArea(6, 7);');
    expect(generatedCode).toContain('println(calculateArea(6, 7));');

    const result = executeVisLang(generatedCode);
    expect(result.success).toBe(true);
    expect(result.output).toEqual(['42\n']);
  });

  it('compiles Function Sub-Graphs when Return node is connected purely via data wire without explicit Exec wire', () => {
    // 1. Function Sub-Graph: doubleNum(x) -> return (x * 2) (ONLY data wires connected!)
    const entryNode = createFunctionEntryNode('doubleNum', ['x'], { x: 100, y: 150 });
    const multNode = createNodeFromTemplate('multiply', { x: 300, y: 200 });
    const num2Node = createNodeFromTemplate('number', { x: 300, y: 350 });
    num2Node.input[0].value = 2;
    const returnNode = createReturnNode({ x: 500, y: 150 });

    const entryOutX = Object.values(entryNode.output)[0].id;
    const multInA = Object.values(multNode.input)[0].id;
    const multInB = Object.values(multNode.input)[1].id;
    const num2Out = Object.values(num2Node.output)[0].id;
    const multOut = Object.values(multNode.output)[0].id;
    const returnIn = Object.values(returnNode.input)[0].id;

    // Notice: NO Exec wires inside the function! Pure data graph!
    const fnWires: WireData[] = [
      { id: 'fw1', originPortId: entryOutX, targetPortId: multInA },
      { id: 'fw2', originPortId: num2Out, targetPortId: multInB },
      { id: 'fw3', originPortId: multOut, targetPortId: returnIn },
    ];

    const fnData: FunctionData = {
      name: 'doubleNum',
      params: [{ name: 'x', dataType: 'number' }],
      nodes: [entryNode, multNode, num2Node, returnNode],
      wires: fnWires,
    };

    // 2. Main Graph: Start -> Println(doubleNum(21))
    const startNode = createNodeFromTemplate('start', { x: 100, y: 100 });
    const fnCallNode = createFunctionNode('doubleNum', ['x'], { x: 300, y: 250 });
    fnCallNode.input[0].value = 21;
    const printNode = createNodeFromTemplate('println', { x: 500, y: 100 });

    const startNext = Object.values(startNode.next)[0].id;
    const printPrev = Object.values(printNode.previous)[0].id;
    const fnCallOut = Object.values(fnCallNode.output)[0].id;
    const printIn = Object.values(printNode.input)[0].id;

    const mainWires: WireData[] = [
      { id: 'mw1', originPortId: startNext, targetPortId: printPrev },
      { id: 'mw2', originPortId: fnCallOut, targetPortId: printIn },
    ];

    const generator = new CodeGenerator([startNode, fnCallNode, printNode], mainWires, [], [fnData]);
    const generatedCode = generator.generate();

    expect(generatedCode).toContain('fun doubleNum(x) {');
    expect(generatedCode).toContain('return (x * 2);');
    expect(generatedCode).toContain('println(doubleNum(21));');

    const result = executeVisLang(generatedCode);
    expect(result.success).toBe(true);
    expect(result.output).toEqual(['42\n']);
  });
});

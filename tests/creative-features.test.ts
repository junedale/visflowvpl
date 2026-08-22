import { describe, it, expect, beforeEach } from 'vitest';
import { executeVisLang } from '../src/interpreter/runtime.js';
import { drawingStore } from '../src/renderer/stores/drawingStore.js';
import { CodeGenerator } from '../src/compiler/generator.js';
import { calculateAutoLayout } from '../src/canvas/autoLayout.js';
import { createNodeFromTemplate } from '../src/canvas/nodeTemplates.js';
import { get } from 'svelte/store';

describe('Turtle Graphics & Drawing Engine', () => {
  beforeEach(() => {
    drawingStore.reset();
  });

  it('draws forward lines and updates heading', async () => {
    const res = await executeVisLang(`
      forward(100);
      turnRight(90);
      forward(50);
    `);

    expect(res.success).toBe(true);
    const state = get(drawingStore);
    expect(state.commands.length).toBe(2);
    expect(state.heading).toBe(0); // started facing 90 (North), turned right 90 -> 0 (East)
    expect(state.commands[0].type).toBe('line');
  });

  it('draws geometric shapes (circle, rect)', async () => {
    const res = await executeVisLang(`
      drawCircle(25);
      drawRect(50, 50);
    `);

    expect(res.success).toBe(true);
    const state = get(drawingStore);
    expect(state.commands.length).toBe(2);
    expect(state.commands[0].type).toBe('circle');
    expect(state.commands[0].radius).toBe(25);
    expect(state.commands[1].type).toBe('rect');
    expect(state.commands[1].width).toBe(50);
  });

  it('handles pen color, size, and clearCanvas', async () => {
    const res = await executeVisLang(`
      setPenColor("#ff0000");
      setPenSize(5);
      forward(20);
      clearCanvas();
    `);

    expect(res.success).toBe(true);
    const state = get(drawingStore);
    expect(state.commands.length).toBe(0);
    expect(state.penColor).toBe('#ff0000');
    expect(state.penSize).toBe(5);
  });
});

describe('WebAudio Builtins Execution', () => {
  it('evaluates playSound, playNote, and playTone without throwing', async () => {
    const res = await executeVisLang(`
      playSound("coin");
      playNote("C4", 100);
      playTone(440, 50);
    `);
    expect(res.success).toBe(true);
  });
});

describe('Code Generator for Creative & Audio Nodes', () => {
  it('generates correct VisLang code for turtle and audio nodes', () => {
    const start = createNodeFromTemplate('start', { x: 0, y: 0 });
    const fwd = createNodeFromTemplate('forward', { x: 200, y: 0 });
    fwd.input[0].value = 75;

    const sfx = createNodeFromTemplate('playsound', { x: 400, y: 0 });
    sfx.input[0].value = 'win';

    const wires = [
      { id: 'w1', originPortId: Object.values(start.next)[0].id, targetPortId: Object.values(fwd.previous)[0].id },
      { id: 'w2', originPortId: Object.values(fwd.next)[0].id, targetPortId: Object.values(sfx.previous)[0].id },
    ];

    const generator = new CodeGenerator([start, fwd, sfx], wires, [], []);
    const code = generator.generate(false);

    expect(code).toContain('forward(75);');
    expect(code).toContain('playSound("win");');
  });
});

describe('Graph Auto-Layout Beautifier Algorithm', () => {
  it('calculates hierarchical left-to-right columns for connected nodes', () => {
    const start = createNodeFromTemplate('start', { x: 500, y: 500 });
    const n1 = createNodeFromTemplate('println', { x: 100, y: 100 });
    const n2 = createNodeFromTemplate('sleep', { x: 50, y: 50 });

    const wires = [
      { id: 'w1', originPortId: Object.values(start.next)[0].id, targetPortId: Object.values(n1.previous)[0].id },
      { id: 'w2', originPortId: Object.values(n1.next)[0].id, targetPortId: Object.values(n2.previous)[0].id },
    ];

    const positions = calculateAutoLayout([start, n1, n2], wires);
    expect(positions.length).toBe(3);

    const posMap = new Map(positions.map((p) => [p.id, p.position]));
    expect(posMap.get(start.id)!.x).toBeLessThan(posMap.get(n1.id)!.x);
    expect(posMap.get(n1.id)!.x).toBeLessThan(posMap.get(n2.id)!.x);
  });
});

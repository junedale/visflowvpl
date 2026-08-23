import { describe, expect, it } from 'vitest';
import { GraphValidator } from '../src/compiler/validator.js';
import { createNodeFromTemplate } from '../src/canvas/nodeTemplates.js';

describe('GraphValidator diagnostics', () => {
  it('reports an actionable error when Start has no execution connection', () => {
    const start = createNodeFromTemplate('start');

    const issues = GraphValidator.validate([start], [], [], []);

    expect(issues).toContainEqual(expect.objectContaining({
      id: `unconnected-start:${start.id}`,
      type: 'error',
      nodeId: start.id,
      suggestion: expect.stringContaining('Drag from Start'),
    }));
  });

  it('associates unfilled inputs with their node and port', () => {
    const print = createNodeFromTemplate('println');
    print.input[0].value = '';

    const issues = GraphValidator.validate([print], [], [], []);

    expect(issues).toContainEqual(expect.objectContaining({
      id: `unfilled-input:${print.id}:${print.input[0].id}`,
      type: 'warning',
      nodeId: print.id,
      portId: print.input[0].id,
    }));
  });
});

import { describe, expect, it } from 'vitest';
import { CodeRunner } from '../src/interpreter/runner.js';

describe('CodeRunner breakpoints', () => {
  it('pauses before a matching node and continues on step', async () => {
    const runner = new CodeRunner();
    const pauses: string[] = [];
    let releasePause: (() => void) | undefined;
    const paused = new Promise<void>((resolve) => { releasePause = resolve; });

    const execution = runner.run('__step__("node_print"); println("done");', {
      shouldPauseAtNode: (nodeId) => nodeId === 'node_print',
      onNodePause: (nodeId, _env, reason) => {
        pauses.push(`${reason}:${nodeId}`);
        releasePause?.();
      },
    });

    await paused;
    expect(pauses).toEqual(['breakpoint:node_print']);
    runner.stepNext();

    const result = await execution;
    expect(result.success).toBe(true);
    expect(result.output).toEqual(['done\n']);
  });
});

import { executeVisLang, ExecutionResult } from './runtime.js';

export interface RunOptions {
  onOutput?: (chunk: string) => void;
  onError?: (error: string) => void;
  onNodeStep?: (nodeId: string, env: Record<string, any>) => void;
  onNodePause?: (nodeId: string, env: Record<string, any>, reason: 'step' | 'breakpoint') => void;
  shouldPauseAtNode?: (nodeId: string) => boolean;
  onVariableChange?: (name: string, value: any) => void;
  onPromptInput?: (prompt: string) => void;
  maxIterations?: number;
  speedMs?: number; // 0 = instant, >0 = delay in ms, -1 = step-by-step manual
}

export class CodeRunner {
  private isCancelled: boolean = false;
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private currentSpeedMs: number = 0;
  private stepResolver: (() => void) | null = null;
  private inputResolver: ((value: string) => void) | null = null;

  public async run(code: string, options: RunOptions = {}): Promise<ExecutionResult> {
    if (this.isRunning) {
      throw new Error('A program is already running.');
    }

    this.isRunning = true;
    this.isCancelled = false;
    this.isPaused = false;
    this.currentSpeedMs = options.speedMs ?? 0;
    this.stepResolver = null;
    this.inputResolver = null;

    try {
      const result = await executeVisLang(code, {
        onPrint: (val) => options.onOutput?.(val),
        onPrintln: (val) => options.onOutput?.(val + '\n'),
        onVariableChange: (name, val) => options.onVariableChange?.(name, val),
        onStep: async (context) => {
          if (this.isCancelled) {
            throw new Error('Execution stopped by user.');
          }

          if (context.name) {
            options.onNodeStep?.(context.name, context.env);
          }

          const pauseAtBreakpoint = Boolean(context.name && options.shouldPauseAtNode?.(context.name));
          const pauseForStep = this.currentSpeedMs === -1 || this.isPaused;
          if (pauseAtBreakpoint || pauseForStep) {
            if (context.name) {
              options.onNodePause?.(context.name, context.env, pauseAtBreakpoint ? 'breakpoint' : 'step');
            }
            await new Promise<void>((resolve) => {
              this.stepResolver = resolve;
            });
          } else if (this.currentSpeedMs > 0) {
            await new Promise<void>((resolve) => {
              const timer = setTimeout(resolve, this.currentSpeedMs);
              this.stepResolver = () => {
                clearTimeout(timer);
                resolve();
              };
            });
          }
        },
        onInput: async (promptText) => {
          if (this.isCancelled) {
            throw new Error('Execution stopped by user.');
          }
          options.onPromptInput?.(promptText);
          return new Promise<string>((resolve) => {
            this.inputResolver = resolve;
          });
        },
        onSleep: async (ms) => {
          if (this.isCancelled) {
            throw new Error('Execution stopped by user.');
          }
          await new Promise<void>((resolve) => {
            const timer = setTimeout(resolve, Math.max(10, ms));
            this.stepResolver = () => {
              clearTimeout(timer);
              resolve();
            };
          });
        },
        maxIterations: options.maxIterations ?? 200000,
        isCancelled: () => this.isCancelled,
      });

      if (!result.success && result.errors.length > 0) {
        result.errors.forEach((err) => options.onError?.(err));
      }

      this.isRunning = false;
      return result;
    } catch (err: any) {
      const errorMsg = err.message || String(err);
      options.onError?.(errorMsg);
      this.isRunning = false;
      return {
        success: false,
        errors: [errorMsg],
        output: [],
        executionTimeMs: 0,
      };
    }
  }

  public stepNext(): void {
    if (this.stepResolver) {
      const res = this.stepResolver;
      this.stepResolver = null;
      res();
    }
  }

  public pause(): void {
    this.isPaused = true;
  }

  public resume(): void {
    this.isPaused = false;
    this.stepNext();
  }

  public setSpeed(speedMs: number): void {
    this.currentSpeedMs = speedMs;
    if (speedMs >= 0 && this.isPaused) {
      this.resume();
    }
  }

  public provideInput(value: string): void {
    if (this.inputResolver) {
      const res = this.inputResolver;
      this.inputResolver = null;
      res(value);
    }
  }

  public stop(): void {
    if (this.isRunning) {
      this.isCancelled = true;
      this.isRunning = false;
      this.isPaused = false;
      if (this.stepResolver) {
        this.stepResolver();
        this.stepResolver = null;
      }
      if (this.inputResolver) {
        this.inputResolver('');
        this.inputResolver = null;
      }
    }
  }

  public get running(): boolean {
    return this.isRunning;
  }

  public get paused(): boolean {
    return this.isPaused;
  }
}

export const globalRunner = new CodeRunner();

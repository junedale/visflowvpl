import { executeVisLang, ExecutionResult } from './runtime.js';

export interface RunOptions {
  onOutput?: (chunk: string) => void;
  onError?: (error: string) => void;
  maxIterations?: number;
}

export class CodeRunner {
  private isCancelled: boolean = false;
  private isRunning: boolean = false;

  public run(code: string, options: RunOptions = {}): Promise<ExecutionResult> {
    if (this.isRunning) {
      throw new Error('A program is already running.');
    }

    this.isRunning = true;
    this.isCancelled = false;

    return new Promise((resolve) => {
      // Execute asynchronously to allow UI to breathe
      setTimeout(() => {
        try {
          const result = executeVisLang(code, {
            onPrint: (val) => options.onOutput?.(val),
            onPrintln: (val) => options.onOutput?.(val + '\n'),
            maxIterations: options.maxIterations ?? 200000,
            isCancelled: () => this.isCancelled,
          });

          if (!result.success && result.errors.length > 0) {
            result.errors.forEach((err) => options.onError?.(err));
          }

          this.isRunning = false;
          resolve(result);
        } catch (err: any) {
          const errorMsg = err.message || String(err);
          options.onError?.(errorMsg);
          this.isRunning = false;
          resolve({
            success: false,
            errors: [errorMsg],
            output: [],
            executionTimeMs: 0,
          });
        }
      }, 10);
    });
  }

  public stop(): void {
    if (this.isRunning) {
      this.isCancelled = true;
      this.isRunning = false;
    }
  }

  public get running(): boolean {
    return this.isRunning;
  }
}

export const globalRunner = new CodeRunner();

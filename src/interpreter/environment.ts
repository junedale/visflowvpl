export class Environment {
  private values: Map<string, any> = new Map();
  private parent: Environment | null = null;
  public onAssign?: (name: string, value: any) => void;

  constructor(parent: Environment | null = null, onAssign?: (name: string, value: any) => void) {
    this.parent = parent;
    this.onAssign = onAssign || parent?.onAssign;
  }

  public define(name: string, value: any): void {
    this.values.set(name, value);
    this.onAssign?.(name, value);
  }

  public assign(name: string, value: any): void {
    if (this.values.has(name)) {
      this.values.set(name, value);
      this.onAssign?.(name, value);
      return;
    }
    if (this.parent !== null) {
      this.parent.assign(name, value);
      return;
    }
    this.values.set(name, value);
    this.onAssign?.(name, value);
  }

  public get(name: string): any {
    if (this.values.has(name)) {
      return this.values.get(name);
    }
    if (this.parent !== null) {
      return this.parent.get(name);
    }
    return undefined;
  }

  public has(name: string): boolean {
    if (this.values.has(name)) return true;
    if (this.parent !== null) return this.parent.has(name);
    return false;
  }

  public getAll(): Record<string, any> {
    const res: Record<string, any> = this.parent ? this.parent.getAll() : {};
    for (const [k, v] of this.values.entries()) {
      if (typeof v !== 'object' || v === null || Array.isArray(v)) {
        res[k] = v;
      }
    }
    return res;
  }
}

export interface VisFunction {
  name: string;
  params: string[];
  blockCtx: any;
  closure: Environment;
}

export class ReturnSignal {
  constructor(public value: any) {}
}

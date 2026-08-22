export class Environment {
  private values: Map<string, any> = new Map();
  private parent: Environment | null = null;

  constructor(parent: Environment | null = null) {
    this.parent = parent;
  }

  public define(name: string, value: any): void {
    this.values.set(name, value);
  }

  public assign(name: string, value: any): void {
    if (this.values.has(name)) {
      this.values.set(name, value);
      return;
    }
    if (this.parent !== null) {
      this.parent.assign(name, value);
      return;
    }
    this.values.set(name, value);
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

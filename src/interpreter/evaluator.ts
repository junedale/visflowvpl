import { VisLangVisitor } from './generated/VisLangVisitor.js';
import {
  ProgramContext,
  BodyContext,
  DeclarationContext,
  FunDeclContext,
  ParamsContext,
  StatementContext,
  IfStatementContext,
  IfStatContext,
  ElifStatContext,
  ElseStatContext,
  DoWhileStatContext,
  WhileStatContext,
  ForStatContext,
  CallStatContext,
  PrintContext,
  PrintlnContext,
  FunCallContext,
  BlockContext,
  ReturnStatementContext,
  IdentifierContext,
  BinaryMulContext,
  ComparisonContext,
  IntLiteralContext,
  LogicalAndContext,
  FunCallExprContext,
  AssignActionContext,
  NullContext,
  StringLiteralContext,
  GroupingsContext,
  UnaryMinContext,
  DoubleLiteralContext,
  LogicalOrContext,
  BooleanLiteralContext,
  EqualityContext,
  UnaryNotContext,
  BinaryAddContext,
  VariableAssignmentContext,
  ArrayAssignmentContext,
  IndexAccessContext,
  ArrayLiteralContext,
} from './generated/VisLangParser.js';
import { Environment, VisFunction, ReturnSignal } from './environment.js';
import { drawingStore } from '../renderer/stores/drawingStore.js';
import { audioService } from '../audio/audioService.js';

export interface EvaluatorOptions {
  onPrint?: (value: string) => void;
  onPrintln?: (value: string) => void;
  onInput?: (prompt: string) => Promise<string> | string;
  onSleep?: (ms: number) => Promise<void> | void;
  onStep?: (context: { line: number; name?: string; env: Record<string, any> }) => Promise<void> | void;
  onVariableChange?: (name: string, value: any) => void;
  maxIterations?: number;
  isCancelled?: () => boolean;
}

export class VisLangEvaluator extends VisLangVisitor<any> {
  private globalEnv: Environment;
  private currentEnv: Environment;
  private onPrint: (value: string) => void;
  private onPrintln: (value: string) => void;
  private onInput?: (prompt: string) => Promise<string> | string;
  private onSleep?: (ms: number) => Promise<void> | void;
  private onStep?: (context: { line: number; name?: string; env: Record<string, any> }) => Promise<void> | void;
  private onVariableChange?: (name: string, value: any) => void;
  private maxIterations: number;
  private isCancelled: () => boolean;
  private iterationCount: number = 0;

  constructor(options: EvaluatorOptions = {}) {
    super();
    this.onVariableChange = options.onVariableChange;
    this.globalEnv = new Environment(null, (name, value) => {
      this.onVariableChange?.(name, value);
    });
    this.currentEnv = this.globalEnv;
    this.onPrint = options.onPrint || ((val) => console.log(val));
    this.onPrintln = options.onPrintln || ((val) => console.log(val));
    this.onInput = options.onInput;
    this.onSleep = options.onSleep;
    this.onStep = options.onStep;
    this.maxIterations = options.maxIterations || 100000;
    this.isCancelled = options.isCancelled || (() => false);

    this.registerBuiltins();
  }

  private registerBuiltins(): void {
    // Builtin functions can be called like standard functions
    const builtins: Record<string, Function> = {
      // Math
      abs: (x: any) => Math.abs(Number(x)),
      round: (x: any) => Math.round(Number(x)),
      floor: (x: any) => Math.floor(Number(x)),
      ceil: (x: any) => Math.ceil(Number(x)),
      min: (a: any, b: any) => Math.min(Number(a), Number(b)),
      max: (a: any, b: any) => Math.max(Number(a), Number(b)),
      pow: (a: any, b: any) => Math.pow(Number(a), Number(b)),
      power: (a: any, b: any) => Math.pow(Number(a), Number(b)),
      sqrt: (x: any) => Math.sqrt(Number(x)),
      random: (min?: any, max?: any) => {
        if (min !== undefined && max !== undefined) {
          const lo = Math.min(Number(min), Number(max));
          const hi = Math.max(Number(min), Number(max));
          return Math.floor(Math.random() * (hi - lo + 1)) + lo;
        }
        if (min !== undefined) {
          return Math.floor(Math.random() * Number(min));
        }
        return Math.random();
      },

      // String
      length: (s: any) => (Array.isArray(s) ? s.length : String(s ?? '').length),
      len: (s: any) => (Array.isArray(s) ? s.length : String(s ?? '').length),
      substring: (s: any, start: any, end?: any) => {
        const str = String(s ?? '');
        return end !== undefined ? str.substring(Number(start), Number(end)) : str.substring(Number(start));
      },
      toUpper: (s: any) => String(s ?? '').toUpperCase(),
      toLower: (s: any) => String(s ?? '').toLowerCase(),
      concat: (...args: any[]) => args.map((a) => String(a ?? '')).join(''),
      contains: (container: any, item: any) => {
        if (Array.isArray(container)) return container.includes(item);
        return String(container ?? '').includes(String(item ?? ''));
      },
      startsWith: (s: any, prefix: any) => String(s ?? '').startsWith(String(prefix ?? '')),
      endsWith: (s: any, suffix: any) => String(s ?? '').endsWith(String(suffix ?? '')),
      toNumber: (s: any) => Number(s),
      toString: (s: any) => String(s),

      // Array
      push: (arr: any, val: any) => {
        if (Array.isArray(arr)) {
          arr.push(val);
          return arr;
        }
        return [val];
      },
      pop: (arr: any) => {
        if (Array.isArray(arr)) {
          return arr.pop();
        }
        return null;
      },
      insert: (arr: any, idx: any, val: any) => {
        if (Array.isArray(arr)) {
          arr.splice(Number(idx), 0, val);
          return arr;
        }
        return [val];
      },
      removeAt: (arr: any, idx: any) => {
        if (Array.isArray(arr)) {
          return arr.splice(Number(idx), 1)[0];
        }
        return null;
      },
      slice: (arr: any, start: any, end?: any) => {
        if (Array.isArray(arr)) {
          return end !== undefined ? arr.slice(Number(start), Number(end)) : arr.slice(Number(start));
        }
        return [];
      },
      join: (arr: any, sep?: any) => {
        if (Array.isArray(arr)) return arr.join(sep !== undefined ? String(sep) : ', ');
        return String(arr ?? '');
      },

      // Turtle Graphics
      forward: (d: any) => { drawingStore.forward(Number(d)); return Number(d); },
      backward: (d: any) => { drawingStore.backward(Number(d)); return Number(d); },
      turnRight: (deg: any) => { drawingStore.turnRight(Number(deg)); return Number(deg); },
      turnLeft: (deg: any) => { drawingStore.turnLeft(Number(deg)); return Number(deg); },
      penDown: () => { drawingStore.setPenDown(true); return true; },
      penUp: () => { drawingStore.setPenDown(false); return false; },
      setPenColor: (c: any) => { drawingStore.setPenColor(String(c)); return String(c); },
      setPenSize: (s: any) => { drawingStore.setPenSize(Number(s)); return Number(s); },
      drawCircle: (r: any, fill?: any) => { drawingStore.drawCircle(Number(r), Boolean(fill)); return Number(r); },
      drawRect: (w: any, h: any, fill?: any) => { drawingStore.drawRect(Number(w), Number(h), Boolean(fill)); return true; },
      clearCanvas: () => { drawingStore.clearCanvas(); return true; },
      resetTurtle: () => { drawingStore.reset(); return true; },

      // WebAudio Sound & Notes
      playTone: async (f: any, d?: any, w?: any) => {
        await audioService.playTone(Number(f), d !== undefined ? Number(d) : 200, (w || 'sine') as OscillatorType);
        return true;
      },
      playNote: async (n: any, d?: any, w?: any) => {
        await audioService.playNote(String(n), d !== undefined ? Number(d) : 250, (w || 'triangle') as OscillatorType);
        return true;
      },
      playSound: async (name: any) => {
        await audioService.playSound(String(name));
        return true;
      },
    };

    for (const [name, fn] of Object.entries(builtins)) {
      this.globalEnv.define(name, {
        name,
        isBuiltin: true,
        handler: fn,
      });
    }
  }

  private checkLoop(): void {
    if (this.isCancelled()) {
      throw new Error('Execution stopped by user.');
    }
    this.iterationCount++;
    if (this.iterationCount > this.maxIterations) {
      throw new Error(`Execution limit exceeded (${this.maxIterations} iterations). Possible infinite loop.`);
    }
  }

  public visitProgram = async (ctx: ProgramContext): Promise<any> => {
    return await this.visit(ctx.body());
  };

  public visitBody = async (ctx: BodyContext): Promise<any> => {
    let result: any = null;
    for (let i = 0; i < ctx.getChildCount(); i++) {
      const child = ctx.getChild(i);
      if (child) {
        result = await this.visit(child);
      }
    }
    return result;
  };

  public visitDeclaration = async (ctx: DeclarationContext): Promise<any> => {
    return await this.visit(ctx.funDecl());
  };

  public visitFunDecl = async (ctx: FunDeclContext): Promise<any> => {
    const funName = ctx.Identifier().getText();
    const paramsCtx = ctx.params();
    const params: string[] = [];
    if (paramsCtx) {
      const idTokens = paramsCtx.Identifier();
      if (idTokens) {
        for (const id of idTokens) {
          params.push(id.getText());
        }
      }
    }

    const fun: VisFunction = {
      name: funName,
      params,
      blockCtx: ctx.block(),
      closure: this.currentEnv,
    };

    this.globalEnv.define(funName, fun);
    return null;
  };

  public visitStatement = async (ctx: StatementContext): Promise<any> => {
    const assignment = ctx.assignment();
    if (assignment) return await this.visit(assignment);

    const ifStat = ctx.ifStatement();
    if (ifStat) return await this.visit(ifStat);

    const doWhile = ctx.doWhileStat();
    if (doWhile) return await this.visit(doWhile);

    const whileStat = ctx.whileStat();
    if (whileStat) return await this.visit(whileStat);

    const forStat = ctx.forStat();
    if (forStat) return await this.visit(forStat);

    const callStat = ctx.callStat();
    if (callStat) return await this.visit(callStat);

    return null;
  };

  public visitVariableAssignment = async (ctx: VariableAssignmentContext): Promise<any> => {
    const id = ctx.Identifier().getText();
    const exprCtx = ctx.expr();
    const funCallCtx = ctx.funCall();

    let val: any = null;
    if (exprCtx) {
      val = await this.visit(exprCtx);
    } else if (funCallCtx) {
      val = await this.visit(funCallCtx);
    }

    this.currentEnv.assign(id, val);
    return val;
  };

  public visitArrayAssignment = async (ctx: ArrayAssignmentContext): Promise<any> => {
    const id = ctx.Identifier().getText();
    const indexExpr = ctx.expr(0);
    const valExpr = ctx.expr(1);
    const funCallCtx = ctx.funCall();

    const targetArr = this.currentEnv.get(id);
    if (!Array.isArray(targetArr)) {
      throw new Error(`Cannot assign index to non-array variable '${id}'.`);
    }

    if (!indexExpr) {
      throw new Error(`Array index expression missing in assignment to '${id}'.`);
    }

    const idx = Number(await this.visit(indexExpr));
    let val: any = null;
    if (valExpr) {
      val = await this.visit(valExpr);
    } else if (funCallCtx) {
      val = await this.visit(funCallCtx);
    }

    targetArr[idx] = val;
    this.currentEnv.assign(id, targetArr);
    return val;
  };

  public visitIfStatement = async (ctx: IfStatementContext): Promise<any> => {
    const ifStat = ctx.ifStat();
    const ifCond = this.isTruthy(await this.visit(ifStat.expr()));
    if (ifCond) {
      return await this.visit(ifStat.block());
    }

    const elifStats = ctx.elifStat();
    for (const elif of elifStats) {
      const elifCond = this.isTruthy(await this.visit(elif.expr()));
      if (elifCond) {
        return await this.visit(elif.block());
      }
    }

    const elseStat = ctx.elseStat();
    if (elseStat) {
      return await this.visit(elseStat.block());
    }

    return null;
  };

  public visitWhileStat = async (ctx: WhileStatContext): Promise<any> => {
    let result: any = null;
    while (this.isTruthy(await this.visit(ctx.expr()))) {
      this.checkLoop();
      result = await this.visit(ctx.block());
    }
    return result;
  };

  public visitDoWhileStat = async (ctx: DoWhileStatContext): Promise<any> => {
    let result: any = null;
    do {
      this.checkLoop();
      result = await this.visit(ctx.block());
    } while (this.isTruthy(await this.visit(ctx.expr())));
    return result;
  };

  public visitForStat = async (ctx: ForStatContext): Promise<any> => {
    let result: any = null;
    const assignment = ctx.assignment();
    if (assignment) {
      await this.visit(assignment);
      const varName = (assignment as any).Identifier().getText();
      const limitCtx = ctx.Identifier(0) || ctx.Integer(0);
      const limit = limitCtx ? this.resolveValue(limitCtx.getText()) : 0;

      while (this.currentEnv.get(varName) < limit) {
        this.checkLoop();
        result = await this.visit(ctx.block());
        this.currentEnv.assign(varName, this.currentEnv.get(varName) + 1);
      }
    }
    return result;
  };

  public visitCallStat = async (ctx: CallStatContext): Promise<any> => {
    const printCall = ctx.printCall();
    if (printCall) return await this.visit(printCall);

    const funCall = ctx.funCall();
    if (funCall) return await this.visit(funCall);

    return null;
  };

  public visitPrint = async (ctx: PrintContext): Promise<any> => {
    const expr = ctx.expr();
    const val = expr ? await this.visit(expr) : '';
    this.onPrint(this.stringify(val));
    return null;
  };

  public visitPrintln = async (ctx: PrintlnContext): Promise<any> => {
    const expr = ctx.expr();
    const val = expr ? await this.visit(expr) : '';
    this.onPrintln(this.stringify(val));
    return null;
  };

  public visitFunCall = async (ctx: FunCallContext): Promise<any> => {
    const funName = ctx.Identifier().getText();

    // Check debug step hook
    if (funName === '__step__' || funName === 'step') {
      const paramsCtx = ctx.params();
      let stepId = '';
      if (paramsCtx && paramsCtx.expr() && paramsCtx.expr().length > 0) {
        stepId = this.stringify(await this.visit(paramsCtx.expr(0)!)).replace(/^"|"$/g, '');
      } else if (paramsCtx && paramsCtx.Identifier() && paramsCtx.Identifier().length > 0) {
        stepId = paramsCtx.Identifier(0)!.getText();
      }
      if (this.onStep) {
        await this.onStep({
          line: ctx.start?.line ?? 0,
          name: stepId,
          env: this.currentEnv.getAll(),
        });
      }
      return null;
    }

    // Check special I/O builtins
    if (funName === 'input') {
      const paramsCtx = ctx.params();
      let promptText = '';
      if (paramsCtx && paramsCtx.expr() && paramsCtx.expr().length > 0) {
        promptText = this.stringify(await this.visit(paramsCtx.expr(0)!));
      }
      if (this.onInput) {
        return await this.onInput(promptText);
      }
      return promptText ? prompt(promptText) ?? '' : '';
    }

    if (funName === 'sleep') {
      const paramsCtx = ctx.params();
      let ms = 100;
      if (paramsCtx && paramsCtx.expr() && paramsCtx.expr().length > 0) {
        ms = Number(await this.visit(paramsCtx.expr(0)!));
      }
      if (this.onSleep) {
        await this.onSleep(ms);
      }
      return null;
    }

    const fun: any = this.globalEnv.get(funName);

    if (!fun) {
      throw new Error(`Function '${funName}' is not defined.`);
    }

    const args: any[] = [];
    const paramsCtx = ctx.params();
    if (paramsCtx) {
      const exprs = paramsCtx.expr();
      if (exprs && exprs.length > 0) {
        for (const e of exprs) {
          args.push(await this.visit(e));
        }
      } else {
        const ids = paramsCtx.Identifier();
        if (ids) {
          for (const id of ids) {
            args.push(this.currentEnv.get(id.getText()));
          }
        }
      }
    }

    // Handle registered standard library builtins
    if (fun.isBuiltin && typeof fun.handler === 'function') {
      return await fun.handler(...args);
    }

    if (typeof fun !== 'object' || !fun.blockCtx) {
      throw new Error(`Function '${funName}' is not callable.`);
    }

    const previousEnv = this.currentEnv;
    const callEnv = new Environment(fun.closure, (name, value) => {
      this.onVariableChange?.(name, value);
    });
    for (let i = 0; i < fun.params.length; i++) {
      callEnv.define(fun.params[i], args[i]);
    }

    this.currentEnv = callEnv;
    try {
      await this.visit(fun.blockCtx);
    } catch (e) {
      if (e instanceof ReturnSignal) {
        return e.value;
      }
      throw e;
    } finally {
      this.currentEnv = previousEnv;
    }

    return null;
  };

  public visitFunCallExpr = async (ctx: FunCallExprContext): Promise<any> => {
    return await this.visit(ctx.funCall());
  };

  public visitBlock = async (ctx: BlockContext): Promise<any> => {
    let result: any = null;
    for (let i = 0; i < ctx.getChildCount(); i++) {
      const child = ctx.getChild(i);
      if (child) {
        result = await this.visit(child);
      }
    }
    const returnStat = ctx.returnStatement();
    if (returnStat) {
      return await this.visit(returnStat);
    }
    return result;
  };

  public visitReturnStatement = async (ctx: ReturnStatementContext): Promise<any> => {
    const val = await this.visit(ctx.expr());
    throw new ReturnSignal(val);
  };

  public visitArrayLiteral = async (ctx: ArrayLiteralContext): Promise<any> => {
    const exprs = ctx.expr();
    if (!exprs || exprs.length === 0) return [];
    const results: any[] = [];
    for (const e of exprs) {
      results.push(await this.visit(e));
    }
    return results;
  };

  public visitIndexAccess = async (ctx: IndexAccessContext): Promise<any> => {
    const arr = await this.visit(ctx.expr(0)!);
    const idx = Number(await this.visit(ctx.expr(1)!));

    if (Array.isArray(arr)) {
      return arr[idx];
    }
    if (typeof arr === 'string') {
      return arr[idx] ?? '';
    }
    return undefined;
  };

  public visitBinaryAdd = async (ctx: BinaryAddContext): Promise<any> => {
    const left = await this.visit(ctx.expr(0)!);
    const right = await this.visit(ctx.expr(1)!);
    const isAdd = ctx.Add() !== null;

    if (isAdd) {
      if (Array.isArray(left) && Array.isArray(right)) {
        return [...left, ...right];
      }
      if (typeof left === 'string' || typeof right === 'string') {
        return `${left}${right}`;
      }
      return Number(left) + Number(right);
    } else {
      return Number(left) - Number(right);
    }
  };

  public visitBinaryMul = async (ctx: BinaryMulContext): Promise<any> => {
    const left = Number(await this.visit(ctx.expr(0)!));
    const right = Number(await this.visit(ctx.expr(1)!));

    if (ctx.Mul() !== null) return left * right;
    if (ctx.Div() !== null) return left / right;
    if (ctx.Mod() !== null) return left % right;
    return left * right;
  };

  public visitComparison = async (ctx: ComparisonContext): Promise<any> => {
    const left = await this.visit(ctx.expr(0)!);
    const right = await this.visit(ctx.expr(1)!);

    if (ctx.Langle() !== null) return left < right;
    if (ctx.Rangle() !== null) return left > right;
    if (ctx.Leq() !== null) return left <= right;
    if (ctx.Req() !== null) return left >= right;
    return false;
  };

  public visitEquality = async (ctx: EqualityContext): Promise<any> => {
    const left = await this.visit(ctx.expr(0)!);
    const right = await this.visit(ctx.expr(1)!);

    if (ctx.Eqeq() !== null) return left == right;
    if (ctx.Neq() !== null) return left != right;
    return false;
  };

  public visitLogicalAnd = async (ctx: LogicalAndContext): Promise<any> => {
    const left = this.isTruthy(await this.visit(ctx.expr(0)!));
    if (!left) return false;
    return this.isTruthy(await this.visit(ctx.expr(1)!));
  };

  public visitLogicalOr = async (ctx: LogicalOrContext): Promise<any> => {
    const left = this.isTruthy(await this.visit(ctx.expr(0)!));
    if (left) return true;
    return this.isTruthy(await this.visit(ctx.expr(1)!));
  };

  public visitUnaryNot = async (ctx: UnaryNotContext): Promise<any> => {
    return !this.isTruthy(await this.visit(ctx.expr()));
  };

  public visitUnaryMin = async (ctx: UnaryMinContext): Promise<any> => {
    return -Number(await this.visit(ctx.expr()));
  };

  public visitAssignAction = async (ctx: AssignActionContext): Promise<any> => {
    const id = ctx.expr(0)!.getText();
    const right = await this.visit(ctx.expr(1)!);
    const op = ctx._op?.text;
    const current = this.currentEnv.get(id);

    let newVal = current;
    if (op === '+=') newVal = current + right;
    else if (op === '-=') newVal = current - right;
    else if (op === '*=') newVal = current * right;
    else if (op === '/=') newVal = current / right;
    else if (op === '%=') newVal = current % right;

    this.currentEnv.assign(id, newVal);
    return newVal;
  };

  public visitIntLiteral = (ctx: IntLiteralContext): any => {
    return parseInt(ctx.getText(), 10);
  };

  public visitDoubleLiteral = (ctx: DoubleLiteralContext): any => {
    return parseFloat(ctx.getText());
  };

  public visitStringLiteral = (ctx: StringLiteralContext): any => {
    const raw = ctx.getText();
    return raw.substring(1, raw.length - 1)
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'");
  };

  public visitBooleanLiteral = (ctx: BooleanLiteralContext): any => {
    return ctx.getText() === 'true';
  };

  public visitIdentifier = (ctx: IdentifierContext): any => {
    const name = ctx.getText();
    if (!this.currentEnv.has(name)) {
      return undefined;
    }
    return this.currentEnv.get(name);
  };

  public visitNull = (_ctx: NullContext): any => {
    return null;
  };

  public visitGroupings = async (ctx: GroupingsContext): Promise<any> => {
    return await this.visit(ctx.expr());
  };

  private isTruthy(val: any): boolean {
    if (val === null || val === undefined) return false;
    if (typeof val === 'boolean') return val;
    if (typeof val === 'number') return val !== 0;
    if (typeof val === 'string') return val.length > 0;
    if (Array.isArray(val)) return val.length > 0;
    return true;
  }

  private stringify(val: any): string {
    if (val === null) return 'null';
    if (val === undefined) return 'undefined';
    if (Array.isArray(val)) return `[${val.map((x) => this.stringify(x)).join(', ')}]`;
    return String(val);
  }

  private resolveValue(raw: string): any {
    const num = Number(raw);
    if (!isNaN(num)) return num;
    return this.currentEnv.get(raw) ?? 0;
  }
}


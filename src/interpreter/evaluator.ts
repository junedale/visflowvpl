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
  AssignmentContext,
} from './generated/VisLangParser.js';
import { Environment, VisFunction, ReturnSignal } from './environment.js';

export interface EvaluatorOptions {
  onPrint?: (value: string) => void;
  onPrintln?: (value: string) => void;
  maxIterations?: number;
  isCancelled?: () => boolean;
}

export class VisLangEvaluator extends VisLangVisitor<any> {
  private globalEnv: Environment;
  private currentEnv: Environment;
  private onPrint: (value: string) => void;
  private onPrintln: (value: string) => void;
  private maxIterations: number;
  private isCancelled: () => boolean;
  private iterationCount: number = 0;

  constructor(options: EvaluatorOptions = {}) {
    super();
    this.globalEnv = new Environment();
    this.currentEnv = this.globalEnv;
    this.onPrint = options.onPrint || ((val) => console.log(val));
    this.onPrintln = options.onPrintln || ((val) => console.log(val));
    this.maxIterations = options.maxIterations || 100000;
    this.isCancelled = options.isCancelled || (() => false);
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

  public visitProgram = (ctx: ProgramContext): any => {
    return this.visit(ctx.body());
  };

  public visitBody = (ctx: BodyContext): any => {
    let result: any = null;
    for (let i = 0; i < ctx.getChildCount(); i++) {
      const child = ctx.getChild(i);
      if (child) {
        result = this.visit(child);
      }
    }
    return result;
  };

  public visitDeclaration = (ctx: DeclarationContext): any => {
    return this.visit(ctx.funDecl());
  };

  public visitFunDecl = (ctx: FunDeclContext): any => {
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

  public visitStatement = (ctx: StatementContext): any => {
    const assignment = ctx.assignment();
    if (assignment) return this.visit(assignment);

    const ifStat = ctx.ifStatement();
    if (ifStat) return this.visit(ifStat);

    const doWhile = ctx.doWhileStat();
    if (doWhile) return this.visit(doWhile);

    const whileStat = ctx.whileStat();
    if (whileStat) return this.visit(whileStat);

    const forStat = ctx.forStat();
    if (forStat) return this.visit(forStat);

    const callStat = ctx.callStat();
    if (callStat) return this.visit(callStat);

    return null;
  };

  public visitAssignment = (ctx: AssignmentContext): any => {
    const id = ctx.Identifier().getText();
    const exprCtx = ctx.expr();
    const funCallCtx = ctx.funCall();

    let val: any = null;
    if (exprCtx) {
      val = this.visit(exprCtx);
    } else if (funCallCtx) {
      val = this.visit(funCallCtx);
    }

    this.currentEnv.assign(id, val);
    return val;
  };

  public visitIfStatement = (ctx: IfStatementContext): any => {
    const ifStat = ctx.ifStat();
    const ifCond = this.isTruthy(this.visit(ifStat.expr()));
    if (ifCond) {
      return this.visit(ifStat.block());
    }

    const elifStats = ctx.elifStat();
    for (const elif of elifStats) {
      const elifCond = this.isTruthy(this.visit(elif.expr()));
      if (elifCond) {
        return this.visit(elif.block());
      }
    }

    const elseStat = ctx.elseStat();
    if (elseStat) {
      return this.visit(elseStat.block());
    }

    return null;
  };

  public visitWhileStat = (ctx: WhileStatContext): any => {
    let result: any = null;
    while (this.isTruthy(this.visit(ctx.expr()))) {
      this.checkLoop();
      result = this.visit(ctx.block());
    }
    return result;
  };

  public visitDoWhileStat = (ctx: DoWhileStatContext): any => {
    let result: any = null;
    do {
      this.checkLoop();
      result = this.visit(ctx.block());
    } while (this.isTruthy(this.visit(ctx.expr())));
    return result;
  };

  public visitForStat = (ctx: ForStatContext): any => {
    let result: any = null;
    const assignment = ctx.assignment();
    if (assignment) {
      this.visit(assignment);
      const varName = assignment.Identifier().getText();
      const limitCtx = ctx.Identifier(0) || ctx.Integer(0);
      const limit = limitCtx ? this.resolveValue(limitCtx.getText()) : 0;

      while (this.currentEnv.get(varName) < limit) {
        this.checkLoop();
        result = this.visit(ctx.block());
        this.currentEnv.assign(varName, this.currentEnv.get(varName) + 1);
      }
    }
    return result;
  };

  public visitCallStat = (ctx: CallStatContext): any => {
    const printCall = ctx.printCall();
    if (printCall) return this.visit(printCall);

    const funCall = ctx.funCall();
    if (funCall) return this.visit(funCall);

    return null;
  };

  public visitPrint = (ctx: PrintContext): any => {
    const expr = ctx.expr();
    const val = expr ? this.visit(expr) : '';
    this.onPrint(this.stringify(val));
    return null;
  };

  public visitPrintln = (ctx: PrintlnContext): any => {
    const expr = ctx.expr();
    const val = expr ? this.visit(expr) : '';
    this.onPrintln(this.stringify(val));
    return null;
  };

  public visitFunCall = (ctx: FunCallContext): any => {
    const funName = ctx.Identifier().getText();
    const fun: VisFunction = this.globalEnv.get(funName);

    if (!fun || typeof fun !== 'object' || !fun.blockCtx) {
      throw new Error(`Function '${funName}' is not defined.`);
    }

    const args: any[] = [];
    const paramsCtx = ctx.params();
    if (paramsCtx) {
      const exprs = paramsCtx.expr();
      if (exprs && exprs.length > 0) {
        for (const e of exprs) {
          args.push(this.visit(e));
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

    const previousEnv = this.currentEnv;
    const callEnv = new Environment(fun.closure);
    for (let i = 0; i < fun.params.length; i++) {
      callEnv.define(fun.params[i], args[i]);
    }

    this.currentEnv = callEnv;
    try {
      this.visit(fun.blockCtx);
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

  public visitFunCallExpr = (ctx: FunCallExprContext): any => {
    return this.visit(ctx.funCall());
  };

  public visitBlock = (ctx: BlockContext): any => {
    let result: any = null;
    for (let i = 0; i < ctx.getChildCount(); i++) {
      const child = ctx.getChild(i);
      if (child) {
        result = this.visit(child);
      }
    }
    const returnStat = ctx.returnStatement();
    if (returnStat) {
      return this.visit(returnStat);
    }
    return result;
  };

  public visitReturnStatement = (ctx: ReturnStatementContext): any => {
    const val = this.visit(ctx.expr());
    throw new ReturnSignal(val);
  };

  public visitBinaryAdd = (ctx: BinaryAddContext): any => {
    const left = this.visit(ctx.expr(0)!);
    const right = this.visit(ctx.expr(1)!);
    const isAdd = ctx.Add() !== null;

    if (isAdd) {
      if (typeof left === 'string' || typeof right === 'string') {
        return `${left}${right}`;
      }
      return Number(left) + Number(right);
    } else {
      return Number(left) - Number(right);
    }
  };

  public visitBinaryMul = (ctx: BinaryMulContext): any => {
    const left = Number(this.visit(ctx.expr(0)!));
    const right = Number(this.visit(ctx.expr(1)!));

    if (ctx.Mul() !== null) return left * right;
    if (ctx.Div() !== null) return left / right;
    if (ctx.Mod() !== null) return left % right;
    return left * right;
  };

  public visitComparison = (ctx: ComparisonContext): any => {
    const left = this.visit(ctx.expr(0)!);
    const right = this.visit(ctx.expr(1)!);

    if (ctx.Langle() !== null) return left < right;
    if (ctx.Rangle() !== null) return left > right;
    if (ctx.Leq() !== null) return left <= right;
    if (ctx.Req() !== null) return left >= right;
    return false;
  };

  public visitEquality = (ctx: EqualityContext): any => {
    const left = this.visit(ctx.expr(0)!);
    const right = this.visit(ctx.expr(1)!);

    if (ctx.Eqeq() !== null) return left == right;
    if (ctx.Neq() !== null) return left != right;
    return false;
  };

  public visitLogicalAnd = (ctx: LogicalAndContext): any => {
    const left = this.isTruthy(this.visit(ctx.expr(0)!));
    if (!left) return false;
    return this.isTruthy(this.visit(ctx.expr(1)!));
  };

  public visitLogicalOr = (ctx: LogicalOrContext): any => {
    const left = this.isTruthy(this.visit(ctx.expr(0)!));
    if (left) return true;
    return this.isTruthy(this.visit(ctx.expr(1)!));
  };

  public visitUnaryNot = (ctx: UnaryNotContext): any => {
    return !this.isTruthy(this.visit(ctx.expr()));
  };

  public visitUnaryMin = (ctx: UnaryMinContext): any => {
    return -Number(this.visit(ctx.expr()));
  };

  public visitAssignAction = (ctx: AssignActionContext): any => {
    const id = ctx.expr(0)!.getText();
    const right = this.visit(ctx.expr(1)!);
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

  public visitGroupings = (ctx: GroupingsContext): any => {
    return this.visit(ctx.expr());
  };

  private isTruthy(val: any): boolean {
    if (val === null || val === undefined) return false;
    if (typeof val === 'boolean') return val;
    if (typeof val === 'number') return val !== 0;
    if (typeof val === 'string') return val.length > 0;
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

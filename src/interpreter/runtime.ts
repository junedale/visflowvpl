import { CharStream, CommonTokenStream, BaseErrorListener, RecognitionException, Recognizer } from 'antlr4ng';
import { VisLangLexer } from './generated/VisLangLexer.js';
import { VisLangParser } from './generated/VisLangParser.js';
import { VisLangEvaluator, EvaluatorOptions } from './evaluator.js';

export class SyntaxErrorCollector extends BaseErrorListener {
  public errors: string[] = [];

  public syntaxError(
    _recognizer: Recognizer<any>,
    _offendingSymbol: any,
    line: number,
    charPositionInLine: number,
    msg: string,
    _e: RecognitionException | null
  ): void {
    this.errors.push(`Line ${line}:${charPositionInLine} ${msg}`);
  }
}

export interface ExecutionResult {
  success: boolean;
  errors: string[];
  output: string[];
  executionTimeMs: number;
}

export async function executeVisLang(code: string, options: EvaluatorOptions = {}): Promise<ExecutionResult> {
  const output: string[] = [];
  const errors: string[] = [];
  const startTime = performance.now();

  const handlePrint = (str: string) => {
    output.push(str);
    options.onPrint?.(str);
  };

  const handlePrintln = (str: string) => {
    output.push(str + '\n');
    options.onPrintln?.(str);
  };

  try {
    const inputStream = CharStream.fromString(code);
    const lexer = new VisLangLexer(inputStream);
    const errorListener = new SyntaxErrorCollector();
    
    lexer.removeErrorListeners();
    lexer.addErrorListener(errorListener);

    const tokenStream = new CommonTokenStream(lexer);
    const parser = new VisLangParser(tokenStream);
    
    parser.removeErrorListeners();
    parser.addErrorListener(errorListener);

    const tree = parser.program();

    if (errorListener.errors.length > 0) {
      return {
        success: false,
        errors: errorListener.errors,
        output,
        executionTimeMs: performance.now() - startTime,
      };
    }

    const evaluator = new VisLangEvaluator({
      ...options,
      onPrint: handlePrint,
      onPrintln: handlePrintln,
    });

    await evaluator.visit(tree);

    return {
      success: true,
      errors: [],
      output,
      executionTimeMs: performance.now() - startTime,
    };
  } catch (err: any) {
    errors.push(err.message || String(err));
    return {
      success: false,
      errors,
      output,
      executionTimeMs: performance.now() - startTime,
    };
  }
}

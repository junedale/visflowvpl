// Generated from src/grammar/VisLang.g4 by ANTLR 4.13.1

import { ErrorNode, ParseTreeListener, ParserRuleContext, TerminalNode } from "antlr4ng";


import { ProgramContext } from "./VisLangParser.js";
import { BodyContext } from "./VisLangParser.js";
import { DeclarationContext } from "./VisLangParser.js";
import { FunDeclContext } from "./VisLangParser.js";
import { ParamsContext } from "./VisLangParser.js";
import { StatementContext } from "./VisLangParser.js";
import { IfStatementContext } from "./VisLangParser.js";
import { IfStatContext } from "./VisLangParser.js";
import { ElifStatContext } from "./VisLangParser.js";
import { ElseStatContext } from "./VisLangParser.js";
import { DoWhileStatContext } from "./VisLangParser.js";
import { WhileStatContext } from "./VisLangParser.js";
import { ForStatContext } from "./VisLangParser.js";
import { CallStatContext } from "./VisLangParser.js";
import { PrintContext } from "./VisLangParser.js";
import { PrintlnContext } from "./VisLangParser.js";
import { FunCallContext } from "./VisLangParser.js";
import { BlockContext } from "./VisLangParser.js";
import { ReturnStatementContext } from "./VisLangParser.js";
import { IdentifierContext } from "./VisLangParser.js";
import { BinaryMulContext } from "./VisLangParser.js";
import { ComparisonContext } from "./VisLangParser.js";
import { ArrayLiteralContext } from "./VisLangParser.js";
import { IntLiteralContext } from "./VisLangParser.js";
import { LogicalAndContext } from "./VisLangParser.js";
import { IndexAccessContext } from "./VisLangParser.js";
import { FunCallExprContext } from "./VisLangParser.js";
import { AssignActionContext } from "./VisLangParser.js";
import { NullContext } from "./VisLangParser.js";
import { StringLiteralContext } from "./VisLangParser.js";
import { GroupingsContext } from "./VisLangParser.js";
import { UnaryMinContext } from "./VisLangParser.js";
import { DoubleLiteralContext } from "./VisLangParser.js";
import { LogicalOrContext } from "./VisLangParser.js";
import { BooleanLiteralContext } from "./VisLangParser.js";
import { EqualityContext } from "./VisLangParser.js";
import { UnaryNotContext } from "./VisLangParser.js";
import { BinaryAddContext } from "./VisLangParser.js";
import { ArrayAssignmentContext } from "./VisLangParser.js";
import { VariableAssignmentContext } from "./VisLangParser.js";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `VisLangParser`.
 */
export class VisLangListener implements ParseTreeListener {
    /**
     * Enter a parse tree produced by `VisLangParser.program`.
     * @param ctx the parse tree
     */
    enterProgram?: (ctx: ProgramContext) => void;
    /**
     * Exit a parse tree produced by `VisLangParser.program`.
     * @param ctx the parse tree
     */
    exitProgram?: (ctx: ProgramContext) => void;
    /**
     * Enter a parse tree produced by `VisLangParser.body`.
     * @param ctx the parse tree
     */
    enterBody?: (ctx: BodyContext) => void;
    /**
     * Exit a parse tree produced by `VisLangParser.body`.
     * @param ctx the parse tree
     */
    exitBody?: (ctx: BodyContext) => void;
    /**
     * Enter a parse tree produced by `VisLangParser.declaration`.
     * @param ctx the parse tree
     */
    enterDeclaration?: (ctx: DeclarationContext) => void;
    /**
     * Exit a parse tree produced by `VisLangParser.declaration`.
     * @param ctx the parse tree
     */
    exitDeclaration?: (ctx: DeclarationContext) => void;
    /**
     * Enter a parse tree produced by `VisLangParser.funDecl`.
     * @param ctx the parse tree
     */
    enterFunDecl?: (ctx: FunDeclContext) => void;
    /**
     * Exit a parse tree produced by `VisLangParser.funDecl`.
     * @param ctx the parse tree
     */
    exitFunDecl?: (ctx: FunDeclContext) => void;
    /**
     * Enter a parse tree produced by `VisLangParser.params`.
     * @param ctx the parse tree
     */
    enterParams?: (ctx: ParamsContext) => void;
    /**
     * Exit a parse tree produced by `VisLangParser.params`.
     * @param ctx the parse tree
     */
    exitParams?: (ctx: ParamsContext) => void;
    /**
     * Enter a parse tree produced by `VisLangParser.statement`.
     * @param ctx the parse tree
     */
    enterStatement?: (ctx: StatementContext) => void;
    /**
     * Exit a parse tree produced by `VisLangParser.statement`.
     * @param ctx the parse tree
     */
    exitStatement?: (ctx: StatementContext) => void;
    /**
     * Enter a parse tree produced by `VisLangParser.ifStatement`.
     * @param ctx the parse tree
     */
    enterIfStatement?: (ctx: IfStatementContext) => void;
    /**
     * Exit a parse tree produced by `VisLangParser.ifStatement`.
     * @param ctx the parse tree
     */
    exitIfStatement?: (ctx: IfStatementContext) => void;
    /**
     * Enter a parse tree produced by `VisLangParser.ifStat`.
     * @param ctx the parse tree
     */
    enterIfStat?: (ctx: IfStatContext) => void;
    /**
     * Exit a parse tree produced by `VisLangParser.ifStat`.
     * @param ctx the parse tree
     */
    exitIfStat?: (ctx: IfStatContext) => void;
    /**
     * Enter a parse tree produced by `VisLangParser.elifStat`.
     * @param ctx the parse tree
     */
    enterElifStat?: (ctx: ElifStatContext) => void;
    /**
     * Exit a parse tree produced by `VisLangParser.elifStat`.
     * @param ctx the parse tree
     */
    exitElifStat?: (ctx: ElifStatContext) => void;
    /**
     * Enter a parse tree produced by `VisLangParser.elseStat`.
     * @param ctx the parse tree
     */
    enterElseStat?: (ctx: ElseStatContext) => void;
    /**
     * Exit a parse tree produced by `VisLangParser.elseStat`.
     * @param ctx the parse tree
     */
    exitElseStat?: (ctx: ElseStatContext) => void;
    /**
     * Enter a parse tree produced by `VisLangParser.doWhileStat`.
     * @param ctx the parse tree
     */
    enterDoWhileStat?: (ctx: DoWhileStatContext) => void;
    /**
     * Exit a parse tree produced by `VisLangParser.doWhileStat`.
     * @param ctx the parse tree
     */
    exitDoWhileStat?: (ctx: DoWhileStatContext) => void;
    /**
     * Enter a parse tree produced by `VisLangParser.whileStat`.
     * @param ctx the parse tree
     */
    enterWhileStat?: (ctx: WhileStatContext) => void;
    /**
     * Exit a parse tree produced by `VisLangParser.whileStat`.
     * @param ctx the parse tree
     */
    exitWhileStat?: (ctx: WhileStatContext) => void;
    /**
     * Enter a parse tree produced by `VisLangParser.forStat`.
     * @param ctx the parse tree
     */
    enterForStat?: (ctx: ForStatContext) => void;
    /**
     * Exit a parse tree produced by `VisLangParser.forStat`.
     * @param ctx the parse tree
     */
    exitForStat?: (ctx: ForStatContext) => void;
    /**
     * Enter a parse tree produced by `VisLangParser.callStat`.
     * @param ctx the parse tree
     */
    enterCallStat?: (ctx: CallStatContext) => void;
    /**
     * Exit a parse tree produced by `VisLangParser.callStat`.
     * @param ctx the parse tree
     */
    exitCallStat?: (ctx: CallStatContext) => void;
    /**
     * Enter a parse tree produced by the `print`
     * labeled alternative in `VisLangParser.printCall`.
     * @param ctx the parse tree
     */
    enterPrint?: (ctx: PrintContext) => void;
    /**
     * Exit a parse tree produced by the `print`
     * labeled alternative in `VisLangParser.printCall`.
     * @param ctx the parse tree
     */
    exitPrint?: (ctx: PrintContext) => void;
    /**
     * Enter a parse tree produced by the `println`
     * labeled alternative in `VisLangParser.printCall`.
     * @param ctx the parse tree
     */
    enterPrintln?: (ctx: PrintlnContext) => void;
    /**
     * Exit a parse tree produced by the `println`
     * labeled alternative in `VisLangParser.printCall`.
     * @param ctx the parse tree
     */
    exitPrintln?: (ctx: PrintlnContext) => void;
    /**
     * Enter a parse tree produced by `VisLangParser.funCall`.
     * @param ctx the parse tree
     */
    enterFunCall?: (ctx: FunCallContext) => void;
    /**
     * Exit a parse tree produced by `VisLangParser.funCall`.
     * @param ctx the parse tree
     */
    exitFunCall?: (ctx: FunCallContext) => void;
    /**
     * Enter a parse tree produced by `VisLangParser.block`.
     * @param ctx the parse tree
     */
    enterBlock?: (ctx: BlockContext) => void;
    /**
     * Exit a parse tree produced by `VisLangParser.block`.
     * @param ctx the parse tree
     */
    exitBlock?: (ctx: BlockContext) => void;
    /**
     * Enter a parse tree produced by `VisLangParser.returnStatement`.
     * @param ctx the parse tree
     */
    enterReturnStatement?: (ctx: ReturnStatementContext) => void;
    /**
     * Exit a parse tree produced by `VisLangParser.returnStatement`.
     * @param ctx the parse tree
     */
    exitReturnStatement?: (ctx: ReturnStatementContext) => void;
    /**
     * Enter a parse tree produced by the `identifier`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    enterIdentifier?: (ctx: IdentifierContext) => void;
    /**
     * Exit a parse tree produced by the `identifier`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    exitIdentifier?: (ctx: IdentifierContext) => void;
    /**
     * Enter a parse tree produced by the `binaryMul`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    enterBinaryMul?: (ctx: BinaryMulContext) => void;
    /**
     * Exit a parse tree produced by the `binaryMul`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    exitBinaryMul?: (ctx: BinaryMulContext) => void;
    /**
     * Enter a parse tree produced by the `comparison`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    enterComparison?: (ctx: ComparisonContext) => void;
    /**
     * Exit a parse tree produced by the `comparison`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    exitComparison?: (ctx: ComparisonContext) => void;
    /**
     * Enter a parse tree produced by the `arrayLiteral`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    enterArrayLiteral?: (ctx: ArrayLiteralContext) => void;
    /**
     * Exit a parse tree produced by the `arrayLiteral`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    exitArrayLiteral?: (ctx: ArrayLiteralContext) => void;
    /**
     * Enter a parse tree produced by the `intLiteral`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    enterIntLiteral?: (ctx: IntLiteralContext) => void;
    /**
     * Exit a parse tree produced by the `intLiteral`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    exitIntLiteral?: (ctx: IntLiteralContext) => void;
    /**
     * Enter a parse tree produced by the `logicalAnd`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    enterLogicalAnd?: (ctx: LogicalAndContext) => void;
    /**
     * Exit a parse tree produced by the `logicalAnd`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    exitLogicalAnd?: (ctx: LogicalAndContext) => void;
    /**
     * Enter a parse tree produced by the `indexAccess`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    enterIndexAccess?: (ctx: IndexAccessContext) => void;
    /**
     * Exit a parse tree produced by the `indexAccess`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    exitIndexAccess?: (ctx: IndexAccessContext) => void;
    /**
     * Enter a parse tree produced by the `funCallExpr`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    enterFunCallExpr?: (ctx: FunCallExprContext) => void;
    /**
     * Exit a parse tree produced by the `funCallExpr`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    exitFunCallExpr?: (ctx: FunCallExprContext) => void;
    /**
     * Enter a parse tree produced by the `assignAction`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    enterAssignAction?: (ctx: AssignActionContext) => void;
    /**
     * Exit a parse tree produced by the `assignAction`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    exitAssignAction?: (ctx: AssignActionContext) => void;
    /**
     * Enter a parse tree produced by the `null`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    enterNull?: (ctx: NullContext) => void;
    /**
     * Exit a parse tree produced by the `null`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    exitNull?: (ctx: NullContext) => void;
    /**
     * Enter a parse tree produced by the `stringLiteral`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    enterStringLiteral?: (ctx: StringLiteralContext) => void;
    /**
     * Exit a parse tree produced by the `stringLiteral`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    exitStringLiteral?: (ctx: StringLiteralContext) => void;
    /**
     * Enter a parse tree produced by the `groupings`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    enterGroupings?: (ctx: GroupingsContext) => void;
    /**
     * Exit a parse tree produced by the `groupings`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    exitGroupings?: (ctx: GroupingsContext) => void;
    /**
     * Enter a parse tree produced by the `unaryMin`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    enterUnaryMin?: (ctx: UnaryMinContext) => void;
    /**
     * Exit a parse tree produced by the `unaryMin`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    exitUnaryMin?: (ctx: UnaryMinContext) => void;
    /**
     * Enter a parse tree produced by the `doubleLiteral`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    enterDoubleLiteral?: (ctx: DoubleLiteralContext) => void;
    /**
     * Exit a parse tree produced by the `doubleLiteral`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    exitDoubleLiteral?: (ctx: DoubleLiteralContext) => void;
    /**
     * Enter a parse tree produced by the `logicalOr`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    enterLogicalOr?: (ctx: LogicalOrContext) => void;
    /**
     * Exit a parse tree produced by the `logicalOr`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    exitLogicalOr?: (ctx: LogicalOrContext) => void;
    /**
     * Enter a parse tree produced by the `booleanLiteral`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    enterBooleanLiteral?: (ctx: BooleanLiteralContext) => void;
    /**
     * Exit a parse tree produced by the `booleanLiteral`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    exitBooleanLiteral?: (ctx: BooleanLiteralContext) => void;
    /**
     * Enter a parse tree produced by the `equality`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    enterEquality?: (ctx: EqualityContext) => void;
    /**
     * Exit a parse tree produced by the `equality`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    exitEquality?: (ctx: EqualityContext) => void;
    /**
     * Enter a parse tree produced by the `unaryNot`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    enterUnaryNot?: (ctx: UnaryNotContext) => void;
    /**
     * Exit a parse tree produced by the `unaryNot`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    exitUnaryNot?: (ctx: UnaryNotContext) => void;
    /**
     * Enter a parse tree produced by the `binaryAdd`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    enterBinaryAdd?: (ctx: BinaryAddContext) => void;
    /**
     * Exit a parse tree produced by the `binaryAdd`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     */
    exitBinaryAdd?: (ctx: BinaryAddContext) => void;
    /**
     * Enter a parse tree produced by the `arrayAssignment`
     * labeled alternative in `VisLangParser.assignment`.
     * @param ctx the parse tree
     */
    enterArrayAssignment?: (ctx: ArrayAssignmentContext) => void;
    /**
     * Exit a parse tree produced by the `arrayAssignment`
     * labeled alternative in `VisLangParser.assignment`.
     * @param ctx the parse tree
     */
    exitArrayAssignment?: (ctx: ArrayAssignmentContext) => void;
    /**
     * Enter a parse tree produced by the `variableAssignment`
     * labeled alternative in `VisLangParser.assignment`.
     * @param ctx the parse tree
     */
    enterVariableAssignment?: (ctx: VariableAssignmentContext) => void;
    /**
     * Exit a parse tree produced by the `variableAssignment`
     * labeled alternative in `VisLangParser.assignment`.
     * @param ctx the parse tree
     */
    exitVariableAssignment?: (ctx: VariableAssignmentContext) => void;

    visitTerminal(node: TerminalNode): void {}
    visitErrorNode(node: ErrorNode): void {}
    enterEveryRule(node: ParserRuleContext): void {}
    exitEveryRule(node: ParserRuleContext): void {}
}


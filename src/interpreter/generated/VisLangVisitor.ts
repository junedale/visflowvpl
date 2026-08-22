// Generated from src/grammar/VisLang.g4 by ANTLR 4.13.1

import { AbstractParseTreeVisitor } from "antlr4ng";


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
 * This interface defines a complete generic visitor for a parse tree produced
 * by `VisLangParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export class VisLangVisitor<Result> extends AbstractParseTreeVisitor<Result> {
    /**
     * Visit a parse tree produced by `VisLangParser.program`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitProgram?: (ctx: ProgramContext) => Result;
    /**
     * Visit a parse tree produced by `VisLangParser.body`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBody?: (ctx: BodyContext) => Result;
    /**
     * Visit a parse tree produced by `VisLangParser.declaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDeclaration?: (ctx: DeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `VisLangParser.funDecl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFunDecl?: (ctx: FunDeclContext) => Result;
    /**
     * Visit a parse tree produced by `VisLangParser.params`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitParams?: (ctx: ParamsContext) => Result;
    /**
     * Visit a parse tree produced by `VisLangParser.statement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitStatement?: (ctx: StatementContext) => Result;
    /**
     * Visit a parse tree produced by `VisLangParser.ifStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIfStatement?: (ctx: IfStatementContext) => Result;
    /**
     * Visit a parse tree produced by `VisLangParser.ifStat`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIfStat?: (ctx: IfStatContext) => Result;
    /**
     * Visit a parse tree produced by `VisLangParser.elifStat`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitElifStat?: (ctx: ElifStatContext) => Result;
    /**
     * Visit a parse tree produced by `VisLangParser.elseStat`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitElseStat?: (ctx: ElseStatContext) => Result;
    /**
     * Visit a parse tree produced by `VisLangParser.doWhileStat`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDoWhileStat?: (ctx: DoWhileStatContext) => Result;
    /**
     * Visit a parse tree produced by `VisLangParser.whileStat`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitWhileStat?: (ctx: WhileStatContext) => Result;
    /**
     * Visit a parse tree produced by `VisLangParser.forStat`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitForStat?: (ctx: ForStatContext) => Result;
    /**
     * Visit a parse tree produced by `VisLangParser.callStat`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitCallStat?: (ctx: CallStatContext) => Result;
    /**
     * Visit a parse tree produced by the `print`
     * labeled alternative in `VisLangParser.printCall`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitPrint?: (ctx: PrintContext) => Result;
    /**
     * Visit a parse tree produced by the `println`
     * labeled alternative in `VisLangParser.printCall`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitPrintln?: (ctx: PrintlnContext) => Result;
    /**
     * Visit a parse tree produced by `VisLangParser.funCall`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFunCall?: (ctx: FunCallContext) => Result;
    /**
     * Visit a parse tree produced by `VisLangParser.block`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBlock?: (ctx: BlockContext) => Result;
    /**
     * Visit a parse tree produced by `VisLangParser.returnStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitReturnStatement?: (ctx: ReturnStatementContext) => Result;
    /**
     * Visit a parse tree produced by the `identifier`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIdentifier?: (ctx: IdentifierContext) => Result;
    /**
     * Visit a parse tree produced by the `binaryMul`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBinaryMul?: (ctx: BinaryMulContext) => Result;
    /**
     * Visit a parse tree produced by the `comparison`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitComparison?: (ctx: ComparisonContext) => Result;
    /**
     * Visit a parse tree produced by the `arrayLiteral`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitArrayLiteral?: (ctx: ArrayLiteralContext) => Result;
    /**
     * Visit a parse tree produced by the `intLiteral`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIntLiteral?: (ctx: IntLiteralContext) => Result;
    /**
     * Visit a parse tree produced by the `logicalAnd`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitLogicalAnd?: (ctx: LogicalAndContext) => Result;
    /**
     * Visit a parse tree produced by the `indexAccess`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIndexAccess?: (ctx: IndexAccessContext) => Result;
    /**
     * Visit a parse tree produced by the `funCallExpr`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFunCallExpr?: (ctx: FunCallExprContext) => Result;
    /**
     * Visit a parse tree produced by the `assignAction`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAssignAction?: (ctx: AssignActionContext) => Result;
    /**
     * Visit a parse tree produced by the `null`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitNull?: (ctx: NullContext) => Result;
    /**
     * Visit a parse tree produced by the `stringLiteral`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitStringLiteral?: (ctx: StringLiteralContext) => Result;
    /**
     * Visit a parse tree produced by the `groupings`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitGroupings?: (ctx: GroupingsContext) => Result;
    /**
     * Visit a parse tree produced by the `unaryMin`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitUnaryMin?: (ctx: UnaryMinContext) => Result;
    /**
     * Visit a parse tree produced by the `doubleLiteral`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDoubleLiteral?: (ctx: DoubleLiteralContext) => Result;
    /**
     * Visit a parse tree produced by the `logicalOr`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitLogicalOr?: (ctx: LogicalOrContext) => Result;
    /**
     * Visit a parse tree produced by the `booleanLiteral`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBooleanLiteral?: (ctx: BooleanLiteralContext) => Result;
    /**
     * Visit a parse tree produced by the `equality`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitEquality?: (ctx: EqualityContext) => Result;
    /**
     * Visit a parse tree produced by the `unaryNot`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitUnaryNot?: (ctx: UnaryNotContext) => Result;
    /**
     * Visit a parse tree produced by the `binaryAdd`
     * labeled alternative in `VisLangParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBinaryAdd?: (ctx: BinaryAddContext) => Result;
    /**
     * Visit a parse tree produced by the `arrayAssignment`
     * labeled alternative in `VisLangParser.assignment`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitArrayAssignment?: (ctx: ArrayAssignmentContext) => Result;
    /**
     * Visit a parse tree produced by the `variableAssignment`
     * labeled alternative in `VisLangParser.assignment`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitVariableAssignment?: (ctx: VariableAssignmentContext) => Result;
}


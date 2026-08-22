// Generated from src/grammar/VisLang.g4 by ANTLR 4.13.1

import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";

import { VisLangListener } from "./VisLangListener.js";
import { VisLangVisitor } from "./VisLangVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;


export class VisLangParser extends antlr.Parser {
    public static readonly Lparen = 1;
    public static readonly Rparen = 2;
    public static readonly Lbrace = 3;
    public static readonly Rbrace = 4;
    public static readonly Comma = 5;
    public static readonly Colon = 6;
    public static readonly Semicolon = 7;
    public static readonly Not = 8;
    public static readonly Mul = 9;
    public static readonly Div = 10;
    public static readonly Mod = 11;
    public static readonly Add = 12;
    public static readonly Sub = 13;
    public static readonly Langle = 14;
    public static readonly Rangle = 15;
    public static readonly Leq = 16;
    public static readonly Req = 17;
    public static readonly Eqeq = 18;
    public static readonly Neq = 19;
    public static readonly Assign = 20;
    public static readonly Add_Assign = 21;
    public static readonly Sub_Assign = 22;
    public static readonly Mul_Assign = 23;
    public static readonly Div_Assign = 24;
    public static readonly Mod_Assign = 25;
    public static readonly Fun = 26;
    public static readonly If = 27;
    public static readonly Else = 28;
    public static readonly For = 29;
    public static readonly Do = 30;
    public static readonly While = 31;
    public static readonly Print = 32;
    public static readonly Println = 33;
    public static readonly Return = 34;
    public static readonly In = 35;
    public static readonly And = 36;
    public static readonly Or = 37;
    public static readonly Null = 38;
    public static readonly Boolean = 39;
    public static readonly String = 40;
    public static readonly Integer = 41;
    public static readonly Double = 42;
    public static readonly Comment = 43;
    public static readonly Identifier = 44;
    public static readonly Whitespace = 45;
    public static readonly RULE_program = 0;
    public static readonly RULE_body = 1;
    public static readonly RULE_declaration = 2;
    public static readonly RULE_funDecl = 3;
    public static readonly RULE_params = 4;
    public static readonly RULE_statement = 5;
    public static readonly RULE_ifStatement = 6;
    public static readonly RULE_ifStat = 7;
    public static readonly RULE_elifStat = 8;
    public static readonly RULE_elseStat = 9;
    public static readonly RULE_doWhileStat = 10;
    public static readonly RULE_whileStat = 11;
    public static readonly RULE_forStat = 12;
    public static readonly RULE_callStat = 13;
    public static readonly RULE_printCall = 14;
    public static readonly RULE_funCall = 15;
    public static readonly RULE_block = 16;
    public static readonly RULE_returnStatement = 17;
    public static readonly RULE_expr = 18;
    public static readonly RULE_assignment = 19;

    public static readonly literalNames = [
        null, "'('", "')'", "'{'", "'}'", "','", "':'", "';'", "'!'", "'*'", 
        "'/'", "'%'", "'+'", "'-'", "'<'", "'>'", "'<='", "'>='", "'=='", 
        "'!='", "'='", "'+='", "'-='", "'*='", "'/='", "'%='", "'fun'", 
        "'if'", "'else'", "'for'", "'do'", "'while'", "'print'", "'println'", 
        "'return'", "'in'", "'and'", "'or'", "'null'"
    ];

    public static readonly symbolicNames = [
        null, "Lparen", "Rparen", "Lbrace", "Rbrace", "Comma", "Colon", 
        "Semicolon", "Not", "Mul", "Div", "Mod", "Add", "Sub", "Langle", 
        "Rangle", "Leq", "Req", "Eqeq", "Neq", "Assign", "Add_Assign", "Sub_Assign", 
        "Mul_Assign", "Div_Assign", "Mod_Assign", "Fun", "If", "Else", "For", 
        "Do", "While", "Print", "Println", "Return", "In", "And", "Or", 
        "Null", "Boolean", "String", "Integer", "Double", "Comment", "Identifier", 
        "Whitespace"
    ];
    public static readonly ruleNames = [
        "program", "body", "declaration", "funDecl", "params", "statement", 
        "ifStatement", "ifStat", "elifStat", "elseStat", "doWhileStat", 
        "whileStat", "forStat", "callStat", "printCall", "funCall", "block", 
        "returnStatement", "expr", "assignment",
    ];

    public get grammarFileName(): string { return "VisLang.g4"; }
    public get literalNames(): (string | null)[] { return VisLangParser.literalNames; }
    public get symbolicNames(): (string | null)[] { return VisLangParser.symbolicNames; }
    public get ruleNames(): string[] { return VisLangParser.ruleNames; }
    public get serializedATN(): number[] { return VisLangParser._serializedATN; }

    protected createFailedPredicateException(predicate?: string, message?: string): antlr.FailedPredicateException {
        return new antlr.FailedPredicateException(this, predicate, message);
    }

    public constructor(input: antlr.TokenStream) {
        super(input);
        this.interpreter = new antlr.ParserATNSimulator(this, VisLangParser._ATN, VisLangParser.decisionsToDFA, new antlr.PredictionContextCache());
    }
    public program(): ProgramContext {
        let localContext = new ProgramContext(this.context, this.state);
        this.enterRule(localContext, 0, VisLangParser.RULE_program);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 40;
            this.body();
            this.state = 41;
            this.match(VisLangParser.EOF);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public body(): BodyContext {
        let localContext = new BodyContext(this.context, this.state);
        this.enterRule(localContext, 2, VisLangParser.RULE_body);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 48;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                this.state = 48;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 0, this.context) ) {
                case 1:
                    {
                    this.state = 43;
                    this.statement();
                    }
                    break;
                case 2:
                    {
                    this.state = 44;
                    this.declaration();
                    }
                    break;
                case 3:
                    {
                    this.state = 45;
                    this.expr(0);
                    this.state = 46;
                    this.match(VisLangParser.Semicolon);
                    }
                    break;
                }
                }
                this.state = 50;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 3959431426) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & 6083) !== 0));
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public declaration(): DeclarationContext {
        let localContext = new DeclarationContext(this.context, this.state);
        this.enterRule(localContext, 4, VisLangParser.RULE_declaration);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 52;
            this.funDecl();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public funDecl(): FunDeclContext {
        let localContext = new FunDeclContext(this.context, this.state);
        this.enterRule(localContext, 6, VisLangParser.RULE_funDecl);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 54;
            this.match(VisLangParser.Fun);
            this.state = 55;
            this.match(VisLangParser.Identifier);
            this.state = 56;
            this.match(VisLangParser.Lparen);
            this.state = 58;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 8450) !== 0) || ((((_la - 38)) & ~0x1F) === 0 && ((1 << (_la - 38)) & 95) !== 0)) {
                {
                this.state = 57;
                this.params();
                }
            }

            this.state = 60;
            this.match(VisLangParser.Rparen);
            this.state = 61;
            this.match(VisLangParser.Lbrace);
            this.state = 62;
            this.block();
            this.state = 63;
            this.match(VisLangParser.Rbrace);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public params(): ParamsContext {
        let localContext = new ParamsContext(this.context, this.state);
        this.enterRule(localContext, 8, VisLangParser.RULE_params);
        try {
            let alternative: number;
            this.state = 81;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 5, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 65;
                this.match(VisLangParser.Identifier);
                this.state = 70;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 3, this.context);
                while (alternative !== 1 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1 + 1) {
                        {
                        {
                        this.state = 66;
                        this.match(VisLangParser.Comma);
                        this.state = 67;
                        this.match(VisLangParser.Identifier);
                        }
                        }
                    }
                    this.state = 72;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 3, this.context);
                }
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 73;
                this.expr(0);
                this.state = 78;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 4, this.context);
                while (alternative !== 1 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1 + 1) {
                        {
                        {
                        this.state = 74;
                        this.match(VisLangParser.Comma);
                        this.state = 75;
                        this.expr(0);
                        }
                        }
                    }
                    this.state = 80;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 4, this.context);
                }
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public statement(): StatementContext {
        let localContext = new StatementContext(this.context, this.state);
        this.enterRule(localContext, 10, VisLangParser.RULE_statement);
        try {
            this.state = 93;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 6, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 83;
                this.assignment();
                this.state = 84;
                this.match(VisLangParser.Semicolon);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 86;
                this.ifStatement();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 87;
                this.doWhileStat();
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 88;
                this.whileStat();
                }
                break;
            case 5:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 89;
                this.forStat();
                }
                break;
            case 6:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 90;
                this.callStat();
                this.state = 91;
                this.match(VisLangParser.Semicolon);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public ifStatement(): IfStatementContext {
        let localContext = new IfStatementContext(this.context, this.state);
        this.enterRule(localContext, 12, VisLangParser.RULE_ifStatement);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 95;
            this.ifStat();
            this.state = 99;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 7, this.context);
            while (alternative !== 1 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1 + 1) {
                    {
                    {
                    this.state = 96;
                    this.elifStat();
                    }
                    }
                }
                this.state = 101;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 7, this.context);
            }
            this.state = 103;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 28) {
                {
                this.state = 102;
                this.elseStat();
                }
            }

            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public ifStat(): IfStatContext {
        let localContext = new IfStatContext(this.context, this.state);
        this.enterRule(localContext, 14, VisLangParser.RULE_ifStat);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 105;
            this.match(VisLangParser.If);
            this.state = 106;
            this.match(VisLangParser.Lparen);
            this.state = 107;
            this.expr(0);
            this.state = 108;
            this.match(VisLangParser.Rparen);
            this.state = 109;
            this.match(VisLangParser.Lbrace);
            this.state = 110;
            this.block();
            this.state = 111;
            this.match(VisLangParser.Rbrace);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public elifStat(): ElifStatContext {
        let localContext = new ElifStatContext(this.context, this.state);
        this.enterRule(localContext, 16, VisLangParser.RULE_elifStat);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 113;
            this.match(VisLangParser.Else);
            this.state = 114;
            this.match(VisLangParser.If);
            this.state = 115;
            this.match(VisLangParser.Lparen);
            this.state = 116;
            this.expr(0);
            this.state = 117;
            this.match(VisLangParser.Rparen);
            this.state = 118;
            this.match(VisLangParser.Lbrace);
            this.state = 119;
            this.block();
            this.state = 120;
            this.match(VisLangParser.Rbrace);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public elseStat(): ElseStatContext {
        let localContext = new ElseStatContext(this.context, this.state);
        this.enterRule(localContext, 18, VisLangParser.RULE_elseStat);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 122;
            this.match(VisLangParser.Else);
            this.state = 123;
            this.match(VisLangParser.Lbrace);
            this.state = 124;
            this.block();
            this.state = 125;
            this.match(VisLangParser.Rbrace);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public doWhileStat(): DoWhileStatContext {
        let localContext = new DoWhileStatContext(this.context, this.state);
        this.enterRule(localContext, 20, VisLangParser.RULE_doWhileStat);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 127;
            this.match(VisLangParser.Do);
            this.state = 128;
            this.match(VisLangParser.Lbrace);
            this.state = 129;
            this.block();
            this.state = 130;
            this.match(VisLangParser.Rbrace);
            this.state = 131;
            this.match(VisLangParser.While);
            this.state = 132;
            this.match(VisLangParser.Lparen);
            this.state = 133;
            this.expr(0);
            this.state = 134;
            this.match(VisLangParser.Rparen);
            this.state = 135;
            this.match(VisLangParser.Semicolon);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public whileStat(): WhileStatContext {
        let localContext = new WhileStatContext(this.context, this.state);
        this.enterRule(localContext, 22, VisLangParser.RULE_whileStat);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 137;
            this.match(VisLangParser.While);
            this.state = 138;
            this.match(VisLangParser.Lparen);
            this.state = 139;
            this.expr(0);
            this.state = 140;
            this.match(VisLangParser.Rparen);
            this.state = 141;
            this.match(VisLangParser.Lbrace);
            this.state = 142;
            this.block();
            this.state = 143;
            this.match(VisLangParser.Rbrace);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public forStat(): ForStatContext {
        let localContext = new ForStatContext(this.context, this.state);
        this.enterRule(localContext, 24, VisLangParser.RULE_forStat);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 145;
            this.match(VisLangParser.For);
            this.state = 146;
            this.match(VisLangParser.Lparen);
            this.state = 150;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 9, this.context) ) {
            case 1:
                {
                this.state = 147;
                this.assignment();
                }
                break;
            case 2:
                {
                this.state = 148;
                this.match(VisLangParser.Identifier);
                }
                break;
            case 3:
                {
                this.state = 149;
                this.match(VisLangParser.Integer);
                }
                break;
            }
            this.state = 152;
            this.match(VisLangParser.In);
            this.state = 153;
            _la = this.tokenStream.LA(1);
            if(!(_la === 41 || _la === 44)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            this.state = 154;
            this.match(VisLangParser.Rparen);
            this.state = 155;
            this.match(VisLangParser.Lbrace);
            this.state = 156;
            this.block();
            this.state = 157;
            this.match(VisLangParser.Rbrace);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public callStat(): CallStatContext {
        let localContext = new CallStatContext(this.context, this.state);
        this.enterRule(localContext, 26, VisLangParser.RULE_callStat);
        try {
            this.state = 161;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case VisLangParser.Print:
            case VisLangParser.Println:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 159;
                this.printCall();
                }
                break;
            case VisLangParser.Identifier:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 160;
                this.funCall();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public printCall(): PrintCallContext {
        let localContext = new PrintCallContext(this.context, this.state);
        this.enterRule(localContext, 28, VisLangParser.RULE_printCall);
        let _la: number;
        try {
            this.state = 175;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case VisLangParser.Print:
                localContext = new PrintContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 163;
                this.match(VisLangParser.Print);
                this.state = 164;
                this.match(VisLangParser.Lparen);
                this.state = 166;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 8450) !== 0) || ((((_la - 38)) & ~0x1F) === 0 && ((1 << (_la - 38)) & 95) !== 0)) {
                    {
                    this.state = 165;
                    this.expr(0);
                    }
                }

                this.state = 168;
                this.match(VisLangParser.Rparen);
                }
                break;
            case VisLangParser.Println:
                localContext = new PrintlnContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 169;
                this.match(VisLangParser.Println);
                this.state = 170;
                this.match(VisLangParser.Lparen);
                this.state = 172;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 8450) !== 0) || ((((_la - 38)) & ~0x1F) === 0 && ((1 << (_la - 38)) & 95) !== 0)) {
                    {
                    this.state = 171;
                    this.expr(0);
                    }
                }

                this.state = 174;
                this.match(VisLangParser.Rparen);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public funCall(): FunCallContext {
        let localContext = new FunCallContext(this.context, this.state);
        this.enterRule(localContext, 30, VisLangParser.RULE_funCall);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 177;
            this.match(VisLangParser.Identifier);
            this.state = 178;
            this.match(VisLangParser.Lparen);
            this.state = 179;
            this.params();
            this.state = 180;
            this.match(VisLangParser.Rparen);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public block(): BlockContext {
        let localContext = new BlockContext(this.context, this.state);
        this.enterRule(localContext, 32, VisLangParser.RULE_block);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 188;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 3892322562) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & 6083) !== 0)) {
                {
                this.state = 186;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 14, this.context) ) {
                case 1:
                    {
                    this.state = 182;
                    this.expr(0);
                    this.state = 183;
                    this.match(VisLangParser.Semicolon);
                    }
                    break;
                case 2:
                    {
                    this.state = 185;
                    this.statement();
                    }
                    break;
                }
                }
                this.state = 190;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 192;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 34) {
                {
                this.state = 191;
                this.returnStatement();
                }
            }

            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public returnStatement(): ReturnStatementContext {
        let localContext = new ReturnStatementContext(this.context, this.state);
        this.enterRule(localContext, 34, VisLangParser.RULE_returnStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 194;
            this.match(VisLangParser.Return);
            this.state = 195;
            this.expr(0);
            this.state = 196;
            this.match(VisLangParser.Semicolon);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public expr(): ExprContext;
    public expr(_p: number): ExprContext;
    public expr(_p?: number): ExprContext {
        if (_p === undefined) {
            _p = 0;
        }

        let parentContext = this.context;
        let parentState = this.state;
        let localContext = new ExprContext(this.context, parentState);
        let previousContext = localContext;
        let _startState = 36;
        this.enterRecursionRule(localContext, 36, VisLangParser.RULE_expr, _p);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 214;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 17, this.context) ) {
            case 1:
                {
                localContext = new UnaryNotContext(localContext);
                this.context = localContext;
                previousContext = localContext;

                this.state = 199;
                this.match(VisLangParser.Not);
                this.state = 200;
                this.expr(17);
                }
                break;
            case 2:
                {
                localContext = new UnaryMinContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 201;
                this.match(VisLangParser.Sub);
                this.state = 202;
                this.expr(16);
                }
                break;
            case 3:
                {
                localContext = new IntLiteralContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 203;
                this.match(VisLangParser.Integer);
                }
                break;
            case 4:
                {
                localContext = new DoubleLiteralContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 204;
                this.match(VisLangParser.Double);
                }
                break;
            case 5:
                {
                localContext = new StringLiteralContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 205;
                this.match(VisLangParser.String);
                }
                break;
            case 6:
                {
                localContext = new BooleanLiteralContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 206;
                this.match(VisLangParser.Boolean);
                }
                break;
            case 7:
                {
                localContext = new IdentifierContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 207;
                this.match(VisLangParser.Identifier);
                }
                break;
            case 8:
                {
                localContext = new NullContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 208;
                this.match(VisLangParser.Null);
                }
                break;
            case 9:
                {
                localContext = new GroupingsContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 209;
                this.match(VisLangParser.Lparen);
                this.state = 210;
                this.expr(0);
                this.state = 211;
                this.match(VisLangParser.Rparen);
                }
                break;
            case 10:
                {
                localContext = new FunCallExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 213;
                this.funCall();
                }
                break;
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 239;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 19, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 237;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 18, this.context) ) {
                    case 1:
                        {
                        localContext = new BinaryMulContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, VisLangParser.RULE_expr);
                        this.state = 216;
                        if (!(this.precpred(this.context, 15))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 15)");
                        }
                        this.state = 217;
                        (localContext as BinaryMulContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 3584) !== 0))) {
                            (localContext as BinaryMulContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 218;
                        this.expr(16);
                        }
                        break;
                    case 2:
                        {
                        localContext = new BinaryAddContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, VisLangParser.RULE_expr);
                        this.state = 219;
                        if (!(this.precpred(this.context, 14))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 14)");
                        }
                        this.state = 220;
                        (localContext as BinaryAddContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 12 || _la === 13)) {
                            (localContext as BinaryAddContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 221;
                        this.expr(15);
                        }
                        break;
                    case 3:
                        {
                        localContext = new ComparisonContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, VisLangParser.RULE_expr);
                        this.state = 222;
                        if (!(this.precpred(this.context, 13))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 13)");
                        }
                        this.state = 223;
                        (localContext as ComparisonContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 245760) !== 0))) {
                            (localContext as ComparisonContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 224;
                        this.expr(14);
                        }
                        break;
                    case 4:
                        {
                        localContext = new EqualityContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, VisLangParser.RULE_expr);
                        this.state = 225;
                        if (!(this.precpred(this.context, 12))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 12)");
                        }
                        this.state = 226;
                        (localContext as EqualityContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 18 || _la === 19)) {
                            (localContext as EqualityContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 227;
                        this.expr(13);
                        }
                        break;
                    case 5:
                        {
                        localContext = new AssignActionContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, VisLangParser.RULE_expr);
                        this.state = 228;
                        if (!(this.precpred(this.context, 11))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 11)");
                        }
                        this.state = 229;
                        (localContext as AssignActionContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 65011712) !== 0))) {
                            (localContext as AssignActionContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 230;
                        this.expr(12);
                        }
                        break;
                    case 6:
                        {
                        localContext = new LogicalAndContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, VisLangParser.RULE_expr);
                        this.state = 231;
                        if (!(this.precpred(this.context, 10))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 10)");
                        }
                        this.state = 232;
                        this.match(VisLangParser.And);
                        this.state = 233;
                        this.expr(11);
                        }
                        break;
                    case 7:
                        {
                        localContext = new LogicalOrContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, VisLangParser.RULE_expr);
                        this.state = 234;
                        if (!(this.precpred(this.context, 9))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 9)");
                        }
                        this.state = 235;
                        this.match(VisLangParser.Or);
                        this.state = 236;
                        this.expr(10);
                        }
                        break;
                    }
                    }
                }
                this.state = 241;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 19, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.unrollRecursionContexts(parentContext);
        }
        return localContext;
    }
    public assignment(): AssignmentContext {
        let localContext = new AssignmentContext(this.context, this.state);
        this.enterRule(localContext, 38, VisLangParser.RULE_assignment);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 242;
            this.match(VisLangParser.Identifier);
            this.state = 243;
            this.match(VisLangParser.Assign);
            this.state = 246;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 20, this.context) ) {
            case 1:
                {
                this.state = 244;
                this.expr(0);
                }
                break;
            case 2:
                {
                this.state = 245;
                this.funCall();
                }
                break;
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public override sempred(localContext: antlr.ParserRuleContext | null, ruleIndex: number, predIndex: number): boolean {
        switch (ruleIndex) {
        case 18:
            return this.expr_sempred(localContext as ExprContext, predIndex);
        }
        return true;
    }
    private expr_sempred(localContext: ExprContext | null, predIndex: number): boolean {
        switch (predIndex) {
        case 0:
            return this.precpred(this.context, 15);
        case 1:
            return this.precpred(this.context, 14);
        case 2:
            return this.precpred(this.context, 13);
        case 3:
            return this.precpred(this.context, 12);
        case 4:
            return this.precpred(this.context, 11);
        case 5:
            return this.precpred(this.context, 10);
        case 6:
            return this.precpred(this.context, 9);
        }
        return true;
    }

    public static readonly _serializedATN: number[] = [
        4,1,45,249,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,
        2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,1,0,
        1,0,1,0,1,1,1,1,1,1,1,1,1,1,4,1,49,8,1,11,1,12,1,50,1,2,1,2,1,3,
        1,3,1,3,1,3,3,3,59,8,3,1,3,1,3,1,3,1,3,1,3,1,4,1,4,1,4,5,4,69,8,
        4,10,4,12,4,72,9,4,1,4,1,4,1,4,5,4,77,8,4,10,4,12,4,80,9,4,3,4,82,
        8,4,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,3,5,94,8,5,1,6,1,6,5,
        6,98,8,6,10,6,12,6,101,9,6,1,6,3,6,104,8,6,1,7,1,7,1,7,1,7,1,7,1,
        7,1,7,1,7,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,9,1,9,1,9,1,9,1,
        9,1,10,1,10,1,10,1,10,1,10,1,10,1,10,1,10,1,10,1,10,1,11,1,11,1,
        11,1,11,1,11,1,11,1,11,1,11,1,12,1,12,1,12,1,12,1,12,3,12,151,8,
        12,1,12,1,12,1,12,1,12,1,12,1,12,1,12,1,13,1,13,3,13,162,8,13,1,
        14,1,14,1,14,3,14,167,8,14,1,14,1,14,1,14,1,14,3,14,173,8,14,1,14,
        3,14,176,8,14,1,15,1,15,1,15,1,15,1,15,1,16,1,16,1,16,1,16,5,16,
        187,8,16,10,16,12,16,190,9,16,1,16,3,16,193,8,16,1,17,1,17,1,17,
        1,17,1,18,1,18,1,18,1,18,1,18,1,18,1,18,1,18,1,18,1,18,1,18,1,18,
        1,18,1,18,1,18,1,18,3,18,215,8,18,1,18,1,18,1,18,1,18,1,18,1,18,
        1,18,1,18,1,18,1,18,1,18,1,18,1,18,1,18,1,18,1,18,1,18,1,18,1,18,
        1,18,1,18,5,18,238,8,18,10,18,12,18,241,9,18,1,19,1,19,1,19,1,19,
        3,19,247,8,19,1,19,3,70,78,99,1,36,20,0,2,4,6,8,10,12,14,16,18,20,
        22,24,26,28,30,32,34,36,38,0,6,2,0,41,41,44,44,1,0,9,11,1,0,12,13,
        1,0,14,17,1,0,18,19,1,0,21,25,268,0,40,1,0,0,0,2,48,1,0,0,0,4,52,
        1,0,0,0,6,54,1,0,0,0,8,81,1,0,0,0,10,93,1,0,0,0,12,95,1,0,0,0,14,
        105,1,0,0,0,16,113,1,0,0,0,18,122,1,0,0,0,20,127,1,0,0,0,22,137,
        1,0,0,0,24,145,1,0,0,0,26,161,1,0,0,0,28,175,1,0,0,0,30,177,1,0,
        0,0,32,188,1,0,0,0,34,194,1,0,0,0,36,214,1,0,0,0,38,242,1,0,0,0,
        40,41,3,2,1,0,41,42,5,0,0,1,42,1,1,0,0,0,43,49,3,10,5,0,44,49,3,
        4,2,0,45,46,3,36,18,0,46,47,5,7,0,0,47,49,1,0,0,0,48,43,1,0,0,0,
        48,44,1,0,0,0,48,45,1,0,0,0,49,50,1,0,0,0,50,48,1,0,0,0,50,51,1,
        0,0,0,51,3,1,0,0,0,52,53,3,6,3,0,53,5,1,0,0,0,54,55,5,26,0,0,55,
        56,5,44,0,0,56,58,5,1,0,0,57,59,3,8,4,0,58,57,1,0,0,0,58,59,1,0,
        0,0,59,60,1,0,0,0,60,61,5,2,0,0,61,62,5,3,0,0,62,63,3,32,16,0,63,
        64,5,4,0,0,64,7,1,0,0,0,65,70,5,44,0,0,66,67,5,5,0,0,67,69,5,44,
        0,0,68,66,1,0,0,0,69,72,1,0,0,0,70,71,1,0,0,0,70,68,1,0,0,0,71,82,
        1,0,0,0,72,70,1,0,0,0,73,78,3,36,18,0,74,75,5,5,0,0,75,77,3,36,18,
        0,76,74,1,0,0,0,77,80,1,0,0,0,78,79,1,0,0,0,78,76,1,0,0,0,79,82,
        1,0,0,0,80,78,1,0,0,0,81,65,1,0,0,0,81,73,1,0,0,0,82,9,1,0,0,0,83,
        84,3,38,19,0,84,85,5,7,0,0,85,94,1,0,0,0,86,94,3,12,6,0,87,94,3,
        20,10,0,88,94,3,22,11,0,89,94,3,24,12,0,90,91,3,26,13,0,91,92,5,
        7,0,0,92,94,1,0,0,0,93,83,1,0,0,0,93,86,1,0,0,0,93,87,1,0,0,0,93,
        88,1,0,0,0,93,89,1,0,0,0,93,90,1,0,0,0,94,11,1,0,0,0,95,99,3,14,
        7,0,96,98,3,16,8,0,97,96,1,0,0,0,98,101,1,0,0,0,99,100,1,0,0,0,99,
        97,1,0,0,0,100,103,1,0,0,0,101,99,1,0,0,0,102,104,3,18,9,0,103,102,
        1,0,0,0,103,104,1,0,0,0,104,13,1,0,0,0,105,106,5,27,0,0,106,107,
        5,1,0,0,107,108,3,36,18,0,108,109,5,2,0,0,109,110,5,3,0,0,110,111,
        3,32,16,0,111,112,5,4,0,0,112,15,1,0,0,0,113,114,5,28,0,0,114,115,
        5,27,0,0,115,116,5,1,0,0,116,117,3,36,18,0,117,118,5,2,0,0,118,119,
        5,3,0,0,119,120,3,32,16,0,120,121,5,4,0,0,121,17,1,0,0,0,122,123,
        5,28,0,0,123,124,5,3,0,0,124,125,3,32,16,0,125,126,5,4,0,0,126,19,
        1,0,0,0,127,128,5,30,0,0,128,129,5,3,0,0,129,130,3,32,16,0,130,131,
        5,4,0,0,131,132,5,31,0,0,132,133,5,1,0,0,133,134,3,36,18,0,134,135,
        5,2,0,0,135,136,5,7,0,0,136,21,1,0,0,0,137,138,5,31,0,0,138,139,
        5,1,0,0,139,140,3,36,18,0,140,141,5,2,0,0,141,142,5,3,0,0,142,143,
        3,32,16,0,143,144,5,4,0,0,144,23,1,0,0,0,145,146,5,29,0,0,146,150,
        5,1,0,0,147,151,3,38,19,0,148,151,5,44,0,0,149,151,5,41,0,0,150,
        147,1,0,0,0,150,148,1,0,0,0,150,149,1,0,0,0,151,152,1,0,0,0,152,
        153,5,35,0,0,153,154,7,0,0,0,154,155,5,2,0,0,155,156,5,3,0,0,156,
        157,3,32,16,0,157,158,5,4,0,0,158,25,1,0,0,0,159,162,3,28,14,0,160,
        162,3,30,15,0,161,159,1,0,0,0,161,160,1,0,0,0,162,27,1,0,0,0,163,
        164,5,32,0,0,164,166,5,1,0,0,165,167,3,36,18,0,166,165,1,0,0,0,166,
        167,1,0,0,0,167,168,1,0,0,0,168,176,5,2,0,0,169,170,5,33,0,0,170,
        172,5,1,0,0,171,173,3,36,18,0,172,171,1,0,0,0,172,173,1,0,0,0,173,
        174,1,0,0,0,174,176,5,2,0,0,175,163,1,0,0,0,175,169,1,0,0,0,176,
        29,1,0,0,0,177,178,5,44,0,0,178,179,5,1,0,0,179,180,3,8,4,0,180,
        181,5,2,0,0,181,31,1,0,0,0,182,183,3,36,18,0,183,184,5,7,0,0,184,
        187,1,0,0,0,185,187,3,10,5,0,186,182,1,0,0,0,186,185,1,0,0,0,187,
        190,1,0,0,0,188,186,1,0,0,0,188,189,1,0,0,0,189,192,1,0,0,0,190,
        188,1,0,0,0,191,193,3,34,17,0,192,191,1,0,0,0,192,193,1,0,0,0,193,
        33,1,0,0,0,194,195,5,34,0,0,195,196,3,36,18,0,196,197,5,7,0,0,197,
        35,1,0,0,0,198,199,6,18,-1,0,199,200,5,8,0,0,200,215,3,36,18,17,
        201,202,5,13,0,0,202,215,3,36,18,16,203,215,5,41,0,0,204,215,5,42,
        0,0,205,215,5,40,0,0,206,215,5,39,0,0,207,215,5,44,0,0,208,215,5,
        38,0,0,209,210,5,1,0,0,210,211,3,36,18,0,211,212,5,2,0,0,212,215,
        1,0,0,0,213,215,3,30,15,0,214,198,1,0,0,0,214,201,1,0,0,0,214,203,
        1,0,0,0,214,204,1,0,0,0,214,205,1,0,0,0,214,206,1,0,0,0,214,207,
        1,0,0,0,214,208,1,0,0,0,214,209,1,0,0,0,214,213,1,0,0,0,215,239,
        1,0,0,0,216,217,10,15,0,0,217,218,7,1,0,0,218,238,3,36,18,16,219,
        220,10,14,0,0,220,221,7,2,0,0,221,238,3,36,18,15,222,223,10,13,0,
        0,223,224,7,3,0,0,224,238,3,36,18,14,225,226,10,12,0,0,226,227,7,
        4,0,0,227,238,3,36,18,13,228,229,10,11,0,0,229,230,7,5,0,0,230,238,
        3,36,18,12,231,232,10,10,0,0,232,233,5,36,0,0,233,238,3,36,18,11,
        234,235,10,9,0,0,235,236,5,37,0,0,236,238,3,36,18,10,237,216,1,0,
        0,0,237,219,1,0,0,0,237,222,1,0,0,0,237,225,1,0,0,0,237,228,1,0,
        0,0,237,231,1,0,0,0,237,234,1,0,0,0,238,241,1,0,0,0,239,237,1,0,
        0,0,239,240,1,0,0,0,240,37,1,0,0,0,241,239,1,0,0,0,242,243,5,44,
        0,0,243,246,5,20,0,0,244,247,3,36,18,0,245,247,3,30,15,0,246,244,
        1,0,0,0,246,245,1,0,0,0,247,39,1,0,0,0,21,48,50,58,70,78,81,93,99,
        103,150,161,166,172,175,186,188,192,214,237,239,246
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!VisLangParser.__ATN) {
            VisLangParser.__ATN = new antlr.ATNDeserializer().deserialize(VisLangParser._serializedATN);
        }

        return VisLangParser.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(VisLangParser.literalNames, VisLangParser.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return VisLangParser.vocabulary;
    }

    private static readonly decisionsToDFA = VisLangParser._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}

export class ProgramContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public body(): BodyContext {
        return this.getRuleContext(0, BodyContext)!;
    }
    public EOF(): antlr.TerminalNode {
        return this.getToken(VisLangParser.EOF, 0)!;
    }
    public override get ruleIndex(): number {
        return VisLangParser.RULE_program;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterProgram) {
             listener.enterProgram(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitProgram) {
             listener.exitProgram(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitProgram) {
            return visitor.visitProgram(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class BodyContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public statement(): StatementContext[];
    public statement(i: number): StatementContext | null;
    public statement(i?: number): StatementContext[] | StatementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StatementContext);
        }

        return this.getRuleContext(i, StatementContext);
    }
    public declaration(): DeclarationContext[];
    public declaration(i: number): DeclarationContext | null;
    public declaration(i?: number): DeclarationContext[] | DeclarationContext | null {
        if (i === undefined) {
            return this.getRuleContexts(DeclarationContext);
        }

        return this.getRuleContext(i, DeclarationContext);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public Semicolon(): antlr.TerminalNode[];
    public Semicolon(i: number): antlr.TerminalNode | null;
    public Semicolon(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(VisLangParser.Semicolon);
    	} else {
    		return this.getToken(VisLangParser.Semicolon, i);
    	}
    }
    public override get ruleIndex(): number {
        return VisLangParser.RULE_body;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterBody) {
             listener.enterBody(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitBody) {
             listener.exitBody(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitBody) {
            return visitor.visitBody(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class DeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public funDecl(): FunDeclContext {
        return this.getRuleContext(0, FunDeclContext)!;
    }
    public override get ruleIndex(): number {
        return VisLangParser.RULE_declaration;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterDeclaration) {
             listener.enterDeclaration(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitDeclaration) {
             listener.exitDeclaration(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitDeclaration) {
            return visitor.visitDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class FunDeclContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public Fun(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Fun, 0)!;
    }
    public Identifier(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Identifier, 0)!;
    }
    public Lparen(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Lparen, 0)!;
    }
    public Rparen(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Rparen, 0)!;
    }
    public Lbrace(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Lbrace, 0)!;
    }
    public block(): BlockContext {
        return this.getRuleContext(0, BlockContext)!;
    }
    public Rbrace(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Rbrace, 0)!;
    }
    public params(): ParamsContext | null {
        return this.getRuleContext(0, ParamsContext);
    }
    public override get ruleIndex(): number {
        return VisLangParser.RULE_funDecl;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterFunDecl) {
             listener.enterFunDecl(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitFunDecl) {
             listener.exitFunDecl(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitFunDecl) {
            return visitor.visitFunDecl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ParamsContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public Identifier(): antlr.TerminalNode[];
    public Identifier(i: number): antlr.TerminalNode | null;
    public Identifier(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(VisLangParser.Identifier);
    	} else {
    		return this.getToken(VisLangParser.Identifier, i);
    	}
    }
    public Comma(): antlr.TerminalNode[];
    public Comma(i: number): antlr.TerminalNode | null;
    public Comma(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(VisLangParser.Comma);
    	} else {
    		return this.getToken(VisLangParser.Comma, i);
    	}
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public override get ruleIndex(): number {
        return VisLangParser.RULE_params;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterParams) {
             listener.enterParams(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitParams) {
             listener.exitParams(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitParams) {
            return visitor.visitParams(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class StatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public assignment(): AssignmentContext | null {
        return this.getRuleContext(0, AssignmentContext);
    }
    public Semicolon(): antlr.TerminalNode | null {
        return this.getToken(VisLangParser.Semicolon, 0);
    }
    public ifStatement(): IfStatementContext | null {
        return this.getRuleContext(0, IfStatementContext);
    }
    public doWhileStat(): DoWhileStatContext | null {
        return this.getRuleContext(0, DoWhileStatContext);
    }
    public whileStat(): WhileStatContext | null {
        return this.getRuleContext(0, WhileStatContext);
    }
    public forStat(): ForStatContext | null {
        return this.getRuleContext(0, ForStatContext);
    }
    public callStat(): CallStatContext | null {
        return this.getRuleContext(0, CallStatContext);
    }
    public override get ruleIndex(): number {
        return VisLangParser.RULE_statement;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterStatement) {
             listener.enterStatement(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitStatement) {
             listener.exitStatement(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitStatement) {
            return visitor.visitStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class IfStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public ifStat(): IfStatContext {
        return this.getRuleContext(0, IfStatContext)!;
    }
    public elifStat(): ElifStatContext[];
    public elifStat(i: number): ElifStatContext | null;
    public elifStat(i?: number): ElifStatContext[] | ElifStatContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ElifStatContext);
        }

        return this.getRuleContext(i, ElifStatContext);
    }
    public elseStat(): ElseStatContext | null {
        return this.getRuleContext(0, ElseStatContext);
    }
    public override get ruleIndex(): number {
        return VisLangParser.RULE_ifStatement;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterIfStatement) {
             listener.enterIfStatement(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitIfStatement) {
             listener.exitIfStatement(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitIfStatement) {
            return visitor.visitIfStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class IfStatContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public If(): antlr.TerminalNode {
        return this.getToken(VisLangParser.If, 0)!;
    }
    public Lparen(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Lparen, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public Rparen(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Rparen, 0)!;
    }
    public Lbrace(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Lbrace, 0)!;
    }
    public block(): BlockContext {
        return this.getRuleContext(0, BlockContext)!;
    }
    public Rbrace(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Rbrace, 0)!;
    }
    public override get ruleIndex(): number {
        return VisLangParser.RULE_ifStat;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterIfStat) {
             listener.enterIfStat(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitIfStat) {
             listener.exitIfStat(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitIfStat) {
            return visitor.visitIfStat(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ElifStatContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public Else(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Else, 0)!;
    }
    public If(): antlr.TerminalNode {
        return this.getToken(VisLangParser.If, 0)!;
    }
    public Lparen(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Lparen, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public Rparen(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Rparen, 0)!;
    }
    public Lbrace(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Lbrace, 0)!;
    }
    public block(): BlockContext {
        return this.getRuleContext(0, BlockContext)!;
    }
    public Rbrace(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Rbrace, 0)!;
    }
    public override get ruleIndex(): number {
        return VisLangParser.RULE_elifStat;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterElifStat) {
             listener.enterElifStat(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitElifStat) {
             listener.exitElifStat(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitElifStat) {
            return visitor.visitElifStat(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ElseStatContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public Else(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Else, 0)!;
    }
    public Lbrace(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Lbrace, 0)!;
    }
    public block(): BlockContext {
        return this.getRuleContext(0, BlockContext)!;
    }
    public Rbrace(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Rbrace, 0)!;
    }
    public override get ruleIndex(): number {
        return VisLangParser.RULE_elseStat;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterElseStat) {
             listener.enterElseStat(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitElseStat) {
             listener.exitElseStat(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitElseStat) {
            return visitor.visitElseStat(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class DoWhileStatContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public Do(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Do, 0)!;
    }
    public Lbrace(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Lbrace, 0)!;
    }
    public block(): BlockContext {
        return this.getRuleContext(0, BlockContext)!;
    }
    public Rbrace(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Rbrace, 0)!;
    }
    public While(): antlr.TerminalNode {
        return this.getToken(VisLangParser.While, 0)!;
    }
    public Lparen(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Lparen, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public Rparen(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Rparen, 0)!;
    }
    public Semicolon(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Semicolon, 0)!;
    }
    public override get ruleIndex(): number {
        return VisLangParser.RULE_doWhileStat;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterDoWhileStat) {
             listener.enterDoWhileStat(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitDoWhileStat) {
             listener.exitDoWhileStat(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitDoWhileStat) {
            return visitor.visitDoWhileStat(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class WhileStatContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public While(): antlr.TerminalNode {
        return this.getToken(VisLangParser.While, 0)!;
    }
    public Lparen(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Lparen, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public Rparen(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Rparen, 0)!;
    }
    public Lbrace(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Lbrace, 0)!;
    }
    public block(): BlockContext {
        return this.getRuleContext(0, BlockContext)!;
    }
    public Rbrace(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Rbrace, 0)!;
    }
    public override get ruleIndex(): number {
        return VisLangParser.RULE_whileStat;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterWhileStat) {
             listener.enterWhileStat(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitWhileStat) {
             listener.exitWhileStat(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitWhileStat) {
            return visitor.visitWhileStat(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ForStatContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public For(): antlr.TerminalNode {
        return this.getToken(VisLangParser.For, 0)!;
    }
    public Lparen(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Lparen, 0)!;
    }
    public In(): antlr.TerminalNode {
        return this.getToken(VisLangParser.In, 0)!;
    }
    public Rparen(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Rparen, 0)!;
    }
    public Lbrace(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Lbrace, 0)!;
    }
    public block(): BlockContext {
        return this.getRuleContext(0, BlockContext)!;
    }
    public Rbrace(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Rbrace, 0)!;
    }
    public Identifier(): antlr.TerminalNode[];
    public Identifier(i: number): antlr.TerminalNode | null;
    public Identifier(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(VisLangParser.Identifier);
    	} else {
    		return this.getToken(VisLangParser.Identifier, i);
    	}
    }
    public Integer(): antlr.TerminalNode[];
    public Integer(i: number): antlr.TerminalNode | null;
    public Integer(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(VisLangParser.Integer);
    	} else {
    		return this.getToken(VisLangParser.Integer, i);
    	}
    }
    public assignment(): AssignmentContext | null {
        return this.getRuleContext(0, AssignmentContext);
    }
    public override get ruleIndex(): number {
        return VisLangParser.RULE_forStat;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterForStat) {
             listener.enterForStat(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitForStat) {
             listener.exitForStat(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitForStat) {
            return visitor.visitForStat(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class CallStatContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public printCall(): PrintCallContext | null {
        return this.getRuleContext(0, PrintCallContext);
    }
    public funCall(): FunCallContext | null {
        return this.getRuleContext(0, FunCallContext);
    }
    public override get ruleIndex(): number {
        return VisLangParser.RULE_callStat;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterCallStat) {
             listener.enterCallStat(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitCallStat) {
             listener.exitCallStat(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitCallStat) {
            return visitor.visitCallStat(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class PrintCallContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return VisLangParser.RULE_printCall;
    }
    public override copyFrom(ctx: PrintCallContext): void {
        super.copyFrom(ctx);
    }
}
export class PrintContext extends PrintCallContext {
    public constructor(ctx: PrintCallContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public Print(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Print, 0)!;
    }
    public Lparen(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Lparen, 0)!;
    }
    public Rparen(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Rparen, 0)!;
    }
    public expr(): ExprContext | null {
        return this.getRuleContext(0, ExprContext);
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterPrint) {
             listener.enterPrint(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitPrint) {
             listener.exitPrint(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitPrint) {
            return visitor.visitPrint(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class PrintlnContext extends PrintCallContext {
    public constructor(ctx: PrintCallContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public Println(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Println, 0)!;
    }
    public Lparen(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Lparen, 0)!;
    }
    public Rparen(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Rparen, 0)!;
    }
    public expr(): ExprContext | null {
        return this.getRuleContext(0, ExprContext);
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterPrintln) {
             listener.enterPrintln(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitPrintln) {
             listener.exitPrintln(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitPrintln) {
            return visitor.visitPrintln(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class FunCallContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public Identifier(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Identifier, 0)!;
    }
    public Lparen(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Lparen, 0)!;
    }
    public params(): ParamsContext {
        return this.getRuleContext(0, ParamsContext)!;
    }
    public Rparen(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Rparen, 0)!;
    }
    public override get ruleIndex(): number {
        return VisLangParser.RULE_funCall;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterFunCall) {
             listener.enterFunCall(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitFunCall) {
             listener.exitFunCall(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitFunCall) {
            return visitor.visitFunCall(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class BlockContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public Semicolon(): antlr.TerminalNode[];
    public Semicolon(i: number): antlr.TerminalNode | null;
    public Semicolon(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(VisLangParser.Semicolon);
    	} else {
    		return this.getToken(VisLangParser.Semicolon, i);
    	}
    }
    public statement(): StatementContext[];
    public statement(i: number): StatementContext | null;
    public statement(i?: number): StatementContext[] | StatementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StatementContext);
        }

        return this.getRuleContext(i, StatementContext);
    }
    public returnStatement(): ReturnStatementContext | null {
        return this.getRuleContext(0, ReturnStatementContext);
    }
    public override get ruleIndex(): number {
        return VisLangParser.RULE_block;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterBlock) {
             listener.enterBlock(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitBlock) {
             listener.exitBlock(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitBlock) {
            return visitor.visitBlock(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ReturnStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public Return(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Return, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public Semicolon(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Semicolon, 0)!;
    }
    public override get ruleIndex(): number {
        return VisLangParser.RULE_returnStatement;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterReturnStatement) {
             listener.enterReturnStatement(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitReturnStatement) {
             listener.exitReturnStatement(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitReturnStatement) {
            return visitor.visitReturnStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ExprContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return VisLangParser.RULE_expr;
    }
    public override copyFrom(ctx: ExprContext): void {
        super.copyFrom(ctx);
    }
}
export class IdentifierContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public Identifier(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Identifier, 0)!;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterIdentifier) {
             listener.enterIdentifier(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitIdentifier) {
             listener.exitIdentifier(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitIdentifier) {
            return visitor.visitIdentifier(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class BinaryMulContext extends ExprContext {
    public _op?: Token | null;
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public Mul(): antlr.TerminalNode | null {
        return this.getToken(VisLangParser.Mul, 0);
    }
    public Div(): antlr.TerminalNode | null {
        return this.getToken(VisLangParser.Div, 0);
    }
    public Mod(): antlr.TerminalNode | null {
        return this.getToken(VisLangParser.Mod, 0);
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterBinaryMul) {
             listener.enterBinaryMul(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitBinaryMul) {
             listener.exitBinaryMul(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitBinaryMul) {
            return visitor.visitBinaryMul(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class ComparisonContext extends ExprContext {
    public _op?: Token | null;
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public Langle(): antlr.TerminalNode | null {
        return this.getToken(VisLangParser.Langle, 0);
    }
    public Rangle(): antlr.TerminalNode | null {
        return this.getToken(VisLangParser.Rangle, 0);
    }
    public Leq(): antlr.TerminalNode | null {
        return this.getToken(VisLangParser.Leq, 0);
    }
    public Req(): antlr.TerminalNode | null {
        return this.getToken(VisLangParser.Req, 0);
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterComparison) {
             listener.enterComparison(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitComparison) {
             listener.exitComparison(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitComparison) {
            return visitor.visitComparison(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IntLiteralContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public Integer(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Integer, 0)!;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterIntLiteral) {
             listener.enterIntLiteral(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitIntLiteral) {
             listener.exitIntLiteral(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitIntLiteral) {
            return visitor.visitIntLiteral(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class LogicalAndContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public And(): antlr.TerminalNode {
        return this.getToken(VisLangParser.And, 0)!;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterLogicalAnd) {
             listener.enterLogicalAnd(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitLogicalAnd) {
             listener.exitLogicalAnd(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitLogicalAnd) {
            return visitor.visitLogicalAnd(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class FunCallExprContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public funCall(): FunCallContext {
        return this.getRuleContext(0, FunCallContext)!;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterFunCallExpr) {
             listener.enterFunCallExpr(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitFunCallExpr) {
             listener.exitFunCallExpr(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitFunCallExpr) {
            return visitor.visitFunCallExpr(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class AssignActionContext extends ExprContext {
    public _op?: Token | null;
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public Add_Assign(): antlr.TerminalNode | null {
        return this.getToken(VisLangParser.Add_Assign, 0);
    }
    public Sub_Assign(): antlr.TerminalNode | null {
        return this.getToken(VisLangParser.Sub_Assign, 0);
    }
    public Mul_Assign(): antlr.TerminalNode | null {
        return this.getToken(VisLangParser.Mul_Assign, 0);
    }
    public Div_Assign(): antlr.TerminalNode | null {
        return this.getToken(VisLangParser.Div_Assign, 0);
    }
    public Mod_Assign(): antlr.TerminalNode | null {
        return this.getToken(VisLangParser.Mod_Assign, 0);
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterAssignAction) {
             listener.enterAssignAction(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitAssignAction) {
             listener.exitAssignAction(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitAssignAction) {
            return visitor.visitAssignAction(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class NullContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public Null(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Null, 0)!;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterNull) {
             listener.enterNull(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitNull) {
             listener.exitNull(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitNull) {
            return visitor.visitNull(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class StringLiteralContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public String(): antlr.TerminalNode {
        return this.getToken(VisLangParser.String, 0)!;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterStringLiteral) {
             listener.enterStringLiteral(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitStringLiteral) {
             listener.exitStringLiteral(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitStringLiteral) {
            return visitor.visitStringLiteral(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class GroupingsContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public Lparen(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Lparen, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public Rparen(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Rparen, 0)!;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterGroupings) {
             listener.enterGroupings(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitGroupings) {
             listener.exitGroupings(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitGroupings) {
            return visitor.visitGroupings(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class UnaryMinContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public Sub(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Sub, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterUnaryMin) {
             listener.enterUnaryMin(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitUnaryMin) {
             listener.exitUnaryMin(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitUnaryMin) {
            return visitor.visitUnaryMin(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class DoubleLiteralContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public Double(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Double, 0)!;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterDoubleLiteral) {
             listener.enterDoubleLiteral(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitDoubleLiteral) {
             listener.exitDoubleLiteral(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitDoubleLiteral) {
            return visitor.visitDoubleLiteral(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class LogicalOrContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public Or(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Or, 0)!;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterLogicalOr) {
             listener.enterLogicalOr(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitLogicalOr) {
             listener.exitLogicalOr(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitLogicalOr) {
            return visitor.visitLogicalOr(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class BooleanLiteralContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public Boolean(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Boolean, 0)!;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterBooleanLiteral) {
             listener.enterBooleanLiteral(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitBooleanLiteral) {
             listener.exitBooleanLiteral(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitBooleanLiteral) {
            return visitor.visitBooleanLiteral(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class EqualityContext extends ExprContext {
    public _op?: Token | null;
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public Eqeq(): antlr.TerminalNode | null {
        return this.getToken(VisLangParser.Eqeq, 0);
    }
    public Neq(): antlr.TerminalNode | null {
        return this.getToken(VisLangParser.Neq, 0);
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterEquality) {
             listener.enterEquality(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitEquality) {
             listener.exitEquality(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitEquality) {
            return visitor.visitEquality(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class UnaryNotContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public Not(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Not, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterUnaryNot) {
             listener.enterUnaryNot(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitUnaryNot) {
             listener.exitUnaryNot(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitUnaryNot) {
            return visitor.visitUnaryNot(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class BinaryAddContext extends ExprContext {
    public _op?: Token | null;
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public Add(): antlr.TerminalNode | null {
        return this.getToken(VisLangParser.Add, 0);
    }
    public Sub(): antlr.TerminalNode | null {
        return this.getToken(VisLangParser.Sub, 0);
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterBinaryAdd) {
             listener.enterBinaryAdd(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitBinaryAdd) {
             listener.exitBinaryAdd(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitBinaryAdd) {
            return visitor.visitBinaryAdd(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class AssignmentContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public Identifier(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Identifier, 0)!;
    }
    public Assign(): antlr.TerminalNode {
        return this.getToken(VisLangParser.Assign, 0)!;
    }
    public expr(): ExprContext | null {
        return this.getRuleContext(0, ExprContext);
    }
    public funCall(): FunCallContext | null {
        return this.getRuleContext(0, FunCallContext);
    }
    public override get ruleIndex(): number {
        return VisLangParser.RULE_assignment;
    }
    public override enterRule(listener: VisLangListener): void {
        if(listener.enterAssignment) {
             listener.enterAssignment(this);
        }
    }
    public override exitRule(listener: VisLangListener): void {
        if(listener.exitAssignment) {
             listener.exitAssignment(this);
        }
    }
    public override accept<Result>(visitor: VisLangVisitor<Result>): Result | null {
        if (visitor.visitAssignment) {
            return visitor.visitAssignment(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}

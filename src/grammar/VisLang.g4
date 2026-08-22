grammar VisLang;



program
    : body EOF
    ;

body
    : (statement | declaration | expr Semicolon)+
    ;

declaration
    : funDecl
    ;

funDecl
    : Fun Identifier Lparen params? Rparen Lbrace block Rbrace
    ;

params
    : Identifier (Comma Identifier)*?
    | expr (Comma expr)*?
    ;

statement
    : assignment Semicolon
    | ifStatement
    | doWhileStat
    | whileStat
    | forStat
    | callStat Semicolon
    ;

ifStatement
    : ifStat elifStat*? elseStat?
    ;

ifStat
    : If Lparen expr Rparen Lbrace block Rbrace
    ;

elifStat
    : Else If Lparen expr Rparen Lbrace block Rbrace
    ;

elseStat
    : Else Lbrace block Rbrace
    ;


doWhileStat
    : Do Lbrace block Rbrace While Lparen expr Rparen Semicolon
    ;

whileStat
    : While Lparen expr Rparen Lbrace block Rbrace
    ;

forStat
    : For Lparen (assignment | Identifier | Integer) In (Identifier | Integer) Rparen Lbrace block Rbrace
    ;

callStat
    : printCall
    | funCall
    ;

printCall
    : Print Lparen expr? Rparen              #print
    | Println Lparen expr? Rparen            #println
    ;

funCall
    : Identifier Lparen params Rparen
    ;

block
    : (expr Semicolon | statement)*  returnStatement?
    ;

returnStatement
    : Return expr Semicolon
    ;

expr
    : Not expr                                                                                #unaryNot
    | Sub expr                                                                                #unaryMin
    | expr op=(Mul | Div | Mod) expr                                                          #binaryMul
    | expr op=(Add | Sub) expr                                                                #binaryAdd
    | expr op=(Langle | Rangle | Leq | Req) expr                                              #comparison
    | expr op=(Eqeq | Neq) expr                                                               #equality
    | expr op=(Add_Assign | Sub_Assign | Mul_Assign | Div_Assign | Mod_Assign) expr           #assignAction
    | expr And expr                                                                           #logicalAnd
    | expr Or expr                                                                            #logicalOr
    | Integer                                                                                 #intLiteral
    | Double                                                                                  #doubleLiteral
    | String                                                                                  #stringLiteral
    | Boolean                                                                                 #booleanLiteral
    | Identifier                                                                              #identifier
    | Null                                                                                    #null
    | Lparen expr Rparen                                                                      #groupings
    | funCall                                                                                 #funCallExpr
    ;

assignment
    : Identifier Assign (expr | funCall)
    ;


Lparen: '(';
Rparen: ')';
Lbrace: '{';
Rbrace: '}';
Comma: ',';
Colon: ':';
Semicolon: ';';

Not: '!';
Mul: '*';
Div: '/';
Mod: '%';
Add: '+';
Sub: '-';
Langle: '<';
Rangle: '>';
Leq: '<=';
Req: '>=';
Eqeq: '==';
Neq: '!=';
Assign: '=';
Add_Assign: '+=';
Sub_Assign: '-=';
Mul_Assign: '*=';
Div_Assign: '/=';
Mod_Assign: '%=';

Fun: 'fun';
If: 'if';
Else: 'else';
For: 'for';
Do: 'do';
While: 'while';
Print: 'print';
Println: 'println';
Return: 'return';
In: 'in';
And: 'and';
Or: 'or';
Null: 'null';

Boolean
    : 'true'
    | 'false'
    ;

String
    : ["] .*? ["]
    | ['] .*? [']
    ;

Integer
    : [1-9] Digit*
    | '0'
    ;

Double
    : Digit+ '.' Digit+
    ;

Comment
    : '//' .*? ->skip
    ;

Identifier
    : [a-zA-Z][a-zA-Z0-9]*
    ;

fragment Digit
    : [0-9]
    ;

Whitespace
    : (' ' | '\t' | '\r' | '\n') -> skip
    ;



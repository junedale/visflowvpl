import { rootLayer as root } from "../app-renderer.js";
import { funList as functions } from "../generator/function.js";
import { varList as variables } from "../generator/variable.js";
import { getInputPort, getNextPort, getNextNodeToParse } from "./parseglobal.js";


let funscript = "";
let funInRoot = [];
let whichFunction = null;


export function parseFunction() {
    funscript = "";
    functions.forEach(fun => fun.isDeclared = false);
    parse();
    return funscript;
}


function parse() {
    funInRoot = root.children.filter(child => child.type === "function");
    funInRoot.forEach(fun => {
        whichFunction = fun;
        if (!fun.nodeInfo.isDeclared) {
            let startNode = null;
            fun.childNodes.forEach(child => {
                if (child.type === "function-rep") {
                    startNode = child;
                    return;
                }
            });
            funscript += `fun ${fun.nodeInfo.title}`;
            let length = Object.keys(fun.nodeInfo.input).length;

            if (length === 0) {
                funscript += "(){\n";
            } else {
                funscript += "(";
                Object.keys(fun.nodeInfo.input).forEach((key, index) => {
                    if (index !== length - 1) {
                        funscript += `${fun.nodeInfo.input[key].title.toLowerCase()}, `;
                    } else {
                        funscript += `${fun.nodeInfo.input[key].title.toLowerCase()}) {\n`;
                    }
                });
            }
            parseNode(startNode);
            funscript += "}\n";
            fun.nodeInfo.isDeclared = true;
            functions.get(fun.nodeInfo.title + length).isDeclared = true;
        } else {
            return;
        }
    });
}


function parseNode(node) {
    if (node === null) {
        return;
    }

    let next = getNextPort(node);
    let input = getInputPort(node);

    if (node.type === "core") {
        switch (node.name().split(" ").join("")) {
            case "print":
                funscript += `print(${parseInput(input[0])});\n`;
                parseNode(getNextNodeToParse(next[0]));
                break;
            case "println":
                funscript += `println(${parseInput(input[0])});\n`;
                parseNode(getNextNodeToParse(next[0]));
                break;
            case "ifelse":
                funscript += `if(${parseInput(input[0])}) {\n`;
                parseNode(getNextNodeToParse(next[1]));
                funscript += `} else {\n`
                parseNode(getNextNodeToParse(next[2]));
                funscript += `}\n\n`
                parseNode(getNextNodeToParse(next[0]));
                break;
            case "whileloop":
                funscript += `while(${parseInput(input[0])}) {`;
                parseNode(getNextNodeToParse(next[1]));
                funscript += `}`
                break;
            case "dowhileloop":
                funscript += `do {\n`;
                parse(getNextNodeToParse(next[1]));
                funscript += `\n} while(${parseInput(input[0])});`
                parse(getNextNodeToParse(next[0]));
                break;
            case "forloop":
                let initial = parseInt(parseInput(input[0]));
                let end = parseInt(parseInput(input[1]));
                let condition = initial > end ? `index < ${end}` : `index < ${end}`;
                funscript += `for(index = ${initial}; ${condition}; index += ${parseInput(input[2])}) {\n`;
                parse(getNextNodeToParse(next[1]));
                funscript += `\n}`
                parse(getNextNodeToParse(next[0]));
                break;
            case "return":
                let value = parseInput(input[0]);
                whichFunction.nodeInfo.value = value;
                funscript += `return ${value};\n`;
                break;
        }
    } else if (node.type === "variable") {
        if (node.nodeInfo.dataType === "string") {
            funscript += `${node.nodeInfo.title} = "${parseInput(input[0])}";\n`;
        } else if (node.nodeInfo.dataType === "array") {
            funscript += `${node.nodeInfo.title} = [${parseInput(input[0])}];\n`;
        } else {
            funscript += `${node.nodeInfo.title} = ${parseInput(input[0])};\n`;
        }

        node.nodeInfo.isDeclared = true;
        variables.get(node.nodeInfo.title).isDeclared = true;
        parseNode(getNextNodeToParse(next[0]));
    } else if (node.type === "function-rep") {
        parseNode(getNextNodeToParse(next[0]));
    }
}

function parseInput(port) {
    let expression = "";

    if (port.incoming.size === 0) {
        return port.inputText.text();
    }

    let incoming = port.incoming.values().next().value.parent;
    let input = getInputPort(incoming);

    if (incoming.type === "core") {
        switch (incoming.name().split(' ').join('')) {
            case "add":
                expression += `(${parseInput(input[0])} + ${parseInput(input[1])})`;
                break;
            case "subtract":
                expression += `(${parseInput(input[0])} - ${parseInput(input[1])})`;
                break;
            case "multiply":
                expression += `(${parseInput(input[0])} * ${parseInput(input[1])})`;
                break;
            case "divide":
                expression += `(${parseInput(input[0])} / ${parseInput(input[1])})`;
                break;
            case "greaterthan":
                expression += `${parseInput(input[0])} > ${parseInput(input[1])}`;
                break;
            case "greaterorequal":
                expression += `${parseInput(input[0])} >= ${parseInput(input[1])}`;
                break;
            case "lessthan":
                expression += `${parseInput(input[0])} < ${parseInput(input[1])}`;
                break;
            case "lessorequal":
                expression += `${parseInput(input[0])} <= ${parseInput(input[1])}`;
                break;
            case "notequal":
                expression += `${parseInput(input[0])} != ${parseInput(input[1])}`;
                break;
            case "equal":
                expression += `${parseInput(input[0])} == ${parseInput(input[1])}`;
                break;
            case "and":
                expression += `${parseInput(input[0])} and ${parseInput(input[1])}`;
                break;
            case "or":
                expression += `${parseInput(input[0])} or ${parseInput(input[1])}`;
                break;
            case "forloop":
                expression += `index`;
                break;
            case "string":
                expression += `"${parseInput(input[0])}"`;
                break;
            case "number":
                expression += `${parseInput(input[0])}`;
                break;
            case "array":
                expression += `"[" + [${parseInput(input[0])}] + "]"`;
                break;
            case "boolean":
                expression += `${parseInput(input[0])}`;
        }
    } else if (incoming.type === "variable") {
        if (incoming.nodeInfo.isDeclared) {
            if(incoming.nodeInfo.dataType === "array") {
                let output = getOutputPort(incoming);

                if(output[1].target.size !== 0) {
                    expression += input[0].inputText.text().split(",").length;
                    return expression;
                }

                if(input[1].incoming.size !== 0 || input[1].inputText !== "") {
                    expression += `${incoming.nodeInfo.title}[${parseInput(input[1])}]`;
                    return expression;
                }
            } else {
                expression += incoming.nodeInfo.title;
            }
        } else {
            if (incoming.nodeInfo.dataType === "string") {
                expression += `${incoming.nodeInfo.title} = "${parseInput(input[0])}";\n`;
            } else if (incoming.nodeInfo.dataType === "array") {
                expression += `${incoming.nodeInfo.title} = [${parseInput(input[0])}];\n`;
            } else {
                expression += `${incoming.nodeInfo.title} = ${parseInput(input[0])};\n`;
            }
            incoming.nodeInfo.isDeclared = true;
            variables.get(incoming.nodeInfo.title).isDeclared = true;
        }
    } else if (incoming.type === "function-rep") {
        Object.keys(incoming.nodeInfo.output).forEach(key => {
            if (incoming.nodeInfo.output[key].id === port.incoming.values().next().value.id()) {
                expression += incoming.nodeInfo.output[key].title.toLowerCase();
                return;
            }
        });
    }

    return expression;
}

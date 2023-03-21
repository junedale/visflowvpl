import { rootLayer } from "../app-renderer.js";
import { funList } from "../generator/function.js";
import { getInputPort, getNextNodeToParse, getNextPort } from "./parseglobal.js";

let funscript = "";
let funInRoot = [];

export function convertFunction() {
    funscript = "";
    reset();
    parse();
    return funscript;
}


function reset() {
    funList.forEach(fun => {
        fun.isDeclared = false;
    });
}


function parse() {
    funInRoot = rootLayer.children.filter(node => node.type === "function");
    funInRoot.forEach(fun => {
        if (!fun.nodeInfo.isDeclared) {
            let startNode = null;
            fun.childNodes.forEach(child => {
                if (child.type === "function-rep") {
                    startNode = child;
                    return;
                }
            })
            funscript += `function ${fun.nodeInfo.title}`;
            let length = Object.keys(fun.nodeInfo.input).length;

            if (length === 0) {
                funscript += `() {\n`;
            } else {
                funscript += `(`;
                Object.keys(fun.nodeInfo.input).forEach((key, index) => {
                    if (index !== length - 1) {
                        funscript += `${fun.nodeInfo.input[key].title.toLowerCase()}, `;
                    } else {
                        funscript += `${fun.nodeInfo.input[key].title.toLowerCase()}) {\n`;
                    }
                });
            }            
            parseNode(startNode);
            funscript += `\n}`;
            fun.nodeInfo.isDeclared = true;
            funList.get(fun.nodeInfo.title).isDeclared = true;
        } else {
            return
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
        switch (node.name().split(' ').join('')) {
            case "print":
                funscript += `console.log(${parseInput(input[0])});\n`;
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
        }
    } else if (node.type === "function-rep") {
        parseNode(getNextNodeToParse(next[0]));
    }
}


export function parseInput(i) {
    let expression = "";
    if (i.incoming.size === 0) {
        return i.inputText.text();
    }

    let incoming = i.incoming.values().next().value.parent;
    let input = getInputPort(incoming);

    if (incoming.type === "core") {
        switch (incoming.name().split(' ').join('')) {
            case "add":
                expression += `${parseInput(input[0])} + ${parseInput(input[1])}`
                break;
            case "subtract":
                expression += `${parseInput(input[0])} - ${parseInput(input[1])}`
                break;
            case "multiply":
                expression += `${parseInput(input[0])} * ${parseInput(input[1])}`
                break;
            case "divide":
                expression += `${parseInput(input[0])} / ${parseInput(input[1])}`
                break;
            case "greaterthan":
                expression += `${parseInput(input[0])} > ${parseInput(input[1])}`
                break;
            case "greaterorequal":
                expression += `${parseInput(input[0])} >= ${parseInput(input[1])}`
                break;
            case "less":
                expression += `${parseInput(input[0])} < ${parseInput(input[1])}`
                break;
            case "lessorequal":
                expression += `${parseInput(input[0])} <= ${parseInput(input[1])}`
                break;
            case "notequal":
                expression += `${parseInput(input[0])} != ${parseInput(input[1])}`
                break;
            case "equal":
                expression += `${parseInput(input[0])} == ${parseInput(input[1])}`
                break;
            case "and":
                expression += `${parseInput(input[0])} && ${parseInput(input[1])}`
                break;
            case "or":
                expression += `${parseInput(input[0])} || ${parseInput(input[1])}`
                break;
            case "return":
                expression += `${parseInput(input[0])}`
        }
    } else if (incoming.type === "variable") {
        if (incoming.nodeInfo.isDeclared) {
            expression += incoming.nodeInfo.title;
        } else {
            if (incoming.nodeInfo.dataType === "string") {
                funscript += `let ${incoming.nodeInfo.title} = "${parseInput(input[0])}";\n`;
            } else if(incoming.nodeInfo.dataType === "array") {
                funscript += `let ${incoming.nodeInfo.title} = [${parseInput(input[0])}];\n`;
            } else {
                funscript += `let ${incoming.nodeInfo.title} = ${parseInput(input[0])};\n`;
            }

            incoming.nodeInfo.isDeclared = true;
            expression += incoming.nodeInfo.title;
        }
    } else if (incoming.type === "function-rep") {
        Object.keys(incoming.nodeInfo.output).forEach(key => {
            if(incoming.nodeInfo.output[key].id === i.incoming.values().next().value.id()) {
                expression += incoming.nodeInfo.output[key].title.toLowerCase();
                return;
            }
        })
    }

    return expression;
}



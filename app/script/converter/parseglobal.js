import { stage } from "../app-renderer.js";
import { varList } from "../generator/variable.js";
import { convertFunction } from "./parsefunction.js";

let node = null;
let varscript = "";
let bodyscript = "";
let funscript = "";
let script = "";

const consoleEl = document.querySelector("#console");
const consoleBodyEl = document.querySelector("#console-body");
const consoleOffcanvas = new bootstrap.Offcanvas(consoleEl, { keyboard: true });


export function enableRunPorgram() {
    document.querySelector("#run").addEventListener("click", () => convertGlobal());
}



function convertGlobal() {
    
    varscript = "";
    funscript = "";
    bodyscript = "";
    parseVariable();
    parseFunction();
    parse(stage.findOne(".start"));
    script = `${varscript}\n${funscript}\n${bodyscript}`;
    console.log(script)
}


function parseVariable() {
    varList.forEach(variable => {
        variable.isDeclared = false;
        if (!variable.isDeclared) {
            if (variable.dataType === "string") {
                varscript += `${variable.title} = "${variable.input[0].value}";\n`;
            } else if (variable.dataType === "array") {
                varscript += `${variable.title} = [${variable.input[0].value}];\n`;
            } else {
                varscript += `${variable.title} = ${variable.input[0].value};\n`;
            }

            variable.isDeclared = true;
        }
    });
}





// function reset() {
//     varList.forEach(variable => {
//         variable.isDeclared = false;
//     });
// }



// export function convertGlobal() {
//     reset();
//     let script = "";
//     varscript = "";
//     bodyscript = "";
//     funscript = convertFunction();
//     node = stage.findOne(".start");
//     parse(node);
//     script = `${varscript}\n${funscript}\n${bodyscript}`;
//     consoleOffcanvas.show();
//     console.log(script)
//     // Interpreter.interpret(script, consoleBodyEl);
//     return script;
// }


function parse(node) {
    if (node === null) {
        return;
    }

    let next = getNextPort(node);
    let input = getInputPort(node);

    switch (node.name().split(' ').join('')) {
        case "start":
            bodyscript += ""
            parse(getNextNodeToParse(next[0]));
            break;
        case "print":
            bodyscript += `print(${parseInput(input[0])});\n`;
            parse(getNextNodeToParse(next[0]));
            break;
        case "ifelse":
            bodyscript += `if(${parseInput(input[0])}) {\n`;
            parse(getNextNodeToParse(next[1]));
            bodyscript += `} else {\n`
            parse(getNextNodeToParse(next[2]));
            bodyscript += `}\n\n`
            parse(getNextNodeToParse(next[0]));
            break;
        case "whileloop":
            bodyscript += `while(${parseInput(input[0])}) {\n`;
            parse(getNextNodeToParse(next[1]));
            bodyscript += `}`
            break;
        case "function":
            bodyscript += checkFunIsDeclared(node);
            parse(getNextNodeToParse(next[0]));
            break;
        case "assign":
            bodyscript += `${parseInput(input[0])} = ${parseInput(input[1])}\n`;
            parse(getNextNodeToParse(next[0]));
    }
}

function parseInput(i) {
    let expression = "";
    if (i.incoming.size === 0) {
        return i.inputText.text();
    }

    let incoming = i.incoming.values().next().value.parent;
    console.log(i.incoming.values().next().value)
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
            case "lessthan":
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
        }
    } else if (incoming.type === "variable") {
        if(input[0].incoming.size === 0) {
            expression += `${incoming.nodeInfo.title}`
        } else {
            expression += `${incoming.nodeInfo.title} = ${parseInput(input[0])}`
        }
    }
    return expression;
}


// function checkFunIsDeclared(node) {
//     let builder = "";
//     if (node.nodeInfo.isDeclared) {

//         let input = getInputPort(node);

//         builder += `${node.nodeInfo.title}`;
//         let length = input.length;

//         if (length === 0) {
//             builder += "();\n";
//         } else {
//             builder += "(";
//             input.forEach((i, index) => {
//                 if (index !== length - 1) {
//                     builder += `${parseInput(i)}, `;
//                 } else {
//                     builder += `${parseInput(i)});`;
//                 }
//             });
//         }
//     }

//     return builder;
// }



export function getNextNodeToParse(p) {
    let n = p.target.values().next().value;
    node = n === undefined ? null : n.parent;
    return node;
}

export function getPrevPort(node) {
    let previousPin = [];

    Object.keys(node.nodeInfo.previous).forEach(key => {
        previousPin.push(node.inputPorts.get(node.nodeInfo.previous[key].id));
    });
    return previousPin;
}

export function getNextPort(node) {
    let nextPin = [];

    Object.keys(node.nodeInfo.next).forEach(key => {
        nextPin.push(node.outputPorts.get(node.nodeInfo.next[key].id));
    });
    return nextPin;
}

export function getOutputPort(node) {
    let outputSocket = [];

    Object.keys(node.nodeInfo.output).forEach(key => {
        outputSocket.push(node.outputPorts.get(node.nodeInfo.output[key].id));
    });
    return outputSocket;
}

export function getInputPort(node) {
    let inputSocket = [];

    Object.keys(node.nodeInfo.input).forEach(key => {
        inputSocket.push(node.inputPorts.get(node.nodeInfo.input[key].id));
    });
    return inputSocket;
}
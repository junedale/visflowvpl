import { stage } from "../app-renderer.js";
import { varList as variables } from "../generator/variable.js";
import { showError } from "../util/error.js";
import { parseFunction } from "./parsefunction.js";



const consoleBodyEl = document.querySelector("#console-body");
const consoleEl = document.querySelector("#console");
const offcanvas = new bootstrap.Offcanvas(consoleEl, { keyboard: false });
let node = null;
let varscript = null;
let bodyscript = null;
let funscript = null;
let script = null;

export default function run() {
    varscript = "", bodyscript = "", funscript = parseFunction();
    consoleBodyEl.innerHTML = "";
    variables.forEach(variable => variable.isDeclared = false);
    node = stage.find(".start");
    if (validate(node)) {
        parse(node[0]);
        script = `${varscript}\n${funscript}\n${bodyscript}`;

        if (script.length <= 2) {
            showError(3, ["Add more nodes to the program"]);
        } else {
            Interpreter.interpret(script, consoleBodyEl);
            offcanvas.show();
            console.log(script)
        }
    }
}

// TODO: use the new interpreter

function validate(node) {
    if (node.length === 0) {
        showError(3, ["No start node found"]);
        return false;
    } else if (node.length > 1) {
        showError(3, ["Multiple start nodes found"]);
        return false;
    } else {
        return true;
    }
}


function parse(node) {
    if (node === null) {
        return;
    }

    let next = getNextPort(node);
    let input = getInputPort(node);

    if (node.type === "core") {
        switch (node.name().split(" ").join("")) {
            case "start":
                // bodyscript += "// start of program //\n"
                parse(getNextNodeToParse(next[0]));
                break;
            case "print":
                bodyscript += `print(${parseInput(input[0])});\n`;
                parse(getNextNodeToParse(next[0]));
                break;
            case "println":
                bodyscript += `println(${parseInput(input[0])});\n`;
                parse(getNextNodeToParse(next[0]));
                break;
            case "ifelse":
                bodyscript += `if(${parseInput(input[0])}) {\n`;
                parse(getNextNodeToParse(next[1]));
                bodyscript += `} else {\n`
                parse(getNextNodeToParse(next[2]));
                bodyscript += `\n}\n\n`
                parse(getNextNodeToParse(next[0]));
                break;
            case "whileloop":
                bodyscript += `while(${parseInput(input[0])}) {\n`;
                parse(getNextNodeToParse(next[1]));
                bodyscript += `\n}`
                parse(getNextNodeToParse(next[0]));
                break;
            case "dowhileloop":
                bodyscript += `do {\n`;
                parse(getNextNodeToParse(next[1]));
                bodyscript += `\n} while(${parseInput(input[0])});`
                parse(getNextNodeToParse(next[0]));
                break;
            case "forloop":
                let initial = parseInt(parseInput(input[0]));
                let end = parseInt(parseInput(input[1]));
                let condition = initial > end ? `index > ${end}` : `index < ${end}`;
                bodyscript += `for(index = ${initial}; ${condition}; index += ${parseInput(input[2])}) {\n`;
                parse(getNextNodeToParse(next[1]));
                bodyscript += `\n}`
                parse(getNextNodeToParse(next[0]));
                break;
        }
    } else if (node.type === "variable") {
        if (node.nodeInfo.dataType === "string") {
            bodyscript += `${node.nodeInfo.title} = "${parseInput(input[0])}";\n`;
        } else if (node.nodeInfo.dataType === "array") {
            bodyscript += `${node.nodeInfo.title} = [${parseInput(input[0])}];\n`;
        } else {
            bodyscript += `${node.nodeInfo.title} = ${parseInput(input[0])};\n`;
        }

        node.nodeInfo.isDeclared = true;
        variables.get(node.nodeInfo.title).isDeclared = true;
        parse(getNextNodeToParse(next[0]));
    } else if (node.type === "function") {
        bodyscript += checkFunIsDeclared(node);
        parse(getNextNodeToParse(next[0]));
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
                if(port.parent.type === "variable") {
                    expression += `${parseInput(input[0])}`;
                } else {
                    expression += `"${parseInput(input[0])}"`;
                }
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
                varscript += `${incoming.nodeInfo.title} = "${parseInput(input[0])}";\n`;
            } else if (incoming.nodeInfo.dataType === "array") {
                varscript += `${incoming.nodeInfo.title} = [${parseInput(input[0])}];\n`;
            } else {
                varscript += `${incoming.nodeInfo.title} = ${parseInput(input[0])};\n`;
            }
            incoming.nodeInfo.isDeclared = true;
            variables.get(incoming.nodeInfo.title).isDeclared = true;
        }
    } else if (incoming.type === "function") {
        expression += checkFunIsDeclared(incoming).slice(0, -1);
    }

    return expression;
}


function checkFunIsDeclared(node) {
    let builder = "";

    if (node.nodeInfo.isDeclared) {
        let input = getInputPort(node);
        let length = input.length;

        builder += node.nodeInfo.title;

        if (length === 0) {
            builder += "();\n";
        } else {
            builder += "(";
            input.forEach((port, index) => {
                if (index !== length - 1) {
                    builder += `${parseInput(port)}, `;
                } else {
                    builder += `${parseInput(port)});`;
                }
            });
        }
    }

    return builder;
}


export function getNextNodeToParse(port) {
    let temp = port.target.values().next().value;
    node = temp === undefined ? null : temp.parent;
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
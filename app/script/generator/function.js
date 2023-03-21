import { stage, rootLayer, wireLayer } from "../app-renderer.js";
import { BaseNode, FunctionNode } from "../node/node.js";
import { setWireVisibility } from "../wire/wiring.js";


export const funList = new Map();
const funListEl = document.querySelector("#fun-list");

stage.on("create-function", handleCreateFunction);

function handleCreateFunction(e) {
    const info = {
        id: null,
        type: "function",
        title: e.funName,
        previous: { 0: { id: null, title: null } },
        next: { 0: { id: null, title: null, order: 0 } },
        input: {},
        output: {},
        category: "function",
        children: e.children.map(child => {
            child.nodeInfo.position = child.position();
            return child.nodeInfo;
        }),
        isDeclared: false,
        width: 160
    };

    if (e.funArgs !== 0) {
        for (let i = 0; i < e.funArgs; i++) {
            info.input[i] = { id: null, title: `Param${i + 1}`, value: "", dataType: "" };
        }
    }

    if (e.funType !== "void") {
        info.output[0] = { id: null, title: "Result", value: "", dataType: "", order: 1 };
    }

    funList.set(e.funName, info);
    createFunctionEl(e.funName, stage, rootLayer, wireLayer, e.children);
    createFunctionNode(e.funName, stage, rootLayer, wireLayer, e.children);
}

export function createFunctionEl(key, stage, rootLayer, wireLayer, children) {
    let functionEl = document.createElement("button");
    functionEl.innerHTML = `Fun ${key}`;
    functionEl.classList.add(...["list-group-item", "list-group-item-action", "fun-btn"]);
    functionEl.addEventListener("click", () => {
        createFunctionNode(key, stage, rootLayer, wireLayer, children);
        getMainModal().hide();
    });
    funListEl.appendChild(functionEl);
}

function createFunctionNode(key, stage, rootLayer, wireLayer, children) {
    let info = funList.get(key);
    let node = new FunctionNode(info, stage, rootLayer, stage.getPointerPosition());
    let newNode = new BaseNode(modifyInfo(info), stage, rootLayer, stage.getPointerPosition());
    newNode.parentNode = node;
    console.log(newNode)
    node.childNodes.set(newNode.id(), newNode);
    newNode.remove();
    Object.keys(info.input).forEach(key => node.inputPorts.get(info.input[key].id).inputText.text(info.input[key].value));
    children.forEach(child => {
        setWireVisibility(child, false, wireLayer);
        node.childNodes.set(child.id(), child);
        child.remove();
    });
}

function modifyInfo(info) {
    let newInfo = { ...info };
    let iCount = Object.keys(newInfo.input).length;
    newInfo.type = "function-rep";
    newInfo.previous = {};
    newInfo.input = {};
    newInfo.output = {};
    newInfo.next = { 0: { id: null, title: "Body", order: 1 } };

    for (let i = 0; i < iCount; i++) {
        newInfo.output[i] = { id: null, parentPortId: info.input[i].id, title: `Param${i + 1}`, dataType: "", order: i + 2 }
    }

    return newInfo;
}
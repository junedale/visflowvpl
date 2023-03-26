import { nanoid } from "../../../../node_modules/nanoid/nanoid.js";
import { stage, rootLayer as root, wireLayer as wire } from "../app-renderer.js";
import { BaseNode, FunctionNode } from "../node/node.js";
import { deleteFunctionNode } from "../util/delete.js";
import { setWireVisibility } from "../wire/wiring.js";

export const funList = new Map();
export const funListEl = document.querySelector("#function-list");
export const funListEl1 = document.querySelector("#function-list-1");

export function enableFunctionCreation() {
    stage.on("create-function", handleCreateFunction);
}

function handleCreateFunction(e) {
    e.name = e.name.indexOf(" ") !== -1 ? e.name.split(" ").join("") : e.name
    const info = {
        id: null,
        type: "function",
        title: e.name,
        previous: { 0: { id: null, title: null } },
        next: { 0: { id: null, title: null, order: 0 } },
        input: {},
        output: {},
        category: "function",
        children: e.children.map(child => {
            child.nodeInfo.position = child.position();
            return child.nodeInfo;
        }),
        dataType: e.data,
        isDeclared: false,
        width: 160
    };

    if (e.args !== 0) {
        for (let i = 0; i < e.args; i++) {
            info.input[i] = { id: null, title: `arg${i + 1}`, dataType: "", value: "" };
        }
    }

    if (e.data !== "void") {
        info.output[0] = { id: null, title: "Result", dataType: "", order: 1 };
        info.value = "";
    }

    funList.set(e.name + e.args, info);
    createFunctionEl(e.name, e.args, stage, root, wire, e.children);
    createFunctionNode(e.name + e.args, stage, root, wire, e.children);
}

export function createFunctionEl(key, args, stage, root, wire, children) {
    console.log(wire)
    let row = document.createElement("div");
    row.classList.add(...["row", "row-cols-2", "g-0"]);
    let col1 = document.createElement("div");
    col1.classList.add(...["col-10", "d-flex"]);
    let col2 = document.createElement("div");
    col2.classList.add(...["col-2", "d-flex"]);
    let del = document.createElement("button");
    del.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
    </svg>
    `;
    del.classList.add(...["btn", "btn-danger", "w-100", "rounded-0", "d-flex", "justify-content-center", "align-items-center"]);
    del.addEventListener("click", () => {
        funList.delete(key + args);
        row.remove();
        stage.find(`.${key + args}`).forEach(node => {
            deleteFunctionNode(node, wire);
        });
    });
        row.appendChild(col1);
        row.appendChild(col2);
        col2.appendChild(del);
    let func = document.createElement("button");
    func.innerHTML = `fun ${key}`;
    func.classList.add("dropdown-item");
    col1.appendChild(func)
    func.addEventListener("click", () => createFunctionNode(key + args, stage, root, wire, children));
    funListEl.appendChild(row);
    funListEl1.appendChild(row.cloneNode(true));
}


export function createFunctionNode(key, stage, root, wire, children) {
    let info = funList.get(key);
    let node = new FunctionNode(info, stage, root, info.position? info.position : stage.getPointerPosition());
    node.id(`node-${nanoid(10)}`);
    node.name(key)
    let newNode = new BaseNode(modifyInfo(info), stage, root, stage.getPointerPosition());
    node.childNodes.set(newNode.id(), newNode);
    newNode.remove();
    Object.keys(info.input).forEach(key => node.inputPorts.get(info.input[key].id).inputText.text(info.input[key].value));
    children.forEach(child => {
        console.log(child)
        setWireVisibility(child, false, wire);
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
        newInfo.output[i] = { id: null, title: `arg${i + 1}`, dataType: "", order: i + 2 };
    }

    return newInfo;
}
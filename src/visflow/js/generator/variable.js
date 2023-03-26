import { nanoid } from "../../../../node_modules/nanoid/nanoid.js";
import { stage, rootLayer as root, wireLayer as wire } from "../app-renderer.js";
import { BaseNode } from "../node/node.js";
import { deleteBaseNode } from "../util/delete.js";

export const varList = new Map();
export const varListEl = document.querySelector("#variable-list");
export const varListEl1 = document.querySelector("#variable-list-1");
let thisRoot;


export function enableVariableCreattion() {
    thisRoot = root;
    stage.on("create-variable", handleCreateVariable);
}


function handleCreateVariable(e) {
    e.name = e.name.indexOf(" ") !== -1 ? e.name.split(" ").join("") : e.name
    const info = {
        id: null,
        type: "variable",
        title: e.name,
        previous: { 0: { id: null, title: null, } },
        next: { 0: { id: null, title: null, order: 0 } },
        input: { 0: { id: null, title: "Set", dataType: e.data, value: e.value } },
        output: { 0: { id: null, title: "Get", dataType: e.data, order: 1 } },
        category: "variable",
        dataType: e.data,
        isDeclarerd: false,
        width: 160,
    }

    console.log(e.name.indexOf(" "));

    if (info.dataType === "array") {
        info.input[1] = { id: null, title: "Index", dataType: e.data, value: null }
        info.output[1] = { id: null, title: "Length", dataType: "number", value: null, order: 2 }
    }

    varList.set(e.name, info);
    createVariableEl(e.name, stage, thisRoot);
    createNode(e.name, stage, thisRoot)
}

export function createVariableEl(key, stage, layer) {
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
        console.log(varList);
        varList.delete(key);
        row.remove();
        stage.find(`.${key}`).forEach(node => deleteBaseNode(node, wire));
        console.log(varList);
    })

    row.appendChild(col1);
    row.appendChild(col2);
    col2.appendChild(del);
    let variable = document.createElement("button");
    variable.innerHTML = key;
    variable.classList.add("dropdown-item");
    variable.addEventListener("click", () => createNode(key, stage, layer));
    col1.appendChild(variable);
    varListEl.appendChild(row);
    varListEl1.appendChild(row.cloneNode(true));
}

export function createNode(key, stage, layer) {
    let info = varList.get(key);
    info.id = nanoid(10);
    let node = new BaseNode(info, stage, layer, stage.getPointerPosition());
    node.inputPorts.get(info.input[0].id).inputText.text(info.input[0].value);
    return node;
}

export function setVariableRoot(root) {
    thisRoot = root;
}
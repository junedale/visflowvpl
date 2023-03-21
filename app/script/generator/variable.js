import { stage, rootLayer } from "../app-renderer.js";
import { mainModal } from "../menu/mainmodal.js";
import { BaseNode } from "../node/node.js";

export const varList = new Map();
const varListEl = document.querySelector("#var-list");
let thisRootLayer = rootLayer;

stage.on("create-variable", handleCreateVariable);

function handleCreateVariable(e) {
    const info = {
        id: null,
        type: "variable",
        title: e.varName,
        previous: {},
        next: {},
        input: { 0: { id: null, title: "Set", dataType: e.varType, value: e.varValue } },
        output: { 0: { id: null, title: "Get", dataType: e.varType, order: 1 } },
        category: "variable",
        dataType: e.varType,
        isDeclarerd: false,
        width: 160,
    }
    varList.set(e.varName, info);
    createVarEl(e.varName, stage, thisRootLayer);
    createVarNode(e.varName, stage, thisRootLayer);
}

export function createVarEl(key, stage, layer) {
    let varEl = document.createElement("button");
    varEl.innerHTML = key;
    varEl.classList.add(...["list-group-item", "list-group-item-action", "var-btn"]);
    varEl.addEventListener("click", () => {
        createVarNode(key, stage, layer);
        mainModal.modal.hide();
    });
    varListEl.append(varEl);
}

export function createVarNode(key, stage, layer) {
    let info = varList.get(key);
    let node = new BaseNode(info, stage, layer, stage.getPointerPosition());
    node.inputPorts.get(info.input[0].id).inputText.text(info.input[0].value);
    return node;
}


export function setVariableRootLayer(layer) {
    thisRootLayer = layer;
}


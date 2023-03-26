import { stage } from "../app-renderer.js";
import { BaseNode, FunctionNode } from "../node/node.js";
import { functionModal } from "./functionmodal.js";


const modalEl = document.querySelector("#select-modal");
const modal = new bootstrap.Modal(modalEl, { keyboard: false });
const selectModalBody = document.querySelector("#select-modal-body");
export let selectedNodeList = [];


export function enableSelectModal() {
    stage.on("selected", handleSelected);
    stage.on("contextmenu", handleContextMenu);
}

function handleContextMenu(e) {
    if (e.target.getParent() instanceof FunctionNode) {
        show(e.target.getParent(), 1)
    } else if (e.target.getParent() instanceof BaseNode) {
        show(e.target.getParent(), 0)
    }
}

function handleSelected(e) {
    selectedNodeList = e.nodes;
    show(selectedNodeList, 2)
    modal.show();
}


function show(target, type) {
    selectModalBody.innerHTML = "";

    if (type === 0) { // BaseNode
        // let button = document.createElement("button");
        // button.className = "btn btn-primary";
        // button.innerHTML = "Collapse Node";
        // selectModalBody.appendChild(button);
    } else if (type === 1) { // FunctionNode
        let button = document.createElement("button");
        button.className = "btn btn-primary";
        button.innerHTML = "Edit Node";
        button.addEventListener("click", () => { stage.fire("edit-mode", { target }); modal.hide(); });
        selectModalBody.appendChild(button);
    } else if (type === 2) { // Selected
        let button = document.createElement("button");
        button.className = "btn btn-primary";
        button.innerHTML = "Create Function";
        button.addEventListener("click", () => { functionModal.show(); modal.hide(); });
        selectModalBody.appendChild(button);
    }

    let button = document.createElement("button");
    button.className = "btn btn-danger";
    button.innerHTML = "Delete Node";
    button.addEventListener("click", () => { stage.fire("delete", { target }); modal.hide(); });
    selectModalBody.appendChild(button);
    modal.show();
}
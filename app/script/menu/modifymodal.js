import { stage } from "../app-renderer.js";
import { BaseNode, FunctionNode } from "../node/node.js";
import { HTML } from "../utils/global.js";
import { showGeneratorModal } from "./generatormodal.js";

export let lastFunctionTarget = null;
export const fileDescriptor = document.querySelector("#file-descriptor");
export const exitBtnEl = document.querySelector("#exit");
const modifyModalEl = document.querySelector("#modify-modal");
const modifyModalBodyEl = document.querySelector("#modify-modal-body");
export const modifyModal = new bootstrap.Modal(modifyModalEl, { keyboard: true });
export let selectedNodeList = [];



export function enableModifyModal() {
    stage.on("contextmenu", handleContextMenu);
    stage.on("selected", handleSelectedNodes);
}

function handleSelectedNodes(e) {
    modifyModalBodyEl.innerHTML = "";
    modifyModalBodyEl.innerHTML = HTML.selectNode;
    modifyModal.show();
    selectedNodeList = e.nodes;
    document.querySelector("#create-fun-from-selected").addEventListener("click", () => {
        showGeneratorModal(1);
        modifyModal.hide();
    });
    document.querySelector("#delete-node").addEventListener("click", () => {
        stage.fire("delete", { target: selectedNodeList });
        modifyModal.hide();
    });
}

function handleContextMenu(e) {
    let target = e.target.getParent();
    modifyModalBodyEl.innerHTML = "";
    console.log("🚀 ~ file: modifymodal.js:40 ~ handleContextMenu ~ target instanceof FunctionNode:", target instanceof FunctionNode)
    if (target instanceof FunctionNode) {
        modifyModalBodyEl.innerHTML = HTML.modifyFunctionNode;
        document.querySelector("#edit-node").addEventListener("click", () => {
            lastFunctionTarget = e.target.getParent();
            fileDescriptor.classList.toggle("d-none", true);
            exitBtnEl.classList.toggle("d-none", false);
            stage.fire("edit-mode", { target: lastFunctionTarget });
            modifyModal.hide();
        });
        document.querySelector("#delete-node").addEventListener("click", () => {
            stage.fire("delete", { target });
            modifyModal.hide();
        });
        modifyModal.show();
    } else if (target instanceof BaseNode) {
        modifyModalBodyEl.innerHTML = HTML.modifyBaseNode;
        document.querySelector("#delete-node").addEventListener("click", () => {
            stage.fire("delete", { target });
            modifyModal.hide();
        });
        modifyModal.show();
    }


}
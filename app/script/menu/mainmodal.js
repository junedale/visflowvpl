import { stage, rootLayer } from "../app-renderer.js";
import { generateNode } from "../generator/nodegen.js";
import { BaseNode } from "../node/node.js";
import { HTML } from "../utils/global.js";
import { showGeneratorModal } from "./generatormodal.js";

export const mainModalEl = document.querySelector("#main-modal");
export const mainModal = new bootstrap.Modal(mainModalEl, { keyboard: true });
const mainModalBodyEl = document.querySelector("#main-modal-body");


let seachBarEl = null;
let nodeList = [];
let thisNodeRootLayer = null;

export function enableMainModal() {
    thisNodeRootLayer = rootLayer;
    mainModalBodyEl.innerHTML = HTML.mainMenu;
    nodeList = document.querySelectorAll(".node");
    seachBarEl = document.querySelector("#context-search");
    initNodeList(nodeList, stage);
    seachBarEl.addEventListener("input", handleSearch);
    mainModalEl.addEventListener("shown.bs.modal", () => seachBarEl.focus());
    mainModalEl.addEventListener("hidden.bs.modal", () => seachBarEl.value = "");
    stage.on("contextmenu", handleContextMenu);
}

function handleContextMenu(e) {
    if (e.target === stage) {
        mainModal.show();
    }
}

function initNodeList(nodes, stage) {
    nodes.forEach(node => {
        node.addEventListener("click", (e) => {
            let id = e.target.id;
            if (id === "function-generator") {
                showGeneratorModal(1);
            } else if (id === "variable-generator") {
                showGeneratorModal(0);
            } else {
                new BaseNode(generateNode(id), stage, thisNodeRootLayer, stage.getPointerPosition());
            }
            mainModal.hide();
        });
    });
}

export function handleSearch(e) {
    let value = e.target.value.toLowerCase();
    nodeList.forEach(node => {
        if (node.id.toLowerCase().includes(value)) {
            node.classList.toggle("d-none", false);
        } else {
            node.classList.toggle("d-none", true);
        }
    });
}


export function setNodeRootLayer(layer) {
    thisNodeRootLayer = layer;
}

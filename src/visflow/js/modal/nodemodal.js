import { stage, rootLayer as root } from "../app-renderer.js";
import { BaseNode } from "../node/node.js";
import generateNode from "../node/nodegen.js";

const modalEl = document.querySelector("#node-modal");
const modal = new bootstrap.Modal(modalEl, { keyboard: false });
const nodeSearch = document.querySelector("#node-search");
const nodeBtnEls = document.querySelectorAll(".node");
let thisRoot = null;


export function enableNodeModal() {
    thisRoot = root;
    stage.on("contextmenu", (e) => e.target === stage ? modal.show() : null);
    modalEl.addEventListener("hidden.bs.modal", handleHiddenModal);
    modalEl.addEventListener("shown.bs.modal", () => nodeSearch.focus());
    nodeSearch.addEventListener("input", handleSearch);
    initNodeBtns();
}

function initNodeBtns() {
    nodeBtnEls.forEach(el => el.addEventListener("click", (e) => {
        new BaseNode(generateNode(e.target.id), stage, thisRoot, stage.getPointerPosition());
        modal.hide();
    }))
}


function handleHiddenModal() {
    nodeSearch.value = "";
    nodeBtnEls.forEach(nodeBtnEl => nodeBtnEl.classList.remove("d-none"));
}


function handleSearch(e) {
    let search = e.target.value.toLowerCase();
    nodeBtnEls.forEach(el => {
        if(el.innerText.toLowerCase().includes(search)) {
            el.classList.remove("d-none");
        } else {
            el.classList.add("d-none");
        }
    });
}

export function setNodeRoot(layer) {
    thisRoot = layer;
}


export { modal as nodeModal}
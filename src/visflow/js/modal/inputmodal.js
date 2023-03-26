import { stage } from "../app-renderer.js"
import { createFileEl, fileListEl } from "../controls/control.js";

const toggleModal = document.querySelector("#new");
const modalEl = document.querySelector("#input-modal");
const modal = new bootstrap.Modal(modalEl, { keyboard: false });
const fileInput = document.querySelector("#file-input");
const valueInput = document.querySelector("#value-input");
const fileWrapper = document.querySelector("#file-input-wrapper");
const valueWrapper = document.querySelector("#value-input-wrapper");


let target = null, parent = null, id = null, value = "";

export function enableInputModal() {
    stage.on("set-value", handleSetValue);
    toggleModal.addEventListener("click", handleToggleModal);
    modalEl.addEventListener("hidden.bs.modal", handleHiddenModal);
    valueInput.addEventListener("keypress", handleValueInput);
    fileInput.addEventListener("keypress", handleFileInput);
}

function handleToggleModal() {
    fileWrapper.classList.toggle("d-none");
    modal.show();
}


function handleValueInput(e) {
    if (e.key === "Enter") {
        target.text(e.target.value);
        Object.keys(parent.nodeInfo.input).forEach(key => {
            if (parent.nodeInfo.input[key].id === id) {
                parent.nodeInfo.input[key].value = e.target.value;
            }
        });
        modal.hide();
    }
}

export async function handleFileInput(e) {
    if (e.key === "Enter") {
        let files = await window.VisFlow.newFile(`${e.target.value}.visflow`, JSON.stringify({
            stageData: {
                position: {},
                scale: {}
            },
            nodes: {
                nodeData: [],
                wireData: []
            },
            variables: [],
            functions: {
                funData: [],
                wireData: []
            }
        }));

        if (files === undefined) {
            return;
        }

        fileListEl.innerHTML = "";

        files.forEach(file => {
            createFileEl(file);
        });

        modal.hide();
    }
}

function handleHiddenModal() {
    fileInput.value = "";
    valueInput.value = "";
    fileWrapper.classList.toggle("d-none", true);
    valueWrapper.classList.toggle("d-none", true);
}

function handleSetValue(e) {
    id = e.id;
    target = e.target;
    parent = e.parent;
    valueInput.value = target.text();
    valueWrapper.classList.toggle("d-none");
    modal.show();
}


export { modal as inputModal, fileWrapper, fileInput };


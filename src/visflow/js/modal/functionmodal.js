import { showError } from "../util/error.js";
import { stage } from "../app-renderer.js";
import { funList as functions } from "../generator/function.js";
import { selectedNodeList } from "./selectmodal.js";


const toggleModal = document.querySelector("#toggle-create-function");
const toggleModal1 = document.querySelector("#toggle-create-function-1");
const modalEl = document.querySelector("#function-modal");
const modal = new bootstrap.Modal(modalEl, { keyboard: false });
const nameInput = document.querySelector("#function-name");
const typeInput = document.querySelector("#function-type");
const ArgsInput = document.querySelector("#parameter-count");
const createBtn = document.querySelector("#create-function-btn");


export function enableFunctionModal() {
    toggleModal.addEventListener("click", () => modal.show());
    toggleModal1.addEventListener("click", () => modal.show());
    modalEl.addEventListener("shown.bs.modal", () => nameInput.focus());
    modalEl.addEventListener("hidden.bs.modal", handleHiddenModal);
    createBtn.addEventListener("click", handleCreate);
}

function handleHiddenModal() {
    nameInput.value = "";
    typeInput.value = "void";
    ArgsInput.value = 0;
    selectedNodeList.length = 0;
}

function handleCreate() {

    let name = nameInput.value;
    let data = typeInput.value;
    let args = ArgsInput.value;

    if (validate(name, data, args)) {
        stage.fire("create-function", { name, data, args, children: selectedNodeList });
        modal.hide();
    }

}


function validate(name, type, args) {
    let error = [];

    if (name === "") {
        error.push("Name cannot be empty");
    }

    if (functions.has(name + args)) {
        error.push("Name already exists");
    }

    if (error.length > 0) {
        showError(3, error);
    }

    return error.length === 0;
}

export { modal as functionModal }


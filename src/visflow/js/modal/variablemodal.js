import { stage } from "../app-renderer.js";
import { showError } from "../util/error.js";
import { varList as variables } from "../generator/variable.js";

const toggleModal = document.querySelector("#toggle-create-variable");
const toggleModal1 = document.querySelector("#toggle-create-variable-1");
const modalEl = document.querySelector("#variable-modal");
const modal = new bootstrap.Modal(modalEl, { keyboard: false });
const nameInput = document.querySelector("#variable-name");
const typeInput = document.querySelector("#variable-type");
const createBtn = document.querySelector("#create-variable-btn");
let valueInput = document.querySelector("#variable-value");


export function enableVariableModal() {
    toggleModal.addEventListener("click", () => modal.show());
    toggleModal1.addEventListener("click", () => modal.show());
    modalEl.addEventListener("shown.bs.modal", () => nameInput.focus());
    modalEl.addEventListener("hidden.bs.modal", handleHiddenModal);
    createBtn.addEventListener("click", handleCreate);
    typeInput.addEventListener("change", handleTypeChange);
}


function handleTypeChange(e) {
    if(e.target.value === "number") {
        valueInput = changeValueInput(0)
        valueInput.setAttribute("type", "number");
        valueInput.setAttribute("value", 0);
    } else if(e.target.value === "string") {
       valueInput = changeValueInput(0);
    } else if(e.target.value === "boolean") {
        valueInput = changeValueInput(1);
    } else {
        valueInput = changeValueInput(0);
    }
}


function changeValueInput(type) {
    if(type === 0) {
        let input = document.createElement("input");
        input.id = "variable-value";
        input.classList.add("form-control");
        input.setAttribute("placeholder", "Value");
        input.setAttribute("type", "text");
        input.setAttribute("value", "");
        valueInput.replaceWith(input);
    } else {
        let select = document.createElement("select");
        let valTrue = document.createElement("option");
        let valFalse = document.createElement("option");
        select.id = "variable-value";
        select.classList.add("form-select");
        valTrue.value = true;
        valTrue.setAttribute("selected", "true");
        valTrue.innerHTML = "True";
        valFalse.value = false;
        valFalse.innerHTML = "False";
        select.appendChild(valTrue);
        select.appendChild(valFalse);
        valueInput.replaceWith(select);
    }
    return document.querySelector("#variable-value");
}


function handleHiddenModal() {
    nameInput.value = "";
    typeInput.value = "string";
    valueInput.value = "";
}


function handleCreate() {

    let name = nameInput.value;
    let data = typeInput.value;
    let value = valueInput.value;

    if (validate(name, data, value)) {
        modal.hide();
        setDefaultValue(data, value);
        stage.fire("create-variable", { name, data, value });
    }
}


function setDefaultValue(type, value) {
    if (value.length === 0) {
        if (type === "number") {
            value = 0;
        } else if (type === "boolean") {
            value = false;
        } else if (type === "string") {
            value = "";
        }
    }
}


function validate(name, type, value) {
    let error = [];

    if (name === "") {
        error.push("Name cannot be empty");
    }

    if (variables.has(name)) {
        error.push("Name already exists");
    }

    if (type === "number" && isNaN(value)) {
        error.push("Value must be a number");
    } else if (type === "boolean") {
        let isTrue = value === "true";
        let isFalse = value === "false";

        if (!isTrue && !isFalse) {
            error.push("Value must be a boolean");
        }
    }

    if (error.length > 0) {
        showError(3, error);
    }

    return error.length === 0;
}
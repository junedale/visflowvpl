import { showToast } from "../utils/error.js";
import { HTML } from "../utils/global.js";
import { validateGeneratorForms } from "../utils/validation.js";
import { mainModal } from "./mainmodal.js";

const genModalEl = document.querySelector("#generator-modal");
const genModalBodyEl = document.querySelector("#generator-modal-body");
const genModal = new bootstrap.Modal(genModalEl, { keyboard: true });

export function showGeneratorModal(type) {
    genModalBodyEl.innerHTML = "";
    if (type === 0) {
        genModalBodyEl.innerHTML = HTML.variableForm;
        document.querySelector("#create-var-btn").addEventListener("click", () => {
            let validate = validateGeneratorForms(0);
            if (validate !== null) {
                showToast(3, validate.join(""));
            }
            genModal.hide();
        });
    } else {
        genModalBodyEl.innerHTML = HTML.functionForm;
        document.querySelector("#create-fun-btn").addEventListener("click", () => {
            let validate = validateGeneratorForms(1);
            if (validate !== null) {
                showToast(3, validate.join(""));
                
            }
            genModal.hide();
        });
    }

    mainModal.hide();
    genModal.show();
}
import { stage } from "../app-renderer.js";
import { HTML } from "../utils/global.js";


const inputModalEl = document.querySelector("#input-modal");
const inputModalBodyEl = document.querySelector("#input-modal-body");
const inputModal = new bootstrap.Modal(inputModalEl, { keyboard: true });

let target = null, parent = null, id = null;
export function enableInput() {
    stage.on("set-value", handleSetValue);

}

function handleSetValue(e) {
    inputModal.show();
    inputModalBodyEl.innerHTML = "";
    target = e.target;
    parent = e.parent;
    id = e.id;

    inputModalBodyEl.innerHTML = HTML.input("node-input", "Input Value");
    let nodeInputEl = document.querySelector("#node-input");
    

    inputModalEl.addEventListener("shown.bs.modal", () => nodeInputEl.focus());
    nodeInputEl.addEventListener("keypress", (e) => {
        if (e.code === "Enter") {
            target.text(e.target.value);
            Object.keys(parent.nodeInfo.input).forEach(key => {
                if(parent.nodeInfo.input[key].id === id) {
                    parent.nodeInfo.input[key].value = target.text();
                }
            });
            inputModal.hide();
        }
    });
}

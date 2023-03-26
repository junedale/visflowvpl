import { stage, rootLayer as root, wireLayer as wire } from "../app-renderer.js";
import { fileNameEl } from "../edit/edit.js";
import { load } from "../io/load.js";
import { handleSave } from "../io/save.js";
import { fileInput, fileWrapper, handleFileInput, inputModal } from "../modal/inputmodal.js";
import run from "../parse/parseglobal.js";
import { showError } from "../util/error.js";


export const fileListEl = document.querySelector("#file-list");



export function enableControl() {
    document.querySelector("#run").addEventListener("click", run);
    document.querySelector("#open").addEventListener("click", handleOpen);
    document.querySelector("#new").addEventListener("click", handleNew);
    document.querySelector("#save").addEventListener("click", handleSave);
    fileInput.addEventListener("keypress", handleFileInput);
}

async function handleNew() {
    inputModal.show();
    fileWrapper.classList.toggle("d-none", false);
}



async function handleOpen() {
    let files = await window.VisFlow.openDir().catch(err => {
        console.error(err);
    });

    if (files === undefined) {
        return;
    }

    showError(1, ["Folder opened successfully!"])

    fileListEl.innerHTML = "";

    files.forEach(file => {
        createFileEl(file);
    });
}


export function createFileEl(file) {
    let btn = document.createElement("button");
    btn.innerHTML = file.fileName;
    btn.classList.add(...["list-group-item", "list-group-item-action"]);
    btn.addEventListener("click", async () => {
        if (file.fileName.endsWith(".visflow")) {
            fileNameEl.innerHTML = file.fileName;
            stage.file = file.fileName;
            let data = await window.VisFlow.openFile(file.fileName);

            if (data === undefined) {
                return;
            }

            root.removeChildren();
            wire.removeChildren();
            load(data);
        }
    });
    fileListEl.appendChild(btn);
}
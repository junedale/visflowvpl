import { stage, rootLayer as root, wireLayer as wire, editLayer as edit } from "../app-renderer.js";
import { funList } from "../generator/function.js";
import { setVariableRoot } from "../generator/variable.js";
import { setNodeRoot } from "../modal/nodemodal.js";
import { state } from "../stage/global.js";
import { setSelectorRoot } from "../util/selector.js";
import { setWireVisibility, setWiringRoot } from "../wire/wiring.js";

export const fileNameEl = document.querySelector("#file-name");
const exitEl = document.querySelector("#exit");
let lastTarget = null;

export function enableEditFunction() {
    stage.on("edit-mode", handleEditMode);
    stage.on("normal-mode", handleNormalMode);
    exitEl.addEventListener("click", () => stage.fire("normal-mode"));
}


function handleEditMode(e) {
    state.edit = true;
    lastTarget = e.target;
    console.log(lastTarget)
    fileNameEl.classList.toggle("d-none", true);
    exitEl.classList.toggle("d-none", false);
    exitEl.classList.toggle("d-flex", true);
    setWiringRoot(edit);
    setNodeRoot(edit);
    setVariableRoot(edit);
    setSelectorRoot(edit);
    edit.visible(true);
    root.hide();
    root.children.forEach(child => setWireVisibility(child, false, wire));
    lastTarget.childNodes.forEach(child => {
        edit.add(child);
        setWireVisibility(child, true, wire);
    });
}

function handleNormalMode(e) {
    state.edit = false;
    fileNameEl.classList.toggle("d-none", false);
    exitEl.classList.toggle("d-none", true);
    exitEl.classList.toggle("d-flex", false);
    root.visible(true);
    edit.visible(false);
    setWiringRoot(root);
    setNodeRoot(root);
    setVariableRoot(root);
    setSelectorRoot(root);
    root.children.forEach(child => setWireVisibility(child, true, wire));
    edit.children.forEach(child => {
        if (!lastTarget.childNodes.has(child.id())) {
            lastTarget.childNodes.set(child.id(), child);
        }
    });
    lastTarget.childNodes.forEach(child => setWireVisibility(child, false, wire));
    
    edit.removeChildren();
    lastTarget = null;
}
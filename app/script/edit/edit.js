import { stage, rootLayer, wireLayer, editLayer } from "../app-renderer.js";
import { setVariableRootLayer } from "../generator/variable.js";
import { setNodeRootLayer } from "../menu/mainmodal.js";
import { exitBtnEl, fileDescriptor, lastFunctionTarget } from "../menu/modifymodal.js";
import { setWireVisibility, setWiringRootLayer } from "../wire/wiring.js";


export let isEditMode = true;

export function enableEditing() {
    exitBtnEl.addEventListener("click", () => {
        exitBtnEl.classList.toggle("d-none", true);
        stage.fire("normal-mode", { target: lastFunctionTarget });
    });

    stage.on("edit-mode", handleEditMode);
    stage.on("normal-mode", handleNormalMode);
}


function handleEditMode(e) {
    isEditMode = true;
    setWiringRootLayer(editLayer);
    setNodeRootLayer(editLayer);
    setVariableRootLayer(editLayer);
    editLayer.visible(true);
    rootLayer.hide();
    rootLayer.children.forEach(child => setWireVisibility(child, false, wireLayer));
    e.target.childNodes.forEach(child => {
        editLayer.add(child);
        setWireVisibility(child, true, wireLayer);
    });
}

function handleNormalMode(e) {
    isEditMode = false;
    rootLayer.visible(true);
    editLayer.visible(false);
    setWiringRootLayer(rootLayer);
    setNodeRootLayer(rootLayer);
    setVariableRootLayer(rootLayer);
    fileDescriptor.classList.toggle("d-none", false);
    rootLayer.children.forEach(child => setWireVisibility(child, true, wireLayer));
    editLayer.children.forEach(child => {
        if (!e.target.childNodes.has(child.id())) {
            e.target.childNodes.set(child.id(), child);
        }
    });
    e.target.childNodes.forEach(child => setWireVisibility(child, false, wireLayer));
    editLayer.removeChildren();
}
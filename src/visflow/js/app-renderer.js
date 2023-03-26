import { enableControl } from "./controls/control.js";
import { enableEditFunction } from "./edit/edit.js";
import { enableFunctionCreation } from "./generator/function.js";
import { enableVariableCreattion } from "./generator/variable.js";
import { enableFunctionModal } from "./modal/functionmodal.js";
import { enableInputModal } from "./modal/inputmodal.js";
import { enableNodeModal } from "./modal/nodemodal.js";
import { enableSelectModal } from "./modal/selectmodal.js";
import { enableVariableModal } from "./modal/variablemodal.js";
import Stage from "./stage/stage.js";
import { enableDelete } from "./util/delete.js";
import enableSelector from "./util/selector.js";
import { enableWiring } from "./wire/wiring.js";


const container = document.querySelector('#stage');
export const stage = new Stage({
    container,
    width: container.clientWidth,
    height: container.clientHeight,
});
export const rootLayer = new Konva.Layer({id: "rootLayer"});
export const wireLayer = new Konva.Layer({id: "wireLayer"});
export const editLayer = new Konva.Layer({id: "editLayer"});

stage.add(wireLayer);
stage.add(editLayer);
stage.add(rootLayer);

enableSelector();
enableDelete();
enableWiring();
enableNodeModal();
enableFunctionModal();
enableVariableModal();
enableVariableCreattion();
enableFunctionCreation();
enableSelectModal();
enableInputModal();
enableControl();
enableEditFunction();

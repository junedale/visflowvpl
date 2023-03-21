import { enableMainModal } from "./menu/mainmodal.js";
import { Stage } from "./stage/stage.js";

const container = document.querySelector("#stage");
export const stage = new Stage(container, container.clientWidth, container.clientHeight);
export const rootLayer = new Konva.Layer({ id: "rootLayer" });
export const wireLayer = new Konva.Layer({ id: "wireLayer" });
export const editLayer = new Konva.Layer({ id: "editLayer", visible: false });


stage.add(wireLayer);
stage.add(editLayer);
stage.add(rootLayer);


import("./menu/mainmodal.js").then(m => m.enableMainModal());
import("./menu/modifymodal.js").then(m => m.enableModifyModal());
import("./utils/selector.js").then(s => s.enableSelector());
import("./wire/wiring.js").then(w => w.enableWiring());
import("./utils/delete.js").then(d => d.enableDelete());
import("./edit/edit.js").then(e => e.enableEditing());
import("./converter/parseglobal.js").then(c => c.enableRunPorgram());
import("./input/input.js").then(i => i.enableInput());
import("./generator/variable.js");
import("./generator/function.js");




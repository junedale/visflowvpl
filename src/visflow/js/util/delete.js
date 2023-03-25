import { stage, rootLayer, wireLayer} from "../app-renderer.js";
import { BaseNode, FunctionNode } from "../node/node.js";
import { state } from "../stage/global.js";
import Wire from "../wire/wire.js";


export function enableDelete() {
    let isCtrlDown = false;

    document.addEventListener("keydown", (e) => {
        if (e.code === "ControlLeft" && state.focused) {
            isCtrlDown = true;
        }
    });

    document.addEventListener("keyup", (e) => {
        if (e.code === "ControlLeft") {
            isCtrlDown = false;
        }
    });

    stage.on("click", (e) => {
        if (isCtrlDown && e.evt.button === 0) {
            stage.fire("delete", { target: e.target });
        }
    });

    stage.on("delete", (e) => {
        if (e.target instanceof Array) {
            e.target.forEach(node => {
                getObjectType(node, wireLayer);
            });
        } else {
            getObjectType(e.target, wireLayer);
        }
    });
}

export function getObjectType(object, wireLayer) {
    if (object instanceof Wire) {
        deleteWire(object, wireLayer);
    } else if (object instanceof FunctionNode) {
        deleteFunctionNode(object, wireLayer);
    } else if (object instanceof BaseNode) {
        deleteBaseNode(object, wireLayer);
    }
}


export function deleteWire(wire, wireLayer) {
    wire.originPort.parent.outputPorts.get(wire.originPort.id()).target.delete(wire.targetPort.id());
    wire.targetPort.parent.inputPorts.get(wire.targetPort.id()).incoming.delete(wire.originPort.id());
    wire.originPort.parent.wires = wire.originPort.parent.wires.filter(id => id !== wire.id());
    wire.targetPort.parent.wires = wire.targetPort.parent.wires.filter(id => id !== wire.id());
    wire.originPort.fire("wiringremoved", { size: wire.originPort.target.size });
    wire.targetPort.fire("wiringremoved", { size: wire.targetPort.incoming.size });
    wire.destroy();
    wireLayer.draw();
}

export function deleteIncWire(wire, wireLayer) {
    if (wire !== null) {
        if (wire.originPort.portType === "next" || wire.originPort.portType === "output") {
            wire.originPort.fire("wiringremoved", { size: wire.originPort.target.size });
        } else {
            wire.originPort.fire("wiringremoved", { size: wire.originPort.incoming.size });
        }
        wire.destroy();
        wireLayer.draw();
    }
}


export function deleteBaseNode(node, wireLayer) {
    node.wires.forEach(id => {
        let wire = wireLayer.findOne(`#${id}`);
        console.log(wireLayer.children)
        console.log(id)
        if (wire === null) {
            return;
        } else {
            console.log(wire);
            deleteWire(wire, wireLayer);
        }
    });
    node.inputPorts.clear();
    node.outputPorts.clear();
    node.destroy();
}

export function deleteFunctionNode(node, wireLayer) {
    node.childNodes.forEach(child => {
        deleteBaseNode(child, wireLayer);
    });
    node.childNodes.clear();
    deleteBaseNode(node, wireLayer);
}
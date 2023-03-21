import { stage, rootLayer, wireLayer } from "../app-renderer.js";
import { setLocation } from "../utils/global.js";
import { deleteIncWire } from "../utils/delete.js";
import { Pin, Socket } from "../node/part/port.js";
import { Wire } from "./wire.js";

let originPos = {}, targetPos = {};
let originPort = null, targetPort = null;
let wire = null, isBtnDown = false;
let thisRootLayer = null;


export function enableWiring() {
    thisRootLayer = rootLayer;
    stage.container().addEventListener("mouseleave", handleMouseLeave);
    stage.on("mousedown", handleMouseDown);
    stage.on("mousemove", handleMouseMove);
    stage.on("mouseup", handleMouseUp);
}

function isPort(object) {
    return object instanceof Pin || object instanceof Socket
}

function handleMouseLeave() {
    isBtnDown = false;

    if (wire !== null && originPort !== null) {
        originPort.parent.draggable(true);
        deleteIncWire(wire, wireLayer);
    }
}

function handleMouseDown(e) {
    if (isPort(e.target)) {
        isBtnDown = true;
        originPort = e.target;
        originPos = setLocation(originPort.absolutePosition(), stage);
        wire = new Wire(null);
        wire.originPort = originPort;
        wire.originPort.parent.draggable(false);
        wire.originPort.fire("wiringstart");
        stage.draggable(false);
        wireLayer.add(wire);
        wireLayer.draw();
    }
}

function handleMouseMove() {
    if (isBtnDown) {
        targetPos = stage.getRelativePointerPosition();
        setWirePoints(originPos, targetPos, getDir(wire.originPort.portType), wire);
    }
}

function handleMouseUp() {
    targetPort = thisRootLayer.getIntersection(stage.getPointerPosition());

    if (!isPort(targetPort) && wire !== null) {
        wire.originPort.parent.draggable(true);
        deleteIncWire(wire, wireLayer);
        wire = null;
        isBtnDown = false;
        stage.draggable(true);
        return;
    } else if(isPort(targetPort) && wire === null) {
        return
    }

    if (isPort(targetPort)) {
        wire.targetPort = targetPort;

        if (checkValidity(wire)) {
            let dir = getDir(wire.originPort.portType);
            setWirePoints(setLocation(wire.originPort.absolutePosition(), stage), setLocation(wire.targetPort.absolutePosition(), stage), dir, wire);
            wire.initListener(dir, stage, thisRootLayer);
            wire.originPort.parent.outputPorts.get(wire.originPort.id()).target.set(wire.targetPort.id(), wire.targetPort);
            wire.targetPort.parent.inputPorts.get(wire.targetPort.id()).incoming.set(wire.originPort.id(), wire.originPort);
            wire.originPort.fire("wiringfinished");
            wire.targetPort.fire("wiringfinished");
            wire.originPort.parent.wires.push(wire.id());
            wire.targetPort.parent.wires.push(wire.id());
        } else {
            deleteIncWire(wire, wireLayer);
        }
        wire.originPort.parent.draggable(true);
        wire.targetPort.parent.draggable(true);
    }


    wire = null;
    isBtnDown = false;
    stage.draggable(true);
}

function checkValidity(wire) {
    swapOrder(wire);

    if (wire.originPort.portType === 'next' && wire.targetPort.portType === 'previous') {
        if (wire.originPort.target.size === 0 && wire.targetPort.incoming.size === 0) {
            return true;
        }
    } else if (wire.originPort.portType === 'output' && wire.targetPort.portType === 'input') {
        if (wire.targetPort.incoming.size === 0) {
            return true;
        }
    }

    return false;
}

function swapOrder(wire) {
    if (wire.originPort.portType === 'previous' || wire.originPort.portType === 'input') {
        let temp = wire.originPort;
        wire.originPort = wire.targetPort;
        wire.targetPort = temp;
    }
}

export function setWireVisibility(node, show, wireLayer) {
    let wires = [];

    node.wires.forEach(id => {
        if (!wires.includes(id)) {
            wires.push(id);
            wireLayer.findOne(`#${id}`).visible(show);
        }
    });

    wires.length = 0;
}

export function setWirePoints(origin, target, dir, wire) {
    let diff = dir * Math.abs(target.x - origin.x) / 1.65;
    let mid1 = { x: origin.x + diff, y: origin.y };
    let mid2 = { x: target.x - diff, y: target.y };
    wire.points([origin.x, origin.y, mid1.x, mid1.y, mid2.x, mid2.y, target.x, target.y]);
}

export function getDir(type) {
    return type === "input" || type === "previous" ? -1 : 1;
}

export function setWiringRootLayer(layer) {
    thisRootLayer = layer;
}
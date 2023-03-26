import { stage, rootLayer as root, wireLayer as wire, editLayer as edit } from "../app-renderer.js";
import { createFunctionEl, createFunctionNode, funList, funListEl, funListEl1 } from "../generator/function.js";
import { createVariableEl, varList, varListEl, varListEl1 } from "../generator/variable.js";
import { BaseNode, FunctionNode } from "../node/node.js";
import { setLocation } from "../stage/global.js";
import { showError } from "../util/error.js";
import Wire from "../wire/wire.js";
import { getDir, setWirePoints } from "../wire/wiring.js";



export function load(data) {

    varListEl.innerHTML = "";
    varListEl1.innerHTML = "";
    funListEl.innerHTML = "";
    funListEl1.innerHTML = "";


    let { nodes, variables, functions, stageData } = data;
    varList.clear();
    funList.clear();

    stage.position(stageData.position);
    stage.scale(stageData.scale);
    stage.container().style.backgroundPosition = "0px 0px";
    stage.container().style.backgroundSize = `${stage.scaleX() * 8}rem ${stage.scaleY() * 8}rem`;

    try {
        if (functions.funData.length !== 0) {
            functions.funData.forEach(info => {
                let children = [];
                info.children.forEach(child => {
                    children.push(new BaseNode(child, stage, edit, child.position));
                });
                let key = info.title + Object.keys(info.input).length;
                funList.set(key, info);
                createFunctionEl(info.title, stage, root);
                createFunctionNode(key, stage, root, wire, children);
            });
        }

        // if (functions.wireData.length !== 0) {
        //     functions.wireData.forEach(info => {
        //         createWire(info, stage, root).visible(false);
        //     });
        // }

        if (nodes.nodeData.length !== 0) {
            nodes.nodeData.forEach(info => {
                let node = new BaseNode(info, stage, root, info.position);
                root.add(node);
            });
        }

        if (nodes.wireData.length !== 0) {
            nodes.wireData.forEach(info => {
                createWire(info, stage, root);
            });
        }

        variables.forEach(info => {
            varList.set(info.title, info);
            createVariableEl(info.title, stage, root);
        });
        showError(1, ["File loaded successfully"]);
    } catch (e) {
        showError(3, ["Error loading file"]);
        console.error(e);
    }
}

function createWire(info, stage, rootLayer) {
    let thisWire = new Wire(info.id);
    thisWire.originPort = rootLayer.findOne(`#${info.originPortId}`);
    thisWire.targetPort = rootLayer.findOne(`#${info.targetPortId}`);
    let dir = getDir(thisWire.originPort.portType);
    setWirePoints(setLocation(thisWire.originPort.absolutePosition(), stage), setLocation(thisWire.targetPort.absolutePosition(), stage), dir, thisWire);
    thisWire.initListener(dir, stage, root);
    thisWire.originPort.parent.outputPorts.get(thisWire.originPort.id()).target.set(thisWire.targetPort.id(), thisWire.targetPort);
    thisWire.targetPort.parent.inputPorts.get(thisWire.targetPort.id()).incoming.set(thisWire.originPort.id(), thisWire.originPort);
    thisWire.originPort.fire("wiringfinished");
    thisWire.targetPort.fire("wiringfinished");
    thisWire.originPort.parent.wires.push(thisWire.id());
    thisWire.targetPort.parent.wires.push(thisWire.id());
    wire.add(thisWire)
    return thisWire;
}
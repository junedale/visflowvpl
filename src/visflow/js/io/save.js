import { stage, rootLayer as root, wireLayer as wire } from "../app-renderer.js";
import { varList } from "../generator/variable.js";
import { showError } from "../util/error.js";



export function handleSave() {
    if (stage.file === null) {
        showError(3, ["No file is opened"]);
        return;
    } else if (stage.file.name === "") {
        showError(3, ["File name is empty"]);
        return;
    } else {
        save(root, wire);
    }
}



function save(root, wire) {
    let baseWireList = [];
    let functionWireList = [];
    let nodeList = root.children;

    let saveObject = {
        stageData: {
            position: stage.position(),
            scale: stage.scale(),
        },
        nodes: {
            nodeData: [],
            wireData: [],
        },
        variables: [],
        // functions: {
        //     funData: [],
        //     wireData: [],
        // }

        functions: []
    };

    if (nodeList.length === 0) {
        showError(3, ["No nodes to save"]);
        return;
    } else {
        nodeList.forEach(node => {
            node.nodeInfo.position = {
                x: node.position().x + stage.x(),
                y: node.position().y + stage.y(),
            };



            if (node.type === "function") {
                node.nodeInfo.children = [];
                node.childNodes.forEach(child => {
                    child.nodeInfo.position = child.position();
                    child.wires.forEach(id => {
                        if (!functionWireList.includes(id)) {
                            let thisWire = wire.findOne("#" + id);
                            functionWireList.push(id);
                            saveObject.functions.wireData.push({
                                id,
                                originPortId: thisWire.originPort.id(),
                                targetPortId: thisWire.targetPort.id(),
                            });
                        }
                    });
                    node.nodeInfo.children.push(child.nodeInfo);
                });
                saveObject.functions.funData.push(node.nodeInfo);
            } else if (node.type === "core" || node.type === "variable") {
                node.wires.forEach(id => {
                    if (!baseWireList.includes(id)) {
                        let thisWire = wire.findOne("#" + id);
                        baseWireList.push(id);
                        saveObject.nodes.wireData.push({
                            id,
                            originPortId: thisWire.originPort.id(),
                            targetPortId: thisWire.targetPort.id(),
                        });
                    }
                });

                saveObject.nodes.nodeData.push(node.nodeInfo);
            }
        });
    }

    if (varList.length !== 0) {
        varList.forEach(info => {
            saveObject.variables.push(info);
        });
    }
    console.log(saveObject)
    window.VisFlow.saveFile(stage.file, JSON.stringify(saveObject));
    showError(0, ["File saved successfully"]);
}
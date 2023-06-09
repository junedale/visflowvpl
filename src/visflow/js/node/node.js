import { nanoid } from "../../../../node_modules/nanoid/nanoid.js";
import { ColorMap, setLocation } from "../stage/global.js";
import Pin from "./parts/pin.js";
import Socket from "./parts/socket.js";
import Body from "./parts/body.js";


export class BaseNode extends Konva.Group {
    type = "";
    nodeInfo = {};
    inputPorts = new Map();
    outputPorts = new Map();
    wires = [];

    constructor(info, stage, layer, loc) {
        super({ name: info.title.toLowerCase(), draggable: true });
        this.type = info.type;
        this.nodeInfo = info;

        if (this.nodeInfo.id === null) {
            this.nodeInfo.id = `node-${nanoid(10)}`;
        }

        console.log(this.nodeInfo.id)

        let height = this.setHeight(getPortCount(this.nodeInfo));
        let relPos = setLocation.bind(stage);

        this.add(new Body({
            text: info.title,
            color: ColorMap[info.category],
            width: info.width,
            group: this,
            height,
            layer
        }));

        this.id(this.nodeInfo.id);
        this.initPreviousPort(this.nodeInfo, layer);
        this.initNextPort(this.nodeInfo, layer);
        this.initInputPort(this.nodeInfo, stage, layer);
        this.initOutputPort(this.nodeInfo, layer);
        this.position(relPos(loc, null));
        layer.add(this);
        layer.draw();
    }

    initPreviousPort(info, layer) {
        if (Object.keys(info.previous).length !== 0) {
            let port = new Pin({
                type: 'previous',
                group: this,
                layer
            });

            if (info.previous[0].id === null) {
                info.previous[0].id = `port-${port._id}`;
            }

            
            port.parent = this;
            port.id(info.previous[0].id);
            this.inputPorts.set(port.id(), port);
        }
    }

    initNextPort(info, layer) {
        if (info.next) {
            Object.keys(info.next).forEach((key) => {
                let port = new Pin({
                    type: 'next',
                    text: info.next[key].title,
                    order: info.next[key].order,
                    width: info.width,
                    group: this,
                    layer
                });

                if (info.next[key].id === null) {
                    info.next[key].id = `port-${port._id}`;
                }

                port.parent = this;
                port.id(info.next[key].id);
                this.outputPorts.set(port.id(), port);
            });
        }
    }

    initInputPort(info, stage, layer) {
        if (info.input) {
            Object.keys(info.input).forEach((key, index) => {
                let port = new Socket({
                    type: 'input',
                    color: 'white',
                    order: index,
                    text: info.input[key].title,
                    dataType: info.input[key].dataType,
                    group: this,
                    stage,
                    layer
                });

                if (info.input[key].id === null) {
                    info.input[key].id = `port-${port._id}`;
                }

                port.id(info.input[key].id);
                port.inputText.id(`${port.id()}-input`);

                if (info.input[key].value !== "") {
                    port.inputText.text(this.nodeInfo.input[key].value);

                }

                port.parent = this;
                this.inputPorts.set(port.id(), port);
            });
        }
    }

    initOutputPort(info, layer) {
        if (info.output) {
            Object.keys(info.output).forEach((key) => {
                let port = new Socket({
                    type: 'output',
                    color: 'white',
                    order: info.output[key].order - 1,
                    text: info.output[key].title,
                    dataType: info.output[key].dataType,
                    width: info.width,
                    group: this,
                    layer,
                });

                if (info.output[key].id === null) {
                    info.output[key].id = `port-${port._id}`;
                }

                port.parent = this;
                port.id(info.output[key].id);
                this.outputPorts.set(port.id(), port);
            });

        }
    }

    setHeight(count) {
        return count === 1 ? 80 : count <= 3 ? ((count * 70) + (count * 70))  / count : ((count * 70) + (count * 70) + (count * 70))  / count;
    }

}

export class FunctionNode extends BaseNode {

    childNodes = new Map();

    constructor(info, stage, layer, loc) {
        super(info, stage, layer, loc);
        this.name("function");
    }
}

function getPortCount(info) {
    let iPort = 0;
    let oPort = 0;

    if (info.previous) {
        iPort += Object.keys(info.previous).length;
    }

    if (info.next) {
        oPort += Object.keys(info.next).length;
    }

    if (info.input) {
        iPort += Object.keys(info.input).length;

    }

    if (info.output) {
        oPort += Object.keys(info.output).length;
    }

    return Math.max(iPort, oPort);
}
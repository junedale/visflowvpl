import { setLocation } from "../stage/global.js";
import { setWirePoints } from "./wiring.js";

export default class Wire extends Konva.Line {

    originPort = null;
    targetPort = null;

    constructor(id) {
        super({
            stroke: 'white',
            strokeWidth: 2,
            lineCap: 'rounded',
            bezier: true
        });

        if (id === null) {
            this.id(`wire-${this._id}`);
        } else {
            this.id(id);
        }
    }

    initListener(dir, stage, layer) {
        this.originPort.parent.on('dragmove', () => {
            let originPos = setLocation(this.originPort.absolutePosition(), stage);
            let targetPos = setLocation(this.targetPort.absolutePosition(), stage);
            setWirePoints(originPos, targetPos, dir, this);
            layer.draw();
        });

        this.targetPort.parent.on('dragmove', () => {
            let originPos = setLocation(this.originPort.absolutePosition(), stage);
            let targetPos = setLocation(this.targetPort.absolutePosition(), stage);
            setWirePoints(originPos, targetPos, dir, this);
            layer.draw();
        });

        this.on('mouseover', () => {
            this.strokeWidth(3.5);
            layer.draw();
        });

        this.on('mouseleave', () => {
            this.strokeWidth(2);
            layer.draw();
        });
    }
}
import { eventListener } from "./portlistener.js";

export default class Socket extends Konva.Circle {

    parent = null;
    portType = null;
    dataType = null;
    inputText = null;

    constructor(prop) {
        super({
            radius: 6.5,
            stroke: prop.color,
            fill: 'transparent',
            strokeWidth: 1.5,
        });

        this.portType = prop.type;
        this.dataType = prop.dType;


        if (this.portType === 'input') {
            this.incoming = new Map();
            this.position({ x: 16, y: 46 + (prop.order * 44) });
            this.initInput(prop);
        } else {
            this.target = new Map();
            this.position({ x: prop.width - 16, y: 46 + (prop.order * 28) });
        }

        prop.group.add(this);
        this.initPortLabel(prop);
        eventListener(this, prop.layer);
    }

    initPortLabel(prop) {
        let label = new Konva.Text({
            text: prop.text,
            fill: 'white',
            fontSize: 12,
            fontFamily: 'Calibri'
        });

        if (this.portType === 'input') {
            label.position({ x: this.position().x + 13, y: this.position().y - 5 });
        } else {
            label.position({ x: this.position().x - label.width() - 14, y: this.position().y - 5 });
        }

        prop.group.add(label);
    }

    initInput(prop) {
        const inputGroup = new Konva.Group({});
        const inputBorder = new Konva.Rect({
            width: 50,
            height: 12,
            stroke: "white",
            strokeWidth: 1.5,
        });
        this.inputText = new Konva.Text({
            text: "",
            width: inputBorder.width() - 1.5,
            height: inputBorder.height(),
            padding: 1,
            fill: "white",
            fontSize: 11,
            fontFamily: "Calibri",
            ellipsis: true,
            x: 1.5
        });

        inputGroup.position({ x: this.position().x + 13, y: this.position().y + 12 });

        inputGroup.on("click", () => {
            prop.stage.fire("set-value", {
                target: this.inputText,
                parent: this.getParent(),
                id: this.id(),
                value: this.inputText.text()
            });
        });

        this.on("wiringfinished", () => {
            if (this.incoming.length !== 0) {
                inputGroup.visible(false);
            }
        });

        this.on("wiringremoved", (e) => {
            if (e.size === 0) {
                inputGroup.visible(true);
            }
            
        });

        inputGroup.add(inputBorder);
        inputGroup.add(this.inputText);
        prop.group.add(inputGroup);
    }
}
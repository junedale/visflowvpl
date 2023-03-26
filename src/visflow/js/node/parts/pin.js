import { eventListener } from "./portlistener.js";

export default class Pin extends Konva.Line {

    parent = null;
    portType = null;
    order = null;

    constructor(prop) {
        super({
            points: [14, 0, 8, 6, 0, 6, 0, -6, 8, -6, 14, 0],
            stroke: 'white',
            strokeWidth: 1.5,
            closed: true,
            lineCap: 'round',
            lineJoin: 'round',
        });

        this.portType = prop.type;
        this.order = prop.order;

        if (this.portType === 'previous') {
            this.incoming = new Map();
            this.position({ x: 10, y: 12 });
        } else {
            this.target = new Map();
            if (prop.order === 0) {
                this.position({ x: prop.width - 24, y: 12 });
            } else {
                this.position({ x: prop.width - 24, y: 45 + ((prop.order - 1) * 28) });
            }
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
            fontFamily: 'Calibri',
        });

        if (this.portType === 'previous') {
            label.position({ x: this.position().x + 20, y: this.position().y - 4.5 });
        } else {
            label.position({ x: this.position().x - label.width() - 7, y: this.position().y - 4.5 });
        }

        prop.group.add(label);
    }
}
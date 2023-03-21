export class Pin extends Konva.Line {

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


export class Socket extends Konva.Circle {

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

        this.on("wiringremoved", () => {
            inputGroup.visible(true);
        });

        inputGroup.add(inputBorder);
        inputGroup.add(this.inputText);
        prop.group.add(inputGroup);
    }
}

function eventListener(port, layer) {

    port.on('mouseover', () => {
        port.strokeWidth(2);
        layer.draw();
    });

    port.on('mouseleave', () => {
        port.strokeWidth(1.5);
        layer.draw();
    });

    port.on('wiringstart', () => {
        port.fill('white');
    });

    port.on('wiringfinished', () => {
        port.fill('white');
    });

    port.on('wiringremoved', (e) => {
        console.log(e)
        if (e.size === 0) {
            port.fill('transparent');
        }
    });
}
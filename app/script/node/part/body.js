export class Body extends Konva.Rect {

    constructor(prop) {
        super({
            width: prop.width,
            height: prop.height,
            fill: '#171717',
            opacity: 0.7,
            shadow: 'black',
            shadowOpacity: 0.4,
            shadowOffset: {x: 15, y: 15},
            shadowBlur: 15,
            cornerRadius: 5
        });

        let border = this.initBorder(prop)
        prop.group.add(border);
        prop.group.add(this);
        this.initHeader(prop);
        this.eventListener(prop.group, border, prop.layer)
    }

    initBorder(prop) {
        let border = new Konva.Rect({
            name: 'border',
            width: prop.width + 6,
            height: prop.height + 6,
            fill: 'transparent',
            stroke: 'white',
            strokeWidth: 0,
            cornerRadius: 5,
            x: -3,
            y: -3
        });

        return border;
    }

    initHeader(prop) {
        let header = new Konva.Rect({
            width: prop.width,
            height: 24,
            fill: prop.color,
            cornerRadius: [5, 5, 0, 0],
        });

        let label = new Konva.Text({
            width: prop.width,
            height: 24,
            text: prop.text.toUpperCase(),
            fill: 'white',
            fontSize: 14,
            fontFamily: 'Calibri',
            fontStyle: 'bold',
            align: 'center',
            y: 6.5,

        });

        console.log(prop.color)

        prop.group.add(header);
        prop.group.add(label);
    }

    eventListener(group, border, layer) {
        group.on('mouseover', () => {
            border.strokeWidth(2);
            layer.draw();
        });

        group.on('mouseleave', () => {
            border.strokeWidth(0);
            layer.draw();
        });

        group.on('selected', () => {
            border.strokeWidth(2);
            layer.draw();
        });

        group.on('unselected', () => {
            border.strokeWidth(0);
            layer.draw();
        })
    }
}
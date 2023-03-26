export function eventListener(port, layer) {

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
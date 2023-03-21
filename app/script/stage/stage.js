export class Stage extends Konva.Stage {

    zoom = 1.05;

    constructor(container, width, height) {
        super({ container, width, height, draggable: false });
        this.initListener(container, this);
    }

    initListener(container, stage) {
        stage.on("contextmenu", (e) => {
            e.evt.preventDefault();
        });

        stage.on("wheel", (e) => {
            let oldScale = stage.scaleX();
            let pointer = stage.getPointerPosition();
            let mPointTo = stage.getRelativePointerPosition();
            let newScale = oldScale;
            let check = e.evt.deltaY > 0 ? oldScale / stage.zoom : oldScale * stage.zoom;

            if (check > 0.175 && check < 1.6) {
                newScale = check;
            }

            stage.scale({ x: newScale, y: newScale });

            let position = {
                x: pointer.x - mPointTo.x * newScale,
                y: pointer.y - mPointTo.y * newScale
            }

            stage.container().style.backgroundSize = `${stage.scaleX() * 8}rem ${stage.scaleY() * 8}rem`;
            stage.position(position);
            stage.batchDraw();
            stage.container().style.backgroundPosition = `${stage.position().x}px ${stage.position().y}px`;
        });

        stage.on("mousedown", (e) => {
            if (e.target === stage && e.evt.button === 0) {
                stage.draggable(true);
            }
        });

        stage.on("mouseup", (e) => {
            if (e.evt.button === 0) {
                stage.draggable(false);
            }
        });

        stage.on("dragmove", () => {
            stage.container().style.backgroundPosition = `${stage.position().x}px ${stage.position().y}px`;
        });

        window.addEventListener("resize", () => {
            stage.width(container.offsetWidth);
            stage.height(container.offsetHeight);
            stage.draw();
        });

        stage.container().tabIndex = 1;
        stage.container().focus();
    }
}
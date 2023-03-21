import {stage, rootLayer} from "../app-renderer.js";

let rect = null;
let isShiftDown = false;
let isMouseDown = false;
let startPos = null;
let endPos = null;

export function enableSelector() {
    stage.container().addEventListener("mouseleave", () => {
        isMouseDown = false;
        isShiftDown = false;

        if (rect !== null) {
            rect.destroy();
            rect = null;
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.shiftKey) {
            isShiftDown = true;
        }
    });

    document.addEventListener("keyup", (e) => {
        if (e.code === "LeftShift") {
            isShiftDown = false;
        }
    });

    stage.on("mousedown", handleMouseDown);
    stage.on("mousemove", handleMouseMove);
    stage.on("mouseup", handleMouseUp);
}

function handleMouseDown(e) {
    if (e.evt.button === 0 && isShiftDown) {
        isMouseDown = true;
        rect = new Konva.Rect({ fill: "white", opacity: 0.3, width: 0, height: 0 });
        startPos = stage.getRelativePointerPosition();
        rect.position(startPos);
        stage.draggable(false);
        rootLayer.add(rect);
        rootLayer.draw();

    }
}

function handleMouseMove() {
    if (isMouseDown && isShiftDown) {
        endPos = stage.getRelativePointerPosition();
        rect.width(endPos.x - startPos.x);
        rect.height(endPos.y - startPos.y);
    }
}


function handleMouseUp(e) {
    e.evt.preventDefault();

    if(rect !== null) {
        rect.destroy();
        rect = null;;
    }

    if(isMouseDown && isShiftDown) {
        let selected = nodesWithin(startPos, endPos, rootLayer);
        console.log("🚀 ~ file: selector.js:73 ~ handleMouseUp ~ selected:", selected)

        if(selected.length !== 0) {
            stage.fire("selected", {nodes: selected});
        }
    }

    isMouseDown = false;
    isShiftDown = false;
    stage.draggable(true);
}


function nodesWithin(startPos, endPos, rootLayer) {
    let nodes = [];
    let { x1, y1, x2, y2 } = swapCoordinates(startPos, endPos);
    rootLayer.children.forEach(child => {
        let pos = child.position();
        let node = { startX: pos.x, startY: pos.y, endX: pos.x + child.width(), endY: pos.y + child.height() };

        if((node.startX >= x1 && node.startY >= y1) && (node.endX <= x2 && node.endY <= y2)) {
            child.fire("selected");
            nodes.push(child);
        }
    });

    return nodes;
}


function swapCoordinates(startPos, endPos) {
    let xInOrder = startPos.x < endPos.x;
    let yInOrder = startPos.y < endPos.y;
    let coordinate = { x1: startPos.x, y1: startPos.y, x2: endPos.x, y2: endPos.y };

    if (!xInOrder && !yInOrder) {
        coordinate = { x1: endPos.x, y1: endPos.y, x2: startPos.x, y2: startPos.y };
    } else if (xInOrder && !yInOrder) {
        coordinate = { x1: startPos.x, y1: endPos.y, x2: endPos.x, y2: startPos.y };
    } else if (!xInOrder && yInOrder) {
        coordinate = { x1: endPos.x, y1: startPos.y, x2: startPos.x, y2: endPos.y };
    }

    return coordinate;
}
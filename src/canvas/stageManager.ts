import Konva from 'konva';
import { nanoid } from 'nanoid';
import { NodeData, WireData, DataType, PortData } from '../types/flow.js';
import { CategoryColors, DataTypeColors, PIN_SIZE, SOCKET_RADIUS, HEADER_HEIGHT, ROW_HEIGHT, NODE_CORNER_RADIUS } from './constants.js';

export interface StageCallbacks {
  onNodeMove?: (nodeId: string, position: { x: number; y: number }) => void;
  onNodeSelect?: (nodeId: string | null) => void;
  onNodeDelete?: (nodeId: string) => void;
  onWireCreate?: (wire: WireData) => void;
  onWireDelete?: (wireId: string) => void;
  onPortValueChange?: (nodeId: string, portId: string, value: any) => void;
  onFunctionEdit?: (functionName: string) => void;
}

interface PortEntry {
  shape: Konva.Shape;
  node: NodeData;
  port: PortData;
  isInput: boolean;
  isExec: boolean;
  group: Konva.Group;
}

export class StageManager {
  private stage: Konva.Stage;
  private wireLayer: Konva.Layer;
  private nodeLayer: Konva.Layer;
  private dragWireLayer: Konva.Layer;

  private nodeGroups: Map<string, Konva.Group> = new Map();
  private wireLines: Map<string, Konva.Line> = new Map();
  private wireDataMap: Map<string, WireData> = new Map();
  private portShapes: Map<string, PortEntry> = new Map();

  private activeConnectingPort: {
    portId: string;
    nodeId: string;
    isInput: boolean;
    isExec: boolean;
    dataType?: DataType;
    pos: { x: number; y: number };
  } | null = null;

  private snappedTargetPort: PortEntry | null = null;
  private dragWire: Konva.Line | null = null;
  private selectedNodeId: string | null = null;
  private isDraggingNode: boolean = false;
  private readonly SNAP_DISTANCE = 40;

  constructor(private container: HTMLDivElement, private callbacks: StageCallbacks = {}) {
    this.stage = new Konva.Stage({
      container,
      width: container.clientWidth || 800,
      height: container.clientHeight || 600,
      draggable: false,
    });

    this.wireLayer = new Konva.Layer({ id: 'wireLayer' });
    this.nodeLayer = new Konva.Layer({ id: 'nodeLayer' });
    this.dragWireLayer = new Konva.Layer({ id: 'dragWireLayer' });

    this.stage.add(this.wireLayer);
    this.stage.add(this.nodeLayer);
    this.stage.add(this.dragWireLayer);

    this.setupListeners();
    this.updateBackgroundGrid();
  }

  private setupListeners(): void {
    // Zoom on wheel
    this.stage.on('wheel', (e) => {
      e.evt.preventDefault();
      const oldScale = this.stage.scaleX();
      const pointer = this.stage.getPointerPosition();
      if (!pointer) return;

      const mousePointTo = {
        x: (pointer.x - this.stage.x()) / oldScale,
        y: (pointer.y - this.stage.y()) / oldScale,
      };

      const zoomFactor = 1.08;
      let newScale = e.evt.deltaY < 0 ? oldScale * zoomFactor : oldScale / zoomFactor;
      newScale = Math.max(0.2, Math.min(2.5, newScale));

      this.stage.scale({ x: newScale, y: newScale });
      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      this.stage.position(newPos);
      this.stage.batchDraw();
      this.updateBackgroundGrid();
    });

    // Panning on background
    this.stage.on('mousedown', (e) => {
      if (e.target === this.stage && e.evt.button === 0 && !this.activeConnectingPort && !this.isDraggingNode) {
        this.stage.draggable(true);
      }
    });

    this.stage.on('mouseup', () => {
      if (this.stage.draggable()) {
        this.stage.draggable(false);
      }
    });

    this.stage.on('dragmove', (e) => {
      if (e.target === this.stage) {
        this.updateBackgroundGrid();
      }
    });

    // Canvas click on empty space -> deselect
    this.stage.on('click tap', (e) => {
      if (e.target === this.stage) {
        this.selectNode(null);
      }
    });

    // Wire dragging and magnetic snapping tracker
    this.stage.on('mousemove', () => {
      if (!this.activeConnectingPort || !this.dragWire) return;

      const ptr = this.stage.getRelativePointerPosition();
      if (!ptr) return;

      const sourcePos = this.activeConnectingPort.pos;
      let targetPos = ptr;

      // Find closest compatible port for magnetic snapping
      const nearestPort = this.findNearestCompatiblePort(ptr);

      if (this.snappedTargetPort && this.snappedTargetPort !== nearestPort) {
        this.snappedTargetPort.shape.scale({ x: 1, y: 1 });
        this.snappedTargetPort.shape.stroke('#0f172a');
        this.snappedTargetPort = null;
      }

      if (nearestPort) {
        this.snappedTargetPort = nearestPort;
        targetPos = this.getPortCanvasPosition(nearestPort.shape, nearestPort.isExec);
        nearestPort.shape.scale({ x: 1.5, y: 1.5 });
        nearestPort.shape.stroke('#ffffff');
      }

      const p1 = this.activeConnectingPort.isInput ? targetPos : sourcePos;
      const p2 = this.activeConnectingPort.isInput ? sourcePos : targetPos;
      const points = this.calculateBezierPoints(p1, p2);

      this.dragWire.points(points);
      this.dragWireLayer.batchDraw();
      this.nodeLayer.batchDraw();
    });

    // Finalize wire connection on mouseup
    this.stage.on('mouseup', (e) => {
      if (!this.activeConnectingPort) return;

      let targetPort = this.snappedTargetPort;
      if (!targetPort) {
        const pointerPos = this.stage.getPointerPosition();
        if (pointerPos) {
          const shape = this.nodeLayer.getIntersection(pointerPos);
          if (shape) {
            for (const entry of this.portShapes.values()) {
              if (entry.shape === shape) {
                if (this.isPortCompatible(this.activeConnectingPort, entry)) {
                  targetPort = entry;
                }
                break;
              }
            }
          }
        }
      }

      if (targetPort && this.isPortCompatible(this.activeConnectingPort, targetPort)) {
        const sourcePort = this.activeConnectingPort;
        const originPortId = sourcePort.isInput ? targetPort.port.id : sourcePort.portId;
        const targetPortId = sourcePort.isInput ? sourcePort.portId : targetPort.port.id;

        const newWire: WireData = {
          id: `wire_${nanoid(8)}`,
          originPortId,
          targetPortId,
        };

        this.endWireDrag();
        this.addWireToCanvas(newWire);
        this.wireLayer.batchDraw();
        this.callbacks.onWireCreate?.(newWire);
        return;
      }

      this.endWireDrag();
    });

    // Global mouseup failsafe
    window.addEventListener('mouseup', () => {
      if (this.activeConnectingPort) {
        this.endWireDrag();
      }
      this.isDraggingNode = false;
    });

    // Window resize
    window.addEventListener('resize', () => {
      if (!this.container) return;
      this.stage.width(this.container.clientWidth);
      this.stage.height(this.container.clientHeight);
      this.stage.batchDraw();
    });
  }

  private findNearestCompatiblePort(pos: { x: number; y: number }): PortEntry | null {
    if (!this.activeConnectingPort) return null;

    let nearest: PortEntry | null = null;
    let minDistance = this.SNAP_DISTANCE;

    for (const entry of this.portShapes.values()) {
      if (!this.isPortCompatible(this.activeConnectingPort, entry)) continue;

      const portPos = this.getPortCanvasPosition(entry.shape, entry.isExec);
      const dist = Math.hypot(pos.x - portPos.x, pos.y - portPos.y);

      if (dist < minDistance) {
        minDistance = dist;
        nearest = entry;
      }
    }

    return nearest;
  }

  private isPortCompatible(
    source: { portId: string; nodeId: string; isInput: boolean; isExec: boolean; dataType?: DataType },
    target: PortEntry
  ): boolean {
    if (source.portId === target.port.id) return false;
    if (source.nodeId === target.node.id) return false;
    if (source.isInput === target.isInput) return false;
    if (source.isExec !== target.isExec) return false;

    if (!source.isExec) {
      const srcType = source.dataType || 'any';
      const tgtType = target.port.dataType || 'any';
      if (srcType !== 'any' && tgtType !== 'any' && srcType !== tgtType) {
        if (srcType === 'number' && tgtType === 'string') {
          return true;
        }
        return false;
      }
    }

    return true;
  }

  private updateBackgroundGrid(): void {
    const scale = this.stage.scaleX();
    const pos = this.stage.position();
    const size = `${32 * scale}px ${32 * scale}px`;
    this.container.style.backgroundSize = size;
    this.container.style.backgroundPosition = `${pos.x}px ${pos.y}px`;
  }

  public renderGraph(nodes: NodeData[], wires: WireData[]): void {
    if (this.isDraggingNode || this.activeConnectingPort) {
      return;
    }

    this.nodeLayer.destroyChildren();
    this.wireLayer.destroyChildren();
    this.nodeGroups.clear();
    this.wireLines.clear();
    this.wireDataMap.clear();
    this.portShapes.clear();

    nodes.forEach((node) => this.addNodeToCanvas(node));
    wires.forEach((wire) => this.addWireToCanvas(wire));

    this.wireLayer.batchDraw();
    this.nodeLayer.batchDraw();
  }

  public addNodeToCanvas(node: NodeData): void {
    const group = new Konva.Group({
      id: node.id,
      x: node.position?.x ?? 100,
      y: node.position?.y ?? 100,
      draggable: true,
    });

    const categoryColor = CategoryColors[node.category] || CategoryColors.void;
    const isSelected = this.selectedNodeId === node.id;
    const isLightTheme = document.documentElement.dataset.theme === 'light';

    const prevCount = Object.keys(node.previous || {}).length;
    const nextPorts = Object.values(node.next || {}).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const nextCount = nextPorts.length;
    const inCount = Object.keys(node.input || {}).length;
    const outCount = Object.keys(node.output || {}).length;
    const isSingleNext = nextCount <= 1 && (nextCount === 0 || !nextPorts[0].title || nextPorts[0].title === 'Exec');

    const maxRows = isSingleNext
      ? Math.max(1, inCount, outCount)
      : Math.max(1, inCount, nextCount + outCount);
    const totalHeight = HEADER_HEIGHT + maxRows * ROW_HEIGHT + 8;
    const width = Math.max(node.width || 180, 180);

    // Node Box Shadow & Card (Material Design 3 Surface Elevation)
    const cardRect = new Konva.Rect({
      width,
      height: totalHeight,
      fill: isLightTheme ? '#f8f9fc' : '#1b1e26',
      stroke: isSelected ? '#a8c7fa' : (isLightTheme ? '#c2c6d0' : '#2d303c'),
      strokeWidth: isSelected ? 2 : 1,
      cornerRadius: NODE_CORNER_RADIUS,
      shadowColor: 'black',
      shadowBlur: 16,
      shadowOpacity: 0.45,
      shadowOffset: { x: 0, y: 6 },
    });
    group.add(cardRect);

    // Header Rect
    const headerRect = new Konva.Rect({
      width,
      height: HEADER_HEIGHT,
      fill: categoryColor,
      cornerRadius: [NODE_CORNER_RADIUS, NODE_CORNER_RADIUS, 0, 0],
    });
    group.add(headerRect);

    // Title Text
    const titleText = new Konva.Text({
      text: node.title,
      fontSize: 13,
      fontFamily: 'Inter, Roboto, sans-serif',
      fontStyle: 'bold',
      fill: '#ffffff',
      x: 14,
      y: 10,
      listening: false,
    });
    group.add(titleText);

    // Execution Pins
    if (node.previous) {
      Object.values(node.previous).forEach((port) => {
        const pin = new Konva.Rect({
          x: -PIN_SIZE / 2,
          y: HEADER_HEIGHT / 2 - PIN_SIZE / 2,
          width: PIN_SIZE,
          height: PIN_SIZE,
          fill: '#f8fafc',
          stroke: '#0f172a',
          strokeWidth: 1.5,
          cornerRadius: 2,
        });
        this.registerPort(pin, node, port, true, true, group);
        group.add(pin);
      });
    }

    if (node.next) {
      nextPorts.forEach((port, idx) => {
        const yPos = isSingleNext
          ? HEADER_HEIGHT / 2
          : HEADER_HEIGHT + idx * ROW_HEIGHT + ROW_HEIGHT / 2;

        const pin = new Konva.Rect({
          x: width - PIN_SIZE / 2,
          y: yPos - PIN_SIZE / 2,
          width: PIN_SIZE,
          height: PIN_SIZE,
          fill: '#f8fafc',
          stroke: '#0f172a',
          strokeWidth: 1.5,
          cornerRadius: 2,
        });
        this.registerPort(pin, node, port, false, true, group);
        group.add(pin);

        if (port.title && !isSingleNext) {
          const pinLabel = new Konva.Text({
            text: port.title,
            fontSize: 11,
            fill: '#94a3b8',
            x: width - 14 - (port.title.length * 7),
            y: yPos - 6,
            listening: false,
          });
          group.add(pinLabel);
        }
      });
    }

    // Data Input Sockets (Left)
    if (node.input) {
      Object.values(node.input).forEach((port, idx) => {
        const yPos = HEADER_HEIGHT + idx * ROW_HEIGHT + ROW_HEIGHT / 2;
        const portColor = DataTypeColors[port.dataType || 'any'];

        const socket = new Konva.Circle({
          x: 0,
          y: yPos,
          radius: SOCKET_RADIUS,
          fill: portColor,
          stroke: '#0f172a',
          strokeWidth: 1.5,
        });
        this.registerPort(socket, node, port, true, false, group);
        group.add(socket);

        const socketLabel = new Konva.Text({
          text: port.title || 'In',
          fontSize: 11,
          fill: isLightTheme ? '#4b5563' : '#cbd5e1',
          x: 14,
          y: yPos - 6,
          listening: false,
        });
        group.add(socketLabel);

        // Render editable inline constant field for unconnected inputs or value nodes
        const valBoxWidth = Math.max(48, width - 80);
        const valueRect = new Konva.Rect({
          x: 60,
          y: yPos - 9,
          width: valBoxWidth,
          height: 20,
          fill: isLightTheme ? '#eef1f6' : '#13151c',
          stroke: isLightTheme ? '#b7becb' : '#383c48',
          strokeWidth: 1,
          cornerRadius: 6,
        });

        const displayVal = port.value !== undefined && port.value !== null ? String(port.value) : '';
        const valueText = new Konva.Text({
          text: displayVal || (port.dataType === 'string' ? '""' : '0'),
          fontSize: 11,
          fontFamily: 'JetBrains Mono, monospace',
          fill: isLightTheme ? '#075985' : '#7cd4fd',
          x: 65,
          y: yPos - 5,
          width: valBoxWidth - 10,
          ellipsis: true,
          wrap: 'none',
          listening: false,
        });

        valueRect.on('mouseenter', () => {
          document.body.style.cursor = 'text';
          valueRect.stroke('#a8c7fa');
          this.nodeLayer.batchDraw();
        });

        valueRect.on('mouseleave', () => {
          document.body.style.cursor = 'default';
          valueRect.stroke('#383c48');
          this.nodeLayer.batchDraw();
        });

        valueRect.on('click tap', (e) => {
          e.cancelBubble = true;
          this.openInlineInput(node, port, valueText, valueRect);
        });

        group.add(valueRect);
        group.add(valueText);
      });
    }

    // Data Output Sockets (Right)
    if (node.output) {
      const outRowOffset = isSingleNext ? 0 : nextCount;
      Object.values(node.output).forEach((port, idx) => {
        const yPos = HEADER_HEIGHT + (outRowOffset + idx) * ROW_HEIGHT + ROW_HEIGHT / 2;
        const portColor = DataTypeColors[port.dataType || 'any'];

        const socket = new Konva.Circle({
          x: width,
          y: yPos,
          radius: SOCKET_RADIUS,
          fill: portColor,
          stroke: '#0f172a',
          strokeWidth: 1.5,
        });
        this.registerPort(socket, node, port, false, false, group);
        group.add(socket);

        const socketLabel = new Konva.Text({
          text: port.title || 'Out',
          fontSize: 11,
          fill: isLightTheme ? '#4b5563' : '#cbd5e1',
          x: width - 14 - ((port.title || 'Out').length * 7),
          y: yPos - 6,
          listening: false,
        });
        group.add(socketLabel);
      });
    }

    // Node Drag Events
    group.on('mouseenter', () => {
      if (!this.activeConnectingPort && !this.isDraggingNode) {
        document.body.style.cursor = 'grab';
      }
    });

    group.on('mouseleave', () => {
      if (!this.activeConnectingPort && !this.isDraggingNode) {
        document.body.style.cursor = 'default';
      }
    });

    group.on('dragstart', () => {
      this.isDraggingNode = true;
      document.body.style.cursor = 'grabbing';
      group.moveToTop();
      this.nodeLayer.batchDraw();
    });

    group.on('dragmove', () => {
      this.updateConnectedWires(node.id);
    });

    group.on('dragend', () => {
      this.isDraggingNode = false;
      document.body.style.cursor = 'grab';
      this.callbacks.onNodeMove?.(node.id, { x: group.x(), y: group.y() });
    });

    group.on('click tap', (e) => {
      e.cancelBubble = true;
      this.selectNode(node.id);
    });

    group.on('dblclick', (e) => {
      e.cancelBubble = true;
      if (node.type === 'function') {
        this.callbacks.onFunctionEdit?.(node.title);
      }
    });

    this.nodeGroups.set(node.id, group);
    this.nodeLayer.add(group);
  }

  private registerPort(
    shape: Konva.Shape,
    node: NodeData,
    port: PortData,
    isInput: boolean,
    isExec: boolean,
    group: Konva.Group
  ): void {
    this.portShapes.set(port.id, { shape, node, port, isInput, isExec, group });

    // When hovering over a port, disable parent group drag so wire creation gets 100% priority
    shape.on('mouseenter', () => {
      group.draggable(false);
      if (!this.activeConnectingPort && !this.isDraggingNode) {
        shape.scale({ x: 1.4, y: 1.4 });
        shape.stroke('#ffffff');
        document.body.style.cursor = 'crosshair';
        this.nodeLayer.batchDraw();
      }
    });

    shape.on('mouseleave', () => {
      if (!this.activeConnectingPort) {
        group.draggable(true);
      }
      if (!this.activeConnectingPort || this.snappedTargetPort?.port.id !== port.id) {
        shape.scale({ x: 1, y: 1 });
        shape.stroke('#0f172a');
        if (!this.isDraggingNode && !this.activeConnectingPort) {
          document.body.style.cursor = 'default';
        }
        this.nodeLayer.batchDraw();
      }
    });

    shape.on('mousedown', (e) => {
      e.cancelBubble = true;
      group.draggable(false);
      this.stage.draggable(false);

      const relPos = this.getPortCanvasPosition(shape, isExec);

      this.activeConnectingPort = {
        portId: port.id,
        nodeId: node.id,
        isInput,
        isExec,
        dataType: port.dataType,
        pos: relPos,
      };

      const wireColor = isExec ? '#ffffff' : DataTypeColors[port.dataType || 'any'];
      this.dragWire = new Konva.Line({
        points: [relPos.x, relPos.y, relPos.x, relPos.y],
        stroke: wireColor,
        strokeWidth: isExec ? 3 : 2.5,
        bezier: true,
        lineCap: 'round',
        listening: false,
      });

      this.dragWireLayer.add(this.dragWire);
      this.dragWireLayer.batchDraw();
    });
  }

  private endWireDrag(): void {
    if (this.dragWire) {
      this.dragWire.destroy();
      this.dragWire = null;
      this.dragWireLayer.batchDraw();
    }

    if (this.snappedTargetPort) {
      this.snappedTargetPort.shape.scale({ x: 1, y: 1 });
      this.snappedTargetPort.shape.stroke('#0f172a');
      this.snappedTargetPort = null;
      this.nodeLayer.batchDraw();
    }

    // Restore draggable on all node groups
    this.nodeGroups.forEach((grp) => {
      grp.draggable(true);
    });

    this.activeConnectingPort = null;
    this.stage.draggable(false);
    document.body.style.cursor = 'default';
  }

  public addWireToCanvas(wire: WireData): void {
    const originEntry = this.portShapes.get(wire.originPortId);
    const targetEntry = this.portShapes.get(wire.targetPortId);
    if (!originEntry || !targetEntry) return;

    const p1 = this.getPortCanvasPosition(originEntry.shape, originEntry.isExec);
    const p2 = this.getPortCanvasPosition(targetEntry.shape, targetEntry.isExec);
    const points = this.calculateBezierPoints(p1, p2);

    const isExec = originEntry.isExec;
    const color = isExec ? '#ffffff' : DataTypeColors[originEntry.port.dataType || 'any'];

    const line = new Konva.Line({
      id: wire.id,
      points,
      stroke: color,
      strokeWidth: isExec ? 3 : 2.5,
      bezier: true,
      lineCap: 'round',
      hitStrokeWidth: 12,
    });

    line.on('click tap', (e) => {
      e.cancelBubble = true;
      if (window.confirm('Delete this connection? You can undo this action.')) {
        this.callbacks.onWireDelete?.(wire.id);
      }
    });

    line.on('mouseenter', () => {
      line.stroke('#ef4444');
      document.body.style.cursor = 'pointer';
      this.wireLayer.batchDraw();
    });

    line.on('mouseleave', () => {
      line.stroke(color);
      document.body.style.cursor = 'default';
      this.wireLayer.batchDraw();
    });

    this.wireDataMap.set(wire.id, wire);
    this.wireLines.set(wire.id, line);
    this.wireLayer.add(line);
  }

  public updateConnectedWires(nodeId: string): void {
    this.wireDataMap.forEach((wire, wireId) => {
      const originEntry = this.portShapes.get(wire.originPortId);
      const targetEntry = this.portShapes.get(wire.targetPortId);
      if (!originEntry || !targetEntry) return;

      if (originEntry.node.id === nodeId || targetEntry.node.id === nodeId) {
        const line = this.wireLines.get(wireId);
        if (line) {
          const p1 = this.getPortCanvasPosition(originEntry.shape, originEntry.isExec);
          const p2 = this.getPortCanvasPosition(targetEntry.shape, targetEntry.isExec);
          line.points(this.calculateBezierPoints(p1, p2));
        }
      }
    });

    this.wireLayer.batchDraw();
  }

  private getPortCanvasPosition(shape: Konva.Shape, isExec: boolean): { x: number; y: number } {
    const abs = shape.getAbsolutePosition();
    const offsetX = isExec ? PIN_SIZE / 2 : 0;
    const offsetY = isExec ? PIN_SIZE / 2 : 0;

    return {
      x: (abs.x + offsetX * this.stage.scaleX() - this.stage.x()) / this.stage.scaleX(),
      y: (abs.y + offsetY * this.stage.scaleY() - this.stage.y()) / this.stage.scaleY(),
    };
  }

  private calculateBezierPoints(p1: { x: number; y: number }, p2: { x: number; y: number }): number[] {
    const dx = Math.abs(p2.x - p1.x) * 0.55;
    const cp1x = p1.x + Math.max(dx, 40);
    const cp1y = p1.y;
    const cp2x = p2.x - Math.max(dx, 40);
    const cp2y = p2.y;
    return [p1.x, p1.y, cp1x, cp1y, cp2x, cp2y, p2.x, p2.y];
  }

  public selectNode(nodeId: string | null): void {
    this.selectedNodeId = nodeId;
    this.nodeGroups.forEach((group, id) => {
      const rect = group.findOne('Rect') as Konva.Rect;
      if (rect) {
        rect.stroke(id === nodeId ? '#38bdf8' : '#334155');
        rect.strokeWidth(id === nodeId ? 2 : 1);
      }
    });
    this.nodeLayer.batchDraw();
    this.callbacks.onNodeSelect?.(nodeId);
  }

  public zoomIn(): void {
    const oldScale = this.stage.scaleX();
    const newScale = Math.min(2.5, oldScale * 1.2);
    this.stage.scale({ x: newScale, y: newScale });
    this.stage.batchDraw();
    this.updateBackgroundGrid();
  }

  public zoomOut(): void {
    const oldScale = this.stage.scaleX();
    const newScale = Math.max(0.2, oldScale / 1.2);
    this.stage.scale({ x: newScale, y: newScale });
    this.stage.batchDraw();
    this.updateBackgroundGrid();
  }

  public resetView(): void {
    this.stage.scale({ x: 1, y: 1 });
    this.stage.position({ x: 0, y: 0 });
    this.stage.batchDraw();
    this.updateBackgroundGrid();
  }

  public getTransform(): { position: { x: number; y: number }; scale: { x: number; y: number } } {
    return {
      position: { x: this.stage.x(), y: this.stage.y() },
      scale: { x: this.stage.scaleX(), y: this.stage.scaleY() },
    };
  }

  public fitGraph(): void {
    const nodes = [...this.nodeGroups.values()];
    if (nodes.length === 0) {
      this.resetView();
      return;
    }

    const bounds = nodes.reduce(
      (box, group) => {
        const rect = group.getClientRect({ skipTransform: true });
        return {
          left: Math.min(box.left, group.x()),
          top: Math.min(box.top, group.y()),
          right: Math.max(box.right, group.x() + rect.width),
          bottom: Math.max(box.bottom, group.y() + rect.height),
        };
      },
      { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
    );
    const padding = 72;
    const scale = Math.max(0.2, Math.min(1.25, Math.min(
      (this.stage.width() - padding * 2) / Math.max(1, bounds.right - bounds.left),
      (this.stage.height() - padding * 2) / Math.max(1, bounds.bottom - bounds.top)
    )));
    this.stage.scale({ x: scale, y: scale });
    this.stage.position({
      x: (this.stage.width() - (bounds.right - bounds.left) * scale) / 2 - bounds.left * scale,
      y: (this.stage.height() - (bounds.bottom - bounds.top) * scale) / 2 - bounds.top * scale,
    });
    this.stage.batchDraw();
    this.updateBackgroundGrid();
  }

  private openInlineInput(
    node: NodeData,
    port: PortData,
    valueText: Konva.Text,
    valueRect: Konva.Rect
  ): void {
    const textPosition = valueRect.getAbsolutePosition();
    const stageBox = this.container.getBoundingClientRect();

    const areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
    };

    const input = document.createElement('input');
    document.body.appendChild(input);

    input.value = String(port.value ?? '');
    input.style.position = 'absolute';
    input.style.top = `${areaPosition.y}px`;
    input.style.left = `${areaPosition.x}px`;
    input.style.width = `${Math.max(60, valueRect.width() * this.stage.scaleX())}px`;
    input.style.height = `${valueRect.height() * this.stage.scaleY()}px`;
    input.style.fontSize = `${11 * this.stage.scaleX()}px`;
    input.style.border = '1px solid #38bdf8';
    input.style.padding = '0px 4px';
    input.style.margin = '0px';
    input.style.background = '#020617';
    input.style.color = '#38bdf8';
    input.style.outline = 'none';
    input.style.borderRadius = '4px';
    input.style.zIndex = '9999';
    input.focus();
    input.select();

    let isCommitted = false;

    const removeInput = () => {
      window.removeEventListener('click', handleOutsideClick);
      if (input.parentNode) {
        input.parentNode.removeChild(input);
      }
    };

    const commitChange = () => {
      if (isCommitted) return;
      isCommitted = true;

      const newVal = input.value;
      const parsedVal = port.dataType === 'number' && !isNaN(Number(newVal)) && newVal.trim() !== '' ? Number(newVal) : newVal;
      port.value = parsedVal;
      valueText.text(String(parsedVal) || (port.dataType === 'string' ? '""' : '0'));
      this.nodeLayer.batchDraw();
      this.callbacks.onPortValueChange?.(node.id, port.id, parsedVal);
      removeInput();
    };

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        commitChange();
      }
      if (e.key === 'Escape') {
        isCommitted = true;
        removeInput();
      }
    });

    input.addEventListener('blur', () => {
      commitChange();
    });

    const handleOutsideClick = (e: MouseEvent) => {
      if (e.target !== input) {
        commitChange();
      }
    };
    setTimeout(() => {
      window.addEventListener('click', handleOutsideClick);
    }, 10);
  }

  public destroy(): void {
    this.stage.destroy();
  }
}

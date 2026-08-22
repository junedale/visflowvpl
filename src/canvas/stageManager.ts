import Konva from 'konva';
import { nanoid } from 'nanoid';
import { NodeData, WireData, DataType, PortData } from '../types/flow.js';
import { CategoryColors, DataTypeColors, PIN_SIZE, SOCKET_RADIUS, HEADER_HEIGHT, ROW_HEIGHT, NODE_CORNER_RADIUS } from './constants.js';

export interface StageCallbacks {
  onNodeMove?: (nodeId: string, position: { x: number; y: number }) => void;
  onNodesMove?: (moves: { nodeId: string; position: { x: number; y: number } }[]) => void;
  onNodeSelect?: (nodeId: string | null, multiSelection?: string[]) => void;
  onNodeDelete?: (nodeId: string) => void;
  onWireCreate?: (wire: WireData) => void;
  onWireDelete?: (wireId: string) => void;
  onPortValueChange?: (nodeId: string, portId: string, value: any) => void;
  onFunctionEdit?: (functionName: string) => void;
  onContextMenu?: (screenPos: { x: number; y: number }, canvasPos: { x: number; y: number }) => void;
  onCommentChange?: (nodeId: string, text: string) => void;
  onWireDropOnCanvas?: (
    screenPos: { x: number; y: number },
    canvasPos: { x: number; y: number },
    connectingPort: { portId: string; nodeId: string; isInput: boolean; isExec: boolean; dataType?: DataType }
  ) => void;
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
  private selectionLayer: Konva.Layer;

  private nodeGroups: Map<string, Konva.Group> = new Map();
  private nodeDataMap: Map<string, NodeData> = new Map();
  private wireLines: Map<string, Konva.Line> = new Map();
  private wireDataMap: Map<string, WireData> = new Map();
  private portShapes: Map<string, PortEntry> = new Map();
  private portTextMap: Map<string, Konva.Text> = new Map();

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
  private selectedNodeIds: Set<string> = new Set();
  private isDraggingNode: boolean = false;
  private dragStartPositions: Map<string, { x: number; y: number }> = new Map();
  private readonly SNAP_DISTANCE = 40;

  private isMarqueeSelecting: boolean = false;
  private marqueeStartPos: { x: number; y: number } | null = null;
  private marqueeRect: Konva.Rect | null = null;

  private highlightedNodeId: string | null = null;
  private highlightRing: Konva.Rect | null = null;

  private isGridUpdateScheduled: boolean = false;
  private dirtyWireNodeIds: Set<string> = new Set();
  private isWireUpdateScheduled: boolean = false;

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
    this.selectionLayer = new Konva.Layer({ id: 'selectionLayer' });

    this.stage.add(this.wireLayer);
    this.stage.add(this.nodeLayer);
    this.stage.add(this.dragWireLayer);
    this.stage.add(this.selectionLayer);

    this.setupListeners();
    this.scheduleBackgroundGridUpdate();
  }

  private setupListeners(): void {
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
      this.scheduleBackgroundGridUpdate();
    });

    this.stage.on('mousedown', (e) => {
      if (e.target === this.stage && e.evt.button === 0 && !this.activeConnectingPort && !this.isDraggingNode) {
        if (e.evt.shiftKey) {
          this.isMarqueeSelecting = true;
          this.stage.draggable(false);
          const relPos = this.stage.getRelativePointerPosition();
          if (relPos) {
            this.marqueeStartPos = relPos;
            this.marqueeRect = new Konva.Rect({
              x: relPos.x,
              y: relPos.y,
              width: 0,
              height: 0,
              stroke: '#38bdf8',
              strokeWidth: 1.5,
              fill: 'rgba(56, 189, 248, 0.12)',
              dash: [4, 4],
              listening: false,
              perfectDrawEnabled: false,
            });
            this.selectionLayer.add(this.marqueeRect);
            this.selectionLayer.batchDraw();
          }
        } else {
          this.stage.draggable(true);
        }
      }
    });

    this.stage.on('mouseup', () => {
      if (this.stage.draggable()) {
        this.stage.draggable(false);
      }

      if (this.isMarqueeSelecting && this.marqueeRect && this.marqueeStartPos) {
        const currentPos = this.stage.getRelativePointerPosition();
        if (currentPos) {
          const x1 = Math.min(this.marqueeStartPos.x, currentPos.x);
          const y1 = Math.min(this.marqueeStartPos.y, currentPos.y);
          const x2 = Math.max(this.marqueeStartPos.x, currentPos.x);
          const y2 = Math.max(this.marqueeStartPos.y, currentPos.y);

          const matchingIds: string[] = [];
          this.nodeGroups.forEach((group, id) => {
            const gx = group.x();
            const gy = group.y();
            const rect = group.findOne('Rect') as Konva.Rect;
            const gw = rect ? rect.width() : 180;
            const gh = rect ? rect.height() : 100;

            if (gx < x2 && gx + gw > x1 && gy < y2 && gy + gh > y1) {
              matchingIds.push(id);
            }
          });

          this.selectNodes(matchingIds);
        }

        this.marqueeRect.destroy();
        this.marqueeRect = null;
        this.marqueeStartPos = null;
        this.isMarqueeSelecting = false;
        this.selectionLayer.batchDraw();
      }
    });

    this.stage.on('dragmove', (e) => {
      if (e.target === this.stage) {
        this.scheduleBackgroundGridUpdate();
      }
    });

    this.stage.on('click tap', (e) => {
      if (e.target === this.stage && !this.isMarqueeSelecting) {
        this.selectNodes([]);
      }
    });

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const stageBox = this.container.getBoundingClientRect();
      const mouseX = e.clientX - stageBox.left;
      const mouseY = e.clientY - stageBox.top;
      const scale = this.stage.scaleX();
      const canvasPos = {
        x: (mouseX - this.stage.x()) / scale,
        y: (mouseY - this.stage.y()) / scale,
      };

      this.callbacks.onContextMenu?.({ x: e.clientX, y: e.clientY }, canvasPos);
    };

    this.container.addEventListener('contextmenu', handleContextMenu);
    this.stage.on('contextmenu', (e) => {
      e.evt.preventDefault();
      handleContextMenu(e.evt);
    });

    this.stage.on('mousemove', () => {
      if (this.isMarqueeSelecting && this.marqueeRect && this.marqueeStartPos) {
        const ptr = this.stage.getRelativePointerPosition();
        if (ptr) {
          const x = Math.min(this.marqueeStartPos.x, ptr.x);
          const y = Math.min(this.marqueeStartPos.y, ptr.y);
          const w = Math.abs(ptr.x - this.marqueeStartPos.x);
          const h = Math.abs(ptr.y - this.marqueeStartPos.y);

          this.marqueeRect.setAttrs({ x, y, width: w, height: h });
          this.selectionLayer.batchDraw();
        }
        return;
      }

      if (!this.activeConnectingPort || !this.dragWire) return;

      const ptr = this.stage.getRelativePointerPosition();
      if (!ptr) return;

      const sourcePos = this.activeConnectingPort.pos;
      let targetPos = ptr;

      const nearestPort = this.findNearestCompatiblePort(ptr);

      if (this.snappedTargetPort && this.snappedTargetPort !== nearestPort) {
        this.snappedTargetPort.shape.scale({ x: 1, y: 1 });
        this.snappedTargetPort.shape.stroke('#0f172a');
        this.snappedTargetPort = null;
      }

      if (nearestPort) {
        this.snappedTargetPort = nearestPort;
        targetPos = this.getPortCanvasPosition(nearestPort.shape, nearestPort.isExec);
        nearestPort.shape.scale({ x: 1.4, y: 1.4 });
        nearestPort.shape.stroke('#ffffff');
      }

      const p1 = this.activeConnectingPort.isInput ? targetPos : sourcePos;
      const p2 = this.activeConnectingPort.isInput ? sourcePos : targetPos;
      const points = this.calculateBezierPoints(p1, p2);

      this.dragWire.points(points);
      this.dragWireLayer.batchDraw();
      this.nodeLayer.batchDraw();
    });

    this.stage.on('mouseup', () => {
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

      // Wire-Drop Quick-Connect: Released onto empty canvas space
      if (!targetPort && this.activeConnectingPort) {
        const sourcePort = { ...this.activeConnectingPort };
        const pointer = this.stage.getPointerPosition();
        if (pointer) {
          const stageBox = this.container.getBoundingClientRect();
          const screenPos = { x: stageBox.left + pointer.x, y: stageBox.top + pointer.y };
          const scale = this.stage.scaleX();
          const canvasPos = {
            x: (pointer.x - this.stage.x()) / scale,
            y: (pointer.y - this.stage.y()) / scale,
          };
          this.endWireDrag();
          this.callbacks.onWireDropOnCanvas?.(screenPos, canvasPos, sourcePort);
          return;
        }
      }

      this.endWireDrag();
    });

    window.addEventListener('mouseup', () => {
      if (this.activeConnectingPort) {
        this.endWireDrag();
      }
      this.isDraggingNode = false;
    });

    window.addEventListener('resize', () => {
      if (!this.container) return;
      this.stage.width(this.container.clientWidth);
      this.stage.height(this.container.clientHeight);
      this.stage.batchDraw();
    });
  }

  private scheduleBackgroundGridUpdate(): void {
    if (this.isGridUpdateScheduled) return;
    this.isGridUpdateScheduled = true;
    requestAnimationFrame(() => {
      this.isGridUpdateScheduled = false;
      const scale = this.stage.scaleX();
      const pos = this.stage.position();
      const size = `${32 * scale}px ${32 * scale}px`;
      this.container.style.backgroundSize = size;
      this.container.style.backgroundPosition = `${pos.x}px ${pos.y}px`;
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
        if (srcType === 'number' && tgtType === 'string') return true;
        return false;
      }
    }
    return true;
  }

  public renderGraph(nodes: NodeData[], wires: WireData[]): void {
    if (this.isDraggingNode || this.activeConnectingPort) return;

    const newNodesMap = new Map(nodes.map((n) => [n.id, n]));
    const newWiresMap = new Map(wires.map((w) => [w.id, w]));

    let nodesChanged = false;
    let wiresChanged = false;

    for (const [nodeId, group] of this.nodeGroups.entries()) {
      if (!newNodesMap.has(nodeId)) {
        this.removeNodeFromCanvas(nodeId, group);
        nodesChanged = true;
      }
    }

    for (const node of nodes) {
      const existingGroup = this.nodeGroups.get(node.id);
      if (!existingGroup) {
        this.addNodeToCanvas(node);
        nodesChanged = true;
      } else {
        if (node.position && (existingGroup.x() !== node.position.x || existingGroup.y() !== node.position.y)) {
          existingGroup.position({ x: node.position.x, y: node.position.y });
          nodesChanged = true;
          this.queueWireUpdate(node.id);
        }

        if (node.input) {
          Object.values(node.input).forEach((port) => {
            const txt = this.portTextMap.get(port.id);
            if (txt) {
              const displayVal = port.value !== undefined && port.value !== null ? String(port.value) : '';
              const newLabel = displayVal !== '' ? displayVal : (port.dataType === 'string' ? '""' : '0');
              if (txt.text() !== newLabel) {
                txt.text(newLabel);
                nodesChanged = true;
              }
            }
          });
        }
      }
    }

    for (const [wireId, line] of this.wireLines.entries()) {
      if (!newWiresMap.has(wireId)) {
        line.destroy();
        this.wireLines.delete(wireId);
        this.wireDataMap.delete(wireId);
        wiresChanged = true;
      }
    }

    for (const wire of wires) {
      if (!this.wireLines.has(wire.id)) {
        this.addWireToCanvas(wire);
        wiresChanged = true;
      }
    }

    if (nodesChanged) {
      this.nodeLayer.batchDraw();
    }
    if (wiresChanged) {
      this.wireLayer.batchDraw();
    }

    if (this.highlightedNodeId) {
      this.highlightNode(this.highlightedNodeId, false);
    }
  }

  private removeNodeFromCanvas(nodeId: string, group: Konva.Group): void {
    const node = this.nodeDataMap.get(nodeId);
    if (node) {
      const allPorts = [
        ...Object.values(node.previous || {}),
        ...Object.values(node.next || {}),
        ...Object.values(node.input || {}),
        ...Object.values(node.output || {}),
      ];
      allPorts.forEach((p) => {
        this.portShapes.delete(p.id);
        this.portTextMap.delete(p.id);
      });
    }
    group.destroy();
    this.nodeGroups.delete(nodeId);
    this.nodeDataMap.delete(nodeId);
    this.selectedNodeIds.delete(nodeId);
  }

  public addNodeToCanvas(node: NodeData): void {
    this.nodeDataMap.set(node.id, node);

    const group = new Konva.Group({
      id: node.id,
      x: node.position?.x ?? 100,
      y: node.position?.y ?? 100,
      draggable: true,
      transformsEnabled: 'position',
    });

    const isSelected = this.selectedNodeIds.has(node.id);
    const isLightTheme = document.documentElement.dataset.theme === 'light';

    if (node.type === 'comment') {
      const noteWidth = Math.max(node.width || 220, 160);
      const noteHeight = Math.max(node.height || 130, 80);

      const noteCard = new Konva.Rect({
        width: noteWidth,
        height: noteHeight,
        fill: isLightTheme ? '#fef3c7' : '#1a1f2c',
        stroke: isSelected ? '#38bdf8' : (isLightTheme ? '#fcd34d' : '#334155'),
        strokeWidth: isSelected ? 2 : 1,
        cornerRadius: 10,
        perfectDrawEnabled: false,
      });
      group.add(noteCard);

      const noteHeader = new Konva.Rect({
        width: noteWidth,
        height: 26,
        fill: isLightTheme ? '#fde68a' : '#262d3d',
        cornerRadius: [10, 10, 0, 0],
        perfectDrawEnabled: false,
      });
      group.add(noteHeader);

      const noteTitle = new Konva.Text({
        text: `📌 ${node.title || 'Note'}`,
        fontSize: 11,
        fontFamily: 'Inter, sans-serif',
        fontStyle: 'bold',
        fill: isLightTheme ? '#78350f' : '#cbd5e1',
        x: 10,
        y: 7,
        listening: false,
        perfectDrawEnabled: false,
      });
      group.add(noteTitle);

      const noteBody = new Konva.Text({
        text: node.commentText || 'Double-click to write note...',
        fontSize: 11,
        fontFamily: 'Inter, sans-serif',
        fill: isLightTheme ? '#92400e' : '#94a3b8',
        x: 12,
        y: 34,
        width: noteWidth - 24,
        height: noteHeight - 42,
        wrap: 'word',
        listening: false,
        perfectDrawEnabled: false,
      });
      group.add(noteBody);

      group.on('dblclick', (e) => {
        e.cancelBubble = true;
        this.openCommentInput(node, noteBody, noteCard);
      });

      this.bindNodeDragAndSelect(group, node);
      this.nodeGroups.set(node.id, group);
      this.nodeLayer.add(group);
      return;
    }

    const categoryColor = CategoryColors[node.category] || CategoryColors.void;
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

    const cardRect = new Konva.Rect({
      width,
      height: totalHeight,
      fill: isLightTheme ? '#f8f9fc' : '#141822',
      stroke: isSelected ? '#38bdf8' : (isLightTheme ? '#cbd5e1' : '#2a3040'),
      strokeWidth: isSelected ? 2 : 1,
      cornerRadius: NODE_CORNER_RADIUS,
      perfectDrawEnabled: false,
    });
    group.add(cardRect);

    const headerRect = new Konva.Rect({
      width,
      height: HEADER_HEIGHT,
      fill: categoryColor,
      cornerRadius: [NODE_CORNER_RADIUS, NODE_CORNER_RADIUS, 0, 0],
      perfectDrawEnabled: false,
    });
    group.add(headerRect);

    const titleText = new Konva.Text({
      text: node.title,
      fontSize: 12,
      fontFamily: 'Inter, sans-serif',
      fontStyle: 'bold',
      fill: '#ffffff',
      x: 12,
      y: 9,
      listening: false,
      perfectDrawEnabled: false,
    });
    group.add(titleText);

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
          perfectDrawEnabled: false,
        });
        this.registerPort(pin, node, port, true, true, group);
        group.add(pin);
      });
    }

    if (node.next) {
      nextPorts.forEach((port, idx) => {
        const yPos = isSingleNext ? HEADER_HEIGHT / 2 : HEADER_HEIGHT + idx * ROW_HEIGHT + ROW_HEIGHT / 2;
        const pin = new Konva.Rect({
          x: width - PIN_SIZE / 2,
          y: yPos - PIN_SIZE / 2,
          width: PIN_SIZE,
          height: PIN_SIZE,
          fill: '#f8fafc',
          stroke: '#0f172a',
          strokeWidth: 1.5,
          cornerRadius: 2,
          perfectDrawEnabled: false,
        });
        this.registerPort(pin, node, port, false, true, group);
        group.add(pin);
      });
    }

    if (node.input) {
      Object.values(node.input).forEach((port, idx) => {
        const yPos = HEADER_HEIGHT + idx * ROW_HEIGHT + ROW_HEIGHT / 2;
        const socket = new Konva.Circle({
          x: 0,
          y: yPos,
          radius: SOCKET_RADIUS,
          fill: DataTypeColors[port.dataType || 'any'],
          stroke: '#0f172a',
          strokeWidth: 1.5,
          perfectDrawEnabled: false,
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
          perfectDrawEnabled: false,
        });
        group.add(socketLabel);

        const valBoxWidth = Math.max(52, width - 80);
        const valueRect = new Konva.Rect({
          x: 60,
          y: yPos - 10,
          width: valBoxWidth,
          height: 20,
          fill: isLightTheme ? '#eef1f6' : '#0c0f17',
          stroke: isLightTheme ? '#b7becb' : '#334155',
          strokeWidth: 1,
          cornerRadius: 5,
          perfectDrawEnabled: false,
        });

        const displayVal = port.value !== undefined && port.value !== null ? String(port.value) : '';
        const valueText = new Konva.Text({
          text: displayVal !== '' ? displayVal : (port.dataType === 'string' ? '""' : '0'),
          fontSize: 11,
          fontFamily: 'JetBrains Mono, monospace',
          fill: isLightTheme ? '#075985' : '#7cd4fd',
          x: 65,
          y: yPos - 6,
          width: valBoxWidth - 10,
          ellipsis: true,
          wrap: 'none',
          listening: true,
          perfectDrawEnabled: false,
        });

        this.portTextMap.set(port.id, valueText);

        const handleInputHover = () => {
          group.draggable(false);
          document.body.style.cursor = 'text';
          valueRect.stroke('#38bdf8');
          valueRect.strokeWidth(1.5);
          this.nodeLayer.batchDraw();
        };

        const handleInputLeave = () => {
          if (!this.activeConnectingPort) {
            group.draggable(true);
          }
          document.body.style.cursor = 'default';
          valueRect.stroke(isLightTheme ? '#b7becb' : '#334155');
          valueRect.strokeWidth(1);
          this.nodeLayer.batchDraw();
        };

        const triggerInput = (e: any) => {
          e.cancelBubble = true;
          this.openInlineInput(node, port, valueText, valueRect);
        };

        valueRect.on('mouseenter', handleInputHover);
        valueRect.on('mouseleave', handleInputLeave);
        valueRect.on('mousedown', (e) => {
          e.cancelBubble = true;
          group.draggable(false);
        });
        valueRect.on('click tap', triggerInput);
        valueRect.on('dblclick', triggerInput);

        valueText.on('mouseenter', handleInputHover);
        valueText.on('mouseleave', handleInputLeave);
        valueText.on('mousedown', (e) => {
          e.cancelBubble = true;
          group.draggable(false);
        });
        valueText.on('click tap', triggerInput);
        valueText.on('dblclick', triggerInput);

        group.add(valueRect);
        group.add(valueText);
      });
    }

    if (node.output) {
      const outRowOffset = isSingleNext ? 0 : nextCount;
      Object.values(node.output).forEach((port, idx) => {
        const yPos = HEADER_HEIGHT + (outRowOffset + idx) * ROW_HEIGHT + ROW_HEIGHT / 2;
        const socket = new Konva.Circle({
          x: width,
          y: yPos,
          radius: SOCKET_RADIUS,
          fill: DataTypeColors[port.dataType || 'any'],
          stroke: '#0f172a',
          strokeWidth: 1.5,
          perfectDrawEnabled: false,
        });
        this.registerPort(socket, node, port, false, false, group);
        group.add(socket);
      });
    }

    this.bindNodeDragAndSelect(group, node);
    this.nodeGroups.set(node.id, group);
    this.nodeLayer.add(group);
  }

  private bindNodeDragAndSelect(group: Konva.Group, node: NodeData): void {
    let startNodePos = { x: 0, y: 0 };

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
      startNodePos = { x: group.x(), y: group.y() };

      if (!this.selectedNodeIds.has(node.id)) {
        this.selectNodes([node.id]);
      }

      this.dragStartPositions.clear();
      this.selectedNodeIds.forEach((id) => {
        const grp = this.nodeGroups.get(id);
        if (grp) {
          this.dragStartPositions.set(id, { x: grp.x(), y: grp.y() });
          grp.moveToTop();
        }
      });
      this.nodeLayer.batchDraw();
    });

    group.on('dragmove', () => {
      const dx = group.x() - startNodePos.x;
      const dy = group.y() - startNodePos.y;

      this.selectedNodeIds.forEach((id) => {
        if (id !== node.id) {
          const grp = this.nodeGroups.get(id);
          const initial = this.dragStartPositions.get(id);
          if (grp && initial) {
            grp.position({ x: initial.x + dx, y: initial.y + dy });
          }
        }
        this.queueWireUpdate(id);
      });
    });

    group.on('dragend', () => {
      this.isDraggingNode = false;
      document.body.style.cursor = 'grab';
      const moves: { nodeId: string; position: { x: number; y: number } }[] = [];
      this.selectedNodeIds.forEach((id) => {
        const grp = this.nodeGroups.get(id);
        if (grp) {
          moves.push({ nodeId: id, position: { x: grp.x(), y: grp.y() } });
          this.callbacks.onNodeMove?.(id, { x: grp.x(), y: grp.y() });
        }
      });
      if (moves.length > 1) this.callbacks.onNodesMove?.(moves);
    });

    group.on('click tap', (e) => {
      e.cancelBubble = true;
      if (e.evt.shiftKey) {
        const newSelection = new Set(this.selectedNodeIds);
        newSelection.has(node.id) ? newSelection.delete(node.id) : newSelection.add(node.id);
        this.selectNodes(Array.from(newSelection));
      } else {
        this.selectNodes([node.id]);
      }
    });

    group.on('dblclick', (e) => {
      if (node.type === 'function') this.callbacks.onFunctionEdit?.(node.title);
    });
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
      if (!this.activeConnectingPort) group.draggable(true);
      if (!this.activeConnectingPort || this.snappedTargetPort?.port.id !== port.id) {
        shape.scale({ x: 1, y: 1 });
        shape.stroke('#0f172a');
        if (!this.isDraggingNode && !this.activeConnectingPort) document.body.style.cursor = 'default';
        this.nodeLayer.batchDraw();
      }
    });

    shape.on('mousedown', (e) => {
      e.cancelBubble = true;
      group.draggable(false);
      this.stage.draggable(false);
      const relPos = this.getPortCanvasPosition(shape, isExec);
      this.activeConnectingPort = { portId: port.id, nodeId: node.id, isInput, isExec, dataType: port.dataType, pos: relPos };
      this.dragWire = new Konva.Line({
        points: [relPos.x, relPos.y, relPos.x, relPos.y],
        stroke: isExec ? '#ffffff' : DataTypeColors[port.dataType || 'any'],
        strokeWidth: isExec ? 3 : 2.5,
        bezier: true,
        lineCap: 'round',
        listening: false,
        perfectDrawEnabled: false,
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
    this.nodeGroups.forEach((grp) => grp.draggable(true));
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

    const line = new Konva.Line({
      id: wire.id,
      points,
      stroke: originEntry.isExec ? '#ffffff' : DataTypeColors[originEntry.port.dataType || 'any'],
      strokeWidth: originEntry.isExec ? 3 : 2.5,
      bezier: true,
      lineCap: 'round',
      hitStrokeWidth: 10,
      perfectDrawEnabled: false,
    });

    line.on('click tap', (e) => {
      e.cancelBubble = true;
      if (window.confirm('Delete this connection?')) this.callbacks.onWireDelete?.(wire.id);
    });

    this.wireDataMap.set(wire.id, wire);
    this.wireLines.set(wire.id, line);
    this.wireLayer.add(line);
  }

  private queueWireUpdate(nodeId: string): void {
    this.dirtyWireNodeIds.add(nodeId);
    if (this.isWireUpdateScheduled) return;
    this.isWireUpdateScheduled = true;
    requestAnimationFrame(() => {
      this.isWireUpdateScheduled = false;
      this.dirtyWireNodeIds.forEach((id) => this.updateConnectedWires(id));
      this.dirtyWireNodeIds.clear();
      this.wireLayer.batchDraw();
    });
  }

  public updateConnectedWires(nodeId: string): void {
    this.wireDataMap.forEach((wire, wireId) => {
      const originEntry = this.portShapes.get(wire.originPortId);
      const targetEntry = this.portShapes.get(wire.targetPortId);
      if (originEntry && targetEntry && (originEntry.node.id === nodeId || targetEntry.node.id === nodeId)) {
        const line = this.wireLines.get(wireId);
        if (line) {
          const p1 = this.getPortCanvasPosition(originEntry.shape, originEntry.isExec);
          const p2 = this.getPortCanvasPosition(targetEntry.shape, targetEntry.isExec);
          line.points(this.calculateBezierPoints(p1, p2));
        }
      }
    });
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
    const cp2x = p2.x - Math.max(dx, 40);
    return [p1.x, p1.y, cp1x, p1.y, cp2x, p2.y, p2.x, p2.y];
  }

  public selectNodes(nodeIds: string[]): void {
    this.selectedNodeIds = new Set(nodeIds);
    this.nodeGroups.forEach((group, id) => {
      const rect = group.findOne('Rect') as Konva.Rect;
      if (rect) {
        const isSelected = this.selectedNodeIds.has(id);
        rect.stroke(isSelected ? '#38bdf8' : '#2a3040');
        rect.strokeWidth(isSelected ? 2 : 1);
      }
    });
    this.nodeLayer.batchDraw();
    this.callbacks.onNodeSelect?.(nodeIds.length > 0 ? nodeIds[0] : null, nodeIds);
  }

  public selectNode(nodeId: string | null): void {
    this.selectNodes(nodeId ? [nodeId] : []);
  }

  public getSelectedNodeIds(): string[] {
    return Array.from(this.selectedNodeIds);
  }

  public highlightNode(nodeId: string | null, autoCenter: boolean = true): void {
    this.highlightedNodeId = nodeId;
    if (this.highlightRing) {
      this.highlightRing.destroy();
      this.highlightRing = null;
    }
    if (!nodeId) {
      this.selectionLayer.batchDraw();
      return;
    }
    const group = this.nodeGroups.get(nodeId);
    if (!group) return;
    const cardRect = group.findOne('Rect') as Konva.Rect;
    const width = cardRect ? cardRect.width() : 180;
    const height = cardRect ? cardRect.height() : 100;

    this.highlightRing = new Konva.Rect({
      x: group.x() - 4,
      y: group.y() - 4,
      width: width + 8,
      height: height + 8,
      stroke: '#4ade80',
      strokeWidth: 2.5,
      cornerRadius: 14,
      listening: false,
      perfectDrawEnabled: false,
    });
    this.selectionLayer.add(this.highlightRing);
    this.selectionLayer.batchDraw();

    if (autoCenter) {
      const scale = this.stage.scaleX();
      const targetX = this.stage.width() / 2 - (group.x() + width / 2) * scale;
      const targetY = this.stage.height() / 2 - (group.y() + height / 2) * scale;
      this.stage.position({ x: targetX, y: targetY });
      this.stage.batchDraw();
      this.scheduleBackgroundGridUpdate();
    }
  }

  private flowAnimation: Konva.Animation | null = null;

  public setExecuting(isExecuting: boolean): void {
    if (isExecuting) {
      this.startWireFlowAnimation();
    } else {
      this.stopWireFlowAnimation();
    }
  }

  private startWireFlowAnimation(): void {
    if (this.flowAnimation || this.wireLines.size === 0) return;

    this.flowAnimation = new Konva.Animation((frame) => {
      if (!frame) return;
      const t = ((frame.time * 0.001) % 1.5) / 1.5; // Loop progress 0 to 1

      this.dragWireLayer.destroyChildren();

      this.wireLines.forEach((line) => {
        const pts = line.points();
        if (pts.length >= 8) {
          const p0 = { x: pts[0], y: pts[1] };
          const p1 = { x: pts[2], y: pts[3] };
          const p2 = { x: pts[4], y: pts[5] };
          const p3 = { x: pts[6], y: pts[7] };

          const u = 1 - t;
          const px = u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x;
          const py = u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y;

          const particle = new Konva.Circle({
            x: px,
            y: py,
            radius: 3.5,
            fill: '#38bdf8',
            stroke: '#ffffff',
            strokeWidth: 1,
            listening: false,
            perfectDrawEnabled: false,
          });
          this.dragWireLayer.add(particle);
        }
      });
    }, this.dragWireLayer);

    this.flowAnimation.start();
  }

  private stopWireFlowAnimation(): void {
    if (this.flowAnimation) {
      this.flowAnimation.stop();
      this.flowAnimation = null;
    }
    this.dragWireLayer.destroyChildren();
    this.dragWireLayer.batchDraw();
  }

  public zoomIn(): void {
    const scale = Math.min(2.5, this.stage.scaleX() * 1.2);
    this.stage.scale({ x: scale, y: scale });
    this.stage.batchDraw();
    this.scheduleBackgroundGridUpdate();
  }

  public zoomOut(): void {
    const scale = Math.max(0.2, this.stage.scaleX() / 1.2);
    this.stage.scale({ x: scale, y: scale });
    this.stage.batchDraw();
    this.scheduleBackgroundGridUpdate();
  }

  public resetView(): void {
    this.stage.scale({ x: 1, y: 1 });
    this.stage.position({ x: 0, y: 0 });
    this.stage.batchDraw();
    this.scheduleBackgroundGridUpdate();
  }

  public fitGraph(): void {
    if (this.nodeGroups.size === 0) return;
    let bounds = { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity };
    this.nodeGroups.forEach((group) => {
      const x = group.x(), y = group.y();
      const rect = group.findOne('Rect') as Konva.Rect;
      const w = rect ? rect.width() : 180, h = rect ? rect.height() : 100;
      bounds.left = Math.min(bounds.left, x);
      bounds.right = Math.max(bounds.right, x + w);
      bounds.top = Math.min(bounds.top, y);
      bounds.bottom = Math.max(bounds.bottom, y + h);
    });
    const padding = 80;
    const scale = Math.min(1.2, Math.max(0.3, Math.min(this.stage.width() / (bounds.right - bounds.left + padding * 2), this.stage.height() / (bounds.bottom - bounds.top + padding * 2))));
    this.stage.scale({ x: scale, y: scale });
    this.stage.position({ x: (this.stage.width() - (bounds.right + bounds.left) * scale) / 2, y: (this.stage.height() - (bounds.bottom + bounds.top) * scale) / 2 });
    this.stage.batchDraw();
    this.scheduleBackgroundGridUpdate();
  }

  private openCommentInput(node: NodeData, noteBody: Konva.Text, noteCard: Konva.Rect): void {
    const cardPos = noteCard.getAbsolutePosition();
    const stageBox = this.container.getBoundingClientRect();
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.value = String(node.commentText ?? '');
    textarea.style.position = 'fixed';
    textarea.style.top = `${stageBox.top + cardPos.y + 30 * this.stage.scaleY()}px`;
    textarea.style.left = `${stageBox.left + cardPos.x + 8 * this.stage.scaleX()}px`;
    textarea.style.width = `${(noteCard.width() - 16) * this.stage.scaleX()}px`;
    textarea.style.height = `${(noteCard.height() - 38) * this.stage.scaleY()}px`;
    textarea.style.fontSize = `${Math.max(11, 11 * this.stage.scaleX())}px`;
    textarea.style.border = '1.5px solid #38bdf8';
    textarea.style.padding = '6px';
    textarea.style.background = '#090d16';
    textarea.style.color = '#f8fafc';
    textarea.style.borderRadius = '6px';
    textarea.style.zIndex = '99999';
    textarea.style.boxSizing = 'border-box';
    textarea.style.outline = 'none';
    textarea.focus();
    let isCommitted = false;
    const commit = () => {
      if (isCommitted) return;
      isCommitted = true;
      node.commentText = textarea.value;
      noteBody.text(textarea.value || 'Double-click to write note...');
      this.nodeLayer.batchDraw();
      this.callbacks.onCommentChange?.(node.id, textarea.value);
      textarea.remove();
    };
    textarea.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Escape' || (e.key === 'Enter' && e.ctrlKey)) commit(); });
    textarea.addEventListener('keyup', (e) => e.stopPropagation());
    textarea.addEventListener('blur', () => commit());
  }

  public getTransform(): { position: { x: number; y: number }; scale: { x: number; y: number } } {
    return {
      position: { x: this.stage.x(), y: this.stage.y() },
      scale: { x: this.stage.scaleX(), y: this.stage.scaleY() },
    };
  }

  private activeInlineInput: HTMLInputElement | null = null;

  private openInlineInput(
    node: NodeData,
    port: PortData,
    valueText: Konva.Text,
    valueRect: Konva.Rect
  ): void {
    if (this.activeInlineInput) {
      try {
        this.activeInlineInput.blur();
      } catch (e) {}
    }

    const textPosition = valueRect.getAbsolutePosition();
    const stageBox = this.container.getBoundingClientRect();

    const areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
    };

    const input = document.createElement('input');
    this.activeInlineInput = input;
    document.body.appendChild(input);

    const initialVal = port.value !== undefined && port.value !== null ? String(port.value) : '';
    input.value = initialVal;
    input.style.position = 'fixed';
    input.style.top = `${areaPosition.y}px`;
    input.style.left = `${areaPosition.x}px`;
    input.style.width = `${Math.max(68, valueRect.width() * this.stage.scaleX())}px`;
    input.style.height = `${valueRect.height() * this.stage.scaleY()}px`;
    input.style.fontSize = `${Math.max(11, 11 * this.stage.scaleX())}px`;
    input.style.fontFamily = 'JetBrains Mono, monospace';
    input.style.border = '2px solid #38bdf8';
    input.style.padding = '0px 6px';
    input.style.margin = '0px';
    input.style.background = '#090d16';
    input.style.color = '#38bdf8';
    input.style.outline = 'none';
    input.style.borderRadius = '4px';
    input.style.boxSizing = 'border-box';
    input.style.boxShadow = '0 0 12px rgba(56, 189, 248, 0.6)';
    input.style.zIndex = '999999';
    input.style.pointerEvents = 'auto';

    let isCommitted = false;

    const removeInput = () => {
      if (isCommitted) return;
      isCommitted = true;
      if (this.activeInlineInput === input) {
        this.activeInlineInput = null;
      }
      window.removeEventListener('mousedown', handleOutsideMouseDown, true);
      if (input.parentNode) {
        input.parentNode.removeChild(input);
      }
    };

    const commitChange = () => {
      if (isCommitted) return;
      const newVal = input.value;
      let parsedVal: any = newVal;
      if (port.dataType === 'number') {
        if (!isNaN(Number(newVal)) && newVal.trim() !== '') {
          parsedVal = Number(newVal);
        }
      }

      port.value = parsedVal;
      valueText.text(String(parsedVal) !== '' ? String(parsedVal) : (port.dataType === 'string' ? '""' : '0'));
      this.nodeLayer.batchDraw();
      this.callbacks.onPortValueChange?.(node.id, port.id, parsedVal);
      removeInput();
    };

    input.addEventListener('keydown', (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (e.key === 'Enter') {
        e.preventDefault();
        commitChange();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        removeInput();
      }
    });

    input.addEventListener('keyup', (e) => { e.stopPropagation(); e.stopImmediatePropagation(); });
    input.addEventListener('keypress', (e) => { e.stopPropagation(); e.stopImmediatePropagation(); });
    input.addEventListener('input', (e) => { e.stopPropagation(); e.stopImmediatePropagation(); });
    input.addEventListener('mousedown', (e) => e.stopPropagation());
    input.addEventListener('click', (e) => e.stopPropagation());
    input.addEventListener('dblclick', (e) => e.stopPropagation());

    const handleOutsideMouseDown = (e: MouseEvent) => {
      if (e.target !== input) {
        commitChange();
      }
    };

    setTimeout(() => {
      input.focus();
      input.select();
      window.addEventListener('mousedown', handleOutsideMouseDown, true);
    }, 50);
  }

  public destroy(): void {
    this.stage.destroy();
  }
}

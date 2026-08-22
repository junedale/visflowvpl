import type { NodeData, WireData } from '../types/flow.js';

/**
 * Intelligent Hierarchical Graph Auto-Layout Algorithm
 * Formats visual nodes into clean left-to-right columns with consistent spacing.
 */
export function calculateAutoLayout(
  nodes: NodeData[],
  wires: WireData[]
): { id: string; position: { x: number; y: number } }[] {
  if (nodes.length === 0) return [];

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const portToNodeMap = new Map<string, string>();

  nodes.forEach((n) => {
    const allPorts = [
      ...Object.values(n.previous || {}),
      ...Object.values(n.next || {}),
      ...Object.values(n.input || {}),
      ...Object.values(n.output || {}),
    ];
    allPorts.forEach((p) => portToNodeMap.set(p.id, n.id));
  });

  // Directed graph adjacency: nodeA -> nodeB
  const outgoing = new Map<string, Set<string>>();
  const incoming = new Map<string, Set<string>>();

  nodes.forEach((n) => {
    outgoing.set(n.id, new Set());
    incoming.set(n.id, new Set());
  });

  wires.forEach((w) => {
    const srcNodeId = portToNodeMap.get(w.originPortId);
    const tgtNodeId = portToNodeMap.get(w.targetPortId);

    if (srcNodeId && tgtNodeId && srcNodeId !== tgtNodeId) {
      outgoing.get(srcNodeId)?.add(tgtNodeId);
      incoming.get(tgtNodeId)?.add(srcNodeId);
    }
  });

  // Assign column ranks (Longest path layering)
  const ranks = new Map<string, number>();

  // Find root nodes (no incoming connections or 'start' node)
  const startNode = nodes.find((n) => n.category === 'start' || n.title.toLowerCase() === 'start');
  const visited = new Set<string>();

  function assignRank(nodeId: string, currentRank: number) {
    const existing = ranks.get(nodeId) ?? 0;
    ranks.set(nodeId, Math.max(existing, currentRank));

    const children = outgoing.get(nodeId) || new Set();
    for (const childId of children) {
      assignRank(childId, currentRank + 1);
    }
  }

  if (startNode) {
    assignRank(startNode.id, 0);
  }

  // Handle all other unranked/floating nodes
  nodes.forEach((n) => {
    if (!ranks.has(n.id)) {
      const inCount = incoming.get(n.id)?.size || 0;
      if (inCount === 0) {
        assignRank(n.id, 0);
      }
    }
  });

  // Fallback for any remaining nodes
  nodes.forEach((n) => {
    if (!ranks.has(n.id)) {
      ranks.set(n.id, 0);
    }
  });

  // Group nodes by rank (column)
  const columns = new Map<number, string[]>();
  ranks.forEach((rank, nodeId) => {
    if (!columns.has(rank)) columns.set(rank, []);
    columns.get(rank)?.push(nodeId);
  });

  // Calculate layout coordinates
  const HORIZONTAL_SPACING = 240;
  const VERTICAL_SPACING = 150;
  const START_X = 80;
  const START_Y = 120;

  const result: { id: string; position: { x: number; y: number } }[] = [];

  const sortedRankKeys = Array.from(columns.keys()).sort((a, b) => a - b);

  sortedRankKeys.forEach((rank) => {
    const nodeIdsInCol = columns.get(rank) || [];
    const colX = START_X + rank * HORIZONTAL_SPACING;

    nodeIdsInCol.forEach((nodeId, rowIdx) => {
      const colY = START_Y + rowIdx * VERTICAL_SPACING;
      result.push({
        id: nodeId,
        position: { x: colX, y: colY },
      });
    });
  });

  return result;
}

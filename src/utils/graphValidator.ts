/**
 * Graph Validator — validates workflow topology before simulation.
 *
 * Checks performed:
 *  1. Exactly one Start node exists
 *  2. At least one End node exists
 *  3. Minimum node count (≥ 2)
 *  4. All non-terminal nodes are connected
 *  5. No cycles (DFS-based detection)
 *  6. Start node has at least one outgoing edge
 *  7. End node has at least one incoming edge
 */

interface ValidationError {
  nodeId: string;
  message: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  nodeErrors: ValidationError[];
}

export function validateGraph(nodes: any[], edges: any[]): ValidationResult {
  const errors: string[] = [];
  const nodeErrors: ValidationError[] = [];

  // ── 1. Start node checks ──────────────────────────────────
  const startNodes = nodes.filter((n) => n.type === "start");
  if (startNodes.length === 0) {
    errors.push("Missing a Start node.");
  } else if (startNodes.length > 1) {
    errors.push("Only one Start node is allowed.");
    startNodes.slice(1).forEach((n) =>
      nodeErrors.push({ nodeId: n.id, message: "Duplicate Start node" })
    );
  }

  // Constraint: Start Node cannot have incoming edges
  const targetIds = new Set(edges.map(e => e.target));
  startNodes.forEach(n => {
    if (targetIds.has(n.id)) {
      errors.push("Start node cannot have incoming connections.");
      nodeErrors.push({ nodeId: n.id, message: "Entry point must be first" });
    }
  });

  // ── 2. End node checks ────────────────────────────────────
  const endNodes = nodes.filter((n) => n.type === "end");
  if (endNodes.length === 0) {
    errors.push("Missing an End node.");
  }

  // ── 3. Minimum size ───────────────────────────────────────
  if (nodes.length < 2) {
    errors.push("Workflow needs at least 2 nodes.");
    return { valid: false, errors, nodeErrors };
  }

  // ── 4. Connectivity check ─────────────────────────────────
  const sourceSet = new Set(edges.map((e: any) => e.source));
  const targetSet = new Set(edges.map((e: any) => e.target));
  const connectedIds = new Set([...sourceSet, ...targetSet]);

  nodes.forEach((n) => {
    if (n.type !== "start" && n.type !== "end" && !connectedIds.has(n.id)) {
      errors.push(`Node "${n.data?.title || n.id}" is not connected.`);
      nodeErrors.push({ nodeId: n.id, message: "Node is not connected to the workflow" });
    }
  });

  // ── 5. Start must have outgoing edge ──────────────────────
  if (startNodes.length === 1 && !sourceSet.has(startNodes[0].id)) {
    errors.push("Start node has no outgoing connections.");
    nodeErrors.push({ nodeId: startNodes[0].id, message: "No outgoing connection" });
  }

  // ── 6. End must have incoming edge ────────────────────────
  endNodes.forEach((n) => {
    if (!targetSet.has(n.id)) {
      errors.push(`End node "${n.data?.endMessage || n.id}" has no incoming connections.`);
      nodeErrors.push({ nodeId: n.id, message: "No incoming connection" });
    }
  });

  // ── 7. Cycle detection (DFS) ──────────────────────────────
  const adjMap = new Map<string, string[]>();
  edges.forEach((e: any) => {
    if (!adjMap.has(e.source)) adjMap.set(e.source, []);
    adjMap.get(e.source)!.push(e.target);
  });

  const visited = new Set<string>();
  const stack = new Set<string>();

  function hasCycle(id: string): boolean {
    if (stack.has(id)) return true;
    if (visited.has(id)) return false;
    visited.add(id);
    stack.add(id);
    for (const next of adjMap.get(id) || []) {
      if (hasCycle(next)) return true;
    }
    stack.delete(id);
    return false;
  }

  let cycleDetected = false;
  for (const n of nodes) {
    if (hasCycle(n.id)) {
      cycleDetected = true;
      break;
    }
  }

  if (cycleDetected) {
    errors.push("Cycle detected in the workflow graph.");
  }

  return {
    valid: errors.length === 0,
    errors: [...new Set(errors)],
    nodeErrors,
  };
}

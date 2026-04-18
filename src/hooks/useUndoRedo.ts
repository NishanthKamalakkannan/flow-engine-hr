import { useCallback, useEffect, useRef } from "react";
import { useWorkflowStore } from "../store/workflowStore";

/**
 * Custom hook for undo/redo with keyboard shortcut support.
 * Maintains a history stack of (nodes, edges) snapshots.
 * Supports Ctrl+Z (undo) and Ctrl+Y / Ctrl+Shift+Z (redo).
 */

interface Snapshot {
  nodes: any[];
  edges: any[];
}

const MAX_HISTORY = 50;

export function useUndoRedo() {
  const past = useRef<Snapshot[]>([]);
  const future = useRef<Snapshot[]>([]);
  const skipRecord = useRef(false);

  const nodes = useWorkflowStore((s: any) => s.nodes);
  const edges = useWorkflowStore((s: any) => s.edges);
  const setNodes = useWorkflowStore((s: any) => s.setNodes);
  const setEdges = useWorkflowStore((s: any) => s.setEdges);

  /** Record a snapshot into the undo history */
  const record = useCallback(() => {
    if (skipRecord.current) {
      skipRecord.current = false;
      return;
    }
    past.current = [
      ...past.current.slice(-MAX_HISTORY),
      { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) },
    ];
    future.current = [];
  }, [nodes, edges]);

  /** Undo — restore the previous snapshot */
  const undo = useCallback(() => {
    if (past.current.length === 0) return;
    const prev = past.current.pop()!;
    future.current.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    });
    skipRecord.current = true;
    setNodes(prev.nodes);
    setEdges(prev.edges);
  }, [nodes, edges, setNodes, setEdges]);

  /** Redo — restore a future snapshot */
  const redo = useCallback(() => {
    if (future.current.length === 0) return;
    const next = future.current.pop()!;
    past.current.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    });
    skipRecord.current = true;
    setNodes(next.nodes);
    setEdges(next.edges);
  }, [nodes, edges, setNodes, setEdges]);

  /** Keyboard shortcuts: Ctrl+Z = undo, Ctrl+Y or Ctrl+Shift+Z = redo */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  return {
    undo,
    redo,
    record,
    canUndo: past.current.length > 0,
    canRedo: future.current.length > 0,
  };
}

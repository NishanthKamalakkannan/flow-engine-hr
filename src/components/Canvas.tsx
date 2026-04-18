import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useRef } from "react";
import { useWorkflowStore } from "../store/workflowStore";
import { nodeTypes } from "./nodes";
import AnimatedEdge from "./edges/AnimatedEdge";

const edgeTypes = { animated: AnimatedEdge };

const DEFAULT_DATA: Record<string, any> = {
  start: { type: "start", title: "Start", metadata: [] },
  task: { type: "task", title: "New Task", description: "", assignee: "", dueDate: "", customFields: [] },
  approval: { type: "approval", title: "Approval", approverRole: "Manager", autoApproveThreshold: 0 },
  automated: { type: "automated", title: "Automated Step", actionId: "", actionParams: {} },
  end: { type: "end", endMessage: "Workflow Complete", summaryFlag: false },
};

function makeId() {
  return "node-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
}

function Flow() {
  const { nodes, edges, setNodes, setEdges, setSelectedNodeId, addNode } = useWorkflowStore();
  const { screenToFlowPosition } = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onConnect = useCallback(
    (connection: any) => {
      setEdges(addEdge(connection, edges));
    },
    [edges]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("nodeType");
      if (!type) return;

      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });

      addNode({
        id: makeId(),
        type: type as any,
        position,
        data: { ...DEFAULT_DATA[type] },
      });
    },
    [screenToFlowPosition]
  );

  return (
    <div ref={reactFlowWrapper} className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: "animated" }}
        onNodesChange={(changes: any) => {
          let updated = [...nodes];
          changes.forEach((change: any) => {
            if (change.type === "position" && change.position) {
              const idx = updated.findIndex((n: any) => n.id === change.id);
              if (idx !== -1) updated[idx] = { ...updated[idx], position: change.position };
            }
            if (change.type === "remove") updated = updated.filter((n: any) => n.id !== change.id);
          });
          setNodes(updated);
        }}
        onEdgesChange={(changes: any) => {
          let updated = [...edges];
          changes.forEach((change: any) => {
            if (change.type === "remove") updated = updated.filter((e: any) => e.id !== change.id);
          });
          setEdges(updated);
        }}
        onConnect={onConnect}
        onNodeClick={(_: any, node: any) => setSelectedNodeId(node.id)}
        onPaneClick={() => setSelectedNodeId(null)}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
        deleteKeyCode="Delete"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#0F3460" />
        <Controls />
        <MiniMap nodeColor="#F97316" maskColor="rgba(26,26,46,0.8)" />
      </ReactFlow>
    </div>
  );
}

export default function Canvas() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}

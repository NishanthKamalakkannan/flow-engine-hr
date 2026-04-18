export type NodeType = "start" | "task" | "approval" | "automated" | "end";

export interface StartNodeData {
  type: "start";
  title: string;
  metadata: { key: string; value: string }[];
}

export interface TaskNodeData {
  type: "task";
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: { key: string; value: string }[];
}

export interface ApprovalNodeData {
  type: "approval";
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
}

export interface AutomatedNodeData {
  type: "automated";
  title: string;
  actionId: string;
  actionParams: Record<string, string>;
}

export interface EndNodeData {
  type: "end";
  endMessage: string;
  summaryFlag: boolean;
}

export type WorkflowNodeData = StartNodeData | TaskNodeData | ApprovalNodeData | AutomatedNodeData | EndNodeData;

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: WorkflowNodeData;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export type SimulationStepStatus = "success" | "warning" | "error";

export interface SimulationStep {
  nodeId: string;
  nodeType: NodeType;
  label: string;
  status: SimulationStepStatus;
  message: string;
  timestamp: string;
}

export interface SimulationResult {
  success: boolean;
  steps: SimulationStep[];
  errors: string[];
}

export interface ValidationError {
  nodeId: string;
  message: string;
}

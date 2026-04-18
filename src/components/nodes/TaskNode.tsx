import { ClipboardList } from "lucide-react";
import { useWorkflowStore } from "../../store/workflowStore";
import BaseNode from "./BaseNode";

export default function TaskNode({ id, selected, data }: any) {
  const validationErrors = useWorkflowStore((s: any) => s.validationErrors);
  return (
    <BaseNode nodeId={id} label={data.title || "Task"} subtitle={data.assignee ? data.assignee : "Unassigned"} icon={<ClipboardList size={14} />} color="bg-blue-600" selected={!!selected} validationErrors={validationErrors} />
  );
}

import { ShieldCheck } from "lucide-react";
import { useWorkflowStore } from "../../store/workflowStore";
import BaseNode from "./BaseNode";

export default function ApprovalNode({ id, selected, data }: any) {
  const validationErrors = useWorkflowStore((s: any) => s.validationErrors);
  return (
    <BaseNode nodeId={id} label={data.title || "Approval"} subtitle={data.approverRole || "No role set"} icon={<ShieldCheck size={14} />} color="bg-yellow-600" selected={!!selected} validationErrors={validationErrors} />
  );
}

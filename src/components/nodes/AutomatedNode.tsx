import { Zap } from "lucide-react";
import { useWorkflowStore } from "../../store/workflowStore";
import BaseNode from "./BaseNode";

export default function AutomatedNode({ id, selected, data }: any) {
  const validationErrors = useWorkflowStore((s: any) => s.validationErrors);
  return (
    <BaseNode nodeId={id} label={data.title || "Automated Step"} subtitle={data.actionId || "No action"} icon={<Zap size={14} />} color="bg-purple-600" selected={!!selected} validationErrors={validationErrors} />
  );
}

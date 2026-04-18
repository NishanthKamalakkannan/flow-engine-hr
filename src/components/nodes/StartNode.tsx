import { Play } from "lucide-react";
import { useWorkflowStore } from "../../store/workflowStore";
import BaseNode from "./BaseNode";

export default function StartNode({ id, selected, data }: any) {
  const validationErrors = useWorkflowStore((s: any) => s.validationErrors);
  return (
    <BaseNode nodeId={id} label={data.title || "Start"} subtitle="Entry Point" icon={<Play size={14} />} color="bg-green-600" selected={!!selected} hasTarget={false} validationErrors={validationErrors} />
  );
}

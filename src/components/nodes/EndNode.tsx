import { Flag } from "lucide-react";
import { useWorkflowStore } from "../../store/workflowStore";
import BaseNode from "./BaseNode";

export default function EndNode({ id, selected, data }: any) {
  const validationErrors = useWorkflowStore((s: any) => s.validationErrors);
  return (
    <BaseNode nodeId={id} label={data.endMessage || "End"} subtitle="Workflow Complete" icon={<Flag size={14} />} color="bg-red-600" selected={!!selected} hasSource={false} validationErrors={validationErrors} />
  );
}

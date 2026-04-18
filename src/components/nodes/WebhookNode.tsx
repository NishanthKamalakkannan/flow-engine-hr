import BaseNode from "./BaseNode";
import { Globe } from "lucide-react";
import { useWorkflowStore } from "../../store/workflowStore";

export default function WebhookNode({ id, selected, data }: any) {
  const validationErrors = useWorkflowStore((s: any) => s.validationErrors);
  return (
    <BaseNode
      nodeId={id}
      label={data.title || "Live API Webhook"}
      subtitle={data.url ? `${data.method || "POST"} ${new URL(data.url).hostname}` : "Configure API URL"}
      icon={<Globe size={14} />}
      color="bg-orange-600"
      selected={!!selected}
      validationErrors={validationErrors}
    />
  );
}

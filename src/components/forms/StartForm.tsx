import { useWorkflowStore } from "../../store/workflowStore";
import Field from "./Field";
import Input from "./Input";
import KeyValueEditor from "./KeyValueEditor";

export default function StartForm({ node }: { node: any }) {
  const { updateNodeData } = useWorkflowStore();
  const d = node.data;

  return (
    <div>
      <Field label="Title" required>
        <Input value={d.title} onChange={e => updateNodeData(node.id, { title: e.target.value })} placeholder="Start title" />
      </Field>
      <Field label="Metadata">
        <KeyValueEditor pairs={d.metadata || []} onChange={pairs => updateNodeData(node.id, { metadata: pairs })} />
      </Field>
    </div>
  );
}

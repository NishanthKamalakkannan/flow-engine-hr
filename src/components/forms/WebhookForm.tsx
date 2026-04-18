import { useWorkflowStore } from "../../store/workflowStore";
import Field from "./Field";
import Input from "./Input";
import Textarea from "./Textarea";

export default function WebhookForm({ node }: { node: any }) {
  const { updateNodeData } = useWorkflowStore();
  const d = node.data;

  return (
    <div>
      <Field label="Node Title">
        <Input 
          value={d.title} 
          onChange={(e) => updateNodeData(node.id, { title: e.target.value })} 
          placeholder="e.g. Notify External CRM" 
        />
      </Field>

      <Field label="Webhook URL" required>
        <Input 
          value={d.url} 
          onChange={(e) => updateNodeData(node.id, { url: e.target.value })} 
          placeholder="https://httpbin.org/post" 
        />
        <p className="text-[10px] text-gray-500 mt-1">
          ? Note: URL must support CORS (e.g. Test with httpbin.org)
        </p>
      </Field>

      <Field label="HTTP Method">
        <select
          value={d.method || "POST"}
          onChange={(e) => updateNodeData(node.id, { method: e.target.value })}
          className="w-full bg-[#1A1A2E] border border-[#0F3460] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 transition-all font-semibold"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>
      </Field>

      {(d.method === "POST" || d.method === "PUT" || d.method === "PATCH") && (
        <Field label="JSON Payload (Optional)">
          <Textarea
            value={d.payload}
            onChange={(e) => updateNodeData(node.id, { payload: e.target.value })}
            placeholder='{ "key": "value" }'
            rows={4}
          />
        </Field>
      )}
    </div>
  );
}

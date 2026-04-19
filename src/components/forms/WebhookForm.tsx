import { useWorkflowStore } from "../../store/workflowStore";
import Field from "./Field";
import Input from "./Input";
import Textarea from "./Textarea";

export default function WebhookForm({ node }: { node: any }) {
  const { updateNodeData } = useWorkflowStore();
  const d = node.data;

  return (
    <div className="flex flex-col gap-4">
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
        <p className="text-[10px] text-pink-600/40 mt-1 font-bold uppercase tracking-tight">
          CORS support required (e.g. httpbin.org)
        </p>
      </Field>

      <Field label="HTTP Method">
        <select
          value={d.method || "POST"}
          onChange={(e) => updateNodeData(node.id, { method: e.target.value })}
          className="w-full bg-white border border-pink-100 rounded-xl px-4 py-2.5 text-[#4A0E1C] text-sm font-medium focus:outline-none focus:border-[#FF4D6D] focus:ring-4 focus:ring-pink-500/5 transition-all shadow-sm"
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
            className="min-h-[120px]"
          />
        </Field>
      )}
    </div>
  );
}

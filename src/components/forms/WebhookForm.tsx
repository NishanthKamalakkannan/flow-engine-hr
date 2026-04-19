import { useWorkflowStore } from "../../store/workflowStore";
import Field from "./Field";
import Input from "./Input";
import Textarea from "./Textarea";

export default function WebhookForm({ node }: { node: any }) {
  const { updateNodeData } = useWorkflowStore();
  const d = node.data;

  return (
    <div className="flex flex-col gap-5">
      <Field label="Protocol Alias">
        <Input 
          value={d.title} 
          onChange={(e) => updateNodeData(node.id, { title: e.target.value })} 
          placeholder="e.g. Notify External HUD" 
        />
      </Field>

      <Field label="Destination Endpoint" required>
        <Input 
          value={d.url} 
          onChange={(e) => updateNodeData(node.id, { url: e.target.value })} 
          placeholder="https://comm-relay.nasa.gov/post" 
        />
        <p className="text-[10px] text-[#6B7280] mt-2 font-black uppercase tracking-tight italic">
          Direct CORS link required for live sync
        </p>
      </Field>

      <Field label="Transmission Protocol">
        <select
          value={d.method || "POST"}
          onChange={(e) => updateNodeData(node.id, { method: e.target.value })}
          className="w-full bg-[#080C14] border border-[#1F2937] rounded-xl px-4 py-3 text-[#F9FAFB] text-sm font-semibold focus:outline-none focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/5 transition-all shadow-inner"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>
      </Field>

      {(d.method === "POST" || d.method === "PUT" || d.method === "PATCH") && (
        <Field label="Telemetry Payload (JSON)">
          <Textarea
            value={d.payload}
            onChange={(e) => updateNodeData(node.id, { payload: e.target.value })}
            placeholder='{ "status": "nominal" }'
            className="min-h-[140px]"
          />
        </Field>
      )}
    </div>
  );
}

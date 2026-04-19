import { useWorkflowStore } from "../../store/workflowStore";
import { useAutomations } from "../../hooks/useAutomations";
import Field from "./Field";
import Input from "./Input";

export default function AutomatedForm({ node }: { node: any }) {
  const { updateNodeData } = useWorkflowStore();
  const { automations, loading } = useAutomations();
  const d = node.data;

  const selectedAction = automations.find((a) => a.id === d.actionId);

  return (
    <div className="flex flex-col gap-4">
      <Field label="Title" required>
        <Input value={d.title} onChange={(e) => updateNodeData(node.id, { title: e.target.value })} placeholder="Step title" />
      </Field>
      <Field label="Action">
        {loading ? (
          <p className="text-pink-300 text-[10px] py-2 animate-pulse font-bold uppercase tracking-widest">Fetching Registry...</p>
        ) : (
          <select
            value={d.actionId}
            onChange={(e) => updateNodeData(node.id, { actionId: e.target.value, actionParams: {} })}
            className="w-full bg-white border border-pink-100 rounded-xl px-4 py-2.5 text-[#4A0E1C] text-sm font-medium focus:outline-none focus:border-[#FF4D6D] focus:ring-4 focus:ring-pink-500/5 transition-all shadow-sm"
          >
            <option value="">Select an action...</option>
            {automations.map((a) => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>
        )}
      </Field>
      {selectedAction && (
        <Field label="Action Parameters">
          <div className="flex flex-col gap-3">
            {selectedAction.params.map((param: string) => (
              <div key={param} className="space-y-1">
                <p className="text-[10px] text-pink-600/40 font-bold uppercase tracking-widest px-1">{param}</p>
                <Input
                  placeholder={param}
                  value={d.actionParams?.[param] || ""}
                  onChange={(e) =>
                    updateNodeData(node.id, { actionParams: { ...d.actionParams, [param]: e.target.value } })
                  }
                />
              </div>
            ))}
          </div>
        </Field>
      )}
    </div>
  );
}

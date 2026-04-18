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
          <p className="text-gray-500 text-xs py-2">Loading actions...</p>
        ) : (
          <select
            value={d.actionId}
            onChange={(e) => updateNodeData(node.id, { actionId: e.target.value, actionParams: {} })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
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
          <div className="flex flex-col gap-2">
            {selectedAction.params.map((param: string) => (
              <div key={param}>
                <p className="text-xs text-gray-500 mb-1">{param}</p>
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

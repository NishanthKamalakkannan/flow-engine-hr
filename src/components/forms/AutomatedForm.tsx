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
    <div className="flex flex-col gap-5">
      <Field label="Protocol Title" required>
        <Input value={d.title} onChange={(e) => updateNodeData(node.id, { title: e.target.value })} placeholder="Mission step title" />
      </Field>
      <Field label="System Action">
        {loading ? (
          <p className="text-[#A855F7] text-[10px] py-1 animate-pulse font-black uppercase tracking-widest">Scanning Registry...</p>
        ) : (
          <select
            value={d.actionId}
            onChange={(e) => updateNodeData(node.id, { actionId: e.target.value, actionParams: {} })}
            className="w-full bg-[#080C14] border border-[#1F2937] rounded-xl px-4 py-3 text-[#F9FAFB] text-sm font-semibold focus:outline-none focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/5 transition-all shadow-inner"
          >
            <option value="">Select Protocol...</option>
            {automations.map((a) => (
              <option key={a.id} value={a.id} className="bg-[#0D1420]">{a.label}</option>
            ))}
          </select>
        )}
      </Field>
      {selectedAction && (
        <Field label="Action Parameters">
          <div className="flex flex-col gap-4">
            {selectedAction.params.map((param: string) => (
              <div key={param} className="space-y-1.5">
                <p className="text-[10px] text-[#6B7280] font-black uppercase tracking-widest px-1">{param}</p>
                <Input
                  placeholder={`Input ${param}`}
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

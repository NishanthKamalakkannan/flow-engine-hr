import { useWorkflowStore } from "../../store/workflowStore";
import Field from "./Field";
import Input from "./Input";

const ROLES = ["Manager", "HRBP", "Director", "VP", "CEO"];

export default function ApprovalForm({ node }: { node: any }) {
  const { updateNodeData } = useWorkflowStore();
  const d = node.data;

  return (
    <div className="flex flex-col gap-4">
      <Field label="Title" required>
        <Input value={d.title} onChange={e => updateNodeData(node.id, { title: e.target.value })} placeholder="Approval title" />
      </Field>
      <Field label="Approver Role">
        <select
          value={d.approverRole}
          onChange={e => updateNodeData(node.id, { approverRole: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
        >
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </Field>
      <Field label="Auto-Approve Threshold (days)">
        <Input
          type="number"
          value={d.autoApproveThreshold}
          onChange={e => updateNodeData(node.id, { autoApproveThreshold: Number(e.target.value) })}
          placeholder="0 = no auto-approve"
          min={0}
        />
      </Field>
    </div>
  );
}

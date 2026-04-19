import { useWorkflowStore } from "../../store/workflowStore";
import Field from "./Field";
import Input from "./Input";

const ROLES = ["Manager", "HRBP", "Director", "VP", "CEO"];

export default function ApprovalForm({ node }: { node: any }) {
  const { updateNodeData } = useWorkflowStore();
  const d = node.data;

  return (
    <div className="flex flex-col gap-5">
      <Field label="Protocol Title" required>
        <Input value={d.title} onChange={e => updateNodeData(node.id, { title: e.target.value })} placeholder="Approval step name" />
      </Field>
      <Field label="Authorized Personnel">
        <select
          value={d.approverRole}
          onChange={e => updateNodeData(node.id, { approverRole: e.target.value })}
          className="w-full bg-[#080C14] border border-[#1F2937] rounded-xl px-4 py-3 text-[#F9FAFB] text-sm font-semibold focus:outline-none focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/5 transition-all shadow-inner"
        >
          {ROLES.map(r => <option key={r} value={r} className="bg-[#0D1420]">{r}</option>)}
        </select>
      </Field>
      <Field label="Auto-Override Threshold (SID)">
        <Input
          type="number"
          value={d.autoApproveThreshold}
          onChange={e => updateNodeData(node.id, { autoApproveThreshold: Number(e.target.value) })}
          placeholder="0 = manual override"
          min={0}
        />
      </Field>
    </div>
  );
}

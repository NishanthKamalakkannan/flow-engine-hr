import { useWorkflowStore } from "../../store/workflowStore";
import Field from "./Field";
import Input from "./Input";

export default function EndForm({ node }: { node: any }) {
  const { updateNodeData } = useWorkflowStore();
  const d = node.data;

  return (
    <div className="flex flex-col gap-4">
      <Field label="End Message">
        <Input value={d.endMessage} onChange={e => updateNodeData(node.id, { endMessage: e.target.value })} placeholder="Workflow complete!" />
      </Field>
      <Field label="Show Summary">
        <label className="relative inline-flex items-center cursor-pointer group">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={d.summaryFlag}
            onChange={() => updateNodeData(node.id, { summaryFlag: !d.summaryFlag })}
          />
          <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:shadow-lg peer-checked:after:shadow-indigo-500/50 peer-checked:after:bg-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-slate-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 border border-slate-700"></div>
          <span className="ms-3 text-xs font-bold text-slate-500 uppercase tracking-widest peer-checked:text-indigo-400 transition-colors">Enabled</span>
        </label>
      </Field>
    </div>
  );
}

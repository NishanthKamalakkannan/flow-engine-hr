import { useWorkflowStore } from "../../store/workflowStore";
import StartForm from "./StartForm";
import TaskForm from "./TaskForm";
import ApprovalForm from "./ApprovalForm";
import AutomatedForm from "./AutomatedForm";
import WebhookForm from "./WebhookForm";
import EndForm from "./EndForm";
import { X, Trash2 } from "lucide-react";

export default function NodeEditPanel() {
  const { nodes, selectedNodeId, setSelectedNodeId, removeNode } = useWorkflowStore();
  const node = nodes.find((n: any) => n.id === selectedNodeId);

  if (!node) return null;

  const colorMap: Record<string, string> = {
    start: "border-emerald-500 bg-emerald-500/10 text-emerald-400",
    task: "border-blue-500 bg-blue-500/10 text-blue-400",
    approval: "border-amber-500 bg-amber-500/10 text-amber-400",
    automated: "border-violet-500 bg-violet-500/10 text-violet-400",
    webhook: "border-indigo-500 bg-indigo-500/10 text-indigo-400",
    end: "border-rose-500 bg-rose-500/10 text-rose-400",
  };

  const labelMap: Record<string, string> = {
    start: "Start Node",
    task: "Task Node",
    approval: "Approval Node",
    automated: "Automated Node",
    webhook: "Live Webhook Node",
    end: "End Node",
  };

  return (
    <div className="w-80 h-full bg-[#0F172A] border-l border-[#1E293B] flex flex-col overflow-hidden shadow-2xl z-10 transition-all duration-500 animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#0F172A]">
        <div className="flex flex-col">
          <span className="text-slate-100 font-bold text-sm tracking-tight">{labelMap[node.type]}</span>
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Configuration</span>
        </div>
        <button onClick={() => setSelectedNodeId(null)} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded-lg">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 border-b border-slate-800 bg-slate-900/40">
        <div className={`px-3 py-2 rounded-xl border flex items-center gap-2.5 ${colorMap[node.type]}`}>
          <div className="w-1.5 h-1.5 rounded-full bg-current shadow-sm" />
          <span className="text-[10px] uppercase font-black tracking-[0.2em]">Active Selection</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        {node.type === "start" && <StartForm node={node} />}
        {node.type === "task" && <TaskForm node={node} />}
        {node.type === "approval" && <ApprovalForm node={node} />}
        {node.type === "automated" && <AutomatedForm node={node} />}
        {node.type === "webhook" && <WebhookForm node={node} />}
        {node.type === "end" && <EndForm node={node} />}
      </div>

      <div className="px-5 py-4 border-t border-slate-800 flex flex-col gap-3">
        <button
          onClick={() => { removeNode(node.id); }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 font-bold text-xs transition-all border border-rose-500/20 active:scale-95"
        >
          <Trash2 size={14} /> Remove Node
        </button>
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] text-slate-500 font-mono">UID: {node.id}</span>
          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">Verified Schema</span>
        </div>
      </div>
    </div>
  );
}

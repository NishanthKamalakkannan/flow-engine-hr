import { useWorkflowStore } from "../../store/workflowStore";
import { X, Settings, CheckCircle2, Info } from "lucide-react";
import StartForm from "./StartForm";
import TaskForm from "./TaskForm";
import ApprovalForm from "./ApprovalForm";
import AutomatedForm from "./AutomatedForm";
import WebhookForm from "./WebhookForm";
import EndForm from "./EndForm";

export default function NodeEditPanel() {
  const { nodes, selectedNodeId, setSelectedNodeId } = useWorkflowStore();
  const node = nodes.find((n: any) => n.id === selectedNodeId);

  if (!node) return null;

  const forms: Record<string, any> = {
    start: StartForm,
    task: TaskForm,
    approval: ApprovalForm,
    automated: AutomatedForm,
    webhook: WebhookForm,
    end: EndForm,
  };

  const Form = forms[node.type];

  return (
    <div className="w-80 h-full bg-white border-l border-pink-100 flex flex-col shadow-[-10px_0_30px_-15px_rgba(255,71,109,0.1)] z-10 animate-in slide-in-from-right duration-500">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-pink-50 bg-pink-50/20">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-pink-50 rounded-lg">
             <Settings size={16} className="text-[#FF4D6D]" />
          </div>
          <div>
            <h2 className="text-[#4A0E1C] font-bold text-sm tracking-tight leading-none">Configuration</h2>
            <div className="flex items-center gap-1.5 mt-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm" />
               <p className="text-emerald-600/60 text-[9px] font-bold uppercase tracking-widest">Active Node</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setSelectedNodeId(null)} 
          className="text-pink-300 hover:text-[#FF4D6D] transition-colors p-1.5 hover:bg-white rounded-lg border border-transparent hover:border-pink-100"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar bg-white">
        {/* Node Metadata Tag */}
        <div className="flex items-center gap-2 mb-6 p-3 bg-pink-50/50 rounded-xl border border-pink-100 shadow-inner">
           <div className="p-1.5 bg-white rounded-lg shadow-sm">
              <Info size={14} className="text-[#FF4D6D]" />
           </div>
           <div>
              <p className="text-pink-600/40 text-[9px] font-bold uppercase tracking-widest">Internal ID</p>
              <p className="text-[#4A0E1C] text-[10px] font-mono font-bold">{node.id}</p>
           </div>
        </div>

        {Form ? <Form node={node} /> : <p className="text-pink-300 text-xs italic">Unknown node type</p>}
      </div>

      {/* Footer Status */}
      <div className="px-6 py-4 bg-pink-50/30 border-t border-pink-50 mt-auto">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 size={14} className="text-emerald-500" />
          <p className="text-[10px] text-pink-600/60 font-bold uppercase tracking-widest">State Synchronized</p>
        </div>
      </div>
    </div>
  );
}

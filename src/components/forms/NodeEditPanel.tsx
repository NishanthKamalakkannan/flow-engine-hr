import { useWorkflowStore } from "../../store/workflowStore";
import { X, Settings, CheckCircle2, Cpu } from "lucide-react";
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
    <div className="w-80 h-full bg-[#0D1420] border-l border-[#1F2937] flex flex-col shadow-[-10px_0_40px_rgba(0,0,0,0.8)] z-20 animate-in slide-in-from-right duration-500">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#1F2937] bg-[#0D1420]/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#080C14] rounded-xl border border-[#1F2937]">
             <Settings size={18} className="text-[#A855F7]" />
          </div>
          <div>
            <h2 className="text-[#F9FAFB] font-black text-sm tracking-tight leading-none">Telemetry Config</h2>
            <div className="flex items-center gap-2 mt-2">
               <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
               <p className="text-[#10B981] text-[9px] font-black uppercase tracking-widest">Linked Node</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setSelectedNodeId(null)} 
          className="text-[#6B7280] hover:text-[#F9FAFB] transition-colors p-2 hover:bg-[#1F2937] rounded-xl border border-transparent hover:border-[#1F2937]"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar bg-[#0D1420]">
        {/* Node Metadata Tag */}
        <div className="flex items-center gap-3 mb-8 p-4 bg-[#080C14]/50 rounded-2xl border border-[#1F2937] shadow-inner">
           <div className="p-2 bg-[#111827] rounded-xl shadow-lg border border-[#1F2937]">
              <Cpu size={16} className="text-[#A855F7]" />
           </div>
           <div>
              <p className="text-[#6B7280] text-[9px] font-black uppercase tracking-widest leading-none mb-2">Internal UUID</p>
              <p className="text-[#F9FAFB] text-[11px] font-mono font-black tracking-tighter">{node.id}</p>
           </div>
        </div>

        {Form ? <Form node={node} /> : <p className="text-[#6B7280] text-xs italic">Protocol unknown</p>}
      </div>

      {/* Footer Status */}
      <div className="px-6 py-4 bg-[#080C14]/30 border-t border-[#1F2937] mt-auto">
        <div className="flex items-center gap-3">
          <CheckCircle2 size={16} className="text-[#10B981]" />
          <p className="text-[10px] text-[#6B7280] font-black uppercase tracking-widest">Configuration Active</p>
        </div>
      </div>
    </div>
  );
}

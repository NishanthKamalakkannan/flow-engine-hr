import { useState } from "react";
import { useWorkflowStore } from "../../store/workflowStore";
import { simulateWorkflow } from "../../api/workflowApi";
import { validateGraph } from "../../utils/graphValidator";
import { X, Play, CheckCircle, AlertCircle, Clock, ChevronDown, ChevronUp, Activity, Trophy } from "lucide-react";
import { clsx } from "clsx";


export default function SandboxPanel({ onClose }: { onClose: () => void }) {
  const { nodes, edges, setValidationErrors, setActiveSimulationNodeId } = useWorkflowStore();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [validationMessages, setValidationMessages] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [expandedDetails, setExpandedDetails] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);

  const handleSimulate = async () => {
    const validation = validateGraph(nodes, edges);
    setValidationMessages(validation.errors);
    setValidationErrors(validation.nodeErrors);

    if (!validation.valid) return;

    setLoading(true);
    setResult(null);
    setActiveStep(-1);
    setIsFinished(false);
    setExpandedDetails({});
    setActiveSimulationNodeId(null);
    
    const res = await simulateWorkflow({ nodes, edges });
    setResult(res);
    setLoading(false);

    for (let i = 0; i < res.steps.length; i++) {
      setActiveSimulationNodeId(res.steps[i].nodeId);
      await new Promise((r) => setTimeout(r, 600));
      setActiveStep(i);
    }
    
    // PERSISTENCE: Keep the last node (End Node) highlighted to show success
    setIsFinished(true);
  };

  const handleClose = () => {
    setValidationErrors([]);
    setActiveSimulationNodeId(null);
    onClose();
  };

  const toggleDetails = (i: number) => {
    setExpandedDetails(prev => ({ ...prev, [i]: !prev[i] }));
  };

  const statusIcon = (status: string) => {
    if (status === "success") return <CheckCircle size={14} className="text-emerald-400" />;
    if (status === "error") return <AlertCircle size={14} className="text-rose-400" />;
    return <Clock size={14} className="text-amber-400" />;
  };

  const nodeTypeColor: Record<string, string> = {
    start: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    task: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    approval: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    automated: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    webhook: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    end: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <div className="fixed top-14 bottom-0 right-0 w-[420px] bg-[#0F172A] border-l border-slate-800 z-50 flex flex-col shadow-[-20px_0_50px_-15px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
             <Activity size={18} className="text-indigo-400" />
          </div>
          <div>
            <h2 className="text-slate-100 font-bold text-lg tracking-tight">Trace Engine</h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Live Execution Log</p>
          </div>
        </div>
        <button onClick={handleClose} className="text-slate-400 hover:text-white transition-colors p-1.5 hover:bg-slate-800 rounded-lg">
          <X size={20} />
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-slate-800 bg-slate-900/10">
        <div className="flex flex-col">
          <p className="text-indigo-400 font-black text-lg leading-none">{nodes.length}</p>
          <p className="text-slate-600 text-[8px] font-black uppercase tracking-widest mt-1">Nodes</p>
        </div>
        <div className="flex flex-col">
          <p className="text-indigo-400 font-black text-lg leading-none">{edges.length}</p>
          <p className="text-slate-600 text-[8px] font-black uppercase tracking-widest mt-1">Edges</p>
        </div>
        <div className="flex flex-col">
          <p className="text-emerald-400 font-black text-lg leading-none">
            {nodes.filter((n: any) => n.type === "start").length}
          </p>
          <p className="text-slate-600 text-[8px] font-black uppercase tracking-widest mt-1">Entry</p>
        </div>
        <div className="flex flex-col">
          <p className="text-rose-400 font-black text-lg leading-none">
            {nodes.filter((n: any) => n.type === "end").length}
          </p>
          <p className="text-slate-600 text-[8px] font-black uppercase tracking-widest mt-1">Exit</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5 custom-scrollbar bg-[#0F172A]">
        {/* Validation errors */}
        {validationMessages.length > 0 && (
          <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
               <AlertCircle size={16} className="text-rose-400" />
               <p className="text-rose-400 font-bold text-xs uppercase tracking-widest">Logic Errors</p>
            </div>
            <div className="space-y-1.5">
              {validationMessages.map((e, i) => (
                <p key={i} className="text-rose-300 text-[11px] font-medium flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-rose-500 flex-shrink-0" />
                  {e}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Loading spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-2 border-indigo-500/20 rounded-full" />
              <div className="w-12 h-12 border-t-2 border-indigo-500 rounded-full animate-spin absolute top-0 left-0" />
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] animate-pulse">Tracing Prototypal Logic...</p>
          </div>
        )}

        {/* Global Success Summary */}
        {isFinished && result?.success && (
          <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl p-5 mb-2 animate-in zoom-in-95 duration-500 flex flex-col items-center text-center gap-3">
             <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                <Trophy size={24} />
             </div>
             <div>
                <p className="text-emerald-400 font-black text-sm uppercase tracking-[0.2em]">Execution Perfect</p>
                <p className="text-slate-400 text-[11px] font-bold mt-1 max-w-[200px]">The workflow was traversed from Start to End with zero logic failures.</p>
             </div>
          </div>
        )}

        {/* Simulation steps */}
        {result && !loading && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.25em] mb-4 pl-1">Execution Sequence</p>

            <div className="flex flex-col gap-3">
              {result.steps.map((step: any, i: number) => (
                <div key={i} className="flex flex-col">
                  <div
                    className={clsx(
                      "flex items-start gap-4 p-4 rounded-xl border transition-all duration-700",
                      i <= activeStep
                        ? "bg-slate-900/40 border-slate-800 opacity-100 shadow-sm"
                        : "opacity-10 border-transparent scale-95",
                      i === activeStep && i === result.steps.length - 1 && "ring-2 ring-emerald-500/50 bg-emerald-500/5"
                    )}
                  >
                    <div className="mt-1 flex-shrink-0">{statusIcon(step.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-slate-100 text-sm font-bold truncate tracking-tight">{step.label}</p>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-lg border uppercase font-black tracking-tighter ${nodeTypeColor[step.nodeType] || ""}`}
                        >
                          {step.nodeType}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs font-medium leading-relaxed">{step.message}</p>
                      
                      {step.details && i <= activeStep && (
                        <button 
                          onClick={() => toggleDetails(i)}
                          className="mt-3 flex items-center gap-1.5 text-indigo-400 text-[10px] font-black hover:text-indigo-300 transition-colors uppercase tracking-[0.15em]"
                        >
                          {expandedDetails[i] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          {expandedDetails[i] ? "Hide JSON" : "View Integration"}
                        </button>
                      )}

                      {expandedDetails[i] && step.details && (
                        <div className="mt-3 p-3 bg-black/40 rounded-xl border border-slate-800 font-mono text-[9px] overflow-x-auto max-w-full shadow-inner animate-in slide-in-from-top-2 duration-300">
                          <pre className="text-slate-300 leading-normal">{JSON.stringify(step.details, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result && !loading && validationMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/5 flex items-center justify-center border border-indigo-500/10 shadow-inner">
              <Play size={24} className="text-indigo-400 ml-1 fill-current" />
            </div>
            <div className="space-y-1">
              <p className="text-slate-100 font-bold uppercase tracking-widest text-sm">Engine Ready</p>
              <p className="text-slate-500 text-[11px] max-w-[200px] leading-relaxed">Initiate trace to verify protypal logic and integration webhooks.</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-slate-800 bg-slate-900/10">
        <button
          onClick={handleSimulate}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
        >
          <Play size={16} className="fill-current" />
          {loading ? "Traversing..." : "Run Sequence Trace"}
        </button>
      </div>
    </div>
  );
}

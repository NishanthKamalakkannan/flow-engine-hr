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
    if (status === "success") return <CheckCircle size={14} className="text-emerald-500" />;
    if (status === "error") return <AlertCircle size={14} className="text-rose-500" />;
    return <Clock size={14} className="text-amber-500" />;
  };

  const nodeTypeColor: Record<string, string> = {
    start: "bg-emerald-50 text-emerald-600 border-emerald-100",
    task: "bg-blue-50 text-blue-600 border-blue-100",
    approval: "bg-amber-50 text-amber-600 border-amber-100",
    automated: "bg-violet-50 text-violet-600 border-violet-100",
    webhook: "bg-pink-50 text-pink-600 border-pink-100",
    end: "bg-rose-50 text-rose-600 border-rose-100",
  };

  return (
    <div className="fixed top-14 bottom-0 right-0 w-[420px] bg-white border-l border-pink-100 z-50 flex flex-col shadow-[-20px_0_50px_-15px_rgba(255,77,109,0.15)] animate-in slide-in-from-right duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-pink-50 bg-pink-50/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-50 rounded-lg">
             <Activity size={18} className="text-[#FF4D6D]" />
          </div>
          <div>
            <h2 className="text-[#4A0E1C] font-bold text-lg tracking-tight leading-none">Trace Engine</h2>
            <p className="text-pink-600/40 text-[10px] font-bold uppercase tracking-widest mt-1.5">Live Execution Log</p>
          </div>
        </div>
        <button onClick={handleClose} className="text-pink-300 hover:text-[#FF4D6D] transition-colors p-1.5 hover:bg-white rounded-lg border border-transparent hover:border-pink-100">
          <X size={20} />
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-pink-50 bg-pink-50/10">
        <div className="flex flex-col">
          <p className="text-[#FF4D6D] font-black text-lg leading-none">{nodes.length}</p>
          <p className="text-pink-600/30 text-[8px] font-black uppercase tracking-widest mt-1">Nodes</p>
        </div>
        <div className="flex flex-col">
          <p className="text-[#FF4D6D] font-black text-lg leading-none">{edges.length}</p>
          <p className="text-pink-600/30 text-[8px] font-black uppercase tracking-widest mt-1">Edges</p>
        </div>
        <div className="flex flex-col">
          <p className="text-emerald-500 font-black text-lg leading-none">
            {nodes.filter((n: any) => n.type === "start").length}
          </p>
          <p className="text-pink-600/30 text-[8px] font-black uppercase tracking-widest mt-1">Entry</p>
        </div>
        <div className="flex flex-col">
          <p className="text-rose-500 font-black text-lg leading-none">
            {nodes.filter((n: any) => n.type === "end").length}
          </p>
          <p className="text-pink-600/30 text-[8px] font-black uppercase tracking-widest mt-1">Exit</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5 custom-scrollbar bg-white">
        {/* Validation errors */}
        {validationMessages.length > 0 && (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 shadow-sm animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-2 mb-3">
               <AlertCircle size={16} className="text-rose-500" />
               <p className="text-rose-500 font-bold text-[10px] uppercase tracking-widest">Logic Errors Detected</p>
            </div>
            <div className="space-y-1.5 pl-1">
              {validationMessages.map((e, i) => (
                <p key={i} className="text-rose-700/70 text-[11px] font-bold flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-rose-400 flex-shrink-0" />
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
              <div className="w-12 h-12 border-2 border-pink-100 rounded-full" />
              <div className="w-12 h-12 border-t-2 border-[#FF4D6D] rounded-full animate-spin absolute top-0 left-0" />
            </div>
            <p className="text-pink-600/50 text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">Mapping Logic Gates...</p>
          </div>
        )}

        {/* Global Success Summary */}
        {isFinished && result?.success && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mb-2 animate-in zoom-in-95 duration-500 flex flex-col items-center text-center gap-3 shadow-md shadow-emerald-500/5">
             <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-50">
                <Trophy size={24} />
             </div>
             <div>
                <p className="text-emerald-600 font-black text-[11px] uppercase tracking-[0.2em]">Execution Trace Perfect</p>
                <p className="text-emerald-700/60 text-[10px] font-bold mt-1.5 max-w-[200px] leading-relaxed">The graph was traversed from entry to exit with zero logic failures.</p>
             </div>
          </div>
        )}

        {/* Simulation items */}
        {result && !loading && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <p className="text-[10px] text-pink-600/30 font-black uppercase tracking-[0.25em] mb-4 pl-1">Trace Events</p>

            <div className="flex flex-col gap-3">
              {result.steps.map((step: any, i: number) => (
                <div key={i} className="flex flex-col">
                  <div
                    className={clsx(
                      "flex items-start gap-4 p-4 rounded-2xl border transition-all duration-700",
                      i <= activeStep
                        ? "bg-white border-pink-100 opacity-100 shadow-sm"
                        : "opacity-10 border-transparent scale-95",
                      i === activeStep && i === result.steps.length - 1 && "ring-2 ring-emerald-500/20 bg-emerald-50/30 border-emerald-100"
                    )}
                  >
                    <div className="mt-1 flex-shrink-0">{statusIcon(step.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[#4A0E1C] text-[13px] font-bold truncate tracking-tight uppercase leading-none">{step.label}</p>
                        <span
                          className={clsx(
                            "text-[8px] px-2 py-0.5 rounded-lg border uppercase font-black tracking-tighter",
                            nodeTypeColor[step.nodeType] || ""
                          )}
                        >
                          {step.nodeType}
                        </span>
                      </div>
                      <p className="text-[#4A0E1C]/50 text-[11px] font-medium leading-relaxed mt-1.5">{step.message}</p>
                      
                      {step.details && i <= activeStep && (
                        <button 
                          onClick={() => toggleDetails(i)}
                          className="mt-4 flex items-center gap-1.5 text-[#FF4D6D] text-[9px] font-black hover:text-[#FF758F] transition-colors uppercase tracking-[0.15em] bg-pink-50 px-2 py-1 rounded-lg"
                        >
                          {expandedDetails[i] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          {expandedDetails[i] ? "Hide JSON Trace" : "View System Trace"}
                        </button>
                      )}

                      {expandedDetails[i] && step.details && (
                        <div className="mt-4 p-4 bg-pink-50/30 rounded-xl border border-pink-100 font-mono text-[9px] overflow-x-auto max-w-full shadow-inner animate-in slide-in-from-top-2 duration-300">
                          <pre className="text-pink-950/70 leading-normal">{JSON.stringify(step.details, null, 2)}</pre>
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
            <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center border border-pink-100 shadow-sm animate-pulse-subtle">
              <Play size={24} className="text-[#FF4D6D] ml-1 fill-current" />
            </div>
            <div className="space-y-1">
              <p className="text-[#4A0E1C] font-bold uppercase tracking-[0.2em] text-xs">Engine Primed</p>
              <p className="text-pink-600/40 text-[10px] font-bold max-w-[200px] leading-relaxed mt-2 uppercase">Initiate sequence trace to verify protypal logic and integration webhooks.</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-pink-50 bg-pink-50/10">
        <button
          onClick={handleSimulate}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-[#FF4D6D] hover:bg-[#FF758F] disabled:opacity-30 text-white font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-pink-500/30 active:scale-[0.98] border border-[#C9184A]/10"
        >
          <Play size={16} className="fill-current" />
          {loading ? "Traversing..." : "Run Sequence Trace"}
        </button>
      </div>
    </div>
  );
}

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
    if (status === "success") return <CheckCircle size={16} className="text-[#10B981]" />;
    if (status === "error") return <AlertCircle size={16} className="text-red-500" />;
    return <Clock size={16} className="text-amber-500" />;
  };

  const nodeTypeColor: Record<string, string> = {
    start: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30",
    task: "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30",
    approval: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30",
    automated: "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/30",
    webhook: "bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/30",
    end: "bg-red-500/10 text-red-500 border-red-500/30",
  };

  return (
    <div className="fixed top-14 bottom-0 right-0 w-[440px] bg-[#0D1420] border-l border-[#1F2937] z-50 flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.9)] animate-in slide-in-from-right duration-500 backdrop-blur-3xl">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-[#1F2937] bg-[#080C14]/50">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-[#111827] rounded-xl border border-[#1F2937] shadow-lg">
             <Activity size={20} className="text-[#A855F7]" />
          </div>
          <div>
            <h2 className="text-[#F9FAFB] font-black text-lg tracking-tight leading-none uppercase">Trace Console</h2>
            <p className="text-[#6B7280] text-[9px] font-black uppercase tracking-[0.25em] mt-2 italic">Real-time Telemetry Log</p>
          </div>
        </div>
        <button onClick={handleClose} className="text-[#6B7280] hover:text-[#F9FAFB] transition-colors p-2 hover:bg-[#1F2937] rounded-xl border border-transparent hover:border-[#1F2937]">
          <X size={24} />
        </button>
      </div>

      {/* Hardware Status Display */}
      <div className="grid grid-cols-4 gap-4 px-6 py-5 border-b border-[#1F2937] bg-black/20">
        {[
          { label: "Nodes", val: nodes.length, color: "text-[#A855F7]" },
          { label: "Edges", val: edges.length, color: "text-[#06B6D4]" },
          { label: "Active", val: isFinished ? result?.steps.length : activeStep + 1, color: "text-[#10B981]" },
          { label: "Status", val: isFinished ? "Pass" : "Idle", color: isFinished ? "text-[#10B981]" : "text-[#6B7280]" },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col">
            <p className={`${stat.color} font-mono font-black text-xl leading-none`}>{stat.val}</p>
            <p className="text-[#6B7280] text-[8px] font-black uppercase tracking-widest mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Content HUD */}
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6 custom-scrollbar bg-[#0D1420]">
        
        {/* Logic Failures Hud */}
        {validationMessages.length > 0 && (
          <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-5 shadow-2xl animate-in shake duration-500">
            <div className="flex items-center gap-3 mb-4">
               <AlertCircle size={18} className="text-red-500" />
               <p className="text-red-500 font-black text-[10px] uppercase tracking-[0.2em]">Diagnostic Error Detected</p>
            </div>
            <div className="space-y-2.5 pl-1">
              {validationMessages.map((e, i) => (
                <p key={i} className="text-red-400 font-bold text-[11px] flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
                  {e}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* System Processing State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-5">
            <div className="relative">
              <div className="w-14 h-14 border-4 border-[#1F2937] rounded-full" />
              <div className="w-14 h-14 border-t-4 border-[#A855F7] rounded-full animate-spin absolute top-0 left-0 shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
            </div>
            <p className="text-[#A855F7] text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Running Sequence...</p>
          </div>
        )}

        {/* Mission Success Indicator */}
        {isFinished && result?.success && (
          <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-2xl p-6 mb-2 animate-in zoom-in-95 duration-700 flex flex-col items-center text-center gap-4 shadow-2xl shadow-[#10B981]/5">
             <div className="w-14 h-14 rounded-2xl bg-[#0D1420] flex items-center justify-center text-[#10B981] shadow-xl border border-[#10B981]/30">
                <Trophy size={28} />
             </div>
             <div>
                <p className="text-[#10B981] font-black text-[12px] uppercase tracking-[0.3em]">Mission Success</p>
                <p className="text-[#10B981]/50 text-[10px] font-bold mt-2.5 max-w-[240px] leading-relaxed uppercase">The protocol executed flawlessly across all logical gates.</p>
             </div>
          </div>
        )}

        {/* Trace Stream */}
        {result && !loading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="text-[10px] text-[#6B7280] font-black uppercase tracking-[0.3em] mb-6 pl-1 italic">Event Stream Trace</p>

            <div className="flex flex-col gap-4">
              {result.steps.map((step: any, i: number) => (
                <div key={i} className="flex flex-col">
                  <div
                    className={clsx(
                      "flex items-start gap-5 p-5 rounded-2xl border transition-all duration-700 backdrop-blur-md",
                      i <= activeStep
                        ? "bg-[#111827] border-[#1F2937] opacity-100 shadow-xl"
                        : "opacity-10 border-transparent scale-95 blur-[2px]",
                      i === activeStep && "border-[#7C3AED] ring-4 ring-[#7C3AED]/10 bg-[#080C14]"
                    )}
                  >
                    <div className="mt-1 flex-shrink-0">{statusIcon(step.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <p className={clsx(
                          "text-[13px] font-black truncate tracking-wide uppercase leading-none",
                          i === activeStep ? "text-[#F9FAFB]" : "text-[#F9FAFB]/80"
                        )}>{step.label}</p>
                        <span
                          className={clsx(
                            "text-[8px] px-2.5 py-1 rounded-lg border font-black tracking-widest uppercase",
                            nodeTypeColor[step.nodeType] || ""
                          )}
                        >
                          {step.nodeType}
                        </span>
                      </div>
                      <p className="text-[#6B7280] text-[11px] font-semibold leading-relaxed mt-2">{step.message}</p>
                      
                      {step.details && i <= activeStep && (
                        <button 
                          onClick={() => toggleDetails(i)}
                          className="mt-5 flex items-center gap-2.5 text-[#A855F7] text-[10px] font-black hover:text-[#7C3AED] transition-colors uppercase tracking-widest bg-[#080C14] px-3 py-1.5 rounded-xl border border-[#1F2937] hover:border-[#7C3AED]/50"
                        >
                          {expandedDetails[i] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          {expandedDetails[i] ? "Hide Telemetry" : "Inspect Raw Stream"}
                        </button>
                      )}

                      {expandedDetails[i] && step.details && (
                        <div className="mt-5 p-5 bg-black/40 rounded-2xl border border-[#1F2937] font-mono text-[10px] overflow-x-auto max-w-full shadow-inner animate-in slide-in-from-top-4 duration-500">
                          <pre className="text-[#6B7280] leading-normal">{JSON.stringify(step.details, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty Console State */}
        {!result && !loading && validationMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
            <div className="w-20 h-20 rounded-3xl bg-[#080C14] flex items-center justify-center border border-[#1F2937] shadow-inner relative group cursor-pointer hover:border-[#7C3AED]/50 transition-all">
              <div className="absolute inset-0 bg-[#7C3AED]/5 rounded-3xl animate-pulse blur-xl" />
              <Play size={32} className="text-[#7C3AED] ml-1 fill-current relative z-10" />
            </div>
            <div className="space-y-2">
              <p className="text-[#F9FAFB] font-black uppercase tracking-[0.4em] text-sm">Engine Primed</p>
              <p className="text-[#6B7280] text-[10px] font-black max-w-[240px] leading-relaxed mt-3 uppercase tracking-widest">Awaiting sequence initialization to perform real-time diagnostic trace.</p>
            </div>
          </div>
        )}
      </div>

      {/* Control Unit */}
      <div className="px-6 py-6 border-t border-[#1F2937] bg-[#080C14]/80">
        <button
          onClick={handleSimulate}
          disabled={loading}
          className="w-full flex items-center justify-center gap-4 py-4.5 rounded-2xl bg-[#7C3AED] hover:bg-[#A855F7] disabled:opacity-20 text-white font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-purple-900/30 active:scale-[0.98] border border-purple-400/20"
        >
          <Play size={18} className="fill-current" />
          {loading ? "Executing..." : "Start System Trace"}
        </button>
      </div>
    </div>
  );
}

import { Handle, Position } from "@xyflow/react";
import { useWorkflowStore } from "../../store/workflowStore";
import { AlertCircle } from "lucide-react";

interface BaseNodeProps {
  id: string;
  data: any;
  title: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  colorClass?: string;
  type?: string;
}

export default function BaseNode({ id, data, title, icon, children, colorClass = "bg-blue-500", type }: BaseNodeProps) {
  const { selectedNodeId, validationErrors, activeSimulationNodeId } = useWorkflowStore();
  const isSelected = selectedNodeId === id;
  const isActive = activeSimulationNodeId === id;
  
  const error = validationErrors.find((e: any) => e.nodeId === id);

  return (
    <div 
      className={`relative min-w-[210px] transition-all duration-300 group ${
        isActive ? "scale-105 z-50" : "scale-100"
      }`}
    >
      {/* Simulation Active Pulse - Mission Status Green */}
      <div className={`absolute -inset-1.5 rounded-2xl blur-xl transition-all duration-500 opacity-0 ${
        isActive ? "opacity-100 bg-[#10B981]/40 animate-pulse" : ""
      }`} />

      {/* Selection Glow - Electric Purple */}
      <div className={`absolute -inset-0.5 rounded-2xl blur-md transition-all duration-700 opacity-0 ${
        isSelected && !isActive ? "opacity-50 bg-[#7C3AED]/40" : ""
      }`} />

      {/* Main Card - Hardware Surface */}
      <div className={`relative bg-[#111827] border rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
        isActive 
          ? "border-[#10B981] ring-4 ring-[#10B981]/10 shadow-[0_0_30px_rgba(16,185,129,0.2)]" 
          : isSelected 
            ? "border-[#7C3AED] shadow-[0_0_20px_rgba(124,58,237,0.25)] ring-4 ring-[#7C3AED]/5" 
            : "border-[#1F2937] group-hover:border-[#374151]"
      }`}>
        
        {/* Hardware Status Strip */}
        <div className={`h-1 w-full ${isActive ? "bg-[#10B981]" : colorClass} opacity-90 shadow-[0_4px_10px_rgba(0,0,0,0.5)]`} />

        <div className="p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-2.5 rounded-xl text-white shadow-lg transition-transform group-hover:scale-110 ${isActive ? "bg-[#10B981]" : colorClass}`}>
              {icon}
            </div>
            <div>
              <p className={`text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-2 ${isActive ? "text-[#10B981]" : "text-[#6B7280]"}`}>
                {type || "System Node"}
              </p>
              <h3 className={`font-black text-sm tracking-tight leading-none transition-colors ${isActive ? "text-white" : "text-[#F9FAFB]"}`}>
                {title}
              </h3>
            </div>
          </div>

          <div className="space-y-2.5 text-[#6B7280] text-xs font-semibold leading-relaxed px-1">
            {children}
          </div>
        </div>

        {/* Diagnostic Alert Banner */}
        {error && (
          <div className="bg-red-950/20 border-t border-red-900/30 px-5 py-2.5 flex items-center gap-3 animate-in slide-in-from-bottom-2 transition-all">
            <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
            <p className="text-[10px] text-red-500 font-black uppercase tracking-widest truncate">{error.message}</p>
          </div>
        )}
      </div>

      {/* Port Interfaces - Electric Style */}
      {data.type !== "end" && (
        <Handle
          type="source"
          position={Position.Right}
          className={`!w-3.5 !h-3.5 !border-2 !border-[#111827] !-right-1.5 hover:!scale-125 transition-all shadow-lg ${isActive ? "!bg-[#10B981]" : "!bg-[#7C3AED]"}`}
        />
      )}
      {data.type !== "start" && (
        <Handle
          type="target"
          position={Position.Left}
          className={`!w-3.5 !h-3.5 !border-2 !border-[#111827] !-left-1.5 hover:!scale-125 transition-all shadow-lg ${isActive ? "!bg-[#10B981]" : "!bg-[#7C3AED]"}`}
        />
      )}
    </div>
  );
}

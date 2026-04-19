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

export default function BaseNode({ id, data, title, icon, children, colorClass = "bg-indigo-500", type }: BaseNodeProps) {
  const { selectedNodeId, validationErrors, activeSimulationNodeId } = useWorkflowStore();
  const isSelected = selectedNodeId === id;
  const isActive = activeSimulationNodeId === id;
  
  const error = validationErrors.find((e: any) => e.nodeId === id);

  return (
    <div 
      className={`relative min-w-[200px] transition-all duration-300 group ${
        isActive ? "scale-110 z-50" : "scale-100"
      }`}
    >
      {/* Traversal Pulse - Standard Green for logic success */}
      <div className={`absolute -inset-1 rounded-2xl blur-lg transition-all duration-500 opacity-0 ${
        isActive ? "opacity-100 bg-emerald-500/60 animate-pulse" : ""
      }`} />

      {/* Selection Glow - Rose themed */}
      <div className={`absolute -inset-0.5 rounded-2xl blur-md transition-all duration-700 opacity-0 ${
        isSelected && !isActive ? "opacity-40 bg-pink-400/30" : ""
      }`} />

      {/* Main Card - White theme */}
      <div className={`relative bg-white border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${
        isActive 
          ? "border-emerald-500 ring-4 ring-emerald-500/10 shadow-xl shadow-emerald-500/20" 
          : isSelected 
            ? "border-[#FF4D6D] shadow-lg shadow-pink-500/10" 
            : "border-pink-100 group-hover:border-pink-300"
      }`}>
        
        {/* Header Ribbon */}
        <div className={`h-1.5 w-full ${isActive ? "bg-emerald-500" : colorClass} opacity-80`} />

        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg text-white shadow-sm transition-transform group-hover:scale-110 ${isActive ? "bg-emerald-500" : colorClass}`}>
              {icon}
            </div>
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-widest leading-none mb-1 ${isActive ? "text-emerald-600" : "text-pink-600/40"}`}>
                {type || "Node"}
              </p>
              <h3 className={`font-bold text-sm tracking-tight leading-none transition-colors ${isActive ? "text-emerald-700" : "text-[#4A0E1C] group-hover:text-pink-600"}`}>
                {title}
              </h3>
            </div>
          </div>

          <div className="space-y-2 text-[#4A0E1C]/70 text-xs font-medium leading-relaxed">
            {children}
          </div>
        </div>

        {/* Validation Error Banner */}
        {error && (
          <div className="bg-rose-50 border-t border-rose-100 px-4 py-2 flex items-center gap-2 animate-in slide-in-from-bottom-1 transition-all">
            <AlertCircle size={12} className="text-rose-500 flex-shrink-0" />
            <p className="text-[9px] text-rose-500 font-bold uppercase tracking-wide truncate">{error.message}</p>
          </div>
        )}
      </div>

      {/* Handles - Soft Rose Style */}
      {data.type !== "end" && (
        <Handle
          type="source"
          position={Position.Right}
          className={`!w-3 !h-3 !border-2 !border-white !-right-1.5 hover:!scale-125 transition-all shadow-sm ${isActive ? "!bg-emerald-500" : "!bg-[#FF4D6D]"}`}
        />
      )}
      {data.type !== "start" && (
        <Handle
          type="target"
          position={Position.Left}
          className={`!w-3 !h-3 !border-2 !border-white !-left-1.5 hover:!scale-125 transition-all shadow-sm ${isActive ? "!bg-emerald-500" : "!bg-[#FF4D6D]"}`}
        />
      )}
    </div>
  );
}

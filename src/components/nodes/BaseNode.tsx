import { clsx } from "clsx";
import type { ReactNode } from "react";
import { Handle, Position } from "@xyflow/react";
import { useWorkflowStore } from "../../store/workflowStore";

interface ValidationError {
  nodeId: string;
  message: string;
}

interface BaseNodeProps {
  label: string;
  subtitle?: string;
  icon: ReactNode;
  color: string;
  selected: boolean;
  hasSource?: boolean;
  hasTarget?: boolean;
  validationErrors?: ValidationError[];
  nodeId: string;
}

export default function BaseNode({
  label,
  subtitle,
  icon,
  color,
  selected,
  hasSource = true,
  hasTarget = true,
  validationErrors = [],
  nodeId,
}: BaseNodeProps) {
  const activeSimulationNodeId = useWorkflowStore((s: any) => s.activeSimulationNodeId);
  const hasError = validationErrors.some((e) => e.nodeId === nodeId);
  const isActive = activeSimulationNodeId === nodeId;

  return (
    <div
      className={clsx(
        "group rounded-xl px-4 py-3 min-w-[210px] shadow-2xl border transition-all duration-300 cursor-pointer backdrop-blur-md",
        selected 
          ? "border-indigo-500 bg-slate-900/95 ring-2 ring-indigo-500/10 scale-[1.03]" 
          : isActive
            ? "border-emerald-500 bg-emerald-500/10 shadow-emerald-500/30 scale-[1.05] ring-4 ring-emerald-500/10"
            : hasError 
              ? "border-rose-500 bg-rose-500/5 animate-pulse-subtle shadow-rose-500/20" 
              : "border-slate-800 bg-slate-900/90 hover:border-slate-700 hover:bg-slate-900 hover:scale-[1.02] hover:shadow-indigo-500/5"
      )}
    >
      {hasTarget && (
        <Handle 
          type="target" 
          position={Position.Top} 
          className="!bg-indigo-500 !border-2 !border-slate-950 !w-3 !h-3 hover:scale-125 transition-all !z-50" 
        />
      )}
      
      <div className="flex items-center gap-3.5">
        <div className={clsx(
          "w-11 h-11 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0 transition-all group-hover:scale-110 duration-500 shadow-xl", 
          isActive ? "animate-bounce" : "",
          color
        )}>
          {icon}
        </div>
        <div className="overflow-hidden flex-1">
          <p className="text-slate-100 text-sm font-bold tracking-tight leading-none mb-1.5 truncate">{label}</p>
          {subtitle && (
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.1em] truncate leading-none opacity-80 group-hover:opacity-100 transition-opacity">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {hasError && (
        <div className="mt-3 flex items-center gap-2 text-rose-400 text-[10px] font-bold uppercase tracking-widest pl-1">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-rose-500/50 animate-pulse" />
          Execution Blocked
        </div>
      )}

      {isActive && (
        <div className="mt-3 flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-widest animate-pulse pl-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-emerald-500/50" />
          Step Processing...
        </div>
      )}

      {hasSource && (
        <Handle 
          type="source" 
          position={Position.Bottom} 
          className="!bg-indigo-500 !border-2 !border-slate-950 !w-3 !h-3 hover:scale-125 transition-all !z-50" 
        />
      )}
    </div>
  );
}

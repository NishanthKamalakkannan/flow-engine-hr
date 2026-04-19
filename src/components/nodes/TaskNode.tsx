import { ClipboardList } from "lucide-react";
import BaseNode from "./BaseNode";

export default function TaskNode({ id, data }: any) {
  return (
    <BaseNode id={id} data={data} title={data.title || "Manual Task"} type="Task Node" icon={<ClipboardList size={14} />} colorClass="bg-blue-500">
      <div className="space-y-2">
        <p className="text-[#94A3B8] text-[11px] leading-relaxed line-clamp-2">
          {data.description || "No description provided."}
        </p>
        {data.assignee && (
          <div className="flex items-center gap-2 pt-2 border-t border-[#1F2937]">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] font-black text-blue-400 border border-blue-500/30">
              {data.assignee.charAt(0).toUpperCase()}
            </div>
            <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-tight">{data.assignee}</p>
          </div>
        )}
      </div>
    </BaseNode>
  );
}

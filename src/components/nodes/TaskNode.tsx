import { ClipboardList } from "lucide-react";
import BaseNode from "./BaseNode";

export default function TaskNode({ id, data }: any) {
  return (
    <BaseNode 
      id={id} 
      data={data}
      title={data.title || "Manual Task"} 
      type="Task Node"
      icon={<ClipboardList size={14} />} 
      colorClass="bg-blue-500"
    >
      <div className="space-y-2">
        <p className="text-[#4A0E1C]/60 text-[11px] leading-relaxed line-clamp-2">
          {data.description || "No description provided."}
        </p>
        {data.assignee && (
           <div className="flex items-center gap-2 pt-2 border-t border-pink-50">
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-black text-blue-500 border border-blue-100 shadow-sm">
                 {data.assignee.charAt(0).toUpperCase()}
              </div>
              <p className="text-[10px] text-pink-600/60 font-bold uppercase tracking-tight">{data.assignee}</p>
           </div>
        )}
      </div>
    </BaseNode>
  );
}

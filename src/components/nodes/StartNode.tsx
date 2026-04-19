import { Play } from "lucide-react";
import BaseNode from "./BaseNode";

export default function StartNode({ id, data }: any) {
  return (
    <BaseNode 
      id={id} 
      data={data}
      title={data.title || "Workflow Entry"} 
      type="Start Node"
      icon={<Play size={14} className="ml-0.5 fill-current" />} 
      colorClass="bg-emerald-500"
    >
      <div className="flex items-center gap-2 px-1">
         <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
         <p className="text-emerald-600 font-black text-[9px] uppercase tracking-widest">Entry Point Active</p>
      </div>
    </BaseNode>
  );
}

import { Zap } from "lucide-react";
import BaseNode from "./BaseNode";

export default function AutomatedNode({ id, data }: any) {
  return (
    <BaseNode 
      id={id} 
      data={data}
      title={data.title || "Automated Step"} 
      type="Automated Node"
      icon={<Zap size={14} />} 
      colorClass="bg-violet-500"
    >
      <div className="flex flex-col gap-1.5 px-1">
        <p className="text-[10px] text-pink-600/40 font-bold uppercase tracking-widest">{data.actionId || "No action set"}</p>
        <div className="h-1 w-full bg-pink-100/50 rounded-full overflow-hidden">
           <div className="w-1/3 h-full bg-violet-400 opacity-50 transition-all group-hover:w-full duration-700" />
        </div>
      </div>
    </BaseNode>
  );
}

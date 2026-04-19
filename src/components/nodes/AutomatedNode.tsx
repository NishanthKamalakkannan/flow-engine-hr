import { Zap } from "lucide-react";
import BaseNode from "./BaseNode";

export default function AutomatedNode({ id, data }: any) {
  return (
    <BaseNode id={id} data={data} title={data.title || "Automated Step"} type="Automated Node" icon={<Zap size={14} />} colorClass="bg-violet-500">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center bg-[#1A2235] p-2.5 rounded-lg border border-[#2D3748]">
          <span className="text-[#6B7280] text-[10px] font-bold uppercase tracking-tight">Action</span>
          <span className="text-[#A78BFA] text-[10px] font-bold truncate max-w-[120px]">{data.actionId || "Not set"}</span>
        </div>
        <div className="h-1 w-full bg-[#1F2937] rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-violet-500 rounded-full transition-all group-hover:w-full duration-700" />
        </div>
      </div>
    </BaseNode>
  );
}

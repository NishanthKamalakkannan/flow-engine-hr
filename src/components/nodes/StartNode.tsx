import { Play } from "lucide-react";
import BaseNode from "./BaseNode";

export default function StartNode({ id, data }: any) {
  return (
    <BaseNode id={id} data={data} title={data.title || "Workflow Entry"} type="Start Node" icon={<Play size={14} className="ml-0.5 fill-current" />} colorClass="bg-emerald-500">
      <div className="flex items-center gap-2 px-1">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
        <p className="text-emerald-400 font-black text-[9px] uppercase tracking-widest">Entry Point Active</p>
      </div>
      {data.metadata?.length > 0 && (
        <div className="bg-[#1A2235] p-2 rounded-lg border border-[#2D3748] mt-1">
          {data.metadata.map((m: any, i: number) => (
            <div key={i} className="flex justify-between text-[10px]">
              <span className="text-[#6B7280] font-bold">{m.key}</span>
              <span className="text-[#94A3B8] font-bold">{m.value}</span>
            </div>
          ))}
        </div>
      )}
    </BaseNode>
  );
}

import { Flag } from "lucide-react";
import BaseNode from "./BaseNode";

export default function EndNode({ id, data }: any) {
  return (
    <BaseNode id={id} data={data} title="Conclusion" type="End Node" icon={<Flag size={14} />} colorClass="bg-rose-500">
      <div className="bg-[#1A2235] p-2.5 rounded-lg border border-[#2D3748]">
        <p className="text-[#94A3B8] font-medium text-[11px] italic tracking-tight">
          "{data.endMessage || "Process terminal reached"}"
        </p>
      </div>
      {data.summaryFlag && (
        <div className="flex items-center gap-1.5 px-1">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          <p className="text-[9px] text-rose-400/70 font-bold uppercase tracking-widest">Summary enabled</p>
        </div>
      )}
    </BaseNode>
  );
}

import { Flag } from "lucide-react";
import BaseNode from "./BaseNode";

export default function EndNode({ id, data }: any) {
  return (
    <BaseNode 
      id={id} 
      data={data}
      title="Conclusion" 
      type="End Node"
      icon={<Flag size={14} />} 
      colorClass="bg-rose-500"
    >
      <p className="text-[#4A0E1C]/80 font-bold text-[11px] px-2 py-2 bg-rose-50/50 rounded-xl border border-rose-100/50 italic tracking-tight">
        "{data.endMessage || "Process terminal reached"}"
      </p>
    </BaseNode>
  );
}

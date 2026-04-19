import { ShieldCheck } from "lucide-react";
import BaseNode from "./BaseNode";

export default function ApprovalNode({ id, data }: any) {
  return (
    <BaseNode 
      id={id} 
      data={data}
      title={data.title || "Approval"} 
      type="Approval Node"
      icon={<ShieldCheck size={14} />} 
      colorClass="bg-amber-500"
    >
      <div className="flex justify-between items-center text-[10px] bg-pink-50/50 p-2 rounded-lg border border-pink-100/50">
        <span className="text-pink-600/40 font-bold uppercase tracking-tight">Role</span>
        <span className="text-[#4A0E1C] font-bold">{data.approverRole || "Any"}</span>
      </div>
    </BaseNode>
  );
}

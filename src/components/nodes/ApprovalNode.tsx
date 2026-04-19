import { ShieldCheck } from "lucide-react";
import BaseNode from "./BaseNode";

export default function ApprovalNode({ id, data }: any) {
  return (
    <BaseNode id={id} data={data} title={data.title || "Approval"} type="Approval Node" icon={<ShieldCheck size={14} />} colorClass="bg-amber-500">
      <div className="flex justify-between items-center text-[10px] bg-[#1A2235] p-2.5 rounded-lg border border-[#2D3748]">
        <span className="text-[#6B7280] font-bold uppercase tracking-tight">Role</span>
        <span className="text-[#F9FAFB] font-bold">{data.approverRole || "Any"}</span>
      </div>
      {data.autoApproveThreshold > 0 && (
        <div className="flex justify-between items-center text-[10px] bg-[#1A2235] p-2.5 rounded-lg border border-[#2D3748]">
          <span className="text-[#6B7280] font-bold uppercase tracking-tight">Auto</span>
          <span className="text-amber-400 font-bold">{data.autoApproveThreshold} days</span>
        </div>
      )}
    </BaseNode>
  );
}

import { Globe } from "lucide-react";
import BaseNode from "./BaseNode";

export default function WebhookNode({ id, data }: any) {
  return (
    <BaseNode 
      id={id} 
      data={data}
      title={data.title || "Live Webhook"} 
      type="Integration Node"
      icon={<Globe size={14} />} 
      colorClass="bg-pink-500"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 bg-pink-50/50 p-2 rounded-lg border border-pink-100/50">
           <span className="text-[9px] font-black text-[#FF4D6D] uppercase">{data.method || "POST"}</span>
           <p className="text-[10px] text-pink-600/60 truncate font-bold">{data.url || "No URL"}</p>
        </div>
        <div className="flex items-center gap-1.5 px-1 animate-pulse">
           <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
           <p className="text-[9px] text-pink-600/30 font-bold uppercase tracking-widest">Live Integration</p>
        </div>
      </div>
    </BaseNode>
  );
}

import { Globe } from "lucide-react";
import BaseNode from "./BaseNode";

export default function WebhookNode({ id, data }: any) {
  const hostname = (() => { try { return new URL(data.url).hostname; } catch { return data.url || "No URL"; } })();
  return (
    <BaseNode id={id} data={data} title={data.title || "Live Webhook"} type="Integration Node" icon={<Globe size={14} />} colorClass="bg-cyan-500">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 bg-[#1A2235] p-2.5 rounded-lg border border-[#2D3748]">
          <span className="text-[9px] font-black text-cyan-400 uppercase bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{data.method || "POST"}</span>
          <p className="text-[10px] text-[#94A3B8] truncate font-bold">{hostname}</p>
        </div>
        <div className="flex items-center gap-1.5 px-1">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <p className="text-[9px] text-cyan-400/70 font-bold uppercase tracking-widest">Live Integration</p>
        </div>
      </div>
    </BaseNode>
  );
}

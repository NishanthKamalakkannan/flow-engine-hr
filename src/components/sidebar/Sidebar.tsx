import { useWorkflowStore } from "../../store/workflowStore";
import { Play, ClipboardList, ShieldCheck, Zap, Flag, Layout, UserPlus, CalendarOff, FileCheck, Globe, Trash2, Download, Upload } from "lucide-react";
import { getAutoLayout } from "../../utils/autoLayout";
import { WORKFLOW_TEMPLATES } from "../../utils/workflowTemplates";

const NODE_TYPES = [
  { type: "start", label: "Start", Icon: Play, color: "bg-[#10B981]", desc: "Process entry" },
  { type: "task", label: "Task", Icon: ClipboardList, color: "bg-[#3B82F6]", desc: "Manual action" },
  { type: "approval", label: "Approval", Icon: ShieldCheck, color: "bg-[#F59E0B]", desc: "Decision gate" },
  { type: "automated", label: "Automated", Icon: Zap, color: "bg-[#8B5CF6]", desc: "System sync" },
  { type: "webhook", label: "Webhook", Icon: Globe, color: "bg-[#06B6D4]", desc: "Live API call" },
  { type: "end", label: "End", Icon: Flag, color: "bg-[#EF4444]", desc: "Completion" },
];

const TEMPLATE_ICONS: Record<string, any> = {
  UserPlus,
  CalendarOff,
  FileCheck,
};

function makeId() {
  return "node-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
}

export default function Sidebar() {
  const { addNode, clearWorkflow, nodes, edges, setNodes, loadWorkflow } = useWorkflowStore();

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData("nodeType", type);
  };

  const handleAddNode = (type: string) => {
    const defaultData: Record<string, any> = {
      start: { type: "start", title: "Start", metadata: [] },
      task: { type: "task", title: "New Task", description: "", assignee: "", dueDate: "", customFields: [] },
      approval: { type: "approval", title: "Approval", approverRole: "Manager", autoApproveThreshold: 0 },
      automated: { type: "automated", title: "Automated Step", actionId: "", actionParams: {} },
      webhook: { type: "webhook", title: "Live API Hook", url: "https://httpbin.org/post", method: "POST", payload: '{\n  "status": "success",\n  "message": "Hello from Workflow Designer"\n}' },
      end: { type: "end", endMessage: "Workflow Complete", summaryFlag: false },
    };
    addNode({
      id: makeId(),
      type: type as any,
      position: { x: 250 + Math.random() * 200, y: 100 + Math.random() * 200 },
      data: { ...defaultData[type] },
    });
  };

  const handleAutoLayout = () => {
    if (nodes.length === 0) return;
    const layouted = getAutoLayout(nodes, edges);
    setNodes(layouted);
  };

  const handleLoadTemplate = (templateIndex: number) => {
    const template = WORKFLOW_TEMPLATES[templateIndex];
    clearWorkflow();
    setTimeout(() => {
      loadWorkflow(
        JSON.parse(JSON.stringify(template.nodes)),
        JSON.parse(JSON.stringify(template.edges))
      );
    }, 50);
  };

  const handleExport = () => {
    const json = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workflow.json";
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        clearWorkflow();
        setTimeout(() => {
          useWorkflowStore.getState().loadWorkflow(data.nodes, data.edges);
        }, 100);
      } catch {
        alert("Invalid workflow file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-64 h-full bg-[#0D1420] border-r border-[#1F2937] flex flex-col p-4 gap-6 overflow-y-auto shadow-2xl z-20">
      {/* Node Palette */}
      <div>
        <p className="text-[10px] text-[#6B7280] font-black uppercase tracking-[0.2em] mb-5 pl-1">Designer Nodes</p>
        <div className="grid grid-cols-1 gap-3">
          {NODE_TYPES.map((n) => (
            <div
              key={n.type}
              draggable
              onDragStart={(e) => handleDragStart(e, n.type)}
              onClick={() => handleAddNode(n.type)}
              className="flex items-center gap-4 p-3.5 rounded-xl border border-[#1F2937] bg-[#111827] cursor-grab hover:border-[#7C3AED] hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all group active:scale-[0.98]"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${n.color}`}>
                <n.Icon size={16} className="text-[#F9FAFB]" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[#F9FAFB] text-xs font-black tracking-tight leading-tight">{n.label}</p>
                <p className="text-[#6B7280] text-[10px] truncate leading-tight mt-1.5 font-medium">{n.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Templates */}
      <div>
        <p className="text-[10px] text-[#6B7280] font-black uppercase tracking-[0.2em] mb-5 pl-1">Mission Presets</p>
        <div className="flex flex-col gap-3">
          {WORKFLOW_TEMPLATES.map((tpl, i) => {
            const TplIcon = TEMPLATE_ICONS[tpl.icon] || Play;
            return (
              <button
                key={tpl.name}
                onClick={() => handleLoadTemplate(i)}
                className="flex items-center gap-4 p-4 rounded-xl border border-[#1F2937] bg-[#111827] hover:border-[#7C3AED] hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all text-left w-full group active:scale-[0.98]"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#0D1420] transition-transform group-hover:translate-x-1 border border-[#1F2937]">
                  <TplIcon size={16} className="text-[#A855F7]" />
                </div>
                <div className="overflow-hidden space-y-1">
                  <p className="text-[#F9FAFB] text-xs font-black truncate leading-tight">{tpl.name}</p>
                  <p className="text-[#6B7280] text-[10px] truncate leading-tight font-medium">{tpl.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto space-y-3 border-t border-[#1F2937] pt-8 pb-4">
        <button
          onClick={handleAutoLayout}
          className="w-full flex items-center justify-center gap-3 text-[11px] py-3.5 px-4 rounded-xl bg-[#111827] hover:bg-[#1F2937] text-[#F9FAFB] font-black transition-all border border-[#1F2937] active:scale-95 shadow-lg uppercase tracking-widest"
        >
          <Layout size={14} className="text-[#A855F7]" /> Refine Layout
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleExport}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-[#7C3AED] hover:bg-[#1F2937] transition-all active:scale-95 group"
            title="Export Mission"
          >
            <Download size={18} className="text-[#6B7280] group-hover:text-[#A855F7] transition-colors" />
            <span className="text-[9px] font-black text-[#6B7280] group-hover:text-[#F9FAFB] uppercase tracking-widest">Export</span>
          </button>
          
          <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-[#7C3AED] hover:bg-[#1F2937] transition-all cursor-pointer active:scale-95 group">
            <Upload size={18} className="text-[#6B7280] group-hover:text-[#A855F7] transition-colors" />
            <span className="text-[9px] font-black text-[#6B7280] group-hover:text-[#F9FAFB] uppercase tracking-widest">Import</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>

        <button
          onClick={clearWorkflow}
          className="w-full flex items-center justify-center gap-3 text-[11px] py-4 px-4 rounded-xl bg-red-950/20 hover:bg-red-950/40 text-red-500 font-black transition-all border border-red-900/40 active:scale-95 tracking-widest shadow-lg uppercase"
        >
          <Trash2 size={14} /> Abort Workflow
        </button>
      </div>

      {/* System Status HUD */}
      <div className="border-t border-[#1F2937] pt-8 pb-4">
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-[10px] text-[#6B7280] font-black uppercase tracking-[0.2em]">Telemetry Status</p>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
             <span className="text-[9px] text-[#10B981] font-black font-mono tracking-tighter uppercase">Nominal</span>
          </div>
        </div>
        <div className="space-y-2 bg-[#080C14]/80 p-4 rounded-2xl border border-[#1F2937] shadow-inner">
          <div className="flex justify-between items-center text-[9px] text-[#6B7280] uppercase font-black tracking-widest">
            <span>Rollback</span>
            <kbd className="bg-[#111827] px-2 py-1 rounded-lg text-[#A855F7] font-mono shadow-md border border-[#1F2937]">Ctrl+Z</kbd>
          </div>
          <div className="flex justify-between items-center text-[9px] text-[#6B7280] uppercase font-black tracking-widest">
            <span>Commit</span>
            <kbd className="bg-[#111827] px-2 py-1 rounded-lg text-[#A855F7] font-mono shadow-md border border-[#1F2937]">Ctrl+Y</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useWorkflowStore } from "../../store/workflowStore";
import { Play, ClipboardList, ShieldCheck, Zap, Flag, Layout, UserPlus, CalendarOff, FileCheck, Globe, Trash2, Download, Upload } from "lucide-react";
import { getAutoLayout } from "../../utils/autoLayout";
import { WORKFLOW_TEMPLATES } from "../../utils/workflowTemplates";

const NODE_TYPES = [
  { type: "start", label: "Start", Icon: Play, color: "bg-emerald-500", desc: "Process entry" },
  { type: "task", label: "Task", Icon: ClipboardList, color: "bg-blue-500", desc: "Manual action" },
  { type: "approval", label: "Approval", Icon: ShieldCheck, color: "bg-amber-500", desc: "Decision gate" },
  { type: "automated", label: "Automated", Icon: Zap, color: "bg-violet-500", desc: "System sync" },
  { type: "webhook", label: "Webhook", Icon: Globe, color: "bg-pink-500", desc: "Live API call" },
  { type: "end", label: "End", Icon: Flag, color: "bg-rose-500", desc: "Completion" },
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
    <div className="w-64 h-full bg-white border-r border-pink-200 flex flex-col p-4 gap-6 overflow-y-auto shadow-sm z-10">
      {/* Node Palette */}
      <div>
        <p className="text-[11px] text-[#4A0E1C]/60 font-bold uppercase tracking-[0.15em] mb-4 pl-1">Designer Nodes</p>
        <div className="grid grid-cols-1 gap-3">
          {NODE_TYPES.map((n) => (
            <div
              key={n.type}
              draggable
              onDragStart={(e) => handleDragStart(e, n.type)}
              onClick={() => handleAddNode(n.type)}
              className="flex items-center gap-3 p-3 rounded-xl border border-pink-100 bg-white cursor-grab hover:border-pink-400 hover:bg-pink-50/50 transition-all group active:scale-[0.98] shadow-sm hover:shadow-md"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${n.color}`}>
                <n.Icon size={16} className="text-white" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[#4A0E1C] text-xs font-bold leading-tight">{n.label}</p>
                <p className="text-pink-600/40 text-[10px] truncate leading-tight mt-0.5">{n.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Templates */}
      <div>
        <p className="text-[11px] text-[#4A0E1C]/60 font-bold uppercase tracking-[0.15em] mb-4 pl-1">Presets</p>
        <div className="flex flex-col gap-3">
          {WORKFLOW_TEMPLATES.map((tpl, i) => {
            const TplIcon = TEMPLATE_ICONS[tpl.icon] || Play;
            return (
              <button
                key={tpl.name}
                onClick={() => handleLoadTemplate(i)}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-pink-100 bg-white hover:border-pink-400 hover:bg-pink-50/50 transition-all text-left w-full group active:scale-[0.98] shadow-sm hover:shadow-md"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-pink-50 transition-transform group-hover:translate-x-0.5">
                  <TplIcon size={15} className="text-[#FF4D6D]" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[#4A0E1C] text-xs font-black truncate leading-tight">{tpl.name}</p>
                  <p className="text-pink-600/40 text-[10px] truncate mt-1 font-medium">{tpl.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto space-y-2.5 border-t border-pink-100 pt-6">
        <button
          onClick={handleAutoLayout}
          className="w-full flex items-center justify-center gap-2 text-xs py-3 px-4 rounded-xl bg-white hover:bg-pink-50 text-[#4A0E1C] font-black transition-all border border-pink-300 active:scale-95 shadow-sm"
        >
          <Layout size={14} className="text-pink-400" /> Refine Layout
        </button>
        
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleExport}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white border border-pink-200 hover:border-pink-400 hover:bg-pink-50 transition-all active:scale-95 group shadow-sm"
            title="Export Workflow"
          >
            <Download size={16} className="text-pink-400 group-hover:text-pink-600 transition-colors" />
            <span className="text-[10px] font-black text-pink-600/50 group-hover:text-pink-600 uppercase tracking-tighter">Export</span>
          </button>
          
          <label className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white border border-pink-200 hover:border-pink-400 hover:bg-pink-50 transition-all cursor-pointer active:scale-95 group shadow-sm">
            <Upload size={16} className="text-pink-400 group-hover:text-pink-600 transition-colors" />
            <span className="text-[10px] font-black text-pink-600/50 group-hover:text-pink-600 uppercase tracking-tighter">Import</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>

        <button
          onClick={clearWorkflow}
          className="w-full flex items-center justify-center gap-2 text-[11px] py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#FF4D6D] font-black transition-all border border-rose-200 active:scale-95 tracking-wide shadow-sm uppercase"
        >
          <Trash2 size={13} /> Reset Engine
        </button>
      </div>

      {/* Keyboard shortcuts */}
      <div className="border-t border-pink-100 pt-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-[10px] text-[#4A0E1C]/40 font-bold uppercase tracking-widest">System Status</p>
          <div className="flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] animate-pulse" />
             <span className="text-[10px] text-[#4A0E1C]/60 font-bold font-mono tracking-tighter">Standby</span>
          </div>
        </div>
        <div className="space-y-1.5 bg-pink-50/50 p-3 rounded-xl border border-pink-100">
          <div className="flex justify-between items-center text-[10px] text-pink-600/60 uppercase font-black tracking-tight">
            <span>Undo</span>
            <kbd className="bg-white px-1.5 py-0.5 rounded text-pink-600/80 font-mono shadow-sm border border-pink-200">Ctrl+Z</kbd>
          </div>
          <div className="flex justify-between items-center text-[10px] text-pink-600/60 uppercase font-black tracking-tight">
            <span>Redo</span>
            <kbd className="bg-white px-1.5 py-0.5 rounded text-pink-600/80 font-mono shadow-sm border border-pink-200">Ctrl+Y</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}

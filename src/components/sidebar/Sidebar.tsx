import { useWorkflowStore } from "../../store/workflowStore";
import { Play, ClipboardList, ShieldCheck, Zap, Flag, Layout, UserPlus, CalendarOff, FileCheck, Globe, Trash2, Download, Upload } from "lucide-react";
import { getAutoLayout } from "../../utils/autoLayout";
import { WORKFLOW_TEMPLATES } from "../../utils/workflowTemplates";

const NODE_TYPES = [
  { type: "start", label: "Start", Icon: Play, color: "bg-emerald-500", desc: "Process entry" },
  { type: "task", label: "Task", Icon: ClipboardList, color: "bg-blue-500", desc: "Manual action" },
  { type: "approval", label: "Approval", Icon: ShieldCheck, color: "bg-amber-500", desc: "Decision gate" },
  { type: "automated", label: "Automated", Icon: Zap, color: "bg-violet-500", desc: "System sync" },
  { type: "webhook", label: "Webhook", Icon: Globe, color: "bg-indigo-500", desc: "Live API call" },
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
    <div className="w-64 h-full bg-[#0F172A] border-r border-[#1E293B] flex flex-col p-4 gap-6 overflow-y-auto shadow-2xl z-10 transition-all duration-500">
      {/* Node Palette */}
      <div>
        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.15em] mb-4">Designer Nodes</p>
        <div className="grid grid-cols-1 gap-2">
          {NODE_TYPES.map((n) => (
            <div
              key={n.type}
              draggable
              onDragStart={(e) => handleDragStart(e, n.type)}
              onClick={() => handleAddNode(n.type)}
              className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-800 bg-slate-900/40 cursor-grab hover:border-indigo-500/50 hover:bg-slate-800 transition-all group active:scale-[0.98]"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${n.color}`}>
                <n.Icon size={16} className="text-white" />
              </div>
              <div className="overflow-hidden">
                <p className="text-slate-100 text-xs font-bold leading-tight">{n.label}</p>
                <p className="text-slate-500 text-[10px] truncate leading-tight mt-0.5">{n.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Templates */}
      <div>
        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.15em] mb-4">Presets</p>
        <div className="flex flex-col gap-2">
          {WORKFLOW_TEMPLATES.map((tpl, i) => {
            const TplIcon = TEMPLATE_ICONS[tpl.icon] || Play;
            return (
              <button
                key={tpl.name}
                onClick={() => handleLoadTemplate(i)}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-indigo-500/50 hover:bg-slate-800 transition-all text-left w-full group active:scale-[0.98]"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-500/10 transition-transform group-hover:translate-x-0.5">
                  <TplIcon size={15} className="text-indigo-400" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-slate-100 text-xs font-bold truncate leading-tight">{tpl.name}</p>
                  <p className="text-slate-500 text-[10px] truncate mt-0.5">{tpl.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto space-y-2 border-t border-slate-800 pt-6">
        <button
          onClick={handleAutoLayout}
          className="w-full flex items-center justify-center gap-2 text-xs py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-50 font-bold transition-all border border-slate-700 active:scale-95"
        >
          <Layout size={14} /> Refine Layout
        </button>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExport}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 transition-all active:scale-95 group"
            title="Export Workflow"
          >
            <Download size={16} className="text-slate-400 group-hover:text-amber-400 transition-colors" />
            <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200">Export</span>
          </button>
          
          <label className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 transition-all cursor-pointer active:scale-95 group shadow-sm">
            <Upload size={16} className="text-slate-400 group-hover:text-emerald-400 transition-colors" />
            <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200">Import</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>

        <button
          onClick={clearWorkflow}
          className="w-full flex items-center justify-center gap-2 text-[11px] py-3 px-4 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 font-bold transition-all border border-rose-500/20 active:scale-95 tracking-wide"
        >
          <Trash2 size={13} /> Reset Canvas
        </button>
      </div>

      {/* Keyboard shortcuts */}
      <div className="border-t border-slate-800 pt-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Engine Status</p>
          <div className="flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] text-slate-400 font-bold font-mono uppercase tracking-tighter">Ready</span>
          </div>
        </div>
        <div className="space-y-1.5 bg-black/20 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center text-[10px] text-slate-500">
            <span>Undo Task</span>
            <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-mono shadow-sm border border-slate-700 uppercase">Ctrl+Z</kbd>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500">
            <span>Redo Task</span>
            <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-mono shadow-sm border border-slate-700 uppercase">Ctrl+Y</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}

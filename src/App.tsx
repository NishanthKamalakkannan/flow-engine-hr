import { useState } from "react";
import Canvas from "./components/Canvas";
import Sidebar from "./components/sidebar/Sidebar";
import NodeEditPanel from "./components/forms/NodeEditPanel";
import SandboxPanel from "./components/sandbox/SandboxPanel";
import { useWorkflowStore } from "./store/workflowStore";
import { useUndoRedo } from "./hooks/useUndoRedo";
import { Play, Undo2, Redo2, Cpu } from "lucide-react";

export default function App() {
  const selectedNodeId = useWorkflowStore((s: any) => s.selectedNodeId);
  const [showSandbox, setShowSandbox] = useState(false);
  const { undo, redo, record, canUndo, canRedo } = useUndoRedo();

  // Record snapshot on significant interactions
  const handleCanvasClick = () => {
    record();
  };

  return (
    <div className="flex h-screen w-screen bg-[#080C14] text-[#F9FAFB] overflow-hidden font-sans selection:bg-purple-500/30">
      {/* Header bar - NASA Mission Control Style */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-[#0D1420]/80 backdrop-blur-xl border-b border-[#1F2937] flex items-center px-6 z-20 gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#7C3AED] to-[#A855F7] rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/40 transition-transform hover:scale-110 active:scale-95 border border-purple-400/20">
            <Cpu size={20} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[#F9FAFB] font-black text-sm tracking-tight leading-none">FlowEngine.HR</span>
            <span className="text-[#A855F7] text-[9px] font-black uppercase tracking-[0.2em] mt-1.5 font-mono">Mission Control Suite</span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-[#080C14]/50 p-1 rounded-xl border border-[#1F2937]">
            <button
              onClick={() => { record(); setTimeout(undo, 10); }}
              disabled={!canUndo}
              className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#7C3AED] hover:bg-[#1F2937] disabled:opacity-10 disabled:cursor-not-allowed transition-all"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={16} />
            </button>
            <button
              onClick={() => { record(); setTimeout(redo, 10); }}
              disabled={!canRedo}
              className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#7C3AED] hover:bg-[#1F2937] disabled:opacity-10 disabled:cursor-not-allowed transition-all"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={16} />
            </button>
          </div>

          <div className="w-px h-6 bg-[#1F2937] mx-1" />

          {/* Simulate button - Electric Purple */}
          <button
            onClick={() => setShowSandbox(true)}
            className="group flex items-center gap-2.5 px-6 py-2.5 bg-[#7C3AED] hover:bg-[#A855F7] text-white text-[13px] font-black rounded-xl transition-all shadow-xl shadow-purple-900/30 active:scale-95 border border-purple-400/30 uppercase tracking-widest"
          >
            <Play size={14} className="fill-current group-hover:scale-110 transition-transform" /> 
            <span>Initiate Sequence</span>
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex w-full h-full pt-14 relative">
        <Sidebar />
        <div className="flex-1 h-full z-0" onMouseUp={handleCanvasClick}>
          <Canvas />
        </div>
        {!showSandbox && selectedNodeId && <NodeEditPanel />}
      </div>

      {/* Trace Engine Drawer */}
      {showSandbox && <SandboxPanel onClose={() => setShowSandbox(false)} />}
    </div>
  );
}

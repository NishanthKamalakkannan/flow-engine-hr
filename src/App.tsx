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
    <div className="flex h-screen w-screen bg-[#FFF5F7] text-[#4A0E1C] overflow-hidden font-sans selection:bg-pink-500/20">
      {/* Header bar - Glassmorphism Light */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-white/70 backdrop-blur-md border-b border-pink-100 flex items-center px-6 z-10 gap-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#FF4D6D] rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/20 transition-transform hover:scale-105 active:scale-95">
            <Cpu size={18} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[#4A0E1C] font-bold text-sm tracking-tight leading-none">FlowEngine.HR</span>
            <span className="text-pink-600/70 text-[10px] font-bold uppercase tracking-widest mt-0.5 font-mono">Elite Rose Suite</span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-1 bg-pink-50/50 p-1 rounded-lg border border-pink-100">
            <button
              onClick={() => { record(); setTimeout(undo, 10); }}
              disabled={!canUndo}
              className="p-1.5 rounded-md text-pink-300 hover:text-pink-600 hover:bg-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={15} />
            </button>
            <button
              onClick={() => { record(); setTimeout(redo, 10); }}
              disabled={!canRedo}
              className="p-1.5 rounded-md text-pink-300 hover:text-pink-600 hover:bg-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={15} />
            </button>
          </div>

          <div className="w-px h-6 bg-pink-100 mx-1" />

          {/* Simulate button - Rose Premium */}
          <button
            onClick={() => setShowSandbox(true)}
            className="group flex items-center gap-2.5 px-6 py-2 bg-[#FF4D6D] hover:bg-[#FF758F] text-white text-[13px] font-bold rounded-xl transition-all shadow-lg shadow-pink-600/20 active:scale-95 border border-[#C9184A]/10"
          >
            <Play size={14} className="group-hover:fill-current transition-all" /> 
            <span>Initiate Sequence</span>
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex w-full h-full pt-14">
        <Sidebar />
        <div className="flex-1 h-full" onMouseUp={handleCanvasClick}>
          <Canvas />
        </div>
        {!showSandbox && selectedNodeId && <NodeEditPanel />}
      </div>

      {/* Trace Engine Drawer */}
      {showSandbox && <SandboxPanel onClose={() => setShowSandbox(false)} />}
    </div>
  );
}

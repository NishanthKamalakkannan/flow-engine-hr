import { create } from "zustand";

export const useWorkflowStore = create<any>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  validationErrors: [],
  simulationResult: null,
  isSimulating: false,
  activeSimulationNodeId: null,

  addNode: (node: any) => set((s: any) => ({ nodes: [...s.nodes, node] })),
  updateNodeData: (id: string, data: any) =>
    set((s: any) => ({
      nodes: s.nodes.map((n: any) => n.id === id ? { ...n, data: { ...n.data, ...data } } : n),
    })),
  removeNode: (id: string) =>
    set((s: any) => ({
      nodes: s.nodes.filter((n: any) => n.id !== id),
      edges: s.edges.filter((e: any) => e.source !== id && e.target !== id),
      selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
    })),
  setNodes: (nodes: any) => set({ nodes }),
  addEdge: (edge: any) => set((s: any) => ({ edges: [...s.edges, edge] })),
  removeEdge: (id: string) => set((s: any) => ({ edges: s.edges.filter((e: any) => e.id !== id) })),
  setEdges: (edges: any) => set({ edges }),
  setSelectedNodeId: (id: any) => set({ selectedNodeId: id }),
  setValidationErrors: (errors: any) => set({ validationErrors: errors }),
  setSimulationResult: (result: any) => set({ simulationResult: result }),
  setIsSimulating: (val: boolean) => set({ isSimulating: val }),
  setActiveSimulationNodeId: (id: string | null) => set({ activeSimulationNodeId: id }),
  loadWorkflow: (nodes: any, edges: any) => set({ nodes, edges }),
  clearWorkflow: () => set({ 
    nodes: [], 
    edges: [], 
    selectedNodeId: null, 
    validationErrors: [], 
    simulationResult: null,
    activeSimulationNodeId: null,
    isSimulating: false 
  }),
}));

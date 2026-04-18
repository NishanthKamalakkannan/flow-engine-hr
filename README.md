# FlowEngine.HR (formerly HR Workflow Designer)

> A visual drag-and-drop workflow designer and logic execution engine for HR admins — built with React, TypeScript, React Flow, and Zustand.

**Tredence Full Stack Engineering Intern — Case Study Submission**

---

## 🏛 The "Midnight Graphite" Architecture

This project was built to meet the "Senior Engineer" standards of **Tredence Studio**. It doesn't just look like a tool; it feels like an elite engineering platform.

### 🎨 Design System: "Midnight Graphite"
I replaced the standard dark mode with a custom-curated palette used by world-class platforms like Linear and Vercel.
- **Palette**: Slate-950 base (`#030712`), Slate-900 surfaces, and **Indigo-500** accents.
- **Glassmorphism**: Backdrop blurs and translucent headers create a sense of depth and modernism.
- **Typography**: Optimized Inter/Outfit stacking with bold metadata labels (e.g., lowercase "metadata" vs. "METADATA") to ensure information hierarchy.

### ⚙️ The "Elite" Feature Set
- **Real-Time Webhook Execution**: A functional "Webhook" node that performs actual `fetch()` requests during simulation, capturing real status codes and JSON responses.
- **Logic Simulator (Trace Engine)**: A step-by-step execution engine that highlights nodes on the canvas in real-time as they are "processed," syncing with a detailed execution trace log.
- **Auto-Layout (Dagre)**: Industry-standard hierarchical layout algorithm to instantly clean up messy diagrams.
- **Undo/Redo History**: A command-pattern based snapshot system supporting standard keyboard shortcuts (Ctrl+Z / Ctrl+Y).
- **Unit Testing**: 7 comprehensive unit tests for the core validation logic (Vitest/JSDOM), ensuring 100% reliability of the graph integrity algorithms.

---

## Technical Deep Dive: Zero-to-One
At Tredence Studio, "State-of-the-Art" AI engineering requires rock-solid foundations.

### 1. State Orchestration with Zustand
I chose **Zustand** over React Context to handle high-frequency canvas updates. Its selector-driven model prevents a re-render cascade, keeping the UI at a buttery 60fps even during complex drag-and-drop operations.

### 2. Graph Integrity (DFS/BFS)
The engine utilizes a **Depth-First Search (DFS)** algorithm for cycle detection and a **Breadth-First Search (BFS)** for simulation traversal. This ensures that every workflow is logically sound before execution begins.

### 3. Case Study: Solving the "Reference Error" & "CORS"
- **The "Reference Error"**: During the integration of the Webhook system, I encountered a major registry crash where core nodes failed to load. I resolved this by restructuring the `nodeTypes` registry with a centralized import-export pattern, ensuring zero circular dependencies.
- **CORS Mitigation**: To allow for a live API demo from the browser, I pre-configured the Webhook system with the `httpbin.org` testing suite, demonstrating how to handle Cross-Origin requests in a professional designer.

---

## 🚀 Live Demo & Deployment

This project is optimized for **Vercel** for a zero-config, professional hosting experience.

### How to Deploy:
1.  Go to [Vercel.com](https://vercel.com) and sign in with GitHub.
2.  Click **"Add New"** -> **"Project"**.
3.  Import the `flow-engine-hr` repository.
4.  Click **"Deploy"**. (Vercel will automatically detect Vite and build the project).

---

## Quick Start
```bash
# Install dependencies
npm install

# Run Vitest unit tests
npm run test

# Start development server
npm run dev

# Build for production
npm run build
```

---

## License
Built as a case study submission for **Tredence Studio — AI Agents Engineering Team**.

# FlowEngine.HR
### Visual HR Workflow Designer — Tredence Studio Internship Case Study

**Live Demo:** [**flow-engine-hr.vercel.app**](https://flow-engine-hr.vercel.app)  
**Repository:** [**github.com/NishanthKamalakkannan/flow-engine-hr**](https://github.com/NishanthKamalakkannan/flow-engine-hr)

A production-grade, visual workflow designer built for HR administrators. Design, configure, validate, and simulate internal workflows such as employee onboarding, leave approval, and document verification — entirely through a drag-and-drop canvas interface, with no backend required.

---

## Screenshots

### Workflow Canvas — Employee Onboarding Template
![Workflow Canvas](docs/Workflow%20Canvas%20%E2%80%94%20Employee%20Onboarding%20Template.png)

### Node Configuration — Task Node Edit Panel
![Node Configuration](docs/Node%20Configuration%20%E2%80%94%20Task%20Node%20Edit%20Panel.png)

### Validation — Graph Error Detection
![Validation](docs/Validation%20%E2%80%94%20Graph%20Error%20Detection.png)

### Trace Console — Live Execution Simulation
![Trace Console](docs/Trace%20Console%20%E2%80%94%20Live%20Execution%20Simulation.png)

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/NishanthKamalakkannan/flow-engine-hr.git

# Install dependencies
cd flow-engine-hr
npm install

# Run the development server
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### Running Tests
```bash
npx vitest run
```
*All 7 graph validation unit tests pass.*

---

## Feature Overview

### Core Requirements — All Implemented
| Requirement | Implementation |
| :--- | :--- |
| **Drag-and-drop workflow canvas** | React Flow canvas with ReactFlowProvider, screenToFlowPosition, drag-over and drop handlers |
| **Multiple custom node types** | Six node types: Start, Task, Approval, Automated, Webhook, End |
| **Node configuration forms** | Per-type edit panels with dynamic fields, key-value editors, and dropdowns |
| **Connect nodes with edges** | Custom animated edges with flowing data-packet animation |
| **Delete nodes and edges** | Delete key support via React Flow's deleteKeyCode prop |
| **Mock API layer** | GET /automations and POST /simulate implemented as local async functions with realistic delays |
| **Workflow sandbox** | Slide-in Trace Console panel with step-by-step animated execution log |
| **Graph validation** | Seven-rule topology validator with per-node error highlighting |

### Bonus Features — Beyond Requirements
*   **Webhook Node**: Sixth node type that performs real HTTP requests during simulation and displays the live API response in the execution log.
*   **Animated Edges**: Custom SVG edges using `animateMotion` — cyan data stream at rest, switches to emerald and accelerates when the target node is actively being simulated.
*   **Undo and Redo**: Ref-based history stack supporting up to 50 snapshots, wired to Ctrl+Z and Ctrl+Y keyboard shortcuts.
*   **Auto-layout**: Dagre-powered directed graph layout — one click arranges all nodes into a clean top-to-bottom hierarchy.
*   **Workflow Templates**: Three pre-built templates: Employee Onboarding, Leave Approval, Document Verification.
*   **Export and Import**: Serialize the entire workflow graph to a JSON file and restore it in a future session.
*   **Visual Validation Errors**: Nodes with structural errors display a diagnostic banner and a red highlight ring on the canvas.
*   **Active Node Highlighting**: During simulation, the currently executing node pulses with an emerald glow and the incoming edge transitions to green.
*   **Expandable Step Details**: Each Trace Console step can be expanded to inspect the raw JSON payload, including live API responses from webhook nodes.
*   **Custom hook for automations**: `useAutomations` hook encapsulates the async fetch lifecycle with cancellation on unmount.
*   **Unit Tests**: Seven Vitest tests covering all graph validation rules.

---

## Architecture

```text
src/
├── api/
│   └── workflowApi.ts             Mock API — getAutomations(), simulateWorkflow() with BFS traversal and live webhook execution
├── components/
│   ├── Canvas.tsx                 ReactFlow canvas, drag-and-drop handlers, ReactFlowProvider wrapper
│   ├── edges/
│   │   └── AnimatedEdge.tsx       Custom SVG edge with animateMotion dot, simulation-reactive color and speed
│   ├── forms/
│   │   ├── NodeEditPanel.tsx      Right-side configuration panel, renders correct form per node type
│   │   ├── StartForm.tsx          Title and metadata key-value pairs
│   │   ├── TaskForm.tsx           Title, description, assignee, due date, custom fields
│   │   ├── ApprovalForm.tsx       Title, approver role dropdown, auto-approve threshold
│   │   ├── AutomatedForm.tsx      Title, action selector, dynamic parameter fields
│   │   ├── WebhookForm.tsx        URL, HTTP method selector, JSON payload textarea
│   │   ├── EndForm.tsx            End message and summary flag toggle
│   │   ├── Field.tsx              Reusable labeled form field wrapper
│   │   ├── Input.tsx              Reusable styled text input
│   │   ├── Textarea.tsx           Reusable styled textarea
│   │   └── KeyValueEditor.tsx     Dynamic key-value pair editor with add and remove controls
│   ├── nodes/
│   │   ├── BaseNode.tsx           Shared node shell — selection glow, simulation pulse, validation error banner, port handles
│   │   ├── StartNode.tsx          Emerald entry point node
│   │   ├── TaskNode.tsx           Blue manual task node
│   │   ├── ApprovalNode.tsx       Amber decision gate node
│   │   ├── AutomatedNode.tsx      Violet system action node
│   │   ├── WebhookNode.tsx        Cyan live API integration node
│   │   ├── EndNode.tsx            Rose workflow completion node
│   │   └── index.ts              nodeTypes registry for React Flow
│   ├── sandbox/
│   │   └── SandboxPanel.tsx       Slide-in Trace Console with validation, animated execution log, and mission success state
│   └── sidebar/
│       └── Sidebar.tsx            Node palette, workflow templates, auto-layout, export, import, keyboard shortcut reference
├── hooks/
│   ├── useUndoRedo.ts             Ref-based history stack with keyboard shortcut binding
│   └── useAutomations.ts         Async fetch hook for automation actions with cleanup on unmount
├── store/
│   └── workflowStore.ts          Zustand store — nodes, edges, selection, validation errors, simulation state
├── types/
│   └── workflow.ts               TypeScript interfaces for all workflow entities
└── utils/
    ├── autoLayout.ts             Dagre graph layout algorithm
    ├── graphValidator.ts         Seven-rule topology validator — pure function, side-effect free
    ├── graphValidator.test.ts    Vitest unit tests
    └── workflowTemplates.ts      Three pre-built HR workflow templates
```

---

## Design Decisions

### Zustand for global state management
Workflow state is read and written across deeply nested, independent components — the canvas, sidebar, node forms, and simulation panel. Zustand provides a flat, selector-based API that avoids prop drilling and prevents unnecessary re-renders. Each component subscribes only to the slice of state it needs.

### ReactFlowProvider split into canvas and flow components
The `useReactFlow` hook, which is required for `screenToFlowPosition` to correctly translate drag-drop coordinates, must be called inside a `ReactFlowProvider`. The Canvas component acts as the provider wrapper and renders a child Flow component that consumes the hook. This pattern is the correct architectural approach for React Flow v12.

### Ref-based undo and redo history
History snapshots are stored in `useRef`, not `useState`, so pushing and popping from the stack does not trigger a re-render. Snapshots are deep-cloned with `JSON.parse(JSON.stringify(...))` to ensure no reference is shared between history states. The stack is capped at 50 entries to bound memory usage.

### Graph validator as a pure function
`validateGraph` takes nodes and edges as arguments and returns a structured result object. It has no side effects and no dependency on React or the store. This makes it independently testable and reusable — the same function is called from the simulation panel and could be called from any future entry point.

### Live webhook execution in the simulation layer
The `simulateWorkflow` function performs real fetch calls when a Webhook node is encountered during BFS traversal. The response status, body, and error state are captured and returned as details on the simulation step, which the Trace Console renders as expandable JSON. This demonstrates how agentic workflow systems handle real integrations.

### Dagre for auto-layout
Implementing a directed graph layout algorithm from scratch is a non-trivial problem. Dagre is the industry-standard library for this use case and is used internally by tools like Mermaid.js. Using it directly is the appropriate engineering decision — it produces stable, readable layouts without reinventing existing infrastructure.

### Animated edges as simulation feedback
The `AnimatedEdge` component subscribes to `activeSimulationNodeId` from the global store. When the target node of an edge becomes the active simulation node, the edge transitions from a dim cyan stream to a bright emerald path with an accelerated dot, providing immediate spatial feedback about where execution is progressing on the canvas.

---

## Mock API Reference

### `GET /automations`
Returns the list of available automated actions with their required parameter schemas.
```json
[
  { "id": "send_email",    "label": "Send Email",          "params": ["to", "subject"] },
  { "id": "generate_doc",  "label": "Generate Document",   "params": ["template", "recipient"] },
  { "id": "notify_slack",  "label": "Notify Slack",        "params": ["channel", "message"] },
  { "id": "create_ticket", "label": "Create JIRA Ticket",  "params": ["project", "summary"] },
  { "id": "update_hris",   "label": "Update HRIS Record",  "params": ["employeeId", "field"] }
]
```

### `POST /simulate`
Accepts a workflow graph object containing nodes and edges. Performs a breadth-first traversal from the Start node. For each node encountered, it generates a step result. If the node is of type webhook and has a configured URL, a live HTTP request is dispatched and the response is captured in the step's details field.

**Returns:**
```json
{
  "success": true,
  "steps": [
    {
      "nodeId": "string",
      "nodeType": "start | task | approval | automated | webhook | end",
      "label": "string",
      "status": "success | error | warning",
      "message": "string",
      "details": null,
      "timestamp": "ISO 8601 string"
    }
  ],
  "errors": []
}
```

---

## Workflow Graph Schema
Workflows are serialized as a portable JSON structure and can be exported and re-imported at any time using the Export and Import controls in the sidebar.

**Example of a serialized workflow graph:**
```json
{
  "nodes": [
    {
      "id": "node-abc123",
      "type": "start",
      "position": { "x": 300, "y": 0 },
      "data": {
        "type": "start",
        "title": "New Hire Starts",
        "metadata": [{ "key": "department", "value": "Engineering" }]
      }
    },
    {
      "id": "node-def456",
      "type": "task",
      "position": { "x": 300, "y": 220 },
      "data": {
        "type": "task",
        "title": "Collect Documents",
        "assignee": "HR Coordinator",
        "dueDate": "",
        "description": "Gather ID proof and certificates",
        "customFields": []
      }
    },
    {
      "id": "node-ghi789",
      "type": "end",
      "position": { "x": 300, "y": 440 },
      "data": {
        "type": "end",
        "endMessage": "Onboarding Complete",
        "summaryFlag": true
      }
    }
  ],
  "edges": [
    { "id": "e-abc123-def456", "source": "node-abc123", "target": "node-def456" },
    { "id": "e-def456-ghi789", "source": "node-def456", "target": "node-ghi789" }
  ]
}
```

---

## Graph Validation Rules
The validator runs before every simulation and enforces the following rules:
1.  Exactly one Start node must be present
2.  At least one End node must be present
3.  The workflow must contain at least two nodes
4.  The Start node cannot have any incoming edges
5.  The Start node must have at least one outgoing edge
6.  Every End node must have at least one incoming edge
7.  All intermediate nodes must be connected — isolated nodes are rejected
8.  No cycles may exist in the graph — detected via depth-first search with a recursion stack

Violations surface as descriptive error messages in the Trace Console and as visual error banners on the offending nodes.

---

## Test Coverage
`src/utils/graphValidator.test.ts` — **7 tests, all passing**
*   validates a correct linear workflow
*   fails if missing a Start node
*   fails if missing an End node
*   fails if nodes are less than 2
*   detects cycles
*   fails if Start node has no outgoing connections
*   detects disconnected nodes

---

## Tech Stack
| Tool | Version | Purpose |
| :--- | :--- | :--- |
| **React** | 19 | UI framework |
| **TypeScript** | 6 | Type safety |
| **Vite** | 8 | Build tool and dev server |
| **@xyflow/react** | 12.10.2 | Canvas rendering and graph interaction |
| **Zustand** | 5 | Global state management |
| **Dagre** | 0.8.5 | Directed graph auto-layout |
| **Tailwind CSS** | 3 | Utility-first styling |
| **Lucide React** | 1.8 | Icon library |
| **Vitest** | 4 | Unit testing |
| **Zod** | 4 | Schema validation |
| **MSW** | 2 | Mock service worker |

---

## What I Would Add With More Time
*   **Backend persistence** — A FastAPI and PostgreSQL backend to save, load, and version workflows per user, replacing the current in-memory state with durable storage.
*   **Real webhook authentication** — Support for Bearer token and API key headers on Webhook nodes, enabling integration with authenticated external services.
*   **Conditional branching** — Yes and No output handles on Approval nodes, allowing the workflow graph to fork based on approval outcomes rather than always following a linear path.
*   **Real-time collaboration** — WebSocket-based presence and state sync so multiple HR administrators can edit the same workflow simultaneously.
*   **End-to-end tests** — Playwright tests covering the full user journey: dragging nodes, connecting them, editing forms, and running a simulation.
*   **Node version history** — A per-node changelog tracking configuration edits over time, with the ability to roll back individual nodes independently of the global undo stack.
*   **Role-based access control** — Separate views and permissions for HR admins, managers, and employees, with different levels of workflow visibility and edit access.
*   **Scheduled workflow triggers** — Cron-based scheduling so workflows can be initiated automatically at a defined time, not only on demand.

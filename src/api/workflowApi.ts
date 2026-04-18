const MOCK_AUTOMATIONS = [
  { id: "send_email", label: "Send Email", params: ["to", "subject"] },
  { id: "generate_doc", label: "Generate Document", params: ["template", "recipient"] },
  { id: "notify_slack", label: "Notify Slack", params: ["channel", "message"] },
  { id: "create_ticket", label: "Create JIRA Ticket", params: ["project", "summary"] },
  { id: "update_hris", label: "Update HRIS Record", params: ["employeeId", "field"] },
];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function getAutomations() {
  await delay(300);
  return MOCK_AUTOMATIONS;
}

export async function simulateWorkflow(graph: any) {
  // Base delay for simulation initiation
  await delay(800);
  const steps: any[] = [];
  const errors: string[] = [];

  const nodeMap = new Map(graph.nodes.map((n: any) => [n.id, n]));
  const edgeMap = new Map<string, string[]>();

  for (const edge of graph.edges) {
    if (!edgeMap.has(edge.source)) edgeMap.set(edge.source, []);
    edgeMap.get(edge.source)!.push(edge.target);
  }

  const startNode = graph.nodes.find((n: any) => n.type === "start");
  if (!startNode) return { success: false, steps: [], errors: ["No Start node found."] };

  const visited = new Set<string>();
  const queue = [startNode.id];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (visited.has(currentId)) {
      errors.push("Cycle detected at node " + currentId);
      break;
    }
    visited.add(currentId);
    const node = nodeMap.get(currentId) as any;
    if (!node) continue;

    const label = node.data?.title || node.data?.endMessage || node.type;
    
    // Default mock response
    let status = "success";
    let message = getStepMessage(node.type);
    let details: any = null;

    // --- LIVE INTEGRATION INJECTION ---
    if (node.type === "webhook" && node.data?.url) {
      try {
        const method = node.data.method || "POST";
        const hasBody = ["POST", "PUT", "PATCH"].includes(method);
        
        const response = await fetch(node.data.url, {
          method,
          headers: hasBody ? { "Content-Type": "application/json" } : {},
          body: hasBody && node.data.payload ? node.data.payload : undefined,
        });

        const isOk = response.ok;
        status = isOk ? "success" : "error";
        
        // Try to parse JSON for extra elite polish
        let responseData;
        try { responseData = await response.json(); } catch { responseData = await response.text(); }

        message = `External API responded with ${response.status} ${response.statusText}`;
        details = {
          status: response.status,
          statusText: response.statusText,
          data: responseData
        };
      } catch (err: any) {
        status = "error";
        message = `API Request Failed: ${err.message}`;
        details = { error: err.message };
      }
    }
    // ----------------------------------

    steps.push({
      nodeId: node.id,
      nodeType: node.type,
      label,
      status,
      message,
      details,
      timestamp: new Date().toISOString(),
    });

    const next = edgeMap.get(currentId) || [];
    queue.push(...next);
  }

  return { success: errors.length === 0, steps, errors };
}

function getStepMessage(type: string) {
  switch (type) {
    case "start": return "Workflow initiated successfully.";
    case "task": return "Task assigned and pending completion.";
    case "approval": return "Approval request sent to approver.";
    case "automated": return "Automated action triggered successfully.";
    case "end": return "Workflow completed.";
    default: return "Step executed.";
  }
}

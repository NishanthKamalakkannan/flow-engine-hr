/**
 * Pre-built workflow templates that demonstrate product thinking.
 * Each template is a complete workflow with nodes and edges.
 */

function makeId(prefix: string, i: number) {
  return `tpl-${prefix}-${i}`;
}

export interface WorkflowTemplate {
  name: string;
  description: string;
  icon: string;
  nodes: any[];
  edges: any[];
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    name: "Employee Onboarding",
    description: "Standard new hire onboarding flow",
    icon: "UserPlus",
    nodes: [
      { id: makeId("onb", 0), type: "start", position: { x: 300, y: 0 }, data: { type: "start", title: "New Hire Starts", metadata: [{ key: "department", value: "" }] } },
      { id: makeId("onb", 1), type: "task", position: { x: 300, y: 120 }, data: { type: "task", title: "Collect Documents", description: "Gather ID proof, address proof, and educational certificates", assignee: "HR Coordinator", dueDate: "", customFields: [] } },
      { id: makeId("onb", 2), type: "automated", position: { x: 300, y: 240 }, data: { type: "automated", title: "Send Welcome Email", actionId: "send_email", actionParams: { to: "new_hire", subject: "Welcome aboard!" } } },
      { id: makeId("onb", 3), type: "task", position: { x: 300, y: 360 }, data: { type: "task", title: "IT Setup", description: "Provision laptop, email, and access credentials", assignee: "IT Admin", dueDate: "", customFields: [] } },
      { id: makeId("onb", 4), type: "approval", position: { x: 300, y: 480 }, data: { type: "approval", title: "Manager Approval", approverRole: "Manager", autoApproveThreshold: 0 } },
      { id: makeId("onb", 5), type: "end", position: { x: 300, y: 600 }, data: { type: "end", endMessage: "Onboarding Complete", summaryFlag: true } },
    ],
    edges: [
      { id: "e-onb-0-1", source: makeId("onb", 0), target: makeId("onb", 1) },
      { id: "e-onb-1-2", source: makeId("onb", 1), target: makeId("onb", 2) },
      { id: "e-onb-2-3", source: makeId("onb", 2), target: makeId("onb", 3) },
      { id: "e-onb-3-4", source: makeId("onb", 3), target: makeId("onb", 4) },
      { id: "e-onb-4-5", source: makeId("onb", 4), target: makeId("onb", 5) },
    ],
  },
  {
    name: "Leave Approval",
    description: "Employee leave request and approval flow",
    icon: "CalendarOff",
    nodes: [
      { id: makeId("lv", 0), type: "start", position: { x: 300, y: 0 }, data: { type: "start", title: "Leave Request Submitted", metadata: [] } },
      { id: makeId("lv", 1), type: "approval", position: { x: 300, y: 120 }, data: { type: "approval", title: "Manager Review", approverRole: "Manager", autoApproveThreshold: 2 } },
      { id: makeId("lv", 2), type: "approval", position: { x: 300, y: 240 }, data: { type: "approval", title: "HR Review", approverRole: "HRBP", autoApproveThreshold: 0 } },
      { id: makeId("lv", 3), type: "automated", position: { x: 300, y: 360 }, data: { type: "automated", title: "Update HRIS", actionId: "update_hris", actionParams: { employeeId: "", field: "leave_balance" } } },
      { id: makeId("lv", 4), type: "automated", position: { x: 300, y: 480 }, data: { type: "automated", title: "Notify Team", actionId: "notify_slack", actionParams: { channel: "#team", message: "Leave approved" } } },
      { id: makeId("lv", 5), type: "end", position: { x: 300, y: 600 }, data: { type: "end", endMessage: "Leave Processed", summaryFlag: true } },
    ],
    edges: [
      { id: "e-lv-0-1", source: makeId("lv", 0), target: makeId("lv", 1) },
      { id: "e-lv-1-2", source: makeId("lv", 1), target: makeId("lv", 2) },
      { id: "e-lv-2-3", source: makeId("lv", 2), target: makeId("lv", 3) },
      { id: "e-lv-3-4", source: makeId("lv", 3), target: makeId("lv", 4) },
      { id: "e-lv-4-5", source: makeId("lv", 4), target: makeId("lv", 5) },
    ],
  },
  {
    name: "Document Verification",
    description: "Verify employee-submitted documents",
    icon: "FileCheck",
    nodes: [
      { id: makeId("doc", 0), type: "start", position: { x: 300, y: 0 }, data: { type: "start", title: "Documents Received", metadata: [{ key: "doc_type", value: "" }] } },
      { id: makeId("doc", 1), type: "automated", position: { x: 300, y: 120 }, data: { type: "automated", title: "Generate Checklist", actionId: "generate_doc", actionParams: { template: "verification_checklist", recipient: "hr_team" } } },
      { id: makeId("doc", 2), type: "task", position: { x: 300, y: 240 }, data: { type: "task", title: "Manual Verification", description: "Cross-verify submitted documents against database", assignee: "HR Verifier", dueDate: "", customFields: [] } },
      { id: makeId("doc", 3), type: "approval", position: { x: 300, y: 360 }, data: { type: "approval", title: "Final Sign-off", approverRole: "Director", autoApproveThreshold: 0 } },
      { id: makeId("doc", 4), type: "automated", position: { x: 300, y: 480 }, data: { type: "automated", title: "Create JIRA Ticket", actionId: "create_ticket", actionParams: { project: "HR", summary: "Docs verified" } } },
      { id: makeId("doc", 5), type: "end", position: { x: 300, y: 600 }, data: { type: "end", endMessage: "Verification Complete", summaryFlag: false } },
    ],
    edges: [
      { id: "e-doc-0-1", source: makeId("doc", 0), target: makeId("doc", 1) },
      { id: "e-doc-1-2", source: makeId("doc", 1), target: makeId("doc", 2) },
      { id: "e-doc-2-3", source: makeId("doc", 2), target: makeId("doc", 3) },
      { id: "e-doc-3-4", source: makeId("doc", 3), target: makeId("doc", 4) },
      { id: "e-doc-4-5", source: makeId("doc", 4), target: makeId("doc", 5) },
    ],
  },
];

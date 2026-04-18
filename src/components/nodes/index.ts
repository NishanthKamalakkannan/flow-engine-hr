import StartNode from "./StartNode";
import TaskNode from "./TaskNode";
import ApprovalNode from "./ApprovalNode";
import AutomatedNode from "./AutomatedNode";
import WebhookNode from "./WebhookNode";
import EndNode from "./EndNode";

export const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  webhook: WebhookNode,
  end: EndNode,
};

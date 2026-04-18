import { useState } from "react";
import { useWorkflowStore } from "../../store/workflowStore";
import { z } from "zod";
import Field from "./Field";
import Input from "./Input";
import Textarea from "./Textarea";
import KeyValueEditor from "./KeyValueEditor";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  assignee: z.string().optional(),
  dueDate: z.string().optional(),
});

export default function TaskForm({ node }: { node: any }) {
  const { updateNodeData } = useWorkflowStore();
  const d = node.data;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (field: string, value: string) => {
    const partial = { ...d, [field]: value };
    const result = taskSchema.safeParse(partial);
    if (!result.success) {
      const fieldError = result.error.issues.find((iss) => iss.path[0] === field);
      setErrors((prev) => ({
        ...prev,
        [field]: fieldError ? fieldError.message : "",
      }));
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    updateNodeData(node.id, { [field]: value });
    validate(field, value);
  };

  return (
    <div>
      <Field label="Title" required>
        <Input
          value={d.title}
          onChange={(e) => handleChange("title", e.target.value)}
          onBlur={() => validate("title", d.title)}
          placeholder="Task title"
        />
        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
      </Field>
      <Field label="Description">
        <Textarea
          value={d.description}
          onChange={(e) => updateNodeData(node.id, { description: e.target.value })}
          placeholder="Describe the task..."
        />
      </Field>
      <Field label="Assignee">
        <Input
          value={d.assignee}
          onChange={(e) => handleChange("assignee", e.target.value)}
          placeholder="e.g. John Doe"
        />
      </Field>
      <Field label="Due Date">
        <Input
          type="date"
          value={d.dueDate}
          onChange={(e) => handleChange("dueDate", e.target.value)}
        />
      </Field>
      <Field label="Custom Fields">
        <KeyValueEditor
          pairs={d.customFields || []}
          onChange={(pairs) => updateNodeData(node.id, { customFields: pairs })}
        />
      </Field>
    </div>
  );
}

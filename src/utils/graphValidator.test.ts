import { describe, it, expect } from 'vitest';
import { validateGraph } from './graphValidator';

describe('graphValidator', () => {
  const startNode = { id: 'start', type: 'start', data: { title: 'Start' } };
  const taskNode = { id: 'task', type: 'task', data: { title: 'Task' } };
  const endNode = { id: 'end', type: 'end', data: { endMessage: 'End' } };

  it('validates a correct linear workflow', () => {
    const nodes = [startNode, taskNode, endNode];
    const edges = [
      { source: 'start', target: 'task' },
      { source: 'task', target: 'end' },
    ];
    const result = validateGraph(nodes, edges);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('fails if missing a Start node', () => {
    const nodes = [taskNode, endNode];
    const edges = [{ source: 'task', target: 'end' }];
    const result = validateGraph(nodes, edges);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing a Start node.');
  });

  it('fails if missing an End node', () => {
    const nodes = [startNode, taskNode];
    const edges = [{ source: 'start', target: 'task' }];
    const result = validateGraph(nodes, edges);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing an End node.');
  });

  it('fails if nodes are less than 2', () => {
    const nodes = [startNode];
    const edges: any[] = [];
    const result = validateGraph(nodes, edges);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Workflow needs at least 2 nodes.');
  });

  it('detects cycles', () => {
    const nodes = [startNode, taskNode, endNode];
    const edges = [
      { source: 'start', target: 'task' },
      { source: 'task', target: 'start' }, // Cycle
      { source: 'task', target: 'end' },
    ];
    const result = validateGraph(nodes, edges);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Cycle detected in the workflow graph.');
  });

  it('fails if Start node has no outgoing connections', () => {
    const nodes = [startNode, taskNode, endNode];
    const edges = [{ source: 'task', target: 'end' }];
    const result = validateGraph(nodes, edges);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Start node has no outgoing connections.');
  });

  it('detects disconnected nodes', () => {
    const nodes = [startNode, taskNode, endNode];
    const edges = [{ source: 'start', target: 'end' }];
    // taskNode is not connected
    const result = validateGraph(nodes, edges);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Node "Task" is not connected.');
  });
});

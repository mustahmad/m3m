import { v4 as uuid } from 'uuid';
import { executionService } from '../services/executionService.js';
import { ExecutionContext } from './ExecutionContext.js';
import { executorRegistry } from './executorRegistry.js';
import { broadcast } from '../websocket/executionBroadcaster.js';
import type { WorkflowGraph, WorkflowNode, WorkflowConnection } from '@m3m/shared';

export class ExecutionEngine {
  async execute(
    executionId: string,
    workflowId: string,
    graph: WorkflowGraph,
    triggerData: Record<string, unknown>,
  ): Promise<Record<string, unknown> | null> {
    const ctx = new ExecutionContext(executionId, workflowId);

    executionService.create({
      id: executionId,
      workflow_id: workflowId,
      status: 'running',
      started_at: new Date().toISOString(),
      trigger_type: 'manual',
    });
    broadcast(executionId, { type: 'execution:start', executionId });

    try {
      const triggerNodes = graph.nodes.filter((n) => n.type === 'webhookTrigger');
      if (triggerNodes.length === 0) {
        throw new Error('No trigger node found in workflow');
      }

      // Build adjacency: nodeId -> outgoing connections
      const adjacency = new Map<string, WorkflowConnection[]>();
      for (const conn of graph.connections) {
        if (!adjacency.has(conn.source)) adjacency.set(conn.source, []);
        adjacency.get(conn.source)!.push(conn);
      }

      // Reverse adjacency: nodeId -> incoming connections
      const reverseAdjacency = new Map<string, WorkflowConnection[]>();
      for (const conn of graph.connections) {
        if (!reverseAdjacency.has(conn.target)) reverseAdjacency.set(conn.target, []);
        reverseAdjacency.get(conn.target)!.push(conn);
      }

      // Execute trigger nodes
      for (const trigger of triggerNodes) {
        ctx.setNodeOutput(trigger.id, triggerData);
        this.recordNodeExecution(executionId, trigger, triggerData, triggerData, 'success');
        broadcast(executionId, { type: 'node:complete', nodeId: trigger.id, status: 'success' });
      }

      // BFS queue from trigger successors
      const queue: string[] = [];
      for (const trigger of triggerNodes) {
        for (const conn of adjacency.get(trigger.id) ?? []) {
          if (!queue.includes(conn.target)) queue.push(conn.target);
        }
      }

      const visited = new Set<string>(triggerNodes.map((t) => t.id));
      let lastOutput: Record<string, unknown> | null = null;
      let iterations = 0;
      const maxIterations = graph.nodes.length * 3;

      while (queue.length > 0) {
        if (++iterations > maxIterations) {
          throw new Error('Execution exceeded maximum iterations - possible cycle detected');
        }

        const nodeId = queue.shift()!;
        if (visited.has(nodeId)) continue;

        const node = graph.nodes.find((n) => n.id === nodeId);
        if (!node) continue;

        // Check all inputs are ready (for Merge nodes)
        const incomingConns = reverseAdjacency.get(nodeId) ?? [];
        const allInputsReady = incomingConns.every((conn) => ctx.hasNodeOutput(conn.source));

        if (!allInputsReady) {
          queue.push(nodeId);
          continue;
        }

        visited.add(nodeId);
        const inputData = this.gatherInputs(incomingConns, ctx);

        broadcast(executionId, { type: 'node:start', nodeId, status: 'running' });

        try {
          const executor = executorRegistry.get(node.type);
          if (!executor) throw new Error(`No executor for node type: ${node.type}`);

          const result = await executor.execute(node.data.config, inputData, ctx);
          ctx.setNodeOutput(nodeId, result.output);
          lastOutput = result.output;

          this.recordNodeExecution(executionId, node, inputData, result.output, 'success');
          broadcast(executionId, { type: 'node:complete', nodeId, status: 'success', output: result.output });

          const outgoing = adjacency.get(nodeId) ?? [];

          if (node.type === 'ifCondition' && result.branch) {
            for (const conn of outgoing) {
              if (conn.sourceHandle === result.branch) {
                queue.push(conn.target);
              } else {
                const skippedNode = graph.nodes.find((n) => n.id === conn.target);
                if (skippedNode) {
                  this.recordNodeExecution(executionId, skippedNode, inputData, null, 'skipped');
                  broadcast(executionId, { type: 'node:complete', nodeId: conn.target, status: 'skipped' });
                }
              }
            }
          } else {
            for (const conn of outgoing) {
              queue.push(conn.target);
            }
          }
        } catch (err: any) {
          this.recordNodeExecution(executionId, node, inputData, null, 'error', err.message);
          broadcast(executionId, { type: 'node:error', nodeId, error: err.message });

          executionService.update(executionId, {
            status: 'error',
            finished_at: new Date().toISOString(),
            error_message: `Node "${node.data.label}" failed: ${err.message}`,
          });
          broadcast(executionId, { type: 'execution:error', executionId, error: err.message });
          return null;
        }
      }

      executionService.update(executionId, {
        status: 'success',
        finished_at: new Date().toISOString(),
      });
      broadcast(executionId, { type: 'execution:complete', executionId });

      return lastOutput;
    } catch (err: any) {
      executionService.update(executionId, {
        status: 'error',
        finished_at: new Date().toISOString(),
        error_message: err.message,
      });
      broadcast(executionId, { type: 'execution:error', executionId, error: err.message });
      return null;
    }
  }

  private gatherInputs(
    incomingConns: WorkflowConnection[],
    ctx: ExecutionContext,
  ): Record<string, unknown> {
    if (incomingConns.length === 0) return {};
    if (incomingConns.length === 1) {
      return ctx.getNodeOutput(incomingConns[0].source) ?? {};
    }
    const inputs: Record<string, unknown> = {};
    for (const conn of incomingConns) {
      const handleKey = conn.targetHandle ?? `input_${conn.source}`;
      inputs[handleKey] = ctx.getNodeOutput(conn.source);
    }
    return { __mergeInputs: inputs };
  }

  private recordNodeExecution(
    executionId: string,
    node: WorkflowNode,
    inputData: Record<string, unknown>,
    outputData: Record<string, unknown> | null,
    status: string,
    errorMessage?: string,
  ) {
    executionService.createNodeExecution({
      id: uuid(),
      execution_id: executionId,
      node_id: node.id,
      node_type: node.type,
      status,
      input_data: JSON.stringify(inputData),
      output_data: outputData ? JSON.stringify(outputData) : null,
      error_message: errorMessage ?? null,
      started_at: new Date().toISOString(),
      finished_at: new Date().toISOString(),
    });
  }
}

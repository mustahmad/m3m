import { useEffect, useState, useCallback } from 'react';
import { useWorkflowStore } from '../stores/workflowStore';
import { workflowsApi } from '../api/workflows';
import type { Node, Edge } from '@xyflow/react';

export function useWorkflow(workflowId: string | undefined) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const store = useWorkflowStore();

  useEffect(() => {
    if (!workflowId) return;
    setIsLoading(true);
    workflowsApi
      .get(workflowId)
      .then((workflow) => {
        const graph = workflow.graph;
        const nodes: Node[] = graph.nodes.map((n) => ({
          id: n.id,
          type: n.type,
          position: n.position,
          data: n.data,
        }));
        const edges: Edge[] = graph.connections.map((c) => ({
          id: c.id,
          source: c.source,
          sourceHandle: c.sourceHandle,
          target: c.target,
          targetHandle: c.targetHandle,
          type: 'smoothstep',
        }));
        store.setWorkflow(workflow.id, workflow.name, nodes, edges, graph.viewport);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [workflowId]);

  const save = useCallback(async () => {
    if (!store.workflowId) return;
    const graph = {
      nodes: store.nodes.map((n) => ({
        id: n.id,
        type: n.type!,
        position: n.position,
        data: n.data,
      })),
      connections: store.edges.map((e) => ({
        id: e.id,
        source: e.source,
        sourceHandle: e.sourceHandle ?? null,
        target: e.target,
        targetHandle: e.targetHandle ?? null,
      })),
      viewport: store.viewport,
    };
    await workflowsApi.update(store.workflowId, {
      name: store.workflowName,
      graph,
    });
    store.markClean();
  }, [store]);

  return { isLoading, error, save };
}

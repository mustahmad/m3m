import { useCallback, useEffect, useRef } from 'react';
import { workflowsApi } from '../api/workflows';
import { wsClient } from '../api/websocket';
import { useWorkflowStore } from '../stores/workflowStore';

export function useExecution() {
  const store = useWorkflowStore();
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    wsClient.connect();

    const unsub = wsClient.subscribe((event) => {
      const { type, nodeId, status, output, error } = event as any;

      if (type === 'node:start' && nodeId) {
        store.setNodeStatus(nodeId, 'running');
      } else if (type === 'node:complete' && nodeId) {
        store.setNodeStatus(nodeId, status);
        if (output) store.setNodeOutput(nodeId, output);
      } else if (type === 'node:error' && nodeId) {
        store.setNodeStatus(nodeId, 'error');
      } else if (type === 'execution:complete') {
        // execution done
      } else if (type === 'execution:error') {
        console.error('Execution error:', error);
      }
    });

    unsubRef.current = unsub;

    return () => {
      unsub();
      wsClient.disconnect();
    };
  }, []);

  const execute = useCallback(async () => {
    const workflowId = useWorkflowStore.getState().workflowId;
    if (!workflowId) return;

    store.clearExecutionState();

    const { executionId } = await workflowsApi.execute(workflowId);
    wsClient.subscribeToExecution(executionId);
  }, []);

  return { execute };
}

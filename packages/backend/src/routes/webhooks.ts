import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { workflowService } from '../services/workflowService.js';
import { ExecutionEngine } from '../engine/ExecutionEngine.js';

const router = Router();

router.all('/:workflowId/*', async (req, res) => {
  const { workflowId } = req.params;
  const workflow = workflowService.getById(workflowId);

  if (!workflow || !workflow.is_active) {
    return res.status(404).json({ error: 'Workflow not found or inactive' });
  }

  const graph = JSON.parse(workflow.graph);
  const triggerData = {
    method: req.method,
    headers: req.headers,
    body: req.body,
    query: req.query,
    path: req.params[0],
  };

  const executionId = uuid();
  const engine = new ExecutionEngine();
  const result = await engine.execute(executionId, workflowId, graph, triggerData);

  const triggerNode = graph.nodes.find((n: any) => n.type === 'webhookTrigger');
  const statusCode = triggerNode?.data?.config?.responseCode ?? 200;
  res.status(statusCode).json({ executionId, data: result });
});

export default router;

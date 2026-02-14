import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { workflowService } from '../services/workflowService.js';
import { executionService } from '../services/executionService.js';
import { ExecutionEngine } from '../engine/ExecutionEngine.js';

const router = Router();

router.get('/', (_req, res) => {
  const workflows = workflowService.listAll();
  res.json({ data: workflows });
});

router.post('/', (req, res) => {
  const { name, description } = req.body;
  const id = uuid();
  const workflow = workflowService.create({ id, name, description });
  res.status(201).json({ data: workflow });
});

router.get('/:id', (req, res) => {
  const workflow = workflowService.getById(req.params.id);
  if (!workflow) return res.status(404).json({ error: 'Workflow not found' });
  res.json({ data: { ...workflow, graph: JSON.parse(workflow.graph) } });
});

router.put('/:id', (req, res) => {
  const { name, description, graph, is_active } = req.body;
  const updated = workflowService.update(req.params.id, {
    name,
    description,
    graph: graph ? JSON.stringify(graph) : undefined,
    is_active,
  });
  if (!updated) return res.status(404).json({ error: 'Workflow not found' });
  res.json({ data: { ...updated, graph: JSON.parse(updated.graph) } });
});

router.delete('/:id', (req, res) => {
  workflowService.delete(req.params.id);
  res.status(204).send();
});

router.post('/:id/execute', async (req, res) => {
  const workflow = workflowService.getById(req.params.id);
  if (!workflow) return res.status(404).json({ error: 'Workflow not found' });

  const executionId = uuid();
  const engine = new ExecutionEngine();
  engine.execute(executionId, req.params.id, JSON.parse(workflow.graph), req.body.inputData ?? {});

  res.status(202).json({ data: { executionId } });
});

router.get('/:id/executions', (req, res) => {
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = parseInt(req.query.offset as string) || 0;
  const executions = executionService.listByWorkflow(req.params.id, limit, offset);
  res.json({ data: executions });
});

export default router;

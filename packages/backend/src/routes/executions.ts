import { Router } from 'express';
import { executionService } from '../services/executionService.js';

const router = Router();

router.get('/:id', (req, res) => {
  const execution = executionService.getById(req.params.id);
  if (!execution) return res.status(404).json({ error: 'Execution not found' });

  const nodeExecutions = executionService.getNodeExecutions(req.params.id);
  res.json({
    data: {
      ...execution,
      nodeExecutions: nodeExecutions.map((ne: any) => ({
        ...ne,
        input_data: ne.input_data ? JSON.parse(ne.input_data) : null,
        output_data: ne.output_data ? JSON.parse(ne.output_data) : null,
      })),
    },
  });
});

router.delete('/:id', (req, res) => {
  executionService.deleteExecution(req.params.id);
  res.status(204).send();
});

export default router;

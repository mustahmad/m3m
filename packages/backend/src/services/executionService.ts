import { getDb } from '../db/connection.js';

export const executionService = {
  create(data: {
    id: string;
    workflow_id: string;
    status: string;
    started_at?: string;
    trigger_type?: string;
  }) {
    const db = getDb();
    db.prepare(
      'INSERT INTO executions (id, workflow_id, status, started_at, trigger_type) VALUES (?, ?, ?, ?, ?)'
    ).run(data.id, data.workflow_id, data.status, data.started_at ?? null, data.trigger_type ?? 'manual');
  },

  update(id: string, data: { status?: string; finished_at?: string; error_message?: string }) {
    const db = getDb();
    const fields: string[] = [];
    const values: any[] = [];

    if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status); }
    if (data.finished_at !== undefined) { fields.push('finished_at = ?'); values.push(data.finished_at); }
    if (data.error_message !== undefined) { fields.push('error_message = ?'); values.push(data.error_message); }

    if (fields.length === 0) return;
    values.push(id);
    db.prepare(`UPDATE executions SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  },

  getById(id: string) {
    const db = getDb();
    return db.prepare('SELECT * FROM executions WHERE id = ?').get(id) as any | undefined;
  },

  listByWorkflow(workflowId: string, limit = 20, offset = 0) {
    const db = getDb();
    return db.prepare(
      'SELECT * FROM executions WHERE workflow_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
    ).all(workflowId, limit, offset);
  },

  deleteExecution(id: string) {
    const db = getDb();
    db.prepare('DELETE FROM executions WHERE id = ?').run(id);
  },

  createNodeExecution(data: {
    id: string;
    execution_id: string;
    node_id: string;
    node_type: string;
    status: string;
    input_data: string | null;
    output_data: string | null;
    error_message: string | null;
    started_at: string | null;
    finished_at: string | null;
  }) {
    const db = getDb();
    db.prepare(
      `INSERT INTO node_executions (id, execution_id, node_id, node_type, status, input_data, output_data, error_message, started_at, finished_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      data.id, data.execution_id, data.node_id, data.node_type,
      data.status, data.input_data, data.output_data, data.error_message,
      data.started_at, data.finished_at
    );
  },

  getNodeExecutions(executionId: string) {
    const db = getDb();
    return db.prepare('SELECT * FROM node_executions WHERE execution_id = ? ORDER BY started_at ASC').all(executionId);
  },
};

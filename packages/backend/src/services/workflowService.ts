import { getDb } from '../db/connection.js';

export const workflowService = {
  listAll() {
    const db = getDb();
    return db.prepare('SELECT id, name, description, is_active, created_at, updated_at FROM workflows ORDER BY updated_at DESC').all();
  },

  getById(id: string) {
    const db = getDb();
    return db.prepare('SELECT * FROM workflows WHERE id = ?').get(id) as any | undefined;
  },

  create(data: { id: string; name?: string; description?: string }) {
    const db = getDb();
    const stmt = db.prepare(
      'INSERT INTO workflows (id, name, description) VALUES (?, ?, ?)'
    );
    stmt.run(data.id, data.name ?? 'Untitled Workflow', data.description ?? '');
    return this.getById(data.id);
  },

  update(id: string, data: { name?: string; description?: string; graph?: string; is_active?: number }) {
    const db = getDb();
    const existing = this.getById(id);
    if (!existing) return null;

    const fields: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
    if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
    if (data.graph !== undefined) { fields.push('graph = ?'); values.push(data.graph); }
    if (data.is_active !== undefined) { fields.push('is_active = ?'); values.push(data.is_active); }

    if (fields.length === 0) return existing;

    fields.push("updated_at = datetime('now')");
    values.push(id);

    db.prepare(`UPDATE workflows SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.getById(id);
  },

  delete(id: string) {
    const db = getDb();
    db.prepare('DELETE FROM workflows WHERE id = ?').run(id);
  },
};

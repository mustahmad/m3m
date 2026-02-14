import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Workflow, Trash2 } from 'lucide-react';
import { workflowsApi } from '../api/workflows';

interface WorkflowItem {
  id: string;
  name: string;
  description: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export function WorkflowListPage() {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const navigate = useNavigate();

  const load = useCallback(() => {
    setIsLoading(true);
    workflowsApi.list().then(setWorkflows).finally(() => setIsLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const workflow = await workflowsApi.create({ name: newName.trim() });
    setShowCreate(false);
    setNewName('');
    navigate(`/workflows/${workflow.id}`);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Delete this workflow?')) return;
    await workflowsApi.delete(id);
    load();
  };

  return (
    <div className="workflow-list-page">
      <div className="workflow-list-header">
        <h2>
          <span style={{ color: 'var(--accent-primary)', marginRight: 8 }}>m3m</span>
          Workflows
        </h2>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <Plus size={14} /> New Workflow
        </button>
      </div>

      {isLoading ? (
        <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>Loading...</div>
      ) : workflows.length === 0 ? (
        <div className="empty-state">
          <Workflow size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
          <h3>No workflows yet</h3>
          <p>Create your first workflow to get started with automation</p>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={14} /> Create Workflow
          </button>
        </div>
      ) : (
        <div className="workflow-grid">
          {workflows.map((wf) => (
            <div key={wf.id} className="workflow-card" onClick={() => navigate(`/workflows/${wf.id}`)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="workflow-card-name">{wf.name}</div>
                <button className="btn-icon" onClick={(e) => handleDelete(e, wf.id)} title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="workflow-card-desc">{wf.description || 'No description'}</div>
              <div className="workflow-card-meta">
                <span>{wf.is_active ? '● Active' : '○ Inactive'}</span>
                <span>{new Date(wf.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Workflow</h3>
            <div className="config-field">
              <label>Name</label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="My Workflow"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

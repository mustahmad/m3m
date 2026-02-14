import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Workflow, Trash2 } from 'lucide-react';
import { workflowsApi } from '../api/workflows';
import { WelcomeModal } from '../components/onboarding/WelcomeModal';
import { DEMO_WORKFLOW_NAME, DEMO_WORKFLOW_GRAPH } from '../components/onboarding/demoWorkflow';
import { useI18n } from '../i18n/store';

const WELCOME_KEY = 'm3m_welcome_shown';

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
  const [showWelcome, setShowWelcome] = useState(false);
  const [newName, setNewName] = useState('');
  const navigate = useNavigate();
  const { t } = useI18n();

  const load = useCallback(() => {
    setIsLoading(true);
    workflowsApi.list().then(setWorkflows).finally(() => setIsLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!localStorage.getItem(WELCOME_KEY)) {
      setShowWelcome(true);
    }
  }, []);

  const dismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem(WELCOME_KEY, '1');
  };

  const createDemo = async () => {
    dismissWelcome();
    const workflow = await workflowsApi.create({ name: DEMO_WORKFLOW_NAME, description: 'A demo workflow showing IF branching and Code nodes' });
    await workflowsApi.update(workflow.id, { graph: DEMO_WORKFLOW_GRAPH });
    navigate(`/workflows/${workflow.id}?tour=1`);
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const workflow = await workflowsApi.create({ name: newName.trim() });
    setShowCreate(false);
    setNewName('');
    navigate(`/workflows/${workflow.id}`);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm(t('pages.deleteConfirm'))) return;
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
          <Plus size={14} /> {t('pages.createWorkflow')}
        </button>
      </div>

      {isLoading ? (
        <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>{t('common.loading')}</div>
      ) : workflows.length === 0 ? (
        <div className="empty-state">
          <Workflow size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
          <h3>{t('pages.noWorkflows')}</h3>
          <p>{t('pages.noWorkflowsDesc')}</p>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={14} /> {t('pages.createWorkflow')}
          </button>
        </div>
      ) : (
        <div className="workflow-grid">
          {workflows.map((wf) => (
            <div key={wf.id} className="workflow-card" onClick={() => navigate(`/workflows/${wf.id}`)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="workflow-card-name">{wf.name}</div>
                <button className="btn-icon" onClick={(e) => handleDelete(e, wf.id)} title={t('common.delete')}>
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="workflow-card-desc">{wf.description || t('pages.noDescription')}</div>
              <div className="workflow-card-meta">
                <span>{wf.is_active ? `● ${t('pages.active')}` : `○ ${t('pages.inactive')}`}</span>
                <span>{new Date(wf.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{t('pages.createNewWorkflow')}</h3>
            <div className="config-field">
              <label>{t('common.name')}</label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={t('pages.myWorkflow')}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowCreate(false)}>{t('common.cancel')}</button>
              <button className="btn btn-primary" onClick={handleCreate}>{t('common.create')}</button>
            </div>
          </div>
        </div>
      )}

      {showWelcome && (
        <WelcomeModal onClose={dismissWelcome} onCreateDemo={createDemo} />
      )}
    </div>
  );
}

import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useCallback, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { WorkflowCanvas } from '../components/editor/WorkflowCanvas';
import { NodeConfigPanel } from '../components/panels/NodeConfigPanel';
import { EditorTour } from '../components/onboarding/EditorTour';
import { useWorkflow } from '../hooks/useWorkflow';
import { useExecution } from '../hooks/useExecution';
import { useWorkflowStore } from '../stores/workflowStore';
import { useI18n } from '../i18n/store';

const TOUR_DONE_KEY = 'm3m_tour_done';

export function WorkflowEditorPage() {
  const { workflowId } = useParams();
  const [searchParams] = useSearchParams();
  const { isLoading, error, save } = useWorkflow(workflowId);
  const { execute } = useExecution();
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const [showTour, setShowTour] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    if (!isLoading && !error) {
      const tourRequested = searchParams.get('tour') === '1';
      const tourDone = localStorage.getItem(TOUR_DONE_KEY);
      if (tourRequested || !tourDone) {
        setTimeout(() => setShowTour(true), 500);
      }
    }
  }, [isLoading, error, searchParams]);

  const completeTour = () => {
    setShowTour(false);
    localStorage.setItem(TOUR_DONE_KEY, '1');
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [save]);

  const handleRun = useCallback(async () => {
    await save();
    await execute();
  }, [save, execute]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
        {t('pages.loadingWorkflow')}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--accent-error)' }}>
        {t('pages.error')}: {error}
      </div>
    );
  }

  return (
    <div className="editor-layout">
      <Header onSave={save} onRun={handleRun} onHelp={() => setShowTour(true)} />
      <div className="editor-body">
        <Sidebar />
        <WorkflowCanvas />
        {selectedNodeId && <NodeConfigPanel />}
      </div>
      {showTour && <EditorTour onComplete={completeTour} />}
    </div>
  );
}

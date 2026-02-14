import { useParams } from 'react-router-dom';
import { useEffect, useCallback } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { WorkflowCanvas } from '../components/editor/WorkflowCanvas';
import { NodeConfigPanel } from '../components/panels/NodeConfigPanel';
import { useWorkflow } from '../hooks/useWorkflow';
import { useExecution } from '../hooks/useExecution';
import { useWorkflowStore } from '../stores/workflowStore';

export function WorkflowEditorPage() {
  const { workflowId } = useParams();
  const { isLoading, error, save } = useWorkflow(workflowId);
  const { execute } = useExecution();
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);

  // Keyboard shortcut: Cmd+S to save
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
        Loading workflow...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--accent-error)' }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div className="editor-layout">
      <Header onSave={save} onRun={handleRun} />
      <div className="editor-body">
        <Sidebar />
        <WorkflowCanvas />
        {selectedNodeId && <NodeConfigPanel />}
      </div>
    </div>
  );
}

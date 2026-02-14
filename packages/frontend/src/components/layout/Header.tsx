import { Link } from 'react-router-dom';
import { Save, Play, ArrowLeft } from 'lucide-react';
import { useWorkflowStore } from '../../stores/workflowStore';

interface HeaderProps {
  onSave: () => void;
  onRun: () => void;
}

export function Header({ onSave, onRun }: HeaderProps) {
  const workflowName = useWorkflowStore((s) => s.workflowName);
  const setWorkflowName = useWorkflowStore((s) => s.setWorkflowName);
  const isDirty = useWorkflowStore((s) => s.isDirty);

  return (
    <header className="header">
      <Link to="/" className="btn-icon" title="Back to workflows">
        <ArrowLeft size={18} />
      </Link>
      <span className="header-logo">m3m</span>
      <div className="header-title">
        <input
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
          placeholder="Workflow name..."
        />
        {isDirty && <span style={{ color: 'var(--accent-warning)', fontSize: 11, marginLeft: 8 }}>unsaved</span>}
      </div>
      <div className="header-actions">
        <button className="btn" onClick={onSave} title="Save (Cmd+S)">
          <Save size={14} /> Save
        </button>
        <button className="btn btn-success" onClick={onRun} title="Run workflow">
          <Play size={14} /> Run
        </button>
      </div>
    </header>
  );
}

import { HashRouter, Routes, Route } from 'react-router-dom';
import { WorkflowListPage } from './pages/WorkflowListPage';
import { WorkflowEditorPage } from './pages/WorkflowEditorPage';

export function App() {
  return (
    <HashRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<WorkflowListPage />} />
          <Route path="/workflows/:workflowId" element={<WorkflowEditorPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

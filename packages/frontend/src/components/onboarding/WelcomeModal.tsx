import { Workflow, Zap, MousePointerClick, Cable, Settings, Play } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
  onCreateDemo: () => void;
}

export function WelcomeModal({ onClose, onCreateDemo }: WelcomeModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="welcome-modal" onClick={(e) => e.stopPropagation()}>
        <div className="welcome-header">
          <span className="welcome-logo">m3m</span>
          <h2>Welcome to m3m</h2>
          <p className="welcome-subtitle">Visual workflow automation platform</p>
        </div>

        <div className="welcome-steps">
          <div className="welcome-step">
            <div className="welcome-step-icon" style={{ background: 'rgba(124,92,252,0.15)', color: '#7c5cfc' }}>
              <MousePointerClick size={20} />
            </div>
            <div>
              <h4>1. Create a Workflow</h4>
              <p>Click "New Workflow" to create your first automation</p>
            </div>
          </div>

          <div className="welcome-step">
            <div className="welcome-step-icon" style={{ background: 'rgba(255,109,90,0.15)', color: '#ff6d5a' }}>
              <Zap size={20} />
            </div>
            <div>
              <h4>2. Drag & Drop Nodes</h4>
              <p>Drag nodes from the left sidebar onto the canvas to build your workflow</p>
            </div>
          </div>

          <div className="welcome-step">
            <div className="welcome-step-icon" style={{ background: 'rgba(0,201,167,0.15)', color: '#00c9a7' }}>
              <Cable size={20} />
            </div>
            <div>
              <h4>3. Connect Nodes</h4>
              <p>Drag from one node's handle to another to create connections</p>
            </div>
          </div>

          <div className="welcome-step">
            <div className="welcome-step-icon" style={{ background: 'rgba(10,189,227,0.15)', color: '#0abde3' }}>
              <Settings size={20} />
            </div>
            <div>
              <h4>4. Configure</h4>
              <p>Click any node to open its settings panel on the right</p>
            </div>
          </div>

          <div className="welcome-step">
            <div className="welcome-step-icon" style={{ background: 'rgba(255,159,67,0.15)', color: '#ff9f43' }}>
              <Play size={20} />
            </div>
            <div>
              <h4>5. Run</h4>
              <p>Hit "Run" to execute your workflow and see results in real-time</p>
            </div>
          </div>
        </div>

        <div className="welcome-nodes">
          <h4>Available Nodes</h4>
          <div className="welcome-node-grid">
            <span className="welcome-node-tag" style={{ borderColor: '#ff6d5a' }}>Webhook Trigger</span>
            <span className="welcome-node-tag" style={{ borderColor: '#7c5cfc' }}>HTTP Request</span>
            <span className="welcome-node-tag" style={{ borderColor: '#ff9f43' }}>Code</span>
            <span className="welcome-node-tag" style={{ borderColor: '#00c9a7' }}>IF Condition</span>
            <span className="welcome-node-tag" style={{ borderColor: '#0abde3' }}>Set Data</span>
            <span className="welcome-node-tag" style={{ borderColor: '#a29bfe' }}>Merge</span>
          </div>
        </div>

        <div className="welcome-actions">
          <button className="btn" onClick={onClose}>Get Started</button>
          <button className="btn btn-primary" onClick={onCreateDemo}>
            <Workflow size={14} /> Try Demo Workflow
          </button>
        </div>
      </div>
    </div>
  );
}

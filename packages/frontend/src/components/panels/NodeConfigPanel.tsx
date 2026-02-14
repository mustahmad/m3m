import { X } from 'lucide-react';
import { useWorkflowStore } from '../../stores/workflowStore';
import { NODE_DEFINITIONS, type NodeType } from '@m3m/shared';
import { WebhookTriggerConfig } from './configs/WebhookTriggerConfig';
import { HttpRequestConfig } from './configs/HttpRequestConfig';
import { CodeFunctionConfig } from './configs/CodeFunctionConfig';
import { IfConditionConfig } from './configs/IfConditionConfig';
import { SetDataConfig } from './configs/SetDataConfig';
import { MergeConfig } from './configs/MergeConfig';
import type { ComponentType } from 'react';

interface ConfigPanelProps {
  nodeId: string;
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}

const CONFIG_COMPONENTS: Record<string, ComponentType<ConfigPanelProps>> = {
  webhookTrigger: WebhookTriggerConfig,
  httpRequest: HttpRequestConfig,
  codeFunction: CodeFunctionConfig,
  ifCondition: IfConditionConfig,
  setData: SetDataConfig,
  merge: MergeConfig,
};

export function NodeConfigPanel() {
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const nodes = useWorkflowStore((s) => s.nodes);
  const updateNodeConfig = useWorkflowStore((s) => s.updateNodeConfig);
  const updateNodeLabel = useWorkflowStore((s) => s.updateNodeLabel);
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const nodeOutputs = useWorkflowStore((s) => s.nodeOutputs);
  const nodeStatuses = useWorkflowStore((s) => s.nodeStatuses);

  const node = nodes.find((n) => n.id === selectedNodeId);
  if (!node || !selectedNodeId) return null;

  const def = NODE_DEFINITIONS[node.type as NodeType];
  const ConfigComponent = CONFIG_COMPONENTS[node.type!];
  const output = nodeOutputs[selectedNodeId];
  const status = nodeStatuses[selectedNodeId];

  return (
    <aside className="config-panel">
      <div className="config-panel-header">
        <input
          value={(node.data as any).label || ''}
          onChange={(e) => updateNodeLabel(selectedNodeId, e.target.value)}
        />
        <button className="btn-icon" onClick={() => selectNode(null)}>
          <X size={16} />
        </button>
      </div>

      {def && (
        <div style={{ padding: '8px 16px', fontSize: 12, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-default)' }}>
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: def.color, marginRight: 6 }} />
          {def.description}
        </div>
      )}

      <div className="config-panel-body">
        {ConfigComponent && (
          <ConfigComponent
            nodeId={selectedNodeId}
            config={(node.data as any).config || {}}
            onChange={(config) => updateNodeConfig(selectedNodeId, config)}
          />
        )}
      </div>

      {(output || status) && (
        <div className="execution-result">
          <h4>
            Execution Result
            {status && <span className={`status-badge ${status}`} style={{ marginLeft: 8 }}>{status}</span>}
          </h4>
          {output && (
            <pre>{JSON.stringify(output, null, 2)}</pre>
          )}
        </div>
      )}
    </aside>
  );
}

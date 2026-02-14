export const NODE_TYPES = {
  WEBHOOK_TRIGGER: 'webhookTrigger',
  HTTP_REQUEST: 'httpRequest',
  CODE_FUNCTION: 'codeFunction',
  IF_CONDITION: 'ifCondition',
  SET_DATA: 'setData',
  MERGE: 'merge',
} as const;

export type NodeType = (typeof NODE_TYPES)[keyof typeof NODE_TYPES];

export interface NodeDefinition {
  type: NodeType;
  label: string;
  description: string;
  icon: string;
  color: string;
  category: 'trigger' | 'action' | 'logic' | 'transform';
  inputs: number;
  outputs: number;
  defaultConfig: Record<string, unknown>;
}

export const NODE_DEFINITIONS: Record<NodeType, NodeDefinition> = {
  webhookTrigger: {
    type: 'webhookTrigger',
    label: 'Webhook Trigger',
    description: 'Starts workflow when an HTTP request is received',
    icon: 'Webhook',
    color: '#ff6d5a',
    category: 'trigger',
    inputs: 0,
    outputs: 1,
    defaultConfig: {
      method: 'POST',
      path: '/webhook',
      responseCode: 200,
    },
  },
  httpRequest: {
    type: 'httpRequest',
    label: 'HTTP Request',
    description: 'Make an HTTP request to any URL',
    icon: 'Globe',
    color: '#7c5cfc',
    category: 'action',
    inputs: 1,
    outputs: 1,
    defaultConfig: {
      method: 'GET',
      url: '',
      headers: '{}',
      body: '',
      bodyType: 'json',
    },
  },
  codeFunction: {
    type: 'codeFunction',
    label: 'Code',
    description: 'Run custom JavaScript code',
    icon: 'Code',
    color: '#ff9f43',
    category: 'transform',
    inputs: 1,
    outputs: 1,
    defaultConfig: {
      code: '// Access input data via `input`\n// Return data for next node\nreturn input;',
    },
  },
  ifCondition: {
    type: 'ifCondition',
    label: 'IF',
    description: 'Route data based on a condition',
    icon: 'GitBranch',
    color: '#00c9a7',
    category: 'logic',
    inputs: 1,
    outputs: 2,
    defaultConfig: {
      field: '',
      operator: 'equals',
      value: '',
    },
  },
  setData: {
    type: 'setData',
    label: 'Set Data',
    description: 'Set, modify, or delete fields in the data',
    icon: 'PenLine',
    color: '#0abde3',
    category: 'transform',
    inputs: 1,
    outputs: 1,
    defaultConfig: {
      assignments: [{ field: '', value: '' }],
      mode: 'set',
    },
  },
  merge: {
    type: 'merge',
    label: 'Merge',
    description: 'Merge data from multiple branches',
    icon: 'Merge',
    color: '#a29bfe',
    category: 'logic',
    inputs: 2,
    outputs: 1,
    defaultConfig: {
      mode: 'append',
      mergeKey: '',
    },
  },
};

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    config: Record<string, unknown>;
  };
}

export interface WorkflowConnection {
  id: string;
  source: string;
  sourceHandle: string | null;
  target: string;
  targetHandle: string | null;
}

export interface WorkflowGraph {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  viewport: { x: number; y: number; zoom: number };
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  graph: WorkflowGraph;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export type ExecutionStatus = 'pending' | 'running' | 'success' | 'error' | 'cancelled';
export type NodeExecutionStatus = 'pending' | 'running' | 'success' | 'error' | 'skipped';

export interface Execution {
  id: string;
  workflow_id: string;
  status: ExecutionStatus;
  started_at: string | null;
  finished_at: string | null;
  trigger_type: string;
  error_message: string | null;
  created_at: string;
}

export interface NodeExecution {
  id: string;
  execution_id: string;
  node_id: string;
  node_type: string;
  status: NodeExecutionStatus;
  input_data: string | null;
  output_data: string | null;
  error_message: string | null;
  started_at: string | null;
  finished_at: string | null;
}

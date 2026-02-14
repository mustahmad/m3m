export const NODE_TYPES = {
  WEBHOOK_TRIGGER: 'webhookTrigger',
  HTTP_REQUEST: 'httpRequest',
  CODE_FUNCTION: 'codeFunction',
  IF_CONDITION: 'ifCondition',
  SET_DATA: 'setData',
  MERGE: 'merge',
  SCHEDULE_TRIGGER: 'scheduleTrigger',
  DELAY: 'delay',
  SWITCH: 'switch',
  LOOP: 'loop',
  FILTER: 'filter',
  SORT: 'sort',
  SPLIT: 'split',
  AGGREGATE: 'aggregate',
  AI_LLM: 'aiLlm',
  AI_CLASSIFIER: 'aiClassifier',
  AI_SUMMARIZE: 'aiSummarize',
  EMAIL_SEND: 'emailSend',
  LOG: 'log',
  ERROR_TRIGGER: 'errorTrigger',
} as const;

export type NodeType = (typeof NODE_TYPES)[keyof typeof NODE_TYPES];

export interface NodeDefinition {
  type: NodeType;
  label: string;
  description: string;
  icon: string;
  color: string;
  category: 'trigger' | 'action' | 'logic' | 'transform' | 'ai';
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
  scheduleTrigger: {
    type: 'scheduleTrigger',
    label: 'Schedule Trigger',
    description: 'Start workflow on a time schedule (cron)',
    icon: 'Clock',
    color: '#e056a0',
    category: 'trigger',
    inputs: 0,
    outputs: 1,
    defaultConfig: {
      cron: '0 * * * *',
      timezone: 'UTC',
    },
  },
  delay: {
    type: 'delay',
    label: 'Delay',
    description: 'Wait for a specified amount of time',
    icon: 'Timer',
    color: '#f8a5c2',
    category: 'logic',
    inputs: 1,
    outputs: 1,
    defaultConfig: {
      duration: 1000,
      unit: 'ms',
    },
  },
  switch: {
    type: 'switch',
    label: 'Switch',
    description: 'Route data to different outputs based on value matching',
    icon: 'Route',
    color: '#26de81',
    category: 'logic',
    inputs: 1,
    outputs: 4,
    defaultConfig: {
      field: '',
      cases: [
        { value: 'case1', output: 0 },
        { value: 'case2', output: 1 },
      ],
      fallbackOutput: 3,
    },
  },
  loop: {
    type: 'loop',
    label: 'Loop',
    description: 'Iterate over array items and process each one',
    icon: 'Repeat',
    color: '#45aaf2',
    category: 'logic',
    inputs: 1,
    outputs: 1,
    defaultConfig: {
      arrayField: 'items',
      batchSize: 1,
    },
  },
  filter: {
    type: 'filter',
    label: 'Filter',
    description: 'Filter items based on conditions',
    icon: 'Filter',
    color: '#20bf6b',
    category: 'transform',
    inputs: 1,
    outputs: 2,
    defaultConfig: {
      field: '',
      operator: 'exists',
      value: '',
    },
  },
  sort: {
    type: 'sort',
    label: 'Sort',
    description: 'Sort items by a field',
    icon: 'ArrowUpDown',
    color: '#4b7bec',
    category: 'transform',
    inputs: 1,
    outputs: 1,
    defaultConfig: {
      field: '',
      direction: 'asc',
    },
  },
  split: {
    type: 'split',
    label: 'Split',
    description: 'Split a single item into multiple items from an array field',
    icon: 'SplitSquareHorizontal',
    color: '#fc5c65',
    category: 'transform',
    inputs: 1,
    outputs: 1,
    defaultConfig: {
      arrayField: 'items',
    },
  },
  aggregate: {
    type: 'aggregate',
    label: 'Aggregate',
    description: 'Collect multiple items into a single array',
    icon: 'Layers',
    color: '#778ca3',
    category: 'transform',
    inputs: 1,
    outputs: 1,
    defaultConfig: {
      outputField: 'items',
    },
  },
  aiLlm: {
    type: 'aiLlm',
    label: 'AI: LLM Chat',
    description: 'Send a prompt to an AI language model (OpenAI, Claude, etc.)',
    icon: 'BrainCircuit',
    color: '#a855f7',
    category: 'ai',
    inputs: 1,
    outputs: 1,
    defaultConfig: {
      provider: 'openai',
      model: 'gpt-4o',
      systemPrompt: 'You are a helpful assistant.',
      userPrompt: '{{input.message}}',
      temperature: 0.7,
      maxTokens: 1024,
      apiKey: '',
    },
  },
  aiClassifier: {
    type: 'aiClassifier',
    label: 'AI: Classify',
    description: 'Classify input text into categories using AI',
    icon: 'Tags',
    color: '#c084fc',
    category: 'ai',
    inputs: 1,
    outputs: 1,
    defaultConfig: {
      provider: 'openai',
      model: 'gpt-4o-mini',
      inputField: 'text',
      categories: 'positive, negative, neutral',
      apiKey: '',
    },
  },
  aiSummarize: {
    type: 'aiSummarize',
    label: 'AI: Summarize',
    description: 'Summarize long text using AI',
    icon: 'FileText',
    color: '#8b5cf6',
    category: 'ai',
    inputs: 1,
    outputs: 1,
    defaultConfig: {
      provider: 'openai',
      model: 'gpt-4o-mini',
      inputField: 'text',
      maxLength: 200,
      language: 'en',
      apiKey: '',
    },
  },
  emailSend: {
    type: 'emailSend',
    label: 'Send Email',
    description: 'Send an email via SMTP',
    icon: 'Mail',
    color: '#3b82f6',
    category: 'action',
    inputs: 1,
    outputs: 1,
    defaultConfig: {
      to: '',
      subject: '',
      body: '',
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPass: '',
    },
  },
  log: {
    type: 'log',
    label: 'Log',
    description: 'Log data for debugging — passes data through unchanged',
    icon: 'ScrollText',
    color: '#94a3b8',
    category: 'transform',
    inputs: 1,
    outputs: 1,
    defaultConfig: {
      message: 'Debug: {{input}}',
    },
  },
  errorTrigger: {
    type: 'errorTrigger',
    label: 'Error Trigger',
    description: 'Triggers when an error occurs in the workflow',
    icon: 'AlertTriangle',
    color: '#ef4444',
    category: 'trigger',
    inputs: 0,
    outputs: 1,
    defaultConfig: {},
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

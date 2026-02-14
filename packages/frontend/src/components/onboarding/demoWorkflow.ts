import type { WorkflowGraph } from '@m3m/shared';

export const DEMO_WORKFLOW_NAME = 'Demo: Hello World API';

export const DEMO_WORKFLOW_GRAPH: WorkflowGraph = {
  nodes: [
    {
      id: 'node_trigger',
      type: 'webhookTrigger',
      position: { x: 50, y: 200 },
      data: {
        label: 'Webhook Trigger',
        config: { method: 'POST', path: '/hello', responseCode: 200 },
      },
    },
    {
      id: 'node_setdata',
      type: 'setData',
      position: { x: 320, y: 120 },
      data: {
        label: 'Add Greeting',
        config: {
          assignments: [
            { field: 'greeting', value: 'Hello from m3m!' },
            { field: 'timestamp', value: '{{body.time}}' },
          ],
          mode: 'set',
        },
      },
    },
    {
      id: 'node_if',
      type: 'ifCondition',
      position: { x: 580, y: 200 },
      data: {
        label: 'Check Name',
        config: { field: 'body.name', operator: 'exists', value: '' },
      },
    },
    {
      id: 'node_code_yes',
      type: 'codeFunction',
      position: { x: 860, y: 100 },
      data: {
        label: 'Personalize',
        config: {
          code: '// Create personalized greeting\nconst name = input.body?.name || "World";\nreturn {\n  message: `Hello, ${name}!`,\n  personalized: true,\n  ...input\n};',
        },
      },
    },
    {
      id: 'node_code_no',
      type: 'codeFunction',
      position: { x: 860, y: 320 },
      data: {
        label: 'Default Response',
        config: {
          code: '// Generic greeting\nreturn {\n  message: "Hello, World!",\n  personalized: false,\n  ...input\n};',
        },
      },
    },
  ],
  connections: [
    { id: 'edge_1', source: 'node_trigger', sourceHandle: 'output', target: 'node_setdata', targetHandle: 'input' },
    { id: 'edge_2', source: 'node_setdata', sourceHandle: 'output', target: 'node_if', targetHandle: 'input' },
    { id: 'edge_3', source: 'node_if', sourceHandle: 'true', target: 'node_code_yes', targetHandle: 'input' },
    { id: 'edge_4', source: 'node_if', sourceHandle: 'false', target: 'node_code_no', targetHandle: 'input' },
  ],
  viewport: { x: 0, y: 0, zoom: 0.85 },
};

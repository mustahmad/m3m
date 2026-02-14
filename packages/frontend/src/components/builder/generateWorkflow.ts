import { NODE_DEFINITIONS, type NodeType } from '@m3m/shared';

const NODE_TYPE_LIST = Object.entries(NODE_DEFINITIONS).map(([key, def]) => ({
  type: key,
  label: def.label,
  category: def.category,
  description: def.description,
  inputs: def.inputs,
  outputs: def.outputs,
  configKeys: Object.keys(def.defaultConfig),
}));

const SYSTEM_PROMPT = `You are a workflow automation builder for the m3m platform.
Given a user's description of what automation they want, generate a workflow as JSON.

Available node types:
${JSON.stringify(NODE_TYPE_LIST, null, 2)}

You MUST respond with ONLY valid JSON (no markdown, no backticks, no explanation) in this exact format:
{
  "name": "Workflow name",
  "nodes": [
    {
      "id": "node_1",
      "type": "<nodeType from the list above>",
      "label": "Human readable label",
      "config": { ...config matching the node type's configKeys }
    }
  ],
  "edges": [
    {
      "source": "node_1",
      "sourceHandle": "output",
      "target": "node_2",
      "targetHandle": "input"
    }
  ]
}

Rules:
- Every workflow MUST start with a trigger node (webhookTrigger or scheduleTrigger or errorTrigger)
- Use sourceHandle "output" for single-output nodes, "true"/"false" for ifCondition/filter nodes
- Use targetHandle "input" for single-input nodes, "input1"/"input2" for merge nodes
- Place nodes in logical order
- Fill in config values based on the user's description
- For IF nodes, create both true and false branches if appropriate
- For code nodes, write actual JavaScript in the config.code field
- Keep workflows practical and concise (3-10 nodes typically)
- ONLY output the JSON, nothing else`;

interface GeneratedNode {
  id: string;
  type: string;
  label: string;
  config: Record<string, unknown>;
}

interface GeneratedWorkflow {
  name: string;
  nodes: GeneratedNode[];
  edges: Array<{
    source: string;
    sourceHandle: string;
    target: string;
    targetHandle: string;
  }>;
}

export interface PlacedWorkflow {
  name: string;
  nodes: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    data: { label: string; config: Record<string, unknown> };
  }>;
  edges: Array<{
    id: string;
    source: string;
    sourceHandle: string;
    target: string;
    targetHandle: string;
    type: string;
  }>;
}

function layoutNodes(generated: GeneratedWorkflow): PlacedWorkflow {
  // Simple left-to-right layout using topological sort
  const nodeMap = new Map(generated.nodes.map((n) => [n.id, n]));
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  for (const n of generated.nodes) {
    inDegree.set(n.id, 0);
    adj.set(n.id, []);
  }

  for (const e of generated.edges) {
    adj.get(e.source)?.push(e.target);
    inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
  }

  // BFS topological sort
  const queue: string[] = [];
  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id);
  }

  const layers: string[][] = [];
  while (queue.length > 0) {
    const layer = [...queue];
    layers.push(layer);
    queue.length = 0;
    for (const id of layer) {
      for (const next of adj.get(id) || []) {
        const deg = (inDegree.get(next) || 1) - 1;
        inDegree.set(next, deg);
        if (deg === 0) queue.push(next);
      }
    }
  }

  // Position nodes: 300px horizontal gap, 150px vertical gap within layers
  const nodes = [];
  const X_GAP = 300;
  const Y_GAP = 150;

  for (let col = 0; col < layers.length; col++) {
    const layer = layers[col];
    const startY = -(layer.length - 1) * Y_GAP / 2;
    for (let row = 0; row < layer.length; row++) {
      const id = layer[row];
      const gen = nodeMap.get(id);
      if (!gen) continue;

      const def = NODE_DEFINITIONS[gen.type as NodeType];
      const defaultConfig = def ? structuredClone(def.defaultConfig) : {};

      nodes.push({
        id,
        type: gen.type,
        position: { x: col * X_GAP + 50, y: startY + row * Y_GAP + 200 },
        data: {
          label: gen.label,
          config: { ...defaultConfig, ...gen.config },
        },
      });
    }
  }

  // Also add any orphaned nodes not reached by topo sort
  const placed = new Set(nodes.map((n) => n.id));
  for (const gen of generated.nodes) {
    if (!placed.has(gen.id)) {
      const def = NODE_DEFINITIONS[gen.type as NodeType];
      const defaultConfig = def ? structuredClone(def.defaultConfig) : {};
      nodes.push({
        id: gen.id,
        type: gen.type,
        position: { x: nodes.length * X_GAP + 50, y: 200 },
        data: {
          label: gen.label,
          config: { ...defaultConfig, ...gen.config },
        },
      });
    }
  }

  const edges = generated.edges.map((e, i) => ({
    id: `edge_${i}`,
    source: e.source,
    sourceHandle: e.sourceHandle || 'output',
    target: e.target,
    targetHandle: e.targetHandle || 'input',
    type: 'smoothstep',
  }));

  return { name: generated.name, nodes, edges };
}

export type AiProvider = 'openai' | 'anthropic' | 'groq';

async function callOpenAICompatible(
  url: string,
  apiKey: string,
  model: string,
  description: string,
): Promise<string> {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 4096,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: description },
      ],
    }),
  });
  const data = await res.json() as any;
  if (data.error) throw new Error(data.error.message || 'API error');
  return data.choices?.[0]?.message?.content || '';
}

export async function generateWorkflow(
  description: string,
  provider: AiProvider,
  apiKey: string,
  model?: string,
): Promise<PlacedWorkflow> {
  let responseText: string;

  if (provider === 'anthropic') {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: model || 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: description }],
      }),
    });
    const data = await res.json() as any;
    if (data.error) throw new Error(data.error.message || 'Anthropic API error');
    responseText = data.content?.[0]?.text || '';
  } else if (provider === 'groq') {
    responseText = await callOpenAICompatible(
      'https://api.groq.com/openai/v1/chat/completions',
      apiKey,
      model || 'llama-3.3-70b-versatile',
      description,
    );
  } else {
    responseText = await callOpenAICompatible(
      'https://api.openai.com/v1/chat/completions',
      apiKey,
      model || 'gpt-4o',
      description,
    );
  }

  // Extract JSON from response (handle potential markdown wrapping)
  let jsonStr = responseText.trim();
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) jsonStr = jsonMatch[1].trim();

  // Find first { and last }
  const start = jsonStr.indexOf('{');
  const end = jsonStr.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No valid JSON found in response');
  jsonStr = jsonStr.slice(start, end + 1);

  let generated: GeneratedWorkflow;
  try {
    generated = JSON.parse(jsonStr);
  } catch {
    throw new Error('Failed to parse AI response as JSON');
  }

  if (!generated.nodes || !Array.isArray(generated.nodes)) {
    throw new Error('Invalid workflow: missing nodes array');
  }

  // Validate node types
  for (const node of generated.nodes) {
    if (!NODE_DEFINITIONS[node.type as NodeType]) {
      throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  return layoutNodes(generated);
}

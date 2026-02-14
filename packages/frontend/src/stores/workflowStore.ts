import { create } from 'zustand';
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';
import { NODE_DEFINITIONS, type NodeType } from '@m3m/shared';

interface WorkflowState {
  workflowId: string | null;
  workflowName: string;
  nodes: Node[];
  edges: Edge[];
  viewport: { x: number; y: number; zoom: number };
  selectedNodeId: string | null;
  isDirty: boolean;

  setWorkflow: (id: string, name: string, nodes: Node[], edges: Edge[], viewport: { x: number; y: number; zoom: number }) => void;
  setWorkflowName: (name: string) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  selectNode: (nodeId: string | null) => void;
  updateNodeConfig: (nodeId: string, config: Record<string, unknown>) => void;
  updateNodeLabel: (nodeId: string, label: string) => void;
  deleteSelectedNode: () => void;
  markClean: () => void;

  // Execution state
  nodeStatuses: Record<string, string>;
  nodeOutputs: Record<string, unknown>;
  setNodeStatus: (nodeId: string, status: string) => void;
  setNodeOutput: (nodeId: string, output: unknown) => void;
  clearExecutionState: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflowId: null,
  workflowName: 'Untitled Workflow',
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  selectedNodeId: null,
  isDirty: false,
  nodeStatuses: {},
  nodeOutputs: {},

  setWorkflow: (id, name, nodes, edges, viewport) =>
    set({ workflowId: id, workflowName: name, nodes, edges, viewport, isDirty: false, selectedNodeId: null }),

  setWorkflowName: (name) => set({ workflowName: name, isDirty: true }),

  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes), isDirty: true }),

  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges), isDirty: true }),

  onConnect: (connection) =>
    set({
      edges: addEdge(
        { ...connection, type: 'smoothstep', animated: false },
        get().edges,
      ),
      isDirty: true,
    }),

  addNode: (type, position) => {
    const def = NODE_DEFINITIONS[type];
    const newNode: Node = {
      id: `node_${crypto.randomUUID().slice(0, 8)}`,
      type,
      position,
      data: { label: def.label, config: structuredClone(def.defaultConfig) },
    };
    set({ nodes: [...get().nodes, newNode], isDirty: true, selectedNodeId: newNode.id });
  },

  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

  updateNodeConfig: (nodeId, config) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, config } } : n,
      ),
      isDirty: true,
    }),

  updateNodeLabel: (nodeId, label) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, label } } : n,
      ),
      isDirty: true,
    }),

  deleteSelectedNode: () => {
    const { selectedNodeId, nodes, edges } = get();
    if (!selectedNodeId) return;
    set({
      nodes: nodes.filter((n) => n.id !== selectedNodeId),
      edges: edges.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId),
      selectedNodeId: null,
      isDirty: true,
    });
  },

  markClean: () => set({ isDirty: false }),

  setNodeStatus: (nodeId, status) =>
    set({ nodeStatuses: { ...get().nodeStatuses, [nodeId]: status } }),

  setNodeOutput: (nodeId, output) =>
    set({ nodeOutputs: { ...get().nodeOutputs, [nodeId]: output } }),

  clearExecutionState: () => set({ nodeStatuses: {}, nodeOutputs: {} }),
}));

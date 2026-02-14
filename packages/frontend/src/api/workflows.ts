import { api } from './client';
import type { Workflow, WorkflowGraph } from '@m3m/shared';

interface WorkflowListItem {
  id: string;
  name: string;
  description: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

const LS_KEY = 'm3m_workflows';

function lsRead(): Record<string, any> {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; }
}
function lsWrite(data: Record<string, any>) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

// Detect if backend is available (cached per session)
let backendAvailable: boolean | null = null;
async function hasBackend(): Promise<boolean> {
  if (backendAvailable !== null) return backendAvailable;
  try {
    const res = await fetch('/api/workflows', { method: 'GET', signal: AbortSignal.timeout(2000) });
    backendAvailable = res.ok;
  } catch {
    backendAvailable = false;
  }
  return backendAvailable;
}

const defaultGraph: WorkflowGraph = { nodes: [], connections: [], viewport: { x: 0, y: 0, zoom: 1 } };

// localStorage fallback implementation
const localApi = {
  list: (): WorkflowListItem[] => {
    const all = lsRead();
    return Object.values(all)
      .map((w: any) => ({ id: w.id, name: w.name, description: w.description || '', is_active: w.is_active || 0, created_at: w.created_at, updated_at: w.updated_at }))
      .sort((a: any, b: any) => b.updated_at.localeCompare(a.updated_at));
  },
  get: (id: string): Workflow | null => {
    const all = lsRead();
    const w = all[id];
    if (!w) return null;
    return { ...w, graph: typeof w.graph === 'string' ? JSON.parse(w.graph) : w.graph };
  },
  create: (data: { name?: string; description?: string }): Workflow => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const wf: any = { id, name: data.name || 'Untitled Workflow', description: data.description || '', graph: defaultGraph, is_active: 0, created_at: now, updated_at: now };
    const all = lsRead();
    all[id] = wf;
    lsWrite(all);
    return wf;
  },
  update: (id: string, data: { name?: string; description?: string; graph?: WorkflowGraph; is_active?: number }): Workflow | null => {
    const all = lsRead();
    if (!all[id]) return null;
    if (data.name !== undefined) all[id].name = data.name;
    if (data.description !== undefined) all[id].description = data.description;
    if (data.graph !== undefined) all[id].graph = data.graph;
    if (data.is_active !== undefined) all[id].is_active = data.is_active;
    all[id].updated_at = new Date().toISOString();
    lsWrite(all);
    return { ...all[id], graph: typeof all[id].graph === 'string' ? JSON.parse(all[id].graph) : all[id].graph };
  },
  delete: (id: string) => {
    const all = lsRead();
    delete all[id];
    lsWrite(all);
  },
};

export const workflowsApi = {
  list: async (): Promise<WorkflowListItem[]> => {
    if (await hasBackend()) {
      return api.get<{ data: WorkflowListItem[] }>('/workflows').then((r) => r.data);
    }
    return localApi.list();
  },

  get: async (id: string): Promise<Workflow> => {
    if (await hasBackend()) {
      return api.get<{ data: Workflow }>(`/workflows/${id}`).then((r) => r.data);
    }
    const w = localApi.get(id);
    if (!w) throw new Error('Workflow not found');
    return w;
  },

  create: async (data: { name?: string; description?: string }): Promise<Workflow> => {
    if (await hasBackend()) {
      return api.post<{ data: Workflow }>('/workflows', data).then((r) => r.data);
    }
    return localApi.create(data);
  },

  update: async (id: string, data: { name?: string; description?: string; graph?: WorkflowGraph; is_active?: number }): Promise<Workflow> => {
    if (await hasBackend()) {
      return api.put<{ data: Workflow }>(`/workflows/${id}`, data).then((r) => r.data);
    }
    const w = localApi.update(id, data);
    if (!w) throw new Error('Workflow not found');
    return w;
  },

  delete: async (id: string): Promise<void> => {
    if (await hasBackend()) {
      await api.delete(`/workflows/${id}`);
      return;
    }
    localApi.delete(id);
  },

  execute: async (id: string, inputData?: Record<string, unknown>) => {
    if (await hasBackend()) {
      return api.post<{ data: { executionId: string } }>(`/workflows/${id}/execute`, { inputData }).then((r) => r.data);
    }
    // Demo mode: simulate execution
    return { executionId: `demo_${crypto.randomUUID().slice(0, 8)}` };
  },

  listExecutions: async (id: string) => {
    if (await hasBackend()) {
      return api.get<{ data: any[] }>(`/workflows/${id}/executions`).then((r) => r.data);
    }
    return [];
  },
};

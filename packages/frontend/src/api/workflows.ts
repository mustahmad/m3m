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

export const workflowsApi = {
  list: () => api.get<{ data: WorkflowListItem[] }>('/workflows').then((r) => r.data),

  get: (id: string) =>
    api.get<{ data: Workflow }>(`/workflows/${id}`).then((r) => r.data),

  create: (data: { name?: string; description?: string }) =>
    api.post<{ data: Workflow }>('/workflows', data).then((r) => r.data),

  update: (id: string, data: { name?: string; description?: string; graph?: WorkflowGraph; is_active?: number }) =>
    api.put<{ data: Workflow }>(`/workflows/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/workflows/${id}`),

  execute: (id: string, inputData?: Record<string, unknown>) =>
    api.post<{ data: { executionId: string } }>(`/workflows/${id}/execute`, { inputData }).then((r) => r.data),

  listExecutions: (id: string) =>
    api.get<{ data: any[] }>(`/workflows/${id}/executions`).then((r) => r.data),
};

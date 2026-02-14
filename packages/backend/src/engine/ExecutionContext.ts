export class ExecutionContext {
  public readonly executionId: string;
  public readonly workflowId: string;
  private nodeOutputs: Map<string, Record<string, unknown>> = new Map();

  constructor(executionId: string, workflowId: string) {
    this.executionId = executionId;
    this.workflowId = workflowId;
  }

  setNodeOutput(nodeId: string, data: Record<string, unknown>) {
    this.nodeOutputs.set(nodeId, data);
  }

  getNodeOutput(nodeId: string): Record<string, unknown> | undefined {
    return this.nodeOutputs.get(nodeId);
  }

  hasNodeOutput(nodeId: string): boolean {
    return this.nodeOutputs.has(nodeId);
  }
}

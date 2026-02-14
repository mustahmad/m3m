import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodeTypes } from '../nodes/nodeTypes';
import { useWorkflowStore } from '../../stores/workflowStore';
import { NODE_DEFINITIONS, type NodeType } from '@m3m/shared';

export function WorkflowCanvas() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const onConnect = useWorkflowStore((s) => s.onConnect);
  const addNode = useWorkflowStore((s) => s.addNode);
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const deleteSelectedNode = useWorkflowStore((s) => s.deleteSelectedNode);

  const rfInstance = useRef<ReactFlowInstance | null>(null);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/m3m-node-type');
      if (!type || !rfInstance.current) return;

      const position = rfInstance.current.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      addNode(type as NodeType, position);
    },
    [addNode],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: any) => {
      selectNode(node.id);
    },
    [selectNode],
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        deleteSelectedNode();
      }
    },
    [deleteSelectedNode],
  );

  return (
    <div className="canvas-wrapper" onKeyDown={onKeyDown} tabIndex={0}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onInit={(instance) => {
          rfInstance.current = instance;
        }}
        fitView
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
          style: { stroke: '#555', strokeWidth: 2 },
        }}
        deleteKeyCode={null}
      >
        <Background color="#333" gap={20} />
        <Controls />
        <MiniMap
          nodeColor={(node) => NODE_DEFINITIONS[node.type as NodeType]?.color ?? '#666'}
          maskColor="rgba(0,0,0,0.7)"
          style={{ background: '#1e293b' }}
        />
      </ReactFlow>
    </div>
  );
}

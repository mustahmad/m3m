import { NODE_DEFINITIONS, type NodeType } from '@m3m/shared';
import * as Icons from 'lucide-react';

const categories = [
  { key: 'trigger', label: 'Triggers' },
  { key: 'action', label: 'Actions' },
  { key: 'logic', label: 'Logic' },
  { key: 'transform', label: 'Transform' },
  { key: 'ai', label: 'AI' },
] as const;

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/m3m-node-type', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="sidebar">
      <h3>Nodes</h3>
      {categories.map((cat) => {
        const items = Object.values(NODE_DEFINITIONS).filter((d) => d.category === cat.key);
        if (items.length === 0) return null;
        return (
          <div key={cat.key} className="sidebar-category">
            <h4>{cat.label}</h4>
            {items.map((def) => {
              const Icon = (Icons as any)[def.icon];
              return (
                <div
                  key={def.type}
                  className="sidebar-node-item"
                  draggable
                  onDragStart={(e) => onDragStart(e, def.type)}
                  title={def.description}
                >
                  <span className="sidebar-node-icon" style={{ background: `${def.color}20`, color: def.color }}>
                    {Icon && <Icon size={16} />}
                  </span>
                  <span>{def.label}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </aside>
  );
}

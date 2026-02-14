import { NODE_DEFINITIONS, type NodeType } from '@m3m/shared';
import * as Icons from 'lucide-react';
import { useI18n } from '../../i18n/store';

const categoryKeys = ['trigger', 'action', 'logic', 'transform', 'ai'] as const;
const categoryI18nMap: Record<string, string> = {
  trigger: 'sidebar.triggers',
  action: 'sidebar.actions',
  logic: 'sidebar.logic',
  transform: 'sidebar.transform',
  ai: 'sidebar.ai',
};

export function Sidebar() {
  const { t } = useI18n();

  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/m3m-node-type', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="sidebar">
      <h3>{t('sidebar.nodes')}</h3>
      {categoryKeys.map((catKey) => {
        const items = Object.values(NODE_DEFINITIONS).filter((d) => d.category === catKey);
        if (items.length === 0) return null;
        return (
          <div key={catKey} className="sidebar-category">
            <h4>{t(categoryI18nMap[catKey])}</h4>
            {items.map((def) => {
              const Icon = (Icons as any)[def.icon];
              return (
                <div
                  key={def.type}
                  className="sidebar-node-item"
                  draggable
                  onDragStart={(e) => onDragStart(e, def.type)}
                  title={t(`nodes.${def.type}.description`)}
                >
                  <span className="sidebar-node-icon" style={{ background: `${def.color}20`, color: def.color }}>
                    {Icon && <Icon size={16} />}
                  </span>
                  <span>{t(`nodes.${def.type}.label`)}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </aside>
  );
}

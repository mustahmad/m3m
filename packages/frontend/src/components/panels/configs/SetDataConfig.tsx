import { Plus, Trash2 } from 'lucide-react';
import { useI18n } from '../../../i18n/store';

interface Props {
  nodeId: string;
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}

export function SetDataConfig({ config, onChange }: Props) {
  const { t } = useI18n();
  const assignments = (config.assignments as Array<{ field: string; value: string }>) || [{ field: '', value: '' }];
  const mode = (config.mode as string) || 'set';

  const updateAssignment = (index: number, key: 'field' | 'value', val: string) => {
    const updated = [...assignments];
    updated[index] = { ...updated[index], [key]: val };
    onChange({ ...config, assignments: updated });
  };

  const addAssignment = () => {
    onChange({ ...config, assignments: [...assignments, { field: '', value: '' }] });
  };

  const removeAssignment = (index: number) => {
    onChange({ ...config, assignments: assignments.filter((_, i) => i !== index) });
  };

  return (
    <>
      <div className="config-field">
        <label>{t('configs.setData.mode')}</label>
        <select value={mode} onChange={(e) => onChange({ ...config, mode: e.target.value })}>
          <option value="set">{t('configs.setData.modeSet')}</option>
          <option value="merge">{t('configs.setData.modeMerge')}</option>
          <option value="replace">{t('configs.setData.modeReplace')}</option>
        </select>
      </div>
      <div className="config-field">
        <label>{t('configs.setData.assignments')}</label>
        {assignments.map((a, i) => (
          <div key={i} className="assignment-row">
            <input
              value={a.field}
              onChange={(e) => updateAssignment(i, 'field', e.target.value)}
              placeholder={t('configs.setData.fieldPlaceholder')}
            />
            <span style={{ color: 'var(--text-muted)' }}>=</span>
            <input
              value={a.value}
              onChange={(e) => updateAssignment(i, 'value', e.target.value)}
              placeholder={t('configs.setData.valuePlaceholder')}
            />
            {assignments.length > 1 && (
              <button className="btn-icon" onClick={() => removeAssignment(i)}>
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
        <button className="btn btn-sm" onClick={addAssignment} style={{ marginTop: 4 }}>
          <Plus size={12} /> {t('configs.setData.addField')}
        </button>
      </div>
    </>
  );
}

import { useI18n } from '../../../i18n/store';

interface Props {
  nodeId: string;
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}

export function IfConditionConfig({ config, onChange }: Props) {
  const { t } = useI18n();
  return (
    <>
      <div className="config-field">
        <label>{t('configs.ifCondition.field')}</label>
        <input
          value={(config.field as string) || ''}
          onChange={(e) => onChange({ ...config, field: e.target.value })}
          placeholder={t('configs.ifCondition.fieldPlaceholder')}
        />
      </div>
      <div className="config-field">
        <label>{t('configs.ifCondition.operator')}</label>
        <select value={(config.operator as string) || 'equals'} onChange={(e) => onChange({ ...config, operator: e.target.value })}>
          <option value="equals">{t('configs.ifCondition.equals')}</option>
          <option value="notEquals">{t('configs.ifCondition.notEquals')}</option>
          <option value="gt">{t('configs.ifCondition.greaterThan')}</option>
          <option value="lt">{t('configs.ifCondition.lessThan')}</option>
          <option value="contains">{t('configs.ifCondition.contains')}</option>
          <option value="exists">{t('configs.ifCondition.exists')}</option>
        </select>
      </div>
      <div className="config-field">
        <label>{t('configs.ifCondition.value')}</label>
        <input
          value={(config.value as string) || ''}
          onChange={(e) => onChange({ ...config, value: e.target.value })}
          placeholder={t('configs.ifCondition.valuePlaceholder')}
        />
      </div>
    </>
  );
}

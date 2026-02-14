import { useI18n } from '../../../i18n/store';

interface Props {
  nodeId: string;
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}

export function MergeConfig({ config, onChange }: Props) {
  const { t } = useI18n();
  const mode = (config.mode as string) || 'append';
  return (
    <>
      <div className="config-field">
        <label>{t('configs.merge.mergeMode')}</label>
        <select value={mode} onChange={(e) => onChange({ ...config, mode: e.target.value })}>
          <option value="append">{t('configs.merge.append')}</option>
          <option value="mergeByIndex">{t('configs.merge.mergeByIndex')}</option>
          <option value="mergeByKey">{t('configs.merge.mergeByKey')}</option>
        </select>
      </div>
      {mode === 'mergeByKey' && (
        <div className="config-field">
          <label>{t('configs.merge.mergeKey')}</label>
          <input
            value={(config.mergeKey as string) || ''}
            onChange={(e) => onChange({ ...config, mergeKey: e.target.value })}
            placeholder={t('configs.merge.mergeKeyPlaceholder')}
          />
        </div>
      )}
    </>
  );
}

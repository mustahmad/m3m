import { useI18n } from '../../../i18n/store';

interface Props {
  nodeId: string;
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}

export function WebhookTriggerConfig({ config, onChange }: Props) {
  const { t } = useI18n();
  return (
    <>
      <div className="config-field">
        <label>{t('configs.webhookTrigger.method')}</label>
        <select value={(config.method as string) || 'POST'} onChange={(e) => onChange({ ...config, method: e.target.value })}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>
      <div className="config-field">
        <label>{t('configs.webhookTrigger.path')}</label>
        <input
          value={(config.path as string) || ''}
          onChange={(e) => onChange({ ...config, path: e.target.value })}
          placeholder={t('configs.webhookTrigger.pathPlaceholder')}
        />
      </div>
      <div className="config-field">
        <label>{t('configs.webhookTrigger.responseCode')}</label>
        <input
          type="number"
          value={(config.responseCode as number) || 200}
          onChange={(e) => onChange({ ...config, responseCode: parseInt(e.target.value) || 200 })}
        />
      </div>
    </>
  );
}

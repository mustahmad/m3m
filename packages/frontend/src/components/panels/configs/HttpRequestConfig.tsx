import { useI18n } from '../../../i18n/store';

interface Props {
  nodeId: string;
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}

export function HttpRequestConfig({ config, onChange }: Props) {
  const { t } = useI18n();
  return (
    <>
      <div className="config-field">
        <label>{t('configs.httpRequest.method')}</label>
        <select value={(config.method as string) || 'GET'} onChange={(e) => onChange({ ...config, method: e.target.value })}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>
      <div className="config-field">
        <label>{t('configs.httpRequest.url')}</label>
        <input
          value={(config.url as string) || ''}
          onChange={(e) => onChange({ ...config, url: e.target.value })}
          placeholder={t('configs.httpRequest.urlPlaceholder')}
        />
      </div>
      <div className="config-field">
        <label>{t('configs.httpRequest.headersJson')}</label>
        <textarea
          rows={3}
          value={(config.headers as string) || '{}'}
          onChange={(e) => onChange({ ...config, headers: e.target.value })}
          placeholder={t('configs.httpRequest.headersPlaceholder')}
        />
      </div>
      <div className="config-field">
        <label>{t('configs.httpRequest.body')}</label>
        <textarea
          rows={5}
          value={(config.body as string) || ''}
          onChange={(e) => onChange({ ...config, body: e.target.value })}
          placeholder={t('configs.httpRequest.bodyPlaceholder')}
        />
      </div>
    </>
  );
}

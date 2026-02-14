import { useI18n } from '../../../i18n/store';

interface Props {
  nodeId: string;
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}

export function CodeFunctionConfig({ config, onChange }: Props) {
  const { t } = useI18n();
  return (
    <>
      <div className="config-field">
        <label>{t('configs.codeFunction.jsCode')}</label>
        <textarea
          rows={12}
          value={(config.code as string) || ''}
          onChange={(e) => onChange({ ...config, code: e.target.value })}
          placeholder={t('configs.codeFunction.placeholder')}
          style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: 12 }}
        />
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '0 2px' }}>
        {t('configs.codeFunction.hint1')}<code style={{ color: 'var(--accent-warning)' }}>input</code>{t('configs.codeFunction.hint2')}
      </div>
    </>
  );
}

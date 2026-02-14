import { Plus, Trash2 } from 'lucide-react';
import { useI18n } from '../../../i18n/store';

interface Props {
  nodeId: string;
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}

export function ScheduleTriggerConfig({ config, onChange }: Props) {
  const { t } = useI18n();
  return (
    <>
      <div className="config-field">
        <label>{t('configs.scheduleTrigger.cronExpression')}</label>
        <input value={(config.cron as string) || ''} onChange={(e) => onChange({ ...config, cron: e.target.value })} placeholder={t('configs.scheduleTrigger.cronPlaceholder')} />
      </div>
      <div className="config-field">
        <label>{t('configs.scheduleTrigger.timezone')}</label>
        <input value={(config.timezone as string) || 'UTC'} onChange={(e) => onChange({ ...config, timezone: e.target.value })} placeholder="UTC" />
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '0 2px' }}>
        {t('configs.scheduleTrigger.examples')} <code>*/5 * * * *</code> {t('configs.scheduleTrigger.every5min')}, <code>0 9 * * 1-5</code> {t('configs.scheduleTrigger.weekdays9am')}
      </div>
    </>
  );
}

export function DelayConfig({ config, onChange }: Props) {
  const { t } = useI18n();
  return (
    <>
      <div className="config-field">
        <label>{t('configs.delay.duration')}</label>
        <input type="number" value={(config.duration as number) || 1000} onChange={(e) => onChange({ ...config, duration: parseInt(e.target.value) || 0 })} />
      </div>
      <div className="config-field">
        <label>{t('configs.delay.unit')}</label>
        <select value={(config.unit as string) || 'ms'} onChange={(e) => onChange({ ...config, unit: e.target.value })}>
          <option value="ms">{t('configs.delay.milliseconds')}</option>
          <option value="s">{t('configs.delay.seconds')}</option>
          <option value="m">{t('configs.delay.minutes')}</option>
        </select>
      </div>
    </>
  );
}

export function SwitchConfig({ config, onChange }: Props) {
  const { t } = useI18n();
  const cases = (config.cases as Array<{ value: string; output: number }>) || [];
  const updateCase = (i: number, val: string) => {
    const updated = [...cases];
    updated[i] = { ...updated[i], value: val };
    onChange({ ...config, cases: updated });
  };
  const addCase = () => onChange({ ...config, cases: [...cases, { value: '', output: cases.length }] });
  const removeCase = (i: number) => onChange({ ...config, cases: cases.filter((_, idx) => idx !== i) });

  return (
    <>
      <div className="config-field">
        <label>{t('configs.switch.fieldToMatch')}</label>
        <input value={(config.field as string) || ''} onChange={(e) => onChange({ ...config, field: e.target.value })} placeholder={t('configs.switch.fieldPlaceholder')} />
      </div>
      <div className="config-field">
        <label>{t('configs.switch.cases')}</label>
        {cases.map((c, i) => (
          <div key={i} className="assignment-row">
            <input value={c.value} onChange={(e) => updateCase(i, e.target.value)} placeholder={t('configs.switch.casePlaceholder', { n: String(i + 1) })} />
            <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{'\u2192'} {t('configs.switch.output')} {i}</span>
            {cases.length > 1 && <button className="btn-icon" onClick={() => removeCase(i)}><Trash2 size={14} /></button>}
          </div>
        ))}
        <button className="btn btn-sm" onClick={addCase} style={{ marginTop: 4 }}><Plus size={12} /> {t('configs.switch.addCase')}</button>
      </div>
    </>
  );
}

export function LoopConfig({ config, onChange }: Props) {
  const { t } = useI18n();
  return (
    <>
      <div className="config-field">
        <label>{t('configs.loop.arrayField')}</label>
        <input value={(config.arrayField as string) || ''} onChange={(e) => onChange({ ...config, arrayField: e.target.value })} placeholder={t('configs.loop.arrayFieldPlaceholder')} />
      </div>
      <div className="config-field">
        <label>{t('configs.loop.batchSize')}</label>
        <input type="number" value={(config.batchSize as number) || 1} onChange={(e) => onChange({ ...config, batchSize: parseInt(e.target.value) || 1 })} />
      </div>
    </>
  );
}

export function FilterConfig({ config, onChange }: Props) {
  const { t } = useI18n();
  return (
    <>
      <div className="config-field">
        <label>{t('configs.filter.field')}</label>
        <input value={(config.field as string) || ''} onChange={(e) => onChange({ ...config, field: e.target.value })} placeholder={t('configs.filter.fieldPlaceholder')} />
      </div>
      <div className="config-field">
        <label>{t('configs.filter.operator')}</label>
        <select value={(config.operator as string) || 'exists'} onChange={(e) => onChange({ ...config, operator: e.target.value })}>
          <option value="equals">{t('configs.filter.equals')}</option>
          <option value="notEquals">{t('configs.filter.notEquals')}</option>
          <option value="gt">{t('configs.filter.greaterThan')}</option>
          <option value="lt">{t('configs.filter.lessThan')}</option>
          <option value="contains">{t('configs.filter.contains')}</option>
          <option value="exists">{t('configs.filter.exists')}</option>
        </select>
      </div>
      <div className="config-field">
        <label>{t('configs.filter.value')}</label>
        <input value={(config.value as string) || ''} onChange={(e) => onChange({ ...config, value: e.target.value })} placeholder={t('configs.filter.valuePlaceholder')} />
      </div>
    </>
  );
}

export function SortConfig({ config, onChange }: Props) {
  const { t } = useI18n();
  return (
    <>
      <div className="config-field">
        <label>{t('configs.sort.fieldToSort')}</label>
        <input value={(config.field as string) || ''} onChange={(e) => onChange({ ...config, field: e.target.value })} placeholder={t('configs.sort.fieldPlaceholder')} />
      </div>
      <div className="config-field">
        <label>{t('configs.sort.direction')}</label>
        <select value={(config.direction as string) || 'asc'} onChange={(e) => onChange({ ...config, direction: e.target.value })}>
          <option value="asc">{t('configs.sort.ascending')}</option>
          <option value="desc">{t('configs.sort.descending')}</option>
        </select>
      </div>
    </>
  );
}

export function SplitConfig({ config, onChange }: Props) {
  const { t } = useI18n();
  return (
    <div className="config-field">
      <label>{t('configs.split.arrayField')}</label>
      <input value={(config.arrayField as string) || ''} onChange={(e) => onChange({ ...config, arrayField: e.target.value })} placeholder={t('configs.split.placeholder')} />
    </div>
  );
}

export function AggregateConfig({ config, onChange }: Props) {
  const { t } = useI18n();
  return (
    <div className="config-field">
      <label>{t('configs.aggregate.outputField')}</label>
      <input value={(config.outputField as string) || ''} onChange={(e) => onChange({ ...config, outputField: e.target.value })} placeholder={t('configs.aggregate.placeholder')} />
    </div>
  );
}

export function AiLlmConfig({ config, onChange }: Props) {
  const { t } = useI18n();
  return (
    <>
      <div className="config-field">
        <label>{t('configs.aiLlm.provider')}</label>
        <select value={(config.provider as string) || 'openai'} onChange={(e) => onChange({ ...config, provider: e.target.value })}>
          <option value="openai">{t('configs.aiLlm.openai')}</option>
          <option value="anthropic">{t('configs.aiLlm.anthropic')}</option>
        </select>
      </div>
      <div className="config-field">
        <label>{t('configs.aiLlm.model')}</label>
        <input value={(config.model as string) || ''} onChange={(e) => onChange({ ...config, model: e.target.value })} placeholder={t('configs.aiLlm.modelPlaceholder')} />
      </div>
      <div className="config-field">
        <label>{t('configs.aiLlm.apiKey')}</label>
        <input type="password" value={(config.apiKey as string) || ''} onChange={(e) => onChange({ ...config, apiKey: e.target.value })} placeholder={t('configs.aiLlm.apiKeyPlaceholder')} />
      </div>
      <div className="config-field">
        <label>{t('configs.aiLlm.systemPrompt')}</label>
        <textarea rows={3} value={(config.systemPrompt as string) || ''} onChange={(e) => onChange({ ...config, systemPrompt: e.target.value })} placeholder={t('configs.aiLlm.systemPromptPlaceholder')} />
      </div>
      <div className="config-field">
        <label>{t('configs.aiLlm.userPrompt')}</label>
        <textarea rows={4} value={(config.userPrompt as string) || ''} onChange={(e) => onChange({ ...config, userPrompt: e.target.value })} placeholder={t('configs.aiLlm.userPromptPlaceholder')} />
      </div>
      <div className="config-field">
        <label>{t('configs.aiLlm.temperature')} ({(config.temperature as number) ?? 0.7})</label>
        <input type="range" min="0" max="2" step="0.1" value={(config.temperature as number) ?? 0.7} onChange={(e) => onChange({ ...config, temperature: parseFloat(e.target.value) })} />
      </div>
      <div className="config-field">
        <label>{t('configs.aiLlm.maxTokens')}</label>
        <input type="number" value={(config.maxTokens as number) || 1024} onChange={(e) => onChange({ ...config, maxTokens: parseInt(e.target.value) || 1024 })} />
      </div>
    </>
  );
}

export function AiClassifierConfig({ config, onChange }: Props) {
  const { t } = useI18n();
  return (
    <>
      <div className="config-field">
        <label>{t('configs.aiClassifier.provider')}</label>
        <select value={(config.provider as string) || 'openai'} onChange={(e) => onChange({ ...config, provider: e.target.value })}>
          <option value="openai">{t('configs.aiClassifier.openai')}</option>
          <option value="anthropic">{t('configs.aiClassifier.anthropic')}</option>
        </select>
      </div>
      <div className="config-field">
        <label>{t('configs.aiClassifier.model')}</label>
        <input value={(config.model as string) || ''} onChange={(e) => onChange({ ...config, model: e.target.value })} placeholder={t('configs.aiClassifier.modelPlaceholder')} />
      </div>
      <div className="config-field">
        <label>{t('configs.aiClassifier.apiKey')}</label>
        <input type="password" value={(config.apiKey as string) || ''} onChange={(e) => onChange({ ...config, apiKey: e.target.value })} placeholder={t('configs.aiClassifier.apiKeyPlaceholder')} />
      </div>
      <div className="config-field">
        <label>{t('configs.aiClassifier.inputField')}</label>
        <input value={(config.inputField as string) || ''} onChange={(e) => onChange({ ...config, inputField: e.target.value })} placeholder={t('configs.aiClassifier.inputFieldPlaceholder')} />
      </div>
      <div className="config-field">
        <label>{t('configs.aiClassifier.categories')}</label>
        <input value={(config.categories as string) || ''} onChange={(e) => onChange({ ...config, categories: e.target.value })} placeholder={t('configs.aiClassifier.categoriesPlaceholder')} />
      </div>
    </>
  );
}

export function AiSummarizeConfig({ config, onChange }: Props) {
  const { t } = useI18n();
  return (
    <>
      <div className="config-field">
        <label>{t('configs.aiSummarize.provider')}</label>
        <select value={(config.provider as string) || 'openai'} onChange={(e) => onChange({ ...config, provider: e.target.value })}>
          <option value="openai">{t('configs.aiSummarize.openai')}</option>
          <option value="anthropic">{t('configs.aiSummarize.anthropic')}</option>
        </select>
      </div>
      <div className="config-field">
        <label>{t('configs.aiSummarize.model')}</label>
        <input value={(config.model as string) || ''} onChange={(e) => onChange({ ...config, model: e.target.value })} placeholder={t('configs.aiSummarize.modelPlaceholder')} />
      </div>
      <div className="config-field">
        <label>{t('configs.aiSummarize.apiKey')}</label>
        <input type="password" value={(config.apiKey as string) || ''} onChange={(e) => onChange({ ...config, apiKey: e.target.value })} placeholder={t('configs.aiSummarize.apiKeyPlaceholder')} />
      </div>
      <div className="config-field">
        <label>{t('configs.aiSummarize.inputField')}</label>
        <input value={(config.inputField as string) || ''} onChange={(e) => onChange({ ...config, inputField: e.target.value })} placeholder={t('configs.aiSummarize.inputFieldPlaceholder')} />
      </div>
      <div className="config-field">
        <label>{t('configs.aiSummarize.maxLength')}</label>
        <input type="number" value={(config.maxLength as number) || 200} onChange={(e) => onChange({ ...config, maxLength: parseInt(e.target.value) || 200 })} />
      </div>
      <div className="config-field">
        <label>{t('configs.aiSummarize.language')}</label>
        <select value={(config.language as string) || 'en'} onChange={(e) => onChange({ ...config, language: e.target.value })}>
          <option value="en">{t('configs.aiSummarize.langEn')}</option>
          <option value="ru">{t('configs.aiSummarize.langRu')}</option>
          <option value="es">{t('configs.aiSummarize.langEs')}</option>
          <option value="fr">{t('configs.aiSummarize.langFr')}</option>
          <option value="de">{t('configs.aiSummarize.langDe')}</option>
          <option value="zh">{t('configs.aiSummarize.langZh')}</option>
          <option value="ja">{t('configs.aiSummarize.langJa')}</option>
        </select>
      </div>
    </>
  );
}

export function EmailSendConfig({ config, onChange }: Props) {
  const { t } = useI18n();
  return (
    <>
      <div className="config-field">
        <label>{t('configs.emailSend.to')}</label>
        <input value={(config.to as string) || ''} onChange={(e) => onChange({ ...config, to: e.target.value })} placeholder={t('configs.emailSend.toPlaceholder')} />
      </div>
      <div className="config-field">
        <label>{t('configs.emailSend.subject')}</label>
        <input value={(config.subject as string) || ''} onChange={(e) => onChange({ ...config, subject: e.target.value })} placeholder={t('configs.emailSend.subjectPlaceholder')} />
      </div>
      <div className="config-field">
        <label>{t('configs.emailSend.body')}</label>
        <textarea rows={5} value={(config.body as string) || ''} onChange={(e) => onChange({ ...config, body: e.target.value })} placeholder={t('configs.emailSend.bodyPlaceholder')} />
      </div>
      <div className="config-field">
        <label>{t('configs.emailSend.smtpHost')}</label>
        <input value={(config.smtpHost as string) || ''} onChange={(e) => onChange({ ...config, smtpHost: e.target.value })} placeholder={t('configs.emailSend.smtpHostPlaceholder')} />
      </div>
      <div className="config-field">
        <label>{t('configs.emailSend.smtpPort')}</label>
        <input type="number" value={(config.smtpPort as number) || 587} onChange={(e) => onChange({ ...config, smtpPort: parseInt(e.target.value) || 587 })} />
      </div>
      <div className="config-field">
        <label>{t('configs.emailSend.smtpUser')}</label>
        <input value={(config.smtpUser as string) || ''} onChange={(e) => onChange({ ...config, smtpUser: e.target.value })} />
      </div>
      <div className="config-field">
        <label>{t('configs.emailSend.smtpPassword')}</label>
        <input type="password" value={(config.smtpPass as string) || ''} onChange={(e) => onChange({ ...config, smtpPass: e.target.value })} />
      </div>
    </>
  );
}

export function LogConfig({ config, onChange }: Props) {
  const { t } = useI18n();
  return (
    <div className="config-field">
      <label>{t('configs.log.messageTemplate')}</label>
      <input value={(config.message as string) || ''} onChange={(e) => onChange({ ...config, message: e.target.value })} placeholder={t('configs.log.placeholder')} />
    </div>
  );
}

export function ErrorTriggerConfig({}: Props) {
  const { t } = useI18n();
  return (
    <div style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '8px 0' }}>
      {t('configs.errorTrigger.info')}
    </div>
  );
}

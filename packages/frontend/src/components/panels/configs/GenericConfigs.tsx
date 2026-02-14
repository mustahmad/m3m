import { Plus, Trash2 } from 'lucide-react';

interface Props {
  nodeId: string;
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}

export function ScheduleTriggerConfig({ config, onChange }: Props) {
  return (
    <>
      <div className="config-field">
        <label>Cron Expression</label>
        <input value={(config.cron as string) || ''} onChange={(e) => onChange({ ...config, cron: e.target.value })} placeholder="0 * * * *" />
      </div>
      <div className="config-field">
        <label>Timezone</label>
        <input value={(config.timezone as string) || 'UTC'} onChange={(e) => onChange({ ...config, timezone: e.target.value })} placeholder="UTC" />
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '0 2px' }}>
        Examples: <code>*/5 * * * *</code> (every 5 min), <code>0 9 * * 1-5</code> (9am weekdays)
      </div>
    </>
  );
}

export function DelayConfig({ config, onChange }: Props) {
  return (
    <>
      <div className="config-field">
        <label>Duration</label>
        <input type="number" value={(config.duration as number) || 1000} onChange={(e) => onChange({ ...config, duration: parseInt(e.target.value) || 0 })} />
      </div>
      <div className="config-field">
        <label>Unit</label>
        <select value={(config.unit as string) || 'ms'} onChange={(e) => onChange({ ...config, unit: e.target.value })}>
          <option value="ms">Milliseconds</option>
          <option value="s">Seconds</option>
          <option value="m">Minutes</option>
        </select>
      </div>
    </>
  );
}

export function SwitchConfig({ config, onChange }: Props) {
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
        <label>Field to match</label>
        <input value={(config.field as string) || ''} onChange={(e) => onChange({ ...config, field: e.target.value })} placeholder="status" />
      </div>
      <div className="config-field">
        <label>Cases</label>
        {cases.map((c, i) => (
          <div key={i} className="assignment-row">
            <input value={c.value} onChange={(e) => updateCase(i, e.target.value)} placeholder={`Case ${i + 1} value`} />
            <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>→ Output {i}</span>
            {cases.length > 1 && <button className="btn-icon" onClick={() => removeCase(i)}><Trash2 size={14} /></button>}
          </div>
        ))}
        <button className="btn btn-sm" onClick={addCase} style={{ marginTop: 4 }}><Plus size={12} /> Add Case</button>
      </div>
    </>
  );
}

export function LoopConfig({ config, onChange }: Props) {
  return (
    <>
      <div className="config-field">
        <label>Array Field</label>
        <input value={(config.arrayField as string) || ''} onChange={(e) => onChange({ ...config, arrayField: e.target.value })} placeholder="items" />
      </div>
      <div className="config-field">
        <label>Batch Size</label>
        <input type="number" value={(config.batchSize as number) || 1} onChange={(e) => onChange({ ...config, batchSize: parseInt(e.target.value) || 1 })} />
      </div>
    </>
  );
}

export function FilterConfig({ config, onChange }: Props) {
  return (
    <>
      <div className="config-field">
        <label>Field</label>
        <input value={(config.field as string) || ''} onChange={(e) => onChange({ ...config, field: e.target.value })} placeholder="status" />
      </div>
      <div className="config-field">
        <label>Operator</label>
        <select value={(config.operator as string) || 'exists'} onChange={(e) => onChange({ ...config, operator: e.target.value })}>
          <option value="equals">Equals</option>
          <option value="notEquals">Not Equals</option>
          <option value="gt">Greater Than</option>
          <option value="lt">Less Than</option>
          <option value="contains">Contains</option>
          <option value="exists">Exists</option>
        </select>
      </div>
      <div className="config-field">
        <label>Value</label>
        <input value={(config.value as string) || ''} onChange={(e) => onChange({ ...config, value: e.target.value })} placeholder="expected value" />
      </div>
    </>
  );
}

export function SortConfig({ config, onChange }: Props) {
  return (
    <>
      <div className="config-field">
        <label>Field to Sort By</label>
        <input value={(config.field as string) || ''} onChange={(e) => onChange({ ...config, field: e.target.value })} placeholder="created_at" />
      </div>
      <div className="config-field">
        <label>Direction</label>
        <select value={(config.direction as string) || 'asc'} onChange={(e) => onChange({ ...config, direction: e.target.value })}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </>
  );
}

export function SplitConfig({ config, onChange }: Props) {
  return (
    <div className="config-field">
      <label>Array Field to Split</label>
      <input value={(config.arrayField as string) || ''} onChange={(e) => onChange({ ...config, arrayField: e.target.value })} placeholder="items" />
    </div>
  );
}

export function AggregateConfig({ config, onChange }: Props) {
  return (
    <div className="config-field">
      <label>Output Field Name</label>
      <input value={(config.outputField as string) || ''} onChange={(e) => onChange({ ...config, outputField: e.target.value })} placeholder="items" />
    </div>
  );
}

export function AiLlmConfig({ config, onChange }: Props) {
  return (
    <>
      <div className="config-field">
        <label>Provider</label>
        <select value={(config.provider as string) || 'openai'} onChange={(e) => onChange({ ...config, provider: e.target.value })}>
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic (Claude)</option>
        </select>
      </div>
      <div className="config-field">
        <label>Model</label>
        <input value={(config.model as string) || ''} onChange={(e) => onChange({ ...config, model: e.target.value })} placeholder="gpt-4o" />
      </div>
      <div className="config-field">
        <label>API Key</label>
        <input type="password" value={(config.apiKey as string) || ''} onChange={(e) => onChange({ ...config, apiKey: e.target.value })} placeholder="sk-..." />
      </div>
      <div className="config-field">
        <label>System Prompt</label>
        <textarea rows={3} value={(config.systemPrompt as string) || ''} onChange={(e) => onChange({ ...config, systemPrompt: e.target.value })} placeholder="You are a helpful assistant." />
      </div>
      <div className="config-field">
        <label>User Prompt</label>
        <textarea rows={4} value={(config.userPrompt as string) || ''} onChange={(e) => onChange({ ...config, userPrompt: e.target.value })} placeholder="{{input.message}}" />
      </div>
      <div className="config-field">
        <label>Temperature ({(config.temperature as number) ?? 0.7})</label>
        <input type="range" min="0" max="2" step="0.1" value={(config.temperature as number) ?? 0.7} onChange={(e) => onChange({ ...config, temperature: parseFloat(e.target.value) })} />
      </div>
      <div className="config-field">
        <label>Max Tokens</label>
        <input type="number" value={(config.maxTokens as number) || 1024} onChange={(e) => onChange({ ...config, maxTokens: parseInt(e.target.value) || 1024 })} />
      </div>
    </>
  );
}

export function AiClassifierConfig({ config, onChange }: Props) {
  return (
    <>
      <div className="config-field">
        <label>Provider</label>
        <select value={(config.provider as string) || 'openai'} onChange={(e) => onChange({ ...config, provider: e.target.value })}>
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic (Claude)</option>
        </select>
      </div>
      <div className="config-field">
        <label>Model</label>
        <input value={(config.model as string) || ''} onChange={(e) => onChange({ ...config, model: e.target.value })} placeholder="gpt-4o-mini" />
      </div>
      <div className="config-field">
        <label>API Key</label>
        <input type="password" value={(config.apiKey as string) || ''} onChange={(e) => onChange({ ...config, apiKey: e.target.value })} placeholder="sk-..." />
      </div>
      <div className="config-field">
        <label>Input Field</label>
        <input value={(config.inputField as string) || ''} onChange={(e) => onChange({ ...config, inputField: e.target.value })} placeholder="text" />
      </div>
      <div className="config-field">
        <label>Categories (comma-separated)</label>
        <input value={(config.categories as string) || ''} onChange={(e) => onChange({ ...config, categories: e.target.value })} placeholder="positive, negative, neutral" />
      </div>
    </>
  );
}

export function AiSummarizeConfig({ config, onChange }: Props) {
  return (
    <>
      <div className="config-field">
        <label>Provider</label>
        <select value={(config.provider as string) || 'openai'} onChange={(e) => onChange({ ...config, provider: e.target.value })}>
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic (Claude)</option>
        </select>
      </div>
      <div className="config-field">
        <label>Model</label>
        <input value={(config.model as string) || ''} onChange={(e) => onChange({ ...config, model: e.target.value })} placeholder="gpt-4o-mini" />
      </div>
      <div className="config-field">
        <label>API Key</label>
        <input type="password" value={(config.apiKey as string) || ''} onChange={(e) => onChange({ ...config, apiKey: e.target.value })} placeholder="sk-..." />
      </div>
      <div className="config-field">
        <label>Input Field</label>
        <input value={(config.inputField as string) || ''} onChange={(e) => onChange({ ...config, inputField: e.target.value })} placeholder="text" />
      </div>
      <div className="config-field">
        <label>Max Summary Length (words)</label>
        <input type="number" value={(config.maxLength as number) || 200} onChange={(e) => onChange({ ...config, maxLength: parseInt(e.target.value) || 200 })} />
      </div>
      <div className="config-field">
        <label>Language</label>
        <select value={(config.language as string) || 'en'} onChange={(e) => onChange({ ...config, language: e.target.value })}>
          <option value="en">English</option>
          <option value="ru">Russian</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
          <option value="ja">Japanese</option>
        </select>
      </div>
    </>
  );
}

export function EmailSendConfig({ config, onChange }: Props) {
  return (
    <>
      <div className="config-field">
        <label>To</label>
        <input value={(config.to as string) || ''} onChange={(e) => onChange({ ...config, to: e.target.value })} placeholder="user@example.com" />
      </div>
      <div className="config-field">
        <label>Subject</label>
        <input value={(config.subject as string) || ''} onChange={(e) => onChange({ ...config, subject: e.target.value })} placeholder="Notification from m3m" />
      </div>
      <div className="config-field">
        <label>Body</label>
        <textarea rows={5} value={(config.body as string) || ''} onChange={(e) => onChange({ ...config, body: e.target.value })} placeholder="Hello, {{input.name}}..." />
      </div>
      <div className="config-field">
        <label>SMTP Host</label>
        <input value={(config.smtpHost as string) || ''} onChange={(e) => onChange({ ...config, smtpHost: e.target.value })} placeholder="smtp.gmail.com" />
      </div>
      <div className="config-field">
        <label>SMTP Port</label>
        <input type="number" value={(config.smtpPort as number) || 587} onChange={(e) => onChange({ ...config, smtpPort: parseInt(e.target.value) || 587 })} />
      </div>
      <div className="config-field">
        <label>SMTP User</label>
        <input value={(config.smtpUser as string) || ''} onChange={(e) => onChange({ ...config, smtpUser: e.target.value })} />
      </div>
      <div className="config-field">
        <label>SMTP Password</label>
        <input type="password" value={(config.smtpPass as string) || ''} onChange={(e) => onChange({ ...config, smtpPass: e.target.value })} />
      </div>
    </>
  );
}

export function LogConfig({ config, onChange }: Props) {
  return (
    <div className="config-field">
      <label>Log Message Template</label>
      <input value={(config.message as string) || ''} onChange={(e) => onChange({ ...config, message: e.target.value })} placeholder="Debug: {{input}}" />
    </div>
  );
}

export function ErrorTriggerConfig({}: Props) {
  return (
    <div style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '8px 0' }}>
      This node activates when any other node in the workflow encounters an error. No configuration needed.
    </div>
  );
}

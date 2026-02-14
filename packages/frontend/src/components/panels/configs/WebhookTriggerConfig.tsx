interface Props {
  nodeId: string;
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}

export function WebhookTriggerConfig({ config, onChange }: Props) {
  return (
    <>
      <div className="config-field">
        <label>Method</label>
        <select value={(config.method as string) || 'POST'} onChange={(e) => onChange({ ...config, method: e.target.value })}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>
      <div className="config-field">
        <label>Path</label>
        <input
          value={(config.path as string) || ''}
          onChange={(e) => onChange({ ...config, path: e.target.value })}
          placeholder="/webhook"
        />
      </div>
      <div className="config-field">
        <label>Response Code</label>
        <input
          type="number"
          value={(config.responseCode as number) || 200}
          onChange={(e) => onChange({ ...config, responseCode: parseInt(e.target.value) || 200 })}
        />
      </div>
    </>
  );
}

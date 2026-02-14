interface Props {
  nodeId: string;
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}

export function HttpRequestConfig({ config, onChange }: Props) {
  return (
    <>
      <div className="config-field">
        <label>Method</label>
        <select value={(config.method as string) || 'GET'} onChange={(e) => onChange({ ...config, method: e.target.value })}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>
      <div className="config-field">
        <label>URL</label>
        <input
          value={(config.url as string) || ''}
          onChange={(e) => onChange({ ...config, url: e.target.value })}
          placeholder="https://api.example.com/data"
        />
      </div>
      <div className="config-field">
        <label>Headers (JSON)</label>
        <textarea
          rows={3}
          value={(config.headers as string) || '{}'}
          onChange={(e) => onChange({ ...config, headers: e.target.value })}
          placeholder='{"Authorization": "Bearer ..."}'
        />
      </div>
      <div className="config-field">
        <label>Body</label>
        <textarea
          rows={5}
          value={(config.body as string) || ''}
          onChange={(e) => onChange({ ...config, body: e.target.value })}
          placeholder='{"key": "{{input.value}}"}'
        />
      </div>
    </>
  );
}

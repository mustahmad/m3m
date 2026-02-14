interface Props {
  nodeId: string;
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}

export function CodeFunctionConfig({ config, onChange }: Props) {
  return (
    <>
      <div className="config-field">
        <label>JavaScript Code</label>
        <textarea
          rows={12}
          value={(config.code as string) || ''}
          onChange={(e) => onChange({ ...config, code: e.target.value })}
          placeholder="// Access input data via `input`&#10;// Return data for next node&#10;return input;"
          style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: 12 }}
        />
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '0 2px' }}>
        Use <code style={{ color: 'var(--accent-warning)' }}>input</code> to access incoming data.
        Return an object to pass to the next node. 5s timeout.
      </div>
    </>
  );
}

interface Props {
  nodeId: string;
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}

export function MergeConfig({ config, onChange }: Props) {
  const mode = (config.mode as string) || 'append';
  return (
    <>
      <div className="config-field">
        <label>Merge Mode</label>
        <select value={mode} onChange={(e) => onChange({ ...config, mode: e.target.value })}>
          <option value="append">Append (combine into array)</option>
          <option value="mergeByIndex">Merge by Index (Object.assign)</option>
          <option value="mergeByKey">Merge by Key</option>
        </select>
      </div>
      {mode === 'mergeByKey' && (
        <div className="config-field">
          <label>Merge Key</label>
          <input
            value={(config.mergeKey as string) || ''}
            onChange={(e) => onChange({ ...config, mergeKey: e.target.value })}
            placeholder="id"
          />
        </div>
      )}
    </>
  );
}

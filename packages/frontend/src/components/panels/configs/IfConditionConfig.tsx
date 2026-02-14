interface Props {
  nodeId: string;
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}

export function IfConditionConfig({ config, onChange }: Props) {
  return (
    <>
      <div className="config-field">
        <label>Field (dot notation)</label>
        <input
          value={(config.field as string) || ''}
          onChange={(e) => onChange({ ...config, field: e.target.value })}
          placeholder="body.status"
        />
      </div>
      <div className="config-field">
        <label>Operator</label>
        <select value={(config.operator as string) || 'equals'} onChange={(e) => onChange({ ...config, operator: e.target.value })}>
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
        <input
          value={(config.value as string) || ''}
          onChange={(e) => onChange({ ...config, value: e.target.value })}
          placeholder="expected value"
        />
      </div>
    </>
  );
}

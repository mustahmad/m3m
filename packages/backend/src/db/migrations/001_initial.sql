CREATE TABLE IF NOT EXISTS workflows (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL DEFAULT 'Untitled Workflow',
    description TEXT DEFAULT '',
    graph       TEXT NOT NULL DEFAULT '{"nodes":[],"connections":[],"viewport":{"x":0,"y":0,"zoom":1}}',
    is_active   INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS executions (
    id            TEXT PRIMARY KEY,
    workflow_id   TEXT NOT NULL,
    status        TEXT NOT NULL DEFAULT 'pending',
    started_at    TEXT,
    finished_at   TEXT,
    trigger_type  TEXT,
    error_message TEXT,
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS node_executions (
    id            TEXT PRIMARY KEY,
    execution_id  TEXT NOT NULL,
    node_id       TEXT NOT NULL,
    node_type     TEXT NOT NULL,
    status        TEXT NOT NULL DEFAULT 'pending',
    input_data    TEXT,
    output_data   TEXT,
    error_message TEXT,
    started_at    TEXT,
    finished_at   TEXT,
    FOREIGN KEY (execution_id) REFERENCES executions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_executions_workflow_id ON executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_node_executions_execution_id ON node_executions(execution_id);

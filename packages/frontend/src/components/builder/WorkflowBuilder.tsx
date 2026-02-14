import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Bot, Sparkles, Settings2 } from 'lucide-react';
import { useI18n } from '../../i18n/store';
import { generateWorkflow, type PlacedWorkflow } from './generateWorkflow';

interface Message {
  role: 'user' | 'assistant' | 'error';
  content: string;
}

interface WorkflowBuilderProps {
  onClose: () => void;
  onApply: (workflow: PlacedWorkflow) => void;
}

const API_KEY_STORAGE = 'm3m_builder_api_key';
const PROVIDER_STORAGE = 'm3m_builder_provider';

export function WorkflowBuilder({ onClose, onApply }: WorkflowBuilderProps) {
  const { t } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_STORAGE) || '');
  const [provider, setProvider] = useState<'openai' | 'anthropic'>(() =>
    (localStorage.getItem(PROVIDER_STORAGE) as 'openai' | 'anthropic') || 'openai'
  );
  const [lastWorkflow, setLastWorkflow] = useState<PlacedWorkflow | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const saveSettings = () => {
    localStorage.setItem(API_KEY_STORAGE, apiKey);
    localStorage.setItem(PROVIDER_STORAGE, provider);
    setShowSettings(false);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    if (!apiKey) {
      setShowSettings(true);
      return;
    }

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setIsLoading(true);
    setLastWorkflow(null);

    try {
      const workflow = await generateWorkflow(text, provider, apiKey);
      setLastWorkflow(workflow);
      const nodeList = workflow.nodes.map((n) => `  - ${n.data.label} (${n.type})`).join('\n');
      const edgeCount = workflow.edges.length;
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: t('builder.generated', {
            name: workflow.name,
            nodeCount: String(workflow.nodes.length),
            edgeCount: String(edgeCount),
          }) + '\n\n' + nodeList,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'error', content: err.message || 'Unknown error' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleApply = () => {
    if (lastWorkflow) {
      onApply(lastWorkflow);
      onClose();
    }
  };

  return (
    <div className="builder-overlay" onClick={onClose}>
      <div className="builder-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="builder-header">
          <div className="builder-header-title">
            <Bot size={20} />
            <span>{t('builder.title')}</span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className="btn-icon" onClick={() => setShowSettings(!showSettings)} title={t('builder.settings')}>
              <Settings2 size={16} />
            </button>
            <button className="btn-icon" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <div className="builder-settings">
            <div className="config-field">
              <label>{t('builder.provider')}</label>
              <select value={provider} onChange={(e) => setProvider(e.target.value as any)}>
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic (Claude)</option>
              </select>
            </div>
            <div className="config-field">
              <label>{t('builder.apiKey')}</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
              />
            </div>
            <button className="btn btn-sm btn-primary" onClick={saveSettings}>{t('common.save')}</button>
          </div>
        )}

        {/* Messages */}
        <div className="builder-messages">
          {messages.length === 0 && (
            <div className="builder-empty">
              <Sparkles size={32} style={{ opacity: 0.3 }} />
              <p>{t('builder.emptyHint')}</p>
              <div className="builder-suggestions">
                {[
                  t('builder.suggestion1'),
                  t('builder.suggestion2'),
                  t('builder.suggestion3'),
                ].map((s, i) => (
                  <button
                    key={i}
                    className="builder-suggestion"
                    onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`builder-msg builder-msg-${msg.role}`}>
              {msg.role === 'assistant' && <Bot size={16} className="builder-msg-icon" />}
              <div className="builder-msg-content">
                {msg.content.split('\n').map((line, j) => (
                  <div key={j}>{line || '\u00A0'}</div>
                ))}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="builder-msg builder-msg-assistant">
              <Bot size={16} className="builder-msg-icon" />
              <div className="builder-msg-content">
                <Loader2 size={16} className="builder-spinner" />
                {t('builder.thinking')}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Apply button */}
        {lastWorkflow && (
          <div className="builder-apply">
            <button className="btn btn-primary" onClick={handleApply}>
              <Sparkles size={14} /> {t('builder.applyWorkflow')}
            </button>
          </div>
        )}

        {/* Input */}
        <div className="builder-input-area">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('builder.inputPlaceholder')}
            rows={2}
            disabled={isLoading}
          />
          <button
            className="btn-icon builder-send"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

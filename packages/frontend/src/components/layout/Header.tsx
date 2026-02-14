import { Link } from 'react-router-dom';
import { Save, Play, ArrowLeft, HelpCircle, Globe } from 'lucide-react';
import { useWorkflowStore } from '../../stores/workflowStore';
import { useI18n, type Locale } from '../../i18n/store';

interface HeaderProps {
  onSave: () => void;
  onRun: () => void;
  onHelp?: () => void;
}

export function Header({ onSave, onRun, onHelp }: HeaderProps) {
  const workflowName = useWorkflowStore((s) => s.workflowName);
  const setWorkflowName = useWorkflowStore((s) => s.setWorkflowName);
  const isDirty = useWorkflowStore((s) => s.isDirty);
  const { t, locale, setLocale } = useI18n();

  const toggleLocale = () => setLocale(locale === 'en' ? 'ru' : 'en' as Locale);

  return (
    <header className="header">
      <Link to="/" className="btn-icon" title={t('header.backToWorkflows')}>
        <ArrowLeft size={18} />
      </Link>
      <span className="header-logo">m3m</span>
      <div className="header-title">
        <input
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
          placeholder={t('header.workflowPlaceholder')}
        />
        {isDirty && <span style={{ color: 'var(--accent-warning)', fontSize: 11, marginLeft: 8 }}>{t('header.unsaved')}</span>}
      </div>
      <div className="header-actions">
        <button className="btn-icon locale-toggle" onClick={toggleLocale} title="EN / RU">
          <Globe size={16} />
          <span className="locale-label">{locale.toUpperCase()}</span>
        </button>
        {onHelp && (
          <button className="btn-icon" onClick={onHelp} title={t('header.showTutorial')}>
            <HelpCircle size={18} />
          </button>
        )}
        <button className="btn" onClick={onSave} title={t('header.saveTooltip')}>
          <Save size={14} /> {t('common.save')}
        </button>
        <button className="btn btn-success" onClick={onRun} title={t('header.runWorkflow')}>
          <Play size={14} /> {t('common.run')}
        </button>
      </div>
    </header>
  );
}

import { Workflow, Zap, MousePointerClick, Cable, Settings, Play } from 'lucide-react';
import { useI18n } from '../../i18n/store';
import { NODE_DEFINITIONS } from '@m3m/shared';

interface WelcomeModalProps {
  onClose: () => void;
  onCreateDemo: () => void;
}

const showcaseNodes = ['webhookTrigger', 'httpRequest', 'codeFunction', 'ifCondition', 'setData', 'merge'] as const;

export function WelcomeModal({ onClose, onCreateDemo }: WelcomeModalProps) {
  const { t } = useI18n();
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="welcome-modal" onClick={(e) => e.stopPropagation()}>
        <div className="welcome-header">
          <span className="welcome-logo">m3m</span>
          <h2>{t('onboarding.welcomeTitle')}</h2>
          <p className="welcome-subtitle">{t('onboarding.welcomeSubtitle')}</p>
        </div>

        <div className="welcome-steps">
          <div className="welcome-step">
            <div className="welcome-step-icon" style={{ background: 'rgba(124,92,252,0.15)', color: '#7c5cfc' }}>
              <MousePointerClick size={20} />
            </div>
            <div>
              <h4>{t('onboarding.step1Title')}</h4>
              <p>{t('onboarding.step1Desc')}</p>
            </div>
          </div>

          <div className="welcome-step">
            <div className="welcome-step-icon" style={{ background: 'rgba(255,109,90,0.15)', color: '#ff6d5a' }}>
              <Zap size={20} />
            </div>
            <div>
              <h4>{t('onboarding.step2Title')}</h4>
              <p>{t('onboarding.step2Desc')}</p>
            </div>
          </div>

          <div className="welcome-step">
            <div className="welcome-step-icon" style={{ background: 'rgba(0,201,167,0.15)', color: '#00c9a7' }}>
              <Cable size={20} />
            </div>
            <div>
              <h4>{t('onboarding.step3Title')}</h4>
              <p>{t('onboarding.step3Desc')}</p>
            </div>
          </div>

          <div className="welcome-step">
            <div className="welcome-step-icon" style={{ background: 'rgba(10,189,227,0.15)', color: '#0abde3' }}>
              <Settings size={20} />
            </div>
            <div>
              <h4>{t('onboarding.step4Title')}</h4>
              <p>{t('onboarding.step4Desc')}</p>
            </div>
          </div>

          <div className="welcome-step">
            <div className="welcome-step-icon" style={{ background: 'rgba(255,159,67,0.15)', color: '#ff9f43' }}>
              <Play size={20} />
            </div>
            <div>
              <h4>{t('onboarding.step5Title')}</h4>
              <p>{t('onboarding.step5Desc')}</p>
            </div>
          </div>
        </div>

        <div className="welcome-nodes">
          <h4>{t('onboarding.availableNodes')}</h4>
          <div className="welcome-node-grid">
            {showcaseNodes.map((key) => {
              const def = NODE_DEFINITIONS[key];
              return (
                <span key={key} className="welcome-node-tag" style={{ borderColor: def.color }}>
                  {t(`nodes.${key}.label`)}
                </span>
              );
            })}
          </div>
        </div>

        <div className="welcome-actions">
          <button className="btn" onClick={onClose}>{t('onboarding.getStarted')}</button>
          <button className="btn btn-primary" onClick={onCreateDemo}>
            <Workflow size={14} /> {t('onboarding.tryDemo')}
          </button>
        </div>
      </div>
    </div>
  );
}

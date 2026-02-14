import { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useI18n } from '../../i18n/store';

interface TourStep {
  target: string;
  titleKey: string;
  descKey: string;
  position: 'right' | 'bottom' | 'center';
  optional?: boolean;
}

const TOUR_STEPS: TourStep[] = [
  {
    target: '.sidebar',
    titleKey: 'onboarding.tourNodePalette',
    descKey: 'onboarding.tourNodePaletteDesc',
    position: 'right',
  },
  {
    target: '.canvas-wrapper',
    titleKey: 'onboarding.tourCanvas',
    descKey: 'onboarding.tourCanvasDesc',
    position: 'center',
  },
  {
    target: '.header-actions',
    titleKey: 'onboarding.tourSaveRun',
    descKey: 'onboarding.tourSaveRunDesc',
    position: 'bottom',
  },
  {
    target: '.m3m-node',
    titleKey: 'onboarding.tourConfig',
    descKey: 'onboarding.tourConfigDesc',
    position: 'right',
    optional: true,
  },
];

interface EditorTourProps {
  onComplete: () => void;
}

export function EditorTour({ onComplete }: EditorTourProps) {
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    const currentStep = TOUR_STEPS[step];
    if (!currentStep) return;

    const el = document.querySelector(currentStep.target);
    if (el) {
      setTargetRect(el.getBoundingClientRect());
    } else if (currentStep.optional) {
      if (step < TOUR_STEPS.length - 1) {
        setStep(step + 1);
      } else {
        onComplete();
      }
    } else {
      setTargetRect(null);
    }
  }, [step]);

  const currentStep = TOUR_STEPS[step];
  if (!currentStep) return null;

  const next = () => {
    if (step < TOUR_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  let tooltipStyle: React.CSSProperties = {};
  if (targetRect) {
    switch (currentStep.position) {
      case 'right':
        tooltipStyle = {
          top: targetRect.top + targetRect.height / 2 - 80,
          left: targetRect.right + 16,
        };
        break;
      case 'bottom':
        tooltipStyle = {
          top: targetRect.bottom + 16,
          left: targetRect.left + targetRect.width / 2 - 160,
        };
        break;
      case 'center':
        tooltipStyle = {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
        break;
    }
  } else {
    tooltipStyle = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  }

  return (
    <div className="tour-overlay">
      {targetRect && currentStep.position !== 'center' && (
        <div
          className="tour-highlight"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
          }}
        />
      )}

      <div className="tour-tooltip" style={tooltipStyle}>
        <div className="tour-tooltip-header">
          <span className="tour-step-badge">{t('onboarding.stepOf', { current: String(step + 1), total: String(TOUR_STEPS.length) })}</span>
          <button className="btn-icon" onClick={onComplete} title={t('onboarding.skipTour')}>
            <X size={14} />
          </button>
        </div>
        <h3>{t(currentStep.titleKey)}</h3>
        <p>{t(currentStep.descKey)}</p>
        <div className="tour-tooltip-actions">
          {step > 0 && (
            <button className="btn btn-sm" onClick={prev}>
              <ArrowLeft size={12} /> {t('common.back')}
            </button>
          )}
          <button className="btn btn-sm btn-primary" onClick={next}>
            {step < TOUR_STEPS.length - 1 ? (
              <>{t('common.next')} <ArrowRight size={12} /></>
            ) : (
              t('common.finish')
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

const TOUR_STEPS = [
  {
    target: '.sidebar',
    title: 'Node Palette',
    description: 'Drag nodes from here onto the canvas. Nodes are grouped by category: Triggers start your workflow, Actions do things, Logic controls flow, and Transform modifies data.',
    position: 'right' as const,
  },
  {
    target: '.canvas-wrapper',
    title: 'Workflow Canvas',
    description: 'This is your workspace. Drop nodes here, then drag between the colored handles to connect them. Use scroll to zoom, drag empty space to pan.',
    position: 'center' as const,
  },
  {
    target: '.header-actions',
    title: 'Save & Run',
    description: 'Save your workflow with the Save button (or Cmd+S). Then click Run to execute it. You\'ll see nodes light up in real-time as they process.',
    position: 'bottom' as const,
  },
  {
    target: '.m3m-node',
    title: 'Node Configuration',
    description: 'Click any node to select it. A configuration panel will appear on the right where you can set URLs, write code, define conditions, and more.',
    position: 'right' as const,
    optional: true,
  },
];

interface EditorTourProps {
  onComplete: () => void;
}

export function EditorTour({ onComplete }: EditorTourProps) {
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const currentStep = TOUR_STEPS[step];
    if (!currentStep) return;

    const el = document.querySelector(currentStep.target);
    if (el) {
      setTargetRect(el.getBoundingClientRect());
    } else if (currentStep.optional) {
      // Skip optional steps if target not found
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
      {/* Highlight target */}
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

      {/* Tooltip */}
      <div className="tour-tooltip" style={tooltipStyle}>
        <div className="tour-tooltip-header">
          <span className="tour-step-badge">Step {step + 1}/{TOUR_STEPS.length}</span>
          <button className="btn-icon" onClick={onComplete} title="Skip tour">
            <X size={14} />
          </button>
        </div>
        <h3>{currentStep.title}</h3>
        <p>{currentStep.description}</p>
        <div className="tour-tooltip-actions">
          {step > 0 && (
            <button className="btn btn-sm" onClick={prev}>
              <ArrowLeft size={12} /> Back
            </button>
          )}
          <button className="btn btn-sm btn-primary" onClick={next}>
            {step < TOUR_STEPS.length - 1 ? (
              <>Next <ArrowRight size={12} /></>
            ) : (
              'Finish'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

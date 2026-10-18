import React from 'react';
import { Check } from 'lucide-react';
import type { WorkflowStep } from '../types/payroll';

interface StepperProps {
  currentStep: WorkflowStep;
  onStepClick: (step: WorkflowStep) => void;
  canNavigateToStep: (step: WorkflowStep) => boolean;
}

const STEPS: { step: WorkflowStep; label: string; title: string }[] = [
  { step: 1, label: 'Step 1', title: 'Employee' },
  { step: 2, label: 'Step 2', title: 'Salary & attendance' },
  { step: 3, label: 'Step 3', title: 'Review payslip' },
  { step: 4, label: 'Step 4', title: 'Distribution' },
];

export const Stepper: React.FC<StepperProps> = ({
  currentStep,
  onStepClick,
  canNavigateToStep,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
      {STEPS.map(({ step, label, title }) => {
        const isCompleted = currentStep > step;
        const isActive = currentStep === step;
        const isAllowed = canNavigateToStep(step);

        let containerClasses =
          'flex items-center gap-2.5 p-3 rounded-xl transition-all select-none ';
        if (isActive) {
          containerClasses +=
            'bg-surface-container-high border-b-2 border-primary text-on-surface shadow-xs';
        } else if (isCompleted) {
          containerClasses +=
            'bg-surface-container text-on-surface hover:bg-surface-container-high cursor-pointer';
        } else {
          containerClasses += isAllowed
            ? 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container cursor-pointer'
            : 'bg-surface-container-low/70 text-on-surface-variant/60 cursor-not-allowed';
        }

        return (
          <button
            key={step}
            type="button"
            disabled={!isAllowed && !isCompleted && !isActive}
            onClick={() => {
              if (isAllowed || isCompleted) {
                onStepClick(step);
              }
            }}
            className={`${containerClasses} text-left w-full focus:outline-none focus:ring-2 focus:ring-primary/40`}
          >
            {/* Step Icon / Number Indicator */}
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full font-mono text-xs font-semibold shrink-0 transition-colors ${
                isCompleted
                  ? 'bg-primary text-white'
                  : isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-container-highest text-on-surface-variant'
              }`}
            >
              {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : step}
            </div>

            {/* Step Label */}
            <div className="flex flex-col min-w-0">
              <span
                className={`text-[10px] font-bold tracking-wider uppercase truncate ${
                  isActive ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                {label} {isActive && '(Active)'}
              </span>
              <span
                className={`text-xs sm:text-sm font-semibold truncate ${
                  isActive || isCompleted
                    ? 'text-on-surface'
                    : 'text-on-surface-variant'
                }`}
              >
                {title}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

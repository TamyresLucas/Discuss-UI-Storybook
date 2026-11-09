import * as React from 'react';
import { CheckCircle, Circle, RadioButton, WarningCircle } from '@phosphor-icons/react';

import { cn } from '../../lib/utils';

export type StepStatus = 'not-completed' | 'completed' | 'error';
export type StepperOrientation = 'horizontal' | 'vertical';

export interface StepProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  label: React.ReactNode;
  /** Figma "Completed" and "Error": not completed (default), completed (success) or completed with an error. */
  status?: StepStatus;
  /** The step the user is on: the bolder label and the filled indicator. */
  selected?: boolean;
  /** Horizontal puts the label under the indicator; vertical puts it before the indicator, right-aligned. */
  orientation?: StepperOrientation;
}

const STATUS_TEXT: Record<StepStatus, string> = { 'not-completed': 'not completed', completed: 'completed', error: 'error' };

/** The 24px indicator: an empty ring, the selected radio, a check or a warning (filled when selected), all Phosphor icons. */
function StepIndicator({ status, selected }: { status: StepStatus; selected: boolean }) {
  const props = { size: 24, 'aria-hidden': true, className: 'shrink-0' } as const;
  if (status === 'completed') return <CheckCircle {...props} weight={selected ? 'fill' : 'regular'} className="shrink-0 text-success-foreground" />;
  if (status === 'error') return <WarningCircle {...props} weight={selected ? 'fill' : 'regular'} className="shrink-0 text-destructive-foreground" />;
  if (selected) return <RadioButton {...props} weight="fill" className="shrink-0 text-accent-foreground" />;
  return <Circle {...props} className="shrink-0 text-input-muted" />;
}

// Figma: Steps (785:557) — 12 variants: Completed × Selected × Error × Type. 136px wide, 64px min height; label body/small in secondary-muted, ui/label in foreground when selected.
export const Step = React.forwardRef<HTMLDivElement, StepProps>(
  ({ label, status = 'not-completed', selected = false, orientation = 'horizontal', className, ...props }, ref) => {
    const vertical = orientation === 'vertical';
    return (
      <div
        ref={ref}
        className={cn(
          'flex min-h-16 w-34 shrink-0',
          // The horizontal indicator sits 6px from the top, so a path beside it lines up whatever the label's length.
          vertical ? 'items-center justify-end gap-4 p-2' : 'flex-col items-center gap-2 pt-1.5',
          className,
        )}
        {...props}
      >
        {!vertical && <StepIndicator status={status} selected={selected} />}
        <span
          className={cn(
            vertical ? 'min-w-0 flex-1 text-right' : 'w-full text-center',
            selected ? 'text-ui-label text-foreground' : 'text-body-small text-secondary-muted-foreground',
          )}
        >
          {label}
          {status !== 'not-completed' && <span className="sr-only">{`, ${STATUS_TEXT[status]}`}</span>}
        </span>
        {vertical && <StepIndicator status={status} selected={selected} />}
      </div>
    );
  },
);
Step.displayName = 'Step';

export interface StepPathProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: StepperOrientation;
  /** Both steps it joins are completed: the path turns success green. */
  completed?: boolean;
}

// Figma: Step path (787:278) — a 1px line in border (success when it joins completed steps), 32px across.
export const StepPath = React.forwardRef<HTMLDivElement, StepPathProps>(
  ({ orientation = 'horizontal', completed = false, className, ...props }, ref) => {
    const vertical = orientation === 'vertical';
    return (
      <div ref={ref} aria-hidden className={cn('flex items-center justify-center', vertical ? 'h-8 w-8 flex-col' : 'h-8 flex-1', className)} {...props}>
        <div className={cn(vertical ? 'w-px flex-1' : 'h-px flex-1', completed ? 'bg-success-foreground' : 'bg-border')} />
      </div>
    );
  },
);
StepPath.displayName = 'StepPath';

export interface StepperStep {
  label: React.ReactNode;
  /** The step went wrong: shown with the warning indicator (filled when it is the current step). */
  error?: boolean;
}

export interface StepperProps extends Omit<React.HTMLAttributes<HTMLOListElement>, 'children'> {
  steps: StepperStep[];
  /** 0-based index of the step the user is on: the ones before it are completed, the ones after not completed. */
  current: number;
  orientation?: StepperOrientation;
}

/**
 * The steps of a flow joined by paths (Figma "In use": completed → selected → not completed). A path between two completed steps is green. An ordered list, with
 * `aria-current="step"` on the current step and the status of the others read out after their label.
 */
export const Stepper = React.forwardRef<HTMLOListElement, StepperProps>(({ steps, current, orientation = 'horizontal', className, ...props }, ref) => {
  const vertical = orientation === 'vertical';
  const statusOf = (i: number, step: StepperStep): StepStatus => (step.error ? 'error' : i < current ? 'completed' : 'not-completed');
  return (
    <ol ref={ref} className={cn('flex', vertical ? 'flex-col items-end' : 'w-full items-start', className)} {...props}>
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            // Horizontal: the path runs from one indicator's edge to the next (it reaches 56px into each 136px step), level with the indicators' centre.
            <li aria-hidden className={cn('flex', vertical ? 'pr-1' : '-mx-14 flex-1 pt-1.5')}>
              <StepPath orientation={orientation} completed={i < current} className={vertical ? undefined : 'h-6'} />
            </li>
          )}
          <li aria-current={i === current ? 'step' : undefined} className="flex">
            <Step label={step.label} status={statusOf(i, step)} selected={i === current} orientation={orientation} />
          </li>
        </React.Fragment>
      ))}
    </ol>
  );
});
Stepper.displayName = 'Stepper';

import * as React from 'react';
import { Check, Minus } from '@phosphor-icons/react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';
import { Label } from './Label';

export type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>;

// Figma: Checkbox (21) — 1.5px muted border at rest; accent fill when checked or indeterminate.
export const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        'peer inline-flex size-4 shrink-0 items-center justify-center rounded-xxs border-2 border-input bg-surface transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        // Brand override: selected controls use `ring`, not `primary`/`accent`.
        'data-[state=checked]:border-ring data-[state=checked]:bg-ring data-[state=checked]:text-label',
        'data-[state=indeterminate]:border-ring data-[state=indeterminate]:bg-ring data-[state=indeterminate]:text-label',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {props.checked === 'indeterminate' ? <Minus size={12} weight="bold" aria-hidden /> : <Check size={12} weight="bold" aria-hidden />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  ),
);
Checkbox.displayName = 'Checkbox';

export interface CheckboxFieldProps extends CheckboxProps {
  label: React.ReactNode;
  /** Secondary line under the label. */
  description?: React.ReactNode;
}

/** Checkbox with its label (and optional description) laid out per Figma. */
export const CheckboxField = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxFieldProps>(
  ({ label, description, id, className, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const controlId = id ?? generatedId;
    const descriptionId = `${controlId}-description`;
    return (
      <div
        className={cn('flex gap-2', description ? 'items-start pt-0.5' : 'items-center', disabled && 'opacity-50', className)}
      >
        <Checkbox
          ref={ref}
          id={controlId}
          disabled={disabled}
          aria-describedby={description ? descriptionId : undefined}
          className={description ? 'mt-0.5' : undefined}
          {...props}
        />
        <div className="flex flex-col gap-0.5">
          <Label htmlFor={controlId} className={cn(!description && 'font-normal leading-5')}>
            {label}
          </Label>
          {description && (
            <p id={descriptionId} className="text-xs text-secondary-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
    );
  },
);
CheckboxField.displayName = 'CheckboxField';

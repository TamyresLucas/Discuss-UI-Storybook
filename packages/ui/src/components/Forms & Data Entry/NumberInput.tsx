import * as React from 'react';
import { Minus, Plus } from '@phosphor-icons/react';

import { cn } from '../../lib/utils';
import { Button } from '../Buttons & Actions/Button';
import { Field, type FieldStatus } from './Field';

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'type' | 'size'> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Unit shown after the value (e.g. "minutes"). */
  unit?: string;
  status?: FieldStatus;
  label?: React.ReactNode;
  description?: React.ReactNode;
  message?: React.ReactNode;
}

// Figma: Numerical input (23) — 200px stepper: − / value + unit / +, 40px tall, 4px inner padding.
export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      value,
      defaultValue = 0,
      onValueChange,
      min = Number.NEGATIVE_INFINITY,
      max = Number.POSITIVE_INFINITY,
      step = 1,
      unit,
      status = 'default',
      label,
      description,
      message,
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [internal, setInternal] = React.useState(defaultValue);
    const current = value ?? internal;
    const clamp = (next: number) => Math.min(max, Math.max(min, next));
    const commit = (next: number) => {
      const clamped = clamp(next);
      setInternal(clamped);
      onValueChange?.(clamped);
    };

    return (
      <Field label={label} description={description} message={message} status={status} id={id} className="w-50">
        {(control) => (
          <div
            className={cn(
              'flex h-10 w-full items-center justify-between rounded-md border bg-surface p-1 transition-colors',
              'has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-ring',
              status === 'error' ? 'border-destructive' : status === 'success' ? 'border-success-foreground' : 'border-border',
              disabled && 'opacity-50',
              className,
            )}
          >
            <Button
              type="button"
              variant="subtle"
              size="icon-sm"
              aria-label="Decrease"
              disabled={disabled || current <= min}
              onClick={() => commit(current - step)}
            >
              <Minus size={16} aria-hidden />
            </Button>
            <div className="flex items-center justify-center gap-1 text-center">
              <input
                ref={ref}
                role="spinbutton"
                inputMode="numeric"
                aria-valuenow={current}
                aria-valuemin={Number.isFinite(min) ? min : undefined}
                aria-valuemax={Number.isFinite(max) ? max : undefined}
                disabled={disabled}
                value={String(current)}
                size={Math.max(1, String(current).length)}
                onChange={(event) => {
                  const parsed = Number(event.target.value.replace(/[^\d.-]/g, ''));
                  if (!Number.isNaN(parsed)) commit(parsed);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    commit(current + step);
                  } else if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    commit(current - step);
                  }
                }}
                className="min-w-0 bg-transparent text-center text-ui-label text-surface-foreground outline-none"
                {...control}
                {...props}
              />
              {unit && <span className="text-body-small text-secondary-muted-foreground">{unit}</span>}
            </div>
            <Button
              type="button"
              variant="subtle"
              size="icon-sm"
              aria-label="Increase"
              disabled={disabled || current >= max}
              onClick={() => commit(current + step)}
            >
              <Plus size={16} aria-hidden />
            </Button>
          </div>
        )}
      </Field>
    );
  },
);
NumberInput.displayName = 'NumberInput';

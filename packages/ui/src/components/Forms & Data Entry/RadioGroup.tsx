import * as React from 'react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';
import { Label } from './Label';

export type RadioGroupProps = React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>;

export const RadioGroup = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Root>, RadioGroupProps>(
  ({ className, ...props }, ref) => (
    <RadioGroupPrimitive.Root ref={ref} className={cn('flex flex-col gap-2', className)} {...props} />
  ),
);
RadioGroup.displayName = 'RadioGroup';

export type RadioGroupItemProps = React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>;

// Figma: Radio Group (24) — 20px ring in muted, accent when selected with a solid centre dot.
export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'peer inline-flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-input bg-surface transition-colors',
      'disabled:cursor-not-allowed disabled:opacity-50',
      // Brand override: selected controls use `ring`, not `primary`/`accent`.
      'data-[state=checked]:border-ring',
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="size-2.5 rounded-full bg-ring" />
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = 'RadioGroupItem';

export interface RadioGroupFieldItemProps extends RadioGroupItemProps {
  label: React.ReactNode;
  /** Secondary line under the label. */
  description?: React.ReactNode;
}

/** A radio with its label (and optional description) laid out per Figma. */
export const RadioGroupFieldItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupFieldItemProps
>(({ label, description, id, className, disabled, ...props }, ref) => {
  const generatedId = React.useId();
  const controlId = id ?? generatedId;
  const descriptionId = `${controlId}-description`;
  return (
    <div
      className={cn('flex gap-2', description ? 'items-start pt-0.5' : 'items-center', disabled && 'opacity-50', className)}
    >
      <RadioGroupItem
        ref={ref}
        id={controlId}
        disabled={disabled}
        aria-describedby={description ? descriptionId : undefined}
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
});
RadioGroupFieldItem.displayName = 'RadioGroupFieldItem';

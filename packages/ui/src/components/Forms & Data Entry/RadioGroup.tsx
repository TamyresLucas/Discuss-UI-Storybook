import * as React from 'react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';

export type RadioGroupProps = React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>;

export const RadioGroup = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Root>, RadioGroupProps>(
  ({ className, ...props }, ref) => (
    <RadioGroupPrimitive.Root ref={ref} className={cn('flex flex-col gap-2', className)} {...props} />
  ),
);
RadioGroup.displayName = 'RadioGroup';

export type RadioGroupItemProps = React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>;

export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-input bg-background transition-colors',
      'disabled:cursor-not-allowed disabled:opacity-50',
      // Brand override: selected controls use `ring`, not `primary`/`accent`.
      'data-[state=checked]:border-ring',
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="h-2 w-2 rounded-full bg-ring" />
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = 'RadioGroupItem';

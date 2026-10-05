import * as React from 'react';
import { Switch as SwitchPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';

export type SwitchProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>;

export const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  ({ className, ...props }, ref) => (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn(
        'inline-flex h-6 w-10 shrink-0 items-center rounded-full border p-1 transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        // Brand override: selected controls use `ring`, not `primary`/`accent`.
        'data-[state=checked]:border-ring data-[state=checked]:bg-ring',
        'data-[state=unchecked]:border-input data-[state=unchecked]:bg-background',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'block h-4 w-4 rounded-full bg-card shadow-sm transition-transform',
          'data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
        )}
      />
    </SwitchPrimitive.Root>
  ),
);
Switch.displayName = 'Switch';

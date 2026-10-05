import * as React from 'react';
import { Switch as SwitchPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';

export type SwitchProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>;

// Figma: Toggle / Switch (17) — 44×24 track, 20px white thumb. Off is `muted`, on is the accent.
export const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  ({ className, ...props }, ref) => (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn(
        'inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        // Brand override: selected controls use `ring`, not `primary`/`accent`.
        'data-[state=checked]:bg-ring data-[state=unchecked]:bg-muted',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'block size-5 rounded-full bg-surface shadow-sm transition-transform',
          'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
        )}
      />
    </SwitchPrimitive.Root>
  ),
);
Switch.displayName = 'Switch';

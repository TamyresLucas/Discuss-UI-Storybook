import * as React from 'react';
import { Toggle as TogglePrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';

export type ToggleProps = React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>;

// Figma: Toggle / Switch (17) › Toggle menu — a 40px square icon button that fills with `secondary` when pressed.
export const Toggle = React.forwardRef<React.ElementRef<typeof TogglePrimitive.Root>, ToggleProps>(
  ({ className, ...props }, ref) => (
    <TogglePrimitive.Root
      ref={ref}
      className={cn(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-md text-surface-foreground transition-colors',
        'hover:bg-accent-soft hover:text-accent-soft-foreground',
        'data-[state=on]:bg-secondary data-[state=on]:hover:bg-accent-soft',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    />
  ),
);
Toggle.displayName = 'Toggle';

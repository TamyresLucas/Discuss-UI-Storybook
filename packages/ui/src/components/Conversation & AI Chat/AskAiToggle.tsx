import * as React from 'react';
import { Sparkle } from '@phosphor-icons/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Toggle as TogglePrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';

const askAiToggleVariants = cva(
  'inline-flex shrink-0 items-center justify-center text-surface-foreground transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      type: {
        // 40px, filled with the subtle fill until pressed.
        menu: 'size-10 rounded-md bg-secondary bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5 data-[state=on]:bg-accent-soft data-[state=on]:bg-none data-[state=on]:text-accent-soft-foreground',
        // 32px, bare until pressed.
        action: 'size-8 rounded-sm hover:bg-accent-soft data-[state=on]:bg-accent-soft data-[state=on]:text-accent-soft-foreground',
      },
    },
    defaultVariants: { type: 'menu' },
  },
);

export interface AskAiToggleProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>, 'type'>,
    VariantProps<typeof askAiToggleVariants> {}

// Figma: User Message Bubble (54) › Ask AI toggle — sparkle toggle in a 40px menu or a 32px action size.
export const AskAiToggle = React.forwardRef<React.ElementRef<typeof TogglePrimitive.Root>, AskAiToggleProps>(
  ({ className, type, 'aria-label': ariaLabel = 'Ask AI', pressed, defaultPressed, ...props }, ref) => {
    const [internal, setInternal] = React.useState(defaultPressed ?? false);
    const on = pressed ?? internal;
    return (
      <TogglePrimitive.Root
        ref={ref}
        aria-label={ariaLabel}
        pressed={pressed}
        defaultPressed={defaultPressed}
        onPressedChange={(next) => {
          setInternal(next);
          props.onPressedChange?.(next);
        }}
        className={cn(askAiToggleVariants({ type }), className)}
        {...props}
      >
        <Sparkle size={16} weight={on ? 'fill' : 'regular'} aria-hidden />
      </TogglePrimitive.Root>
    );
  },
);
AskAiToggle.displayName = 'AskAiToggle';

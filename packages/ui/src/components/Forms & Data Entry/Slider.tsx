import * as React from 'react';
import { Slider as SliderPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';

export type SliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>;

export const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, value, defaultValue, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, ...props }, ref) => {
    const thumbValues = value ?? defaultValue ?? [0];
    return (
      <SliderPrimitive.Root
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        className={cn('relative flex w-full touch-none items-center select-none', className)}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-muted">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        {thumbValues.map((_, index) => (
          // The accessible name belongs on each individual thumb (the actual
          // role="slider" element) — Root is just a group container. With
          // more than one thumb this applies the same label to each; give a
          // range slider distinct per-thumb labels via aria-labelledby instead.
          <SliderPrimitive.Thumb
            key={index}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            className="block h-4 w-4 rounded-full border border-primary bg-background shadow-sm transition-colors disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Root>
    );
  },
);
Slider.displayName = 'Slider';

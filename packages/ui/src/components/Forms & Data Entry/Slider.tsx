import * as React from 'react';
import { Slider as SliderPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';

export interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /** Text shown above the track on the left (e.g. "Label"). The max value is shown on the right. */
  label?: React.ReactNode;
  /** Show the min and max values above the track instead of a label. */
  showRange?: boolean;
  /**
   * Show the current value in a bubble above the thumb. `true` shows it while
   * the thumb is hovered, focused or dragged; `'always'` keeps it visible.
   */
  showValue?: boolean | 'always';
}

// Figma: Slider (26) — 4px `muted` track, `input-accent` fill, 16px accent thumb, `primary` value bubble.
export const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  (
    {
      className,
      value,
      defaultValue,
      onValueChange,
      min = 0,
      max = 100,
      label,
      showRange,
      showValue,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ...props
    },
    ref,
  ) => {
    const [internal, setInternal] = React.useState<number[]>(defaultValue ?? [min]);
    const thumbValues = value ?? internal;
    const hasHeader = label != null || showRange;

    return (
      <div className={cn('flex w-full flex-col gap-2', className)}>
        {hasHeader && (
          <div className="flex items-center justify-between text-secondary-muted-foreground">
            {label != null ? (
              <span className="text-ui-label text-surface-foreground">{label}</span>
            ) : (
              <span className="text-ui-caption">{min}</span>
            )}
            <span className="text-body-small">{max}</span>
          </div>
        )}
        <SliderPrimitive.Root
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          min={min}
          max={max}
          onValueChange={(next) => {
            setInternal(next);
            onValueChange?.(next);
          }}
          className="relative flex h-4 w-full touch-none items-center select-none"
          {...props}
        >
          <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-xxs bg-muted">
            <SliderPrimitive.Range className="absolute h-full bg-input-accent" />
          </SliderPrimitive.Track>
          {thumbValues.map((thumbValue, index) => (
            // The accessible name belongs on each individual thumb (the actual
            // role="slider" element) — Root is just a group container. With
            // more than one thumb this applies the same label to each; give a
            // range slider distinct per-thumb labels via aria-labelledby instead.
            <SliderPrimitive.Thumb
              key={index}
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledBy}
              className="group relative block size-4 rounded-full border-2 border-surface bg-input-accent shadow-sm transition-colors disabled:pointer-events-none disabled:opacity-50"
            >
              {showValue && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute bottom-full left-1/2 mb-2 flex min-w-4 -translate-x-1/2 items-center justify-center rounded-xs bg-primary p-0.5 text-ui-caption text-label',
                    showValue !== 'always' && 'invisible group-hover:visible group-focus-visible:visible group-active:visible',
                  )}
                >
                  {thumbValue}
                </span>
              )}
            </SliderPrimitive.Thumb>
          ))}
        </SliderPrimitive.Root>
      </div>
    );
  },
);
Slider.displayName = 'Slider';

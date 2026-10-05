import * as React from 'react';
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';

export interface RatingScaleProps
  extends Omit<React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>, 'type' | 'value' | 'defaultValue' | 'onValueChange'> {
  /** Number of points on the scale. */
  max?: number;
  /** Selected rating (1-based), or `undefined` for none. */
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number | undefined) => void;
  /** Caption under the first point (e.g. "Not likely"). */
  lowLabel?: React.ReactNode;
  /** Caption under the last point (e.g. "Very likely"). */
  highLabel?: React.ReactNode;
}

// Figma: Question input (282:1490) › Rating scale item — equal-width 48px buttons; selected has a 2px accent border.
export const RatingScale = React.forwardRef<React.ElementRef<typeof ToggleGroupPrimitive.Root>, RatingScaleProps>(
  ({ className, max = 5, value, defaultValue, onValueChange, lowLabel, highLabel, ...props }, ref) => {
    const [internal, setInternal] = React.useState<number | undefined>(defaultValue);
    const current = value !== undefined ? value : internal;
    return (
      <div className={cn('flex w-full max-w-150 flex-col gap-2', className)}>
        <ToggleGroupPrimitive.Root
          ref={ref}
          type="single"
          value={current ? String(current) : ''}
          onValueChange={(next) => {
            const parsed = next ? Number(next) : undefined;
            setInternal(parsed);
            onValueChange?.(parsed);
          }}
          className="flex gap-2"
          {...props}
        >
          {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
            <ToggleGroupPrimitive.Item
              key={n}
              value={String(n)}
              aria-label={`${n}`}
              className={cn(
                'flex h-12 min-w-0 flex-1 items-center justify-center rounded-sm border-2 border-border bg-surface text-ui-label-large text-surface-foreground transition-colors',
                'hover:bg-accent-soft',
                'data-[state=on]:border-accent-foreground data-[state=on]:text-accent-foreground',
              )}
            >
              {n}
            </ToggleGroupPrimitive.Item>
          ))}
        </ToggleGroupPrimitive.Root>
        {(lowLabel != null || highLabel != null) && (
          <div className="flex justify-between text-ui-caption text-secondary-muted-foreground" aria-hidden="true">
            <span>{lowLabel}</span>
            <span>{highLabel}</span>
          </div>
        )}
      </div>
    );
  },
);
RatingScale.displayName = 'RatingScale';

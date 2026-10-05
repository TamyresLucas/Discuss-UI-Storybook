import * as React from 'react';
import { Progress as ProgressPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';

export interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /** Heading shown above the track, left-aligned (e.g. "Project Progress"). */
  label?: React.ReactNode;
  /** Right-aligned value above the track. Pass `true` to render `value%`. */
  valueLabel?: React.ReactNode | true;
  /** Left caption below the track (e.g. "16 of 25 tasks completed"). */
  detailsStart?: React.ReactNode;
  /** Right caption below the track (e.g. "Est. 3 days remaining"). */
  detailsEnd?: React.ReactNode;
}

// Figma: Progress Bar (36). Track is `secondary`, indicator is `accent`, both full-radius, 8px tall.
export const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value = 0, label, valueLabel, detailsStart, detailsEnd, ...props }, ref) => {
    const hasHeader = label != null || valueLabel != null;
    const hasDetails = detailsStart != null || detailsEnd != null;
    const clamped = Math.min(100, Math.max(0, value ?? 0));
    return (
      <div className={cn('flex w-full flex-col gap-2', className)}>
        {hasHeader && (
          <div className="flex items-center justify-between text-ui-label text-surface-foreground">
            <span>{label}</span>
            <span>{valueLabel === true ? `${Math.round(clamped)}%` : valueLabel}</span>
          </div>
        )}
        <ProgressPrimitive.Root
          ref={ref}
          value={clamped}
          className="relative h-2 w-full overflow-hidden rounded-full bg-secondary"
          {...props}
        >
          <ProgressPrimitive.Indicator
            className="h-full rounded-full bg-accent transition-[width]"
            style={{ width: `${clamped}%` }}
          />
        </ProgressPrimitive.Root>
        {hasDetails && (
          <div className="flex items-start justify-between text-ui-label leading-5 text-secondary-muted-foreground">
            <span>{detailsStart}</span>
            <span>{detailsEnd}</span>
          </div>
        )}
      </div>
    );
  },
);
Progress.displayName = 'Progress';

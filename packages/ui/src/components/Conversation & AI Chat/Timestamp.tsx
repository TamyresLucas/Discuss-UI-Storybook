import * as React from 'react';

import { cn } from '../../lib/utils';

export interface TimestampProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The time text, e.g. "5 minutes ago". */
  time: React.ReactNode;
  /** Action buttons (ghost icon `Button`s) shown next to the time. */
  children?: React.ReactNode;
  /** `before` puts the time left of the actions (user messages); `after` puts it right of them (AI replies). */
  timePosition?: 'before' | 'after';
}

// Figma: Timestamp (58) — 12px/16px `secondary-muted` time with 40px icon actions.
export const Timestamp = React.forwardRef<HTMLDivElement, TimestampProps>(
  ({ className, time, children, timePosition = 'before', ...props }, ref) => {
    const timeNode = (
      <time className="text-ui-caption whitespace-nowrap text-secondary-muted-foreground">{time}</time>
    );
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-2', timePosition === 'before' && 'justify-end', className)}
        {...props}
      >
        {timePosition === 'before' && timeNode}
        {children && (
          <div role="toolbar" aria-label="Message actions" className="flex items-center">
            {children}
          </div>
        )}
        {timePosition === 'after' && timeNode}
      </div>
    );
  },
);
Timestamp.displayName = 'Timestamp';

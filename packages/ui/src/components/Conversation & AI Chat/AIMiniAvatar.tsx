import * as React from 'react';

import { cn } from '../../lib/utils';
import { AI_GLYPH_THINKING, AI_GLYPH_WORKING } from './aiGlyphPaths';

export type AIStatus = 'idle' | 'thinking' | 'executing' | 'working';

const defaultLabel: Record<Exclude<AIStatus, 'idle'>, string> = {
  thinking: 'Thinking...',
  executing: 'Executing...',
  working: 'Working on it...',
};

export interface AIMiniAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `idle` shows only the mark; the others add a status line next to it. */
  status?: AIStatus;
  /** Override the status text. */
  label?: React.ReactNode;
  /** Elapsed time shown after the label while `working` (e.g. "45 s"). */
  elapsed?: React.ReactNode;
}

// Figma: AI Mini Avatar (57) › AI feedback — the accent squiggle mark with an optional status line.
// While busy the mark draws itself on, left to right, and repeats (still under prefers-reduced-motion).
export const AIMiniAvatar = React.forwardRef<HTMLDivElement, AIMiniAvatarProps>(
  ({ className, status = 'idle', label, elapsed, ...props }, ref) => {
    const glyph = status === 'working' ? AI_GLYPH_WORKING : AI_GLYPH_THINKING;
    const busy = status !== 'idle';
    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn('flex items-center gap-2.5', className)}
        {...props}
      >
        <svg
          aria-hidden="true"
          viewBox={glyph.viewBox}
          fill="none"
          className={cn(
            'h-5.75 shrink-0 fill-accent',
            status === 'working' ? 'w-5' : 'w-5.25',
            busy && 'motion-safe:animate-ai-draw-on',
          )}
        >
          <path d={glyph.d} />
        </svg>
        {busy && (
          <span
            className={cn(
              'text-ui-caption whitespace-nowrap',
              status === 'executing'
                ? 'bg-linear-to-r from-secondary-muted-foreground to-secondary-muted-foreground/40 bg-clip-text text-transparent'
                : 'text-secondary-muted-foreground',
            )}
          >
            {label ?? defaultLabel[status]}
          </span>
        )}
        {status === 'working' && elapsed != null && (
          <>
            <span aria-hidden="true" className="size-0.5 rounded-full bg-secondary-muted-foreground" />
            <span className="text-ui-caption whitespace-nowrap text-secondary-muted-foreground">{elapsed}</span>
          </>
        )}
      </div>
    );
  },
);
AIMiniAvatar.displayName = 'AIMiniAvatar';

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
// While busy the mark draws itself on along its own path, holds, clears the same way and repeats (still under prefers-reduced-motion).
export const AIMiniAvatar = React.forwardRef<HTMLDivElement, AIMiniAvatarProps>(
  ({ className, status = 'idle', label, elapsed, ...props }, ref) => {
    const glyph = status === 'working' ? AI_GLYPH_WORKING : AI_GLYPH_THINKING;
    const busy = status !== 'idle';
    // The busy mark is drawn on along its own path, so each instance needs its own mask.
    const maskId = React.useId();
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
          )}
        >
          {busy && (
            <>
              <mask id={maskId} maskUnits="userSpaceOnUse" style={{ maskType: 'alpha' }}>
                {/* A thick stroke along the mark's centre line. It is revealed gradually (see `animate-ai-draw-on`), uncovering the mark behind it. */}
                <path
                  d={glyph.line}
                  pathLength={1}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="motion-safe:animate-ai-draw-on"
                />
              </mask>
              <path d={glyph.d} mask={`url(#${maskId})`} />
            </>
          )}
          {!busy && <path d={glyph.d} />}
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

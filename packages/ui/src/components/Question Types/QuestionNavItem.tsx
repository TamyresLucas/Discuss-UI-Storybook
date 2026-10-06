import * as React from 'react';
import { DotsSixVertical, Warning } from '@phosphor-icons/react';
import { Slot } from 'radix-ui';

import { cn } from '../../lib/utils';
import { QuestionTypeIcon, type QuestionType } from './QuestionTypeIcon';

export interface QuestionNavItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The question currently open in the editor. */
  selected?: boolean;
  /** Question type, shown as the leading 16px duotone icon. */
  questionType?: QuestionType;
  /** The question has validation problems — the type icon becomes a warning icon. */
  error?: boolean;
  /** Render the child element instead of a `<button>` (e.g. a router link). */
  asChild?: boolean;
}

// Figma: Question navigation (357:4645) — one row per question. Question-type icon (muted; accent when selected), warning on error (destructive border when selected, soft red fill on hover), drag handle on hover. Label is 14px.
export const QuestionNavItem = React.forwardRef<HTMLButtonElement, QuestionNavItemProps>(
  ({ className, questionType = 'select-one', selected, error, asChild, children, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : 'button';
    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : 'button'}
        aria-current={selected ? 'true' : undefined}
        className={cn(
          'group/nav flex h-9.5 w-full max-w-106.5 items-center gap-2 rounded-sm border bg-surface p-2 text-left text-body-small text-surface-foreground transition-colors focus-visible:outline-none',
          error
            ? ['hover:bg-destructive-soft focus-visible:border-destructive', selected ? 'border-destructive' : 'border-border']
            : [
                'hover:border-input-accent hover:bg-accent-soft focus-visible:border-input-accent',
                selected ? 'border-input-accent' : 'border-border',
              ],
          className,
        )}
        {...props}
      >
        <span aria-hidden="true" className="relative flex size-4 shrink-0 items-center justify-center">
          <DotsSixVertical size={16} className="hidden group-hover/nav:block" />
          <span className="group-hover/nav:hidden">
            {error ? (
              <Warning size={16} className="text-destructive" />
            ) : (
              <QuestionTypeIcon
                type={questionType}
                size={16}
                className={selected ? 'text-accent-foreground' : 'text-muted-foreground'}
              />
            )}
          </span>
        </span>
        <span className="min-w-0 flex-1 truncate">{children}</span>
        {error && <span className="sr-only">, has errors</span>}
      </Comp>
    );
  },
);
QuestionNavItem.displayName = 'QuestionNavItem';

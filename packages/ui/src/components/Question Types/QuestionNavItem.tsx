import * as React from 'react';
import { DotsSixVertical, Warning, WarningCircle } from '@phosphor-icons/react';
import { Slot } from 'radix-ui';

import { cn } from '../../lib/utils';
import { QuestionTypeIcon, type QuestionType } from './QuestionTypeIcon';

export interface QuestionNavItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The question currently open in the editor. */
  selected?: boolean;
  /** Question type, shown as the leading 16px duotone icon. */
  questionType?: QuestionType;
  /** The question has validation problems — the type icon becomes the exclamation circle, in the destructive colour. */
  error?: boolean;
  /** The question has recommendations — the type icon becomes the exclamation triangle, in the warning colour. `error` wins when both are set. */
  warning?: boolean;
  /** Render the child element instead of a `<button>` (e.g. a router link). */
  asChild?: boolean;
  /**
   * Whether hovering swaps the type icon for the drag grip. Defaults to true. Set it to false when the row can't be moved (for
   * example while a translation is being edited), so the icon stays and the row doesn't suggest dragging.
   */
  showDragHandle?: boolean;
  /**
   * Shows the hover look (soft fill, drag grip in place of the type icon) without the pointer, for mirroring a hover that
   * happens elsewhere, such as over the same question's card.
   */
  hovered?: boolean;
}

// Figma: Question navigation (357:4645) — one row per question. Question-type icon (muted; accent when selected), exclamation circle on error (destructive border when selected, soft red fill on hover), exclamation triangle on warning (warning border when selected, soft amber fill on hover), drag handle on hover. Label is 14px.
export const QuestionNavItem = React.forwardRef<HTMLButtonElement, QuestionNavItemProps>(
  ({ className, questionType = 'select-one', selected, error, warning, asChild, showDragHandle = true, hovered, children, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : 'button';
    // An error outranks a warning: the row shows one problem state.
    const warn = !error && !!warning;
    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : 'button'}
        aria-current={selected ? 'true' : undefined}
        data-hovered={hovered ? '' : undefined}
        className={cn(
          'group/nav flex h-9.5 w-full max-w-106.5 items-center gap-2 rounded-sm border bg-surface p-2 text-left text-body-small text-surface-foreground transition-colors focus-visible:outline-none',
          error
            ? ['hover:bg-destructive-soft focus-visible:border-destructive', selected ? 'border-destructive' : 'border-border']
            : warn
              ? ['hover:bg-warning-soft focus-visible:border-warning-foreground', selected ? 'border-warning-foreground' : 'border-border']
              : [
                  // Hover only changes the fill; the border stays as it is (default grey, or accent when selected).
                  'hover:bg-accent-soft focus-visible:border-input-accent',
                  selected ? 'border-input-accent' : 'border-border',
                ],
          hovered && (error ? 'bg-destructive-soft' : warn ? 'bg-warning-soft' : 'bg-accent-soft'),
          className,
        )}
        {...props}
      >
        <span aria-hidden="true" className="relative flex size-4 shrink-0 items-center justify-center">
          {showDragHandle && <DotsSixVertical size={16} className="hidden group-hover/nav:block group-data-[hovered]/nav:block" />}
          <span className={showDragHandle ? 'group-hover/nav:hidden group-data-[hovered]/nav:hidden' : undefined}>
            {error ? (
              <WarningCircle size={16} className="text-destructive-foreground" />
            ) : warn ? (
              <Warning size={16} className="text-warning-foreground" />
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
        {warn && <span className="sr-only">, has warnings</span>}
      </Comp>
    );
  },
);
QuestionNavItem.displayName = 'QuestionNavItem';

import * as React from 'react';
import { DotsSixVertical } from '@phosphor-icons/react';

import { cn } from '../../lib/utils';
import { InlineEdit } from '../Forms & Data Entry/InlineEdit';
import { ToastInline } from '../Overlays & Feedback/Toast';

export interface QuestionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'onChange'> {
  /** Question number, shown as "QUESTION 01". */
  number: number;
  title: React.ReactNode;
  /** Adds the red asterisk after the title. */
  required?: boolean;
  /** Shows an error banner above the header. `true` shows "This question is mandatory."; pass a node for a custom message. */
  error?: boolean | React.ReactNode;
  onDismissError?: () => void;
  /** Editor mode: an editable title with a character counter and hover actions. */
  editor?: boolean;
  /** Editor mode: called as the title is typed. `title` must then be a string. */
  onTitleChange?: (title: string) => void;
  /** Editor mode: action buttons (copy, delete, preview, AI) revealed on hover or focus. */
  actions?: React.ReactNode;
  /** Editor mode: content shown right beside the "Question N" tag, e.g. the time allowed for the question. */
  meta?: React.ReactNode;
  /** Editor mode: title length limit. */
  maxLength?: number;
  /** Editor mode: the question is being edited — the number tag turns accent. */
  active?: boolean;
  /** Editor mode: show the "n/2000 characters" counter. Defaults to `true`. */
  showCounter?: boolean;
  /**
   * Editor mode: turns the "Question N" tag into a drag handle. Spread onto the tag, so it takes anything a drag-and-drop
   * library hands out (`ref`, `role`, `tabIndex`, pointer and keyboard listeners, aria attributes). The tag then shows a
   * grab cursor, is focusable and reveals the grip icon on keyboard focus; it is labelled "Reorder question N" unless you
   * pass your own `aria-label`. Omit it for the plain tag.
   */
  dragHandleProps?: React.ComponentPropsWithRef<'span'>;
  /**
   * Whether the grip icon appears in the "Question N" tag on hover or focus. Defaults to true. Set it to false when the question
   * can't be moved (for example while a translation is being edited), so the tag doesn't suggest dragging.
   */
  showDragHandle?: boolean;
}

const eyebrow = 'text-ui-caption uppercase text-secondary-muted-foreground';

// Figma: Question card components (357:4761) › Question_Header — eyebrow + display title; error and editor variants.
export const QuestionHeader = React.forwardRef<HTMLDivElement, QuestionHeaderProps>(
  (
    { className, number, title, required, error, onDismissError, editor, onTitleChange, actions, meta, maxLength = 2000, active, showCounter = true, dragHandleProps, showDragHandle = true, ...props },
    ref,
  ) => {
    // Editor mode: live title length while typing; null once editing ends so the saved title is the source of truth.
    const [draft, setDraft] = React.useState<string | null>(null);
    const label = String(number).padStart(2, '0');
    const showError = error !== undefined && error !== false;

    if (editor) {
      const text = typeof title === 'string' ? title : '';
      const count = (draft ?? text).length;
      return (
        <div ref={ref} className={cn('group/header flex w-full flex-col gap-2', className)} {...props}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
            <span
              aria-label={dragHandleProps ? `Reorder question ${number}` : undefined}
              {...dragHandleProps}
              className={cn(
                'group/handle inline-flex h-6 items-center gap-1 rounded-sm px-2.5 text-ui-caption',
                // The tag makes room for the grip on hover, and inside a QuestionEditorCard whenever the card is hovered.
                showDragHandle && 'hover:pl-1 group-hover/editor:pl-1',
                active
                  ? 'bg-accent-soft text-accent-soft-foreground'
                  : 'bg-secondary bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5 text-surface-foreground',
                dragHandleProps && 'cursor-grab touch-none select-none',
                dragHandleProps && showDragHandle && 'focus-visible:pl-1',
                dragHandleProps?.className,
              )}
            >
              {showDragHandle && (
                <DotsSixVertical
                  size={16}
                  aria-hidden
                  className="hidden shrink-0 group-hover/editor:block group-hover/handle:block group-focus-visible/handle:block"
                />
              )}
              Question {number}
            </span>
            {meta}
            </div>
            {actions && (
              <div className={cn(
                  'flex items-center gap-2 opacity-0 transition-opacity group-focus-within/header:opacity-100 group-hover/header:opacity-100',
                  // Inside a QuestionEditorCard, hovering or focusing anywhere on the card reveals them too.
                  'group-focus-within/editor:opacity-100 group-hover/editor:opacity-100',
                )}>
                {actions}
              </div>
            )}
          </div>
          {/* The negative margin cancels InlineEdit's own padding so the text stays flush with the tag above. */}
          <InlineEdit
            variant="question"
            multiline
            selected={active}
            className="-mx-3 w-auto"
            aria-label="Question title"
            placeholder="Click to write the question text"
            value={text}
            maxLength={maxLength}
            onValueChange={onTitleChange}
            onDraftChange={setDraft}
            onEditingChange={(editing) => {
              if (!editing) setDraft(null);
            }}
            textClassName="text-heading-h4"
          />
          {showCounter && (
            <p className="text-ui-caption text-secondary-muted-foreground">
              {count}/{maxLength} characters
            </p>
          )}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('flex w-full flex-col gap-2', className)} {...props}>
        {showError && (
          <ToastInline variant="destructive" onClose={onDismissError} className="min-h-10">
            <span className="text-ui-label text-destructive">{error === true ? 'This question is mandatory.' : error}</span>
          </ToastInline>
        )}
        <p className={eyebrow}>Question {label}</p>
        <h3 className="text-heading-h4 text-surface-foreground">
          {title}
          {required && (
            <span aria-hidden="true" className="text-destructive">
              *
            </span>
          )}
          {required && <span className="sr-only"> (required)</span>}
        </h3>
      </div>
    );
  },
);
QuestionHeader.displayName = 'QuestionHeader';

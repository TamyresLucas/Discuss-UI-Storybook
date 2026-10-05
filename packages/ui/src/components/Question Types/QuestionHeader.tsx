import * as React from 'react';
import { DotsSixVertical } from '@phosphor-icons/react';

import { cn } from '../../lib/utils';
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
  /** Editor mode: title length limit. */
  maxLength?: number;
}

const eyebrow = 'text-ui-caption uppercase text-secondary-muted-foreground';

// Figma: Question card components (357:4761) › Question_Header — eyebrow + display title; error and editor variants.
export const QuestionHeader = React.forwardRef<HTMLDivElement, QuestionHeaderProps>(
  (
    { className, number, title, required, error, onDismissError, editor, onTitleChange, actions, maxLength = 2000, ...props },
    ref,
  ) => {
    const label = String(number).padStart(2, '0');
    const showError = error !== undefined && error !== false;

    if (editor) {
      const text = typeof title === 'string' ? title : '';
      return (
        <div ref={ref} className={cn('group/header flex w-full flex-col gap-2', className)} {...props}>
          <div className="flex items-center justify-between">
            <span className="group/handle inline-flex h-6 items-center gap-1 rounded-sm bg-secondary bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5 px-2.5 text-ui-caption text-surface-foreground hover:pl-1">
              <DotsSixVertical size={16} aria-hidden className="hidden shrink-0 group-hover/handle:block" />
              Question {number}
            </span>
            {actions && (
              <div className="flex items-center gap-2 opacity-0 transition-opacity group-focus-within/header:opacity-100 group-hover/header:opacity-100">
                {actions}
              </div>
            )}
          </div>
          <textarea
            rows={1}
            aria-label="Question title"
            value={text}
            maxLength={maxLength}
            onChange={(event) => onTitleChange?.(event.target.value)}
            className="field-sizing-content w-full resize-none bg-transparent text-heading-h4 text-surface-foreground outline-none"
          />
          <p className="text-ui-caption text-secondary-muted-foreground">
            {text.length}/{maxLength} characters
          </p>
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

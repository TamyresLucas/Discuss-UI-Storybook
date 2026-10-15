import * as React from 'react';
import { DotsSixVertical } from '@phosphor-icons/react';

import { cn } from '../../lib/utils';
import { InlineEdit, type InlineEditMark } from '../Forms & Data Entry/InlineEdit';
import { ToastInline } from '../Overlays & Feedback/Toast';
import { QuestionTypeIcon, type QuestionType } from './QuestionTypeIcon';

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
  /** Editor mode: shown while the title is empty. Defaults to "Click to write the question text". */
  titlePlaceholder?: string;
  /** Editor mode: `regular` shows the title placeholder in the normal text colour instead of the muted one. Default `muted`. */
  titlePlaceholderTone?: 'muted' | 'regular';
  /**
   * Editor mode: shortest title (in characters) that may be saved. When set, the title's limits guardrail turns on: while the title
   * is being edited a line under it shows the allowed range and the live count (using `maxLength`), a title that is too short is not
   * saved (the field stays open and says why), and the always-on counter is replaced by that line.
   */
  titleMinLength?: number;
  /**
   * Editor mode: a title longer than this many characters (counted live while it is typed) switches to the regular 16px body style
   * instead of the heading style, and shows `titleRecommendedNote` under it when that is given.
   */
  titleRecommendedMax?: number;
  /** Editor mode: optional text shown under a title that is longer than `titleRecommendedMax`. Leave it out to change only the style (for example when the recommendation is shown elsewhere). */
  titleRecommendedNote?: React.ReactNode;
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
  /**
   * Editor mode: the question's type, shown as a 16px icon at the start of the "Question N" tag in its default and selected states.
   * On hover or focus (when the tag can be dragged) the grip icon replaces it. Leave it out for a tag with the number only.
   */
  questionType?: QuestionType;
  /** Editor mode: ranges of the saved title to underline in the destructive colour (misspelled words, for example). See `InlineEdit`'s `marks`. */
  titleMarks?: InlineEditMark[];
}

const eyebrow = 'text-ui-caption uppercase text-secondary-muted-foreground';

// Figma: Question card components (357:4761) › Question_Header — eyebrow + display title; error and editor variants.
export const QuestionHeader = React.forwardRef<HTMLDivElement, QuestionHeaderProps>(
  (
    { className, number, title, required, error, onDismissError, editor, onTitleChange, titlePlaceholder = 'Click to write the question text', titlePlaceholderTone, titleMinLength, titleRecommendedMax, titleRecommendedNote, actions, meta, maxLength = 2000, active, showCounter = true, dragHandleProps, showDragHandle = true, questionType, titleMarks, ...props },
    ref,
  ) => {
    // Editor mode: live title length while typing; null once editing ends so the saved title is the source of truth.
    const [draft, setDraft] = React.useState<string | null>(null);
    const label = String(number).padStart(2, '0');
    const showError = error !== undefined && error !== false;

    if (editor) {
      const text = typeof title === 'string' ? title : '';
      const count = (draft ?? text).length;
      // A long title drops to the regular body style and gets a recommendation, because a long question is tiring to read.
      const long = titleRecommendedMax !== undefined && count > titleRecommendedMax;
      return (
        <div ref={ref} className={cn('group/header flex w-full flex-col gap-2', className)} {...props}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
            <span
              aria-label={dragHandleProps ? `Reorder question ${number}` : undefined}
              {...dragHandleProps}
              className={cn(
                'group/handle inline-flex h-6 items-center gap-1 rounded-sm px-2.5 text-ui-caption',
                // The tag makes room for the grip on hover, and inside a QuestionEditorCard whenever the card is hovered. With a type icon the grip
                // takes the icon's place, so the tag keeps its padding and its width.
                showDragHandle && !questionType && 'hover:pl-1 group-hover/editor:pl-1 group-data-[hovered]/editor:pl-1',
                active
                  ? 'bg-accent-soft text-accent-soft-foreground'
                  : 'bg-secondary bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5 text-surface-foreground',
                dragHandleProps && 'cursor-grab touch-none select-none',
                dragHandleProps && showDragHandle && !questionType && 'focus-visible:pl-1',
                dragHandleProps?.className,
              )}
            >
              {questionType && (
                <QuestionTypeIcon
                  type={questionType}
                  size={16}
                  // The grip takes the icon's place whenever it shows; a tag that can't be dragged keeps the icon.
                  className={cn('shrink-0', showDragHandle && 'group-hover/editor:hidden group-data-[hovered]/editor:hidden group-hover/handle:hidden group-focus-visible/handle:hidden')}
                />
              )}
              {showDragHandle && (
                <DotsSixVertical
                  size={16}
                  aria-hidden
                  className="hidden shrink-0 group-hover/editor:block group-data-[hovered]/editor:block group-hover/handle:block group-focus-visible/handle:block"
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
                  'group-focus-within/editor:opacity-100 group-hover/editor:opacity-100 group-data-[hovered]/editor:opacity-100',
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
            placeholder={titlePlaceholder}
            placeholderTone={titlePlaceholderTone}
            minLength={titleMinLength}
            showLimits={titleMinLength !== undefined}
            value={text}
            maxLength={maxLength}
            onValueChange={onTitleChange}
            onDraftChange={setDraft}
            onEditingChange={(editing) => {
              if (!editing) setDraft(null);
            }}
            marks={titleMarks}
            textClassName={long ? 'text-body-base' : 'text-heading-h4'}
          />
          {long && titleRecommendedNote != null && <p className="text-ui-caption text-secondary-muted-foreground">{titleRecommendedNote}</p>}
          {showCounter && titleMinLength === undefined && (
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

import * as React from 'react';
import { DotsSixVertical } from '@phosphor-icons/react';

import { cn } from '../../lib/utils';
import { QuestionTypeIcon, type QuestionType } from './QuestionTypeIcon';

export interface QuestionNumberTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The question's number, shown as "Question N". */
  number: number;
  /** The question is being edited: the tag turns accent. */
  active?: boolean;
  /** The question's type, shown as a 16px icon at the start of the tag (the grip takes its place on hover when the tag can be dragged). */
  questionType?: QuestionType;
  /** Whether the grip icon appears on hover or focus. Defaults to true. Set false where the question can't be moved. */
  showDragHandle?: boolean;
  /** Turns the tag into a drag handle: spread onto it, so it takes anything a drag-and-drop library gives (listeners, attributes, a ref). */
  dragHandleProps?: React.ComponentPropsWithRef<'span'>;
}

// Figma: Question card components (357:4761) › Question_Header — the "Question N" tag of the editor variant, on its own so a list that is not an
// editor (a plan, a summary) can number its questions the same way.
export const QuestionNumberTag = React.forwardRef<HTMLSpanElement, QuestionNumberTagProps>(
  ({ number, active, questionType, showDragHandle = true, dragHandleProps, className, ...props }, ref) => (
    <span
      ref={ref}
      aria-label={dragHandleProps ? `Reorder question ${number}` : undefined}
      {...props}
      {...dragHandleProps}
      className={cn(
        'group/handle inline-flex h-6 shrink-0 items-center gap-1 rounded-sm px-2.5 text-ui-caption',
        // The tag makes room for the grip on hover, and inside a QuestionEditorCard whenever the card is hovered. With a type icon the grip
        // takes the icon's place, so the tag keeps its padding and its width.
        showDragHandle && !questionType && 'hover:pl-1 group-hover/editor:pl-1 group-data-[hovered]/editor:pl-1',
        active ? 'bg-accent-soft text-accent-soft-foreground' : 'bg-secondary bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5 text-surface-foreground',
        dragHandleProps && 'cursor-grab touch-none select-none',
        dragHandleProps && showDragHandle && !questionType && 'focus-visible:pl-1',
        className,
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
  ),
);
QuestionNumberTag.displayName = 'QuestionNumberTag';

import * as React from 'react';
import { PencilSimple } from '@phosphor-icons/react';

import { cn } from '../../lib/utils';
import { fieldSurfaceClasses } from './Field';

export interface InlineEditProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Controlled value. Pair with `onValueChange`. */
  value?: string;
  defaultValue?: string;
  /** Called when an edit is committed (Enter, blur or the commit key for multiline) with a changed value. */
  onValueChange?: (value: string) => void;
  /** Shown in read mode, muted, while the value is empty. */
  placeholder?: string;
  /** Accessible name for the read button and the field. Required: there is no visible label. */
  'aria-label': string;
  /** Use a textarea. Enter inserts a line break; Cmd/Ctrl+Enter commits. */
  multiline?: boolean;
  maxLength?: number;
  disabled?: boolean;
  /** Called when editing starts or ends. */
  onEditingChange?: (editing: boolean) => void;
  /** Called on every keystroke while editing (and with the saved value when editing ends), e.g. for a live character counter. */
  onDraftChange?: (value: string) => void;
  /**
   * `default` is a rounded field. A short single-line label shows the pencil and hugs its text; `multiline` (longer
   * text) hides the pencil and fills the width. `question` is for question text: it fills the width with no pencil,
   * has square corners and shows a 1px bottom border on hover and focus (in the input border colour) that becomes a bolder 2px accent border while `selected`. Enter saves; Shift+Enter adds a
   * line break when `multiline`.
   */
  variant?: 'default' | 'question';
  /** `question` variant: keeps the bottom border while the owning question is selected. */
  selected?: boolean;
  /** Classes for the displayed/edited text, e.g. a heading text style. The field itself keeps the same box. */
  textClassName?: string;
}

// Not in Figma: shadcn has no inline-edit primitive, so this is a plain toggle between a button and a field.
// Read mode is a button (so it is keyboard- and screen-reader-reachable); editing swaps in an input that commits on
// Enter/blur and reverts on Escape.
export const InlineEdit = React.forwardRef<HTMLDivElement, InlineEditProps>(
  (
    {
      className,
      textClassName,
      value: valueProp,
      defaultValue = '',
      onValueChange,
      placeholder = 'Click to edit',
      multiline,
      maxLength,
      disabled,
      onEditingChange,
      onDraftChange,
      variant = 'default',
      selected,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const [internal, setInternal] = React.useState(defaultValue);
    const value = valueProp ?? internal;
    const [editing, setEditing] = React.useState(false);
    const [draft, setDraft] = React.useState(value);
    const fieldRef = React.useRef<HTMLInputElement & HTMLTextAreaElement>(null);
    const readRef = React.useRef<HTMLButtonElement>(null);
    // Set while an Escape revert is pending so the blur that follows it does not commit.
    const cancelled = React.useRef(false);
    const restoreFocus = React.useRef(false);

    React.useEffect(() => {
      if (editing) {
        fieldRef.current?.focus();
        fieldRef.current?.select();
      } else if (restoreFocus.current) {
        restoreFocus.current = false;
        readRef.current?.focus();
      }
    }, [editing]);

    const start = () => {
      if (disabled) return;
      setDraft(value);
      cancelled.current = false;
      setEditing(true);
      onEditingChange?.(true);
    };
    const finish = (commit: boolean, refocus: boolean) => {
      restoreFocus.current = refocus;
      if (commit && draft !== value) {
        if (valueProp === undefined) setInternal(draft);
        onValueChange?.(draft);
      }
      setEditing(false);
      onEditingChange?.(false);
      onDraftChange?.(commit ? draft : value);
    };

    const textClasses = cn('text-ui-input-value text-surface-foreground', textClassName);
    const question = variant === 'question';
    // Longer text and question text fill the box and drop the pencil; a short label hugs its text.
    const fill = multiline || question;

    return (
      <div ref={ref} className={cn(fill ? 'flex w-full min-w-0' : 'inline-flex min-w-0 max-w-full', className)} {...props}>
        {editing ? (
          React.createElement(multiline ? 'textarea' : 'input', {
            ref: fieldRef,
            value: draft,
            maxLength,
            'aria-label': ariaLabel,
            ...(multiline ? { rows: 1 } : { type: 'text' }),
            className: cn(
              'w-full px-3 py-1 outline-none',
              multiline && 'field-sizing-content resize-none',
              question
                ? 'rounded-none border-0 border-b-2 border-accent-foreground bg-transparent'
                : cn('rounded-md focus-visible:border-input-accent', fieldSurfaceClasses('default')),
              textClasses,
            ),
            onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              setDraft(event.target.value);
              onDraftChange?.(event.target.value);
            },
            onKeyDown: (event: React.KeyboardEvent) => {
              if (event.key === 'Escape') {
                cancelled.current = true;
                finish(false, true);
              } else if (
                event.key === 'Enter' &&
                (!multiline || event.metaKey || event.ctrlKey || (question && !event.shiftKey))
              ) {
                event.preventDefault();
                finish(true, true);
              }
            },
            onBlur: () => {
              if (!cancelled.current) finish(true, false);
            },
          })
        ) : (
          <button
            ref={readRef}
            type="button"
            disabled={disabled}
            aria-label={`${ariaLabel}: ${value || placeholder}. Edit`}
            onClick={start}
            className={cn(
              'group inline-flex min-w-0 max-w-full items-center gap-2 px-3 text-left outline-none',
              fill && 'w-full',
              question
                ? // Hover and focus show a 1px bottom border in the input colour; only a selected question gets the 2px accent
                  // one. The extra 1px of bottom padding keeps the height identical so the text never jumps.
                  selected
                  ? 'rounded-none border-b-2 border-accent-foreground py-1'
                  : 'rounded-none border-b border-transparent pb-1.25 pt-1 enabled:hover:border-input-muted enabled:focus-visible:border-input-muted'
                : 'rounded-md border border-transparent py-1 enabled:focus-visible:border-input-accent',
              'enabled:hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50',
              textClasses,
            )}
          >
            <span className={cn('min-w-0', multiline ? 'whitespace-pre-wrap' : 'truncate', fill && 'flex-1', !value && 'text-muted-foreground')}>
              {value || placeholder}
            </span>
            {!fill && (
              <PencilSimple
                size={16}
                aria-hidden
                className="shrink-0 text-secondary-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              />
            )}
          </button>
        )}
      </div>
    );
  },
);
InlineEdit.displayName = 'InlineEdit';

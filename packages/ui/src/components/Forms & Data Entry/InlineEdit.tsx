import * as React from 'react';
import { PencilSimple, WarningCircle } from '@phosphor-icons/react';

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
  /**
   * Shortest value (in characters, ignoring surrounding spaces) that may be saved. An edit that is too short is not saved:
   * the field stays open with an error message, and Escape still reverts.
   */
  minLength?: number;
  /**
   * Checks an edit before it is saved (on Enter or blur). Return a message to refuse it: the field stays open showing the
   * message and `onValueChange` is not called. Return nothing (or `null`) to accept. Runs after `minLength`.
   */
  validate?: (value: string) => string | null | undefined;
  /**
   * While editing, shows the allowed length under the field (from `minLength` and `maxLength`) with a live character
   * counter. After a refused save the same line turns into the error state (error colour and icon) instead of a
   * different message appears.
   */
  showLimits?: boolean;
  /**
   * Multiline only: Enter saves (like a single-line field) and Shift+Enter inserts a line break. Cmd/Ctrl+Enter keeps
   * saving too. The `question` variant already works this way.
   */
  submitOnEnter?: boolean;
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

/** "150–500 characters", "At least 150 characters" or "Up to 500 characters", from whichever limits are set. */
function limitsText(min?: number, max?: number) {
  if (min !== undefined && max !== undefined) return `${min}–${max} characters`;
  if (min !== undefined) return `At least ${min} characters`;
  if (max !== undefined) return `Up to ${max} characters`;
  return '';
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
      minLength,
      validate,
      showLimits,
      submitOnEnter,
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
    // The reason the last attempt to save was refused; cleared by the next valid keystroke, Escape or a save.
    const [error, setError] = React.useState<string | null>(null);
    const errorId = React.useId();
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

    const problemWith = (text: string) => {
      if (minLength !== undefined && text.trim().length < minLength) {
        return `Enter at least ${minLength} characters (${text.trim().length} now).`;
      }
      return validate?.(text) ?? null;
    };

    const start = () => {
      if (disabled) return;
      setDraft(value);
      setError(null);
      cancelled.current = false;
      setEditing(true);
      onEditingChange?.(true);
    };
    const finish = (commit: boolean, refocus: boolean) => {
      if (commit && draft !== value) {
        // An edit that fails validation is not saved: the field stays open and says why.
        const problem = problemWith(draft);
        if (problem) {
          setError(problem);
          return;
        }
      }
      setError(null);
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
      <div
        ref={ref}
        className={cn(fill ? 'flex w-full min-w-0' : 'inline-flex min-w-0 max-w-full', editing && (error || showLimits) && 'flex-col gap-1.5', className)}
        {...props}
      >
        {editing ? (
          <>
          {React.createElement(multiline ? 'textarea' : 'input', {
            ref: fieldRef,
            value: draft,
            maxLength,
            'aria-label': ariaLabel,
            'aria-invalid': error ? true : undefined,
            'aria-describedby': error || showLimits ? errorId : undefined,
            ...(multiline ? { rows: 1 } : { type: 'text' }),
            className: cn(
              'w-full px-3 py-1 outline-none',
              multiline && 'field-sizing-content resize-none',
              question
                ? cn('rounded-none border-0 border-b-2 bg-transparent', error ? 'border-destructive' : 'border-accent-foreground')
                : cn('rounded-md', !error && 'focus-visible:border-input-accent', fieldSurfaceClasses(error ? 'error' : 'default')),
              textClasses,
            ),
            onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              setDraft(event.target.value);
              // After a refused save, the message follows what is typed and goes away as soon as the text is acceptable.
              if (error) setError(problemWith(event.target.value));
              onDraftChange?.(event.target.value);
            },
            onKeyDown: (event: React.KeyboardEvent) => {
              if (event.key === 'Escape') {
                cancelled.current = true;
                setError(null);
                finish(false, true);
              } else if (
                event.key === 'Enter' &&
                (!multiline || event.metaKey || event.ctrlKey || ((question || submitOnEnter) && !event.shiftKey))
              ) {
                event.preventDefault();
                finish(true, true);
              }
            },
            onBlur: () => {
              if (!cancelled.current) finish(true, false);
            },
          })}
          {(error || showLimits) && (
            <p
              id={errorId}
              role={error ? 'alert' : undefined}
              className={cn('flex items-start justify-between gap-2 px-3 text-ui-caption', error ? 'text-destructive' : 'text-secondary-muted-foreground')}
            >
              <span className="flex items-start gap-2">
                {error && <WarningCircle size={16} aria-hidden className="shrink-0" />}
                {showLimits ? limitsText(minLength, maxLength) : error}
                {/* The line stays the same in the error state; screen readers also get the reason. */}
                {showLimits && error && <span className="sr-only">{error}</span>}
              </span>
              {showLimits && (
                <span aria-hidden className="shrink-0 tabular-nums">
                  {draft.length}
                  {maxLength !== undefined && `/${maxLength}`}
                </span>
              )}
            </p>
          )}
          </>
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
              // The text is editable in place, so hovering it shows the text cursor.
              'enabled:cursor-text enabled:hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50',
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

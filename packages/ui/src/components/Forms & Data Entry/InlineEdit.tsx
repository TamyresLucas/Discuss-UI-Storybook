import * as React from 'react';
import { PencilSimple, Trash, WarningCircle } from '@phosphor-icons/react';
import { Popover as PopoverPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';
import { Button } from '../Buttons & Actions/Button';
import { fieldSurfaceClasses } from './Field';

export interface InlineEditProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Controlled value. Pair with `onValueChange`. */
  value?: string;
  defaultValue?: string;
  /** Called when an edit is committed (Enter, blur or the commit key for multiline) with a changed value. */
  onValueChange?: (value: string) => void;
  /** Shown in read mode while the value is empty, muted unless `placeholderTone` says otherwise. */
  placeholder?: string;
  /** `regular` shows the placeholder in the normal text colour instead of the muted one, for hints that read as real content. Default `muted`. */
  placeholderTone?: 'muted' | 'regular';
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
   * has square corners and shows a 1px bottom border on hover and focus (in the input border colour) that becomes a bolder 2px muted accent border while `selected` (light enough to stay distinct from the destructive underline of a marked word). Enter saves; Shift+Enter adds a
   * line break when `multiline`.
   */
  variant?: 'default' | 'question';
  /** `question` variant: keeps the bottom border while the owning question is selected. */
  selected?: boolean;
  /** Classes for the displayed/edited text, e.g. a heading text style. The field itself keeps the same box. */
  textClassName?: string;
  /**
   * Ranges of the saved text to underline in the destructive colour, for example misspelled words found by a spell checker. `start` is the
   * first character and `end` the one after the last. Read mode only: the text box shown while editing has no underline. Ranges that are
   * out of bounds, empty or overlapping are ignored.
   */
  marks?: InlineEditMark[];
  /**
   * Makes each mark clickable: clicking an underlined word opens a small card with the marked text, its `suggestions` and a Dismiss action,
   * instead of starting the edit. Called with the mark and the suggestion the reader chose; apply it to the value yourself.
   */
  onMarkApply?: (mark: InlineEditMark, replacement: string) => void;
  /** Called when the reader dismisses a mark from its card. Remove the mark to make the underline go away. */
  onMarkDismiss?: (mark: InlineEditMark) => void;
}

export interface InlineEditMark {
  start: number;
  end: number;
  /** Corrections offered in the mark's card, best first (at most three are shown). Used with `onMarkApply`. An empty string offers to remove the marked text (the button reads "Remove"). */
  suggestions?: string[];
  /** Short heading of the mark's card, for the kind of problem ("Placeholder text"). Defaults to "Possible typo". */
  label?: string;
}

/** The text split into plain and marked pieces; marks that don't fit the text are dropped. */
function splitMarks(text: string, marks: InlineEditMark[] | undefined): { text: string; mark?: InlineEditMark }[] {
  const valid = (marks ?? []).filter((m) => Number.isInteger(m.start) && Number.isInteger(m.end) && m.start >= 0 && m.end > m.start && m.end <= text.length).sort((a, b) => a.start - b.start);
  const out: { text: string; mark?: InlineEditMark }[] = [];
  let at = 0;
  for (const m of valid) {
    if (m.start < at) continue;
    if (m.start > at) out.push({ text: text.slice(at, m.start) });
    out.push({ text: text.slice(m.start, m.end), mark: m });
    at = m.end;
  }
  if (at < text.length) out.push({ text: text.slice(at) });
  return out;
}

// A solid destructive line under the word. Its padding is measured (see `useMarkAlignment`) so the line sits on the field's own bottom edge.
const markClasses = 'rounded-xxs border-b-2 border-destructive-foreground';

/**
 * Pads a mark so its background and line line up with the read-mode button. On a single line the mark fills the button's full height, and its
 * bottom edge lands exactly on the button's bottom edge, where the field's own hover and selected underline is drawn (so the mark's line covers it
 * instead of showing a second one). On a wrapped title it only fills its own line, so it never covers the lines around it. The right padding
 * depends on the font and line height, so it is measured.
 */
function useMarkAlignment(ref: React.RefObject<HTMLSpanElement | null>, text: string) {
  const [padding, setPadding] = React.useState({ top: 0, bottom: 0 });
  React.useLayoutEffect(() => {
    const mark = ref.current;
    const button = mark?.closest('button');
    if (!mark || !button) return;
    const align = () => {
      const m = mark.getBoundingClientRect();
      const b = button.getBoundingClientRect();
      const markStyle = getComputedStyle(mark);
      const buttonStyle = getComputedStyle(button);
      const border = parseFloat(markStyle.borderBottomWidth);
      // The mark's own text area, without the padding added here.
      const baseTop = m.top + parseFloat(markStyle.paddingTop);
      const baseBottom = m.bottom - parseFloat(markStyle.paddingBottom) - border;
      const contentTop = b.top + parseFloat(buttonStyle.borderTopWidth) + parseFloat(buttonStyle.paddingTop);
      const contentBottom = b.bottom - parseFloat(buttonStyle.borderBottomWidth) - parseFloat(buttonStyle.paddingBottom);
      const lineHeight = parseFloat(buttonStyle.lineHeight) || contentBottom - contentTop;
      const lines = Math.max(1, Math.round((contentBottom - contentTop) / lineHeight));
      const lineIndex = Math.min(lines - 1, Math.max(0, Math.floor(((baseTop + baseBottom) / 2 - contentTop) / lineHeight)));
      const targetTop = lineIndex === 0 ? b.top : contentTop + lineIndex * lineHeight;
      const targetBottom = lineIndex === lines - 1 ? b.bottom : contentTop + (lineIndex + 1) * lineHeight;
      const next = { top: Math.max(0, baseTop - targetTop), bottom: Math.max(0, targetBottom - baseBottom - border) };
      setPadding((p) => (Math.abs(p.top - next.top) < 0.5 && Math.abs(p.bottom - next.bottom) < 0.5 ? p : next));
    };
    align();
    const observer = new ResizeObserver(align);
    observer.observe(button);
    return () => observer.disconnect();
  }, [ref, text]);
  return padding;
}

/** The card that is open right now, anywhere on the page: opening another one closes it, so only one is ever open. */
let closeOpenMarkCard: (() => void) | null = null;

/** A marked piece of text. Plain underline, or, when the owner handles marks, a button that opens a card to apply a suggestion or dismiss the mark. */
function MarkedText({ mark, text, onApply, onDismiss }: { mark: InlineEditMark; text: string; onApply?: (mark: InlineEditMark, replacement: string) => void; onDismiss?: (mark: InlineEditMark) => void }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);
  React.useEffect(
    () => () => {
      if (closeOpenMarkCard === close) closeOpenMarkCard = null;
    },
    [close],
  );
  const padding = useMarkAlignment(ref, text);
  const style = { paddingTop: padding.top, paddingBottom: padding.bottom };
  if (!onApply && !onDismiss) {
    return (
      <span ref={ref} data-mark className={markClasses} style={style}>
        {text}
      </span>
    );
  }
  const suggestions = (mark.suggestions ?? []).slice(0, 3);
  const handleOpenChange = (next: boolean) => {
    if (next) {
      if (closeOpenMarkCard && closeOpenMarkCard !== close) closeOpenMarkCard();
      closeOpenMarkCard = close;
    } else if (closeOpenMarkCard === close) {
      closeOpenMarkCard = null;
    }
    setOpen(next);
  };
  // The mark sits inside the read-mode button, so clicks and keys here must not also start the edit.
  const stop = (event: React.SyntheticEvent) => event.stopPropagation();
  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <span ref={ref} data-mark role="button" tabIndex={-1} onClick={stop} style={style} className={cn(markClasses, 'cursor-pointer hover:bg-destructive-soft')}>
          {text}
        </span>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={8}
          style={{ zIndex: 'var(--sys-z-40)' }}
          onClick={stop}
          onKeyDown={stop}
          // The mark is not focusable, and focus jumping back to it would make a card opened next think focus left it.
          onCloseAutoFocus={(event) => event.preventDefault()}
          className="flex w-72 flex-col gap-3 rounded-md border border-border bg-surface p-4 text-left text-body-base font-normal shadow-md outline-none"
        >
          <p className="text-ui-caption uppercase text-secondary-muted-foreground">{mark.label ?? 'Possible typo'}</p>
          {suggestions.length > 0 && (
            <ul className="flex flex-col gap-2">
              {suggestions.map((suggestion, i) => (
                <li key={suggestion} className="flex items-center justify-between gap-3">
                  <span className="min-w-0 break-words">
                    <s className="text-destructive-foreground">{text}</s>
                    {suggestion !== '' && (
                      <>
                        {' '}
                        <span className="font-semibold text-accent-foreground">{suggestion}</span>
                      </>
                    )}
                  </span>
                  {onApply && (
                    <Button type="button" size="sm" variant={i === 0 ? 'default' : 'outline'} onClick={() => onApply(mark, suggestion)}>
                      {suggestion === '' ? 'Remove' : 'Apply'}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
          {onDismiss && (
            <Button type="button" size="sm" variant="ghost" className="self-start" onClick={() => onDismiss(mark)}>
              <Trash size={16} aria-hidden /> Dismiss
            </Button>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

/** "150 characters required" (the maximum shows in the live count beside it), or "Up to 500 characters" when there is no minimum. */
function limitsText(min?: number, max?: number) {
  if (min !== undefined) return `${min} ${min === 1 ? 'character' : 'characters'} required`;
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
      marks,
      onMarkApply,
      onMarkDismiss,
      value: valueProp,
      defaultValue = '',
      onValueChange,
      placeholder = 'Click to edit',
      placeholderTone = 'muted',
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
                ? // Hover and focus show a 1px bottom border in the input colour; only a selected question gets the 2px muted accent
                  // one. The extra 1px of bottom padding keeps the height identical so the text never jumps.
                  selected
                  ? 'rounded-none border-b-2 border-accent-muted py-1'
                  : 'rounded-none border-b border-transparent pb-1.25 pt-1 enabled:hover:border-input-muted enabled:focus-visible:border-input-muted'
                : 'rounded-md border border-transparent py-1 enabled:focus-visible:border-input-accent',
              // The text is editable in place, so hovering it shows the text cursor.
              // A selected question already stands out, so its text field takes no hover background.
              question && selected ? 'enabled:cursor-text' : 'enabled:cursor-text enabled:hover:bg-secondary',
              'disabled:cursor-not-allowed disabled:opacity-50',
              textClasses,
            )}
          >
            <span className={cn('min-w-0', multiline ? 'whitespace-pre-wrap' : 'truncate', fill && 'flex-1', !value && placeholderTone === 'muted' && 'text-muted-foreground')}>
              {value
                ? splitMarks(value, marks).map((piece, i) =>
                    piece.mark ? (
                      <MarkedText key={i} mark={piece.mark} text={piece.text} onApply={onMarkApply} onDismiss={onMarkDismiss} />
                    ) : (
                      piece.text
                    ),
                  )
                : placeholder}
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

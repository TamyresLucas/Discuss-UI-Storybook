import * as React from 'react';
import { Check, DotsSixVertical, Plus, Trash, WarningCircle } from '@phosphor-icons/react';

import { cn } from '../../lib/utils';
import { Button } from '../Buttons & Actions/Button';
import { Checkbox } from '../Forms & Data Entry/Checkbox';
import { DraftMarks, MarkedText, remapMarks, splitMarks, type InlineEditMark } from '../Forms & Data Entry/MarkedText';
import { RadioGroupItem } from '../Forms & Data Entry/RadioGroup';

const optionClasses =
  'flex w-full max-w-150 cursor-pointer items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-body-base text-surface-foreground transition-colors ' +
  // Hover changes the fill and shadow only; the border changes only when the option is selected.
  'hover:bg-accent-soft hover:shadow-md ' +
  'has-[[data-state=checked]]:border-accent-foreground ' +
  'has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50';

interface OptionBase {
  label: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface QuestionRadioOptionProps extends OptionBase {
  kind?: 'radio';
  /** Value in the surrounding `RadioGroup`. */
  value: string;
}

export interface QuestionCheckboxOptionProps extends OptionBase {
  kind: 'checkbox';
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export type QuestionOptionProps = QuestionRadioOptionProps | QuestionCheckboxOptionProps;

// Figma: Question input (282:1490) › Radio / Checkbox — a full-width answer card; hover changes the fill only, and only a selected option gets the accent border.
export function QuestionOption(props: QuestionOptionProps) {
  const id = React.useId();
  return (
    <label htmlFor={id} className={cn(optionClasses, props.className)}>
      {props.kind === 'checkbox' ? (
        <Checkbox
          id={id}
          checked={props.checked}
          defaultChecked={props.defaultChecked}
          onCheckedChange={(next) => props.onCheckedChange?.(next === true)}
          disabled={props.disabled}
        />
      ) : (
        <RadioGroupItem id={id} value={props.value} disabled={props.disabled} />
      )}
      <span className="min-w-0 flex-1">{props.label}</span>
    </label>
  );
}

export interface QuestionOtherOptionProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onSubmit'> {
  /** Called with the typed text when the confirm button (or Enter) is pressed. */
  onSubmit?: (value: string) => void;
  confirmLabel?: string;
}

// Figma: Question input › Other=Yes — a free-text answer with a small confirm button.
export const QuestionOtherOption = React.forwardRef<HTMLInputElement, QuestionOtherOptionProps>(
  ({ className, onSubmit, confirmLabel = 'Confirm answer', placeholder = 'Type your answer', ...props }, ref) => {
    const inner = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => inner.current as HTMLInputElement);
    const submit = () => onSubmit?.(inner.current?.value ?? '');
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-md border border-border bg-surface py-2 pr-2 pl-4 focus-within:border-input-accent',
          className,
        )}
      >
        <input
          ref={inner}
          type="text"
          placeholder={placeholder}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              submit();
            }
          }}
          className="min-w-0 bg-transparent text-body-base text-surface-foreground outline-none placeholder:text-muted-foreground"
          {...props}
        />
        <Button type="button" variant="subtle" size="icon-sm" aria-label={confirmLabel} onClick={submit}>
          <Check size={16} aria-hidden />
        </Button>
      </div>
    );
  },
);
QuestionOtherOption.displayName = 'QuestionOtherOption';

export interface QuestionOptionEditorProps {
  label: string;
  onLabelChange?: (label: string) => void;
  /** Called by the trash button. */
  onRemove?: () => void;
  /** Called by the add (+) button. */
  onAdd?: () => void;
  /** Shown while the option is empty, for example "Option 1". */
  placeholder?: string;
  /** `regular` shows the placeholder in the normal text colour instead of the muted one. Default `muted`. */
  placeholderTone?: 'muted' | 'regular';
  /**
   * Shortest label (in characters, ignoring surrounding spaces) that may be saved. With `minLength` or `maxLength` the label is
   * guarded like an `InlineEdit`: typing only changes a draft, Enter or leaving the field saves it through `onLabelChange`, a label
   * that is too short is not saved (the field stays open and says why), Escape reverts, and while it is being edited a line under
   * the row shows the allowed range and the live count. An unchanged label is never refused. Without either, `onLabelChange` is
   * called on every keystroke as before.
   */
  minLength?: number;
  /** Longest label (in characters). See `minLength`. */
  maxLength?: number;
  /** Disables the trash button, for example when the question is already at its minimum number of options. */
  removeDisabled?: boolean;
  /** Disables the add (+) button, for example when the question is already at its maximum number of options. */
  addDisabled?: boolean;
  className?: string;
  /**
   * Answer type. When set the row is quiet at rest: its normal border, the radio or checkbox indicator in front of the
   * label, and the remove/add buttons hidden but still taking their space, so the row is the same width in every state.
   * On hover or keyboard focus it becomes the editor: the shadow lifts, the drag handle replaces the indicator and the
   * buttons appear. The border colour does not change. Omit it for an always-on editor row.
   */
  kind?: 'radio' | 'checkbox' | 'rank';
  /**
   * `kind="rank"` only: the position shown in the round number tag, as in `RankList`. For a ranking question the row keeps
   * its drag handle and number at rest and, like the other kinds, becomes the editor on hover or keyboard focus.
   */
  rank?: number;
  /**
   * Makes the grip a drag handle for reordering (spread the handle props of your drag library, e.g. dnd-kit's `attributes` and
   * `listeners`, with its `setActivatorNodeRef` as `ref`). The grip gets a grab cursor and is focusable; it is labelled
   * "Reorder option N" (N from `rank`) unless you pass your own `aria-label`. Omit it for a plain, decorative grip.
   */
  dragHandleProps?: React.ComponentPropsWithRef<'span'>;
  /**
   * The look of the row while it is being dragged: lifted shadow and the grip showing, as on hover. Use it on the copy that follows
   * the pointer; the row left behind in the list is dimmed by the caller.
   */
  lifted?: boolean;
  /**
   * Locks the row's place in the list: the label stays editable, but there is no drag grip (hover keeps the radio or checkbox
   * indicator; a ranking row keeps its number) and no remove or add buttons. For editing a translation, where the options themselves
   * are shared with the original.
   */
  locked?: boolean;
  /**
   * Ranges of the label to underline in the destructive colour, for example misspelled words found by a spell checker. The underline shows
   * while the label is not being edited. See `InlineEdit`'s `marks`.
   */
  marks?: InlineEditMark[];
  /** Makes each mark clickable: clicking an underlined word opens a card with the corrections and a Dismiss action. See `InlineEdit`'s `onMarkApply`. */
  onMarkApply?: (mark: InlineEditMark, replacement: string) => void;
  /** Called when a mark is dismissed from its card. */
  onMarkDismiss?: (mark: InlineEditMark) => void;
}

// Figma: Question input › Editor=Yes — an option being authored: drag handle, editable label, remove and add buttons.
/** "1 character required" (the maximum shows in the live count beside it), or "Up to 100 characters" when there is no minimum. */
function limitsText(min?: number, max?: number) {
  if (min !== undefined) return `${min} ${min === 1 ? 'character' : 'characters'} required`;
  if (max !== undefined) return `Up to ${max} characters`;
  return '';
}

export function QuestionOptionEditor({ label, onLabelChange, placeholder, placeholderTone = 'muted', minLength, maxLength, onRemove, onAdd, removeDisabled, addDisabled, className, kind, rank, dragHandleProps, lifted, locked, marks, onMarkApply, onMarkDismiss }: QuestionOptionEditorProps) {
  const reveal = kind !== undefined;
  const guarded = minLength !== undefined || maxLength !== undefined;
  // Guarded mode: `draft` is the text being typed (null while not editing) and `error` why the last save was refused.
  const [draft, setDraft] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const helperId = React.useId();
  const [focused, setFocused] = React.useState(false);
  const showMarks = !!marks?.length && !focused && draft === null;
  const fieldRef = React.useRef<HTMLInputElement>(null);
  // The marks as they stand while the label is edited: carried over keystroke by keystroke (see `remapMarks`).
  const [editMarks, setEditMarks] = React.useState<InlineEditMark[]>([]);
  const [scroll, setScroll] = React.useState(0);
  const typed = guarded ? (draft ?? label) : label;
  // Set while an Escape revert or a save by Enter is pending so the blur that follows does not save again.
  const skipBlur = React.useRef(false);
  const problemWith = (text: string) =>
    minLength !== undefined && text.trim().length < minLength ? `Enter at least ${minLength} ${minLength === 1 ? 'character' : 'characters'}.` : null;
  const save = () => {
    if (draft === null) return true;
    if (draft !== label) {
      const problem = problemWith(draft);
      if (problem) {
        setError(problem);
        return false;
      }
      onLabelChange?.(draft);
    }
    setDraft(null);
    setError(null);
    return true;
  };
  // The grip: decorative unless the caller makes it a drag handle.
  const gripProps: React.ComponentPropsWithRef<'span'> = dragHandleProps
    ? {
        'aria-label': rank ? `Reorder option ${rank}` : 'Reorder option',
        ...dragHandleProps,
        className: cn('cursor-grab touch-none select-none', dragHandleProps.className),
      }
    : { 'aria-hidden': true };
  const grip = dragHandleProps ? (
    <span {...gripProps} className={cn('shrink-0', gripProps.className)}>
      <DotsSixVertical size={20} aria-hidden className="text-surface-foreground" />
    </span>
  ) : (
    <DotsSixVertical size={20} aria-hidden className="shrink-0 text-surface-foreground" />
  );
  return (
    <div className={cn('group/option flex w-full items-center gap-2', className)}>
      <div
        className={cn(
          'flex min-h-11.5 min-w-0 flex-1 flex-col justify-center gap-1 rounded-md border bg-surface px-4 py-2 focus-within:border-input-accent',
          reveal
            ? // The border is always visible and does not change on hover; only the shadow lifts the row. The field being edited keeps the accent.
              cn('border-border group-hover/option:shadow-md group-focus-within/option:shadow-md', lifted && 'shadow-md')
            : 'border-border hover:border-input-muted hover:shadow-md',
        )}
      >
        <div className="flex min-w-0 items-start gap-2">
        {/* The leading grip, indicator or number is as tall as the input's line (28px), so they stay centred on the text; the helper line then sits under the input. */}
        {(kind !== undefined || !locked) && (
        <div className="flex h-7 shrink-0 items-center gap-2">
        {kind === 'rank' ? (
          <>
            {!locked && grip}
            <span
              aria-hidden="true"
              className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-background bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5 text-ui-caption text-surface-foreground"
            >
              {rank}
            </span>
          </>
        ) : reveal && locked ? (
          <span aria-hidden="true" className="relative flex size-5 shrink-0 items-center justify-center">
            <span className={cn('inline-flex size-4 border-2 border-input bg-surface', kind === 'radio' ? 'rounded-full' : 'rounded-xxs')} />
          </span>
        ) : reveal ? (
          <span {...gripProps} className={cn('relative flex size-5 shrink-0 items-center justify-center', gripProps.className)}>
            <span
              aria-hidden="true"
              className={cn(
                'inline-flex size-4 border-2 border-input bg-surface group-hover/option:hidden group-focus-within/option:hidden',
                lifted && 'hidden',
                kind === 'radio' ? 'rounded-full' : 'rounded-xxs',
              )}
            />
            <DotsSixVertical
              size={20}
              aria-hidden
              className={cn(
                'hidden shrink-0 text-surface-foreground group-hover/option:block group-focus-within/option:block',
                lifted && 'block',
              )}
            />
          </span>
        ) : locked ? null : (
          grip
        )}
        </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="relative min-w-0">
        {/* Behind the field, which is transparent and painted over it: the highlight and the browser's text selection show together. */}
        {focused && editMarks.length > 0 && <DraftMarks layer="behind" singleLine text={typed} marks={editMarks} scrollLeft={scroll} className="flex items-center whitespace-pre text-body-base" />}
        <input
          ref={fieldRef}
          aria-label="Option label"
          aria-invalid={error ? true : undefined}
          aria-describedby={guarded && draft !== null ? helperId : undefined}
          placeholder={placeholder}
          maxLength={maxLength}
          value={guarded ? (draft ?? label) : label}
          onFocus={() => {
            setFocused(true);
            setEditMarks(marks ?? []);
            if (guarded && draft === null) setDraft(label);
          }}
          onChange={(event) => {
            requestAnimationFrame(() => setScroll(fieldRef.current?.scrollLeft ?? 0));
            setEditMarks(remapMarks(typed, event.target.value, editMarks));
            if (!guarded) return onLabelChange?.(event.target.value);
            setDraft(event.target.value);
            // After a refused save the message follows what is typed and goes away once the text is acceptable.
            if (error) setError(problemWith(event.target.value));
          }}
          onScroll={(event) => setScroll(event.currentTarget.scrollLeft)}
          onKeyDown={(event) => {
            if (!guarded) return;
            if (event.key === 'Escape') {
              skipBlur.current = true;
              setDraft(null);
              setError(null);
              fieldRef.current?.blur();
            } else if (event.key === 'Enter') {
              event.preventDefault();
              if (save()) {
                skipBlur.current = true;
                fieldRef.current?.blur();
              }
            }
          }}
          onBlur={() => {
            setFocused(false);
            if (!guarded) return;
            if (skipBlur.current) {
              skipBlur.current = false;
              return;
            }
            save();
          }}
          className={cn(
            'relative w-full min-w-0 bg-transparent text-body-base text-surface-foreground outline-none',
            placeholderTone === 'regular' ? 'placeholder:text-surface-foreground' : 'placeholder:text-muted-foreground',
            // The marked text is drawn over the field, so the field's own letters step aside until it is edited.
            showMarks && 'text-transparent',
          )}
        />
        {focused && editMarks.length > 0 && <DraftMarks layer="over" singleLine text={typed} marks={editMarks} scrollLeft={scroll} className="flex items-center whitespace-pre text-body-base" />}
        {showMarks && (
          <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center overflow-hidden whitespace-pre text-body-base text-surface-foreground [&_[data-mark]]:pointer-events-auto">
            {splitMarks(label, marks).map((piece, i) =>
              piece.mark ? <MarkedText key={`${piece.mark.start}:${piece.text}`} mark={piece.mark} text={piece.text} onApply={onMarkApply} onDismiss={onMarkDismiss} /> : <span key={i}>{piece.text}</span>,
            )}
          </div>
        )}
        </div>
    {guarded && draft !== null && (
      <p
        id={helperId}
        role={error ? 'alert' : undefined}
        className={cn('flex items-start justify-between gap-2 text-ui-caption', error ? 'text-destructive' : 'text-secondary-muted-foreground')}
      >
        <span className="flex items-start gap-2">
          {error && <WarningCircle size={16} aria-hidden className="shrink-0" />}
          {limitsText(minLength, maxLength)}
          {error && <span className="sr-only">{error}</span>}
        </span>
        <span aria-hidden className="shrink-0 tabular-nums">
          {draft.length}
          {maxLength !== undefined && `/${maxLength}`}
        </span>
      </p>
    )}
        </div>
        </div>
      </div>
      {!locked && (
        <div
          className={cn(
            'flex items-center gap-2',
            reveal && 'opacity-0 transition-opacity group-hover/option:opacity-100 group-focus-within/option:opacity-100',
          )}
        >
          <Button type="button" variant="destructive" size="icon-sm" aria-label="Remove option" disabled={removeDisabled} onClick={onRemove}>
            <Trash size={16} aria-hidden />
          </Button>
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Add option" disabled={addDisabled} onClick={onAdd}>
            <Plus size={16} aria-hidden />
          </Button>
        </div>
      )}
    </div>
  );
}

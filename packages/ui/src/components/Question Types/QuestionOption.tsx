import * as React from 'react';
import { Check, DotsSixVertical, Plus, Trash } from '@phosphor-icons/react';

import { cn } from '../../lib/utils';
import { Button } from '../Buttons & Actions/Button';
import { Checkbox } from '../Forms & Data Entry/Checkbox';
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
}

// Figma: Question input › Editor=Yes — an option being authored: drag handle, editable label, remove and add buttons.
export function QuestionOptionEditor({ label, onLabelChange, placeholder, onRemove, onAdd, removeDisabled, addDisabled, className, kind, rank, dragHandleProps, lifted, locked }: QuestionOptionEditorProps) {
  const reveal = kind !== undefined;
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
          'flex h-11.5 min-w-0 flex-1 items-center gap-2 rounded-md border bg-surface px-4 py-2 focus-within:border-input-accent',
          reveal
            ? // The border is always visible and does not change on hover; only the shadow lifts the row. The field being edited keeps the accent.
              cn('border-border group-hover/option:shadow-md group-focus-within/option:shadow-md', lifted && 'shadow-md')
            : 'border-border hover:border-input-muted hover:shadow-md',
        )}
      >
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
        <input
          aria-label="Option label"
          placeholder={placeholder}
          value={label}
          onChange={(event) => onLabelChange?.(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-body-base text-surface-foreground outline-none"
        />
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

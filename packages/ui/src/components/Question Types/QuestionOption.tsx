import * as React from 'react';
import { Check, DotsSixVertical, Plus, Trash } from '@phosphor-icons/react';

import { cn } from '../../lib/utils';
import { Button } from '../Buttons & Actions/Button';
import { Checkbox } from '../Forms & Data Entry/Checkbox';
import { RadioGroupItem } from '../Forms & Data Entry/RadioGroup';

const optionClasses =
  'flex w-full max-w-150 cursor-pointer items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-body-base text-surface-foreground transition-colors ' +
  'hover:border-input hover:bg-accent-soft hover:shadow-md ' +
  'has-[[data-state=checked]]:border-accent-foreground has-[[data-state=checked]]:hover:border-accent-foreground ' +
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

// Figma: Question input (282:1490) › Radio / Checkbox — a full-width answer card; selected gets the accent border.
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
  className?: string;
}

// Figma: Question input › Editor=Yes — an option being authored: drag handle, editable label, remove and add buttons.
export function QuestionOptionEditor({ label, onLabelChange, onRemove, onAdd, className }: QuestionOptionEditorProps) {
  return (
    <div className={cn('flex w-full items-center gap-2', className)}>
      <div className="flex h-11.5 min-w-0 flex-1 items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 focus-within:border-input-accent hover:border-input hover:shadow-md">
        <DotsSixVertical size={20} aria-hidden className="shrink-0 text-surface-foreground" />
        <input
          aria-label="Option label"
          value={label}
          onChange={(event) => onLabelChange?.(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-body-base text-surface-foreground outline-none"
        />
      </div>
      <Button type="button" variant="destructive" size="icon-sm" aria-label="Remove option" onClick={onRemove}>
        <Trash size={16} aria-hidden />
      </Button>
      <Button type="button" variant="ghost" size="icon-sm" aria-label="Add option" onClick={onAdd}>
        <Plus size={16} aria-hidden />
      </Button>
    </div>
  );
}

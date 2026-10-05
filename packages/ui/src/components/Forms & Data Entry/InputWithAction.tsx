import * as React from 'react';

import { cn } from '../../lib/utils';
import { Button } from '../Buttons & Actions/Button';
import { Field, type FieldStatus } from './Field';

export interface InputWithActionProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label of the trailing action button. */
  actionLabel: string;
  onAction?: React.MouseEventHandler<HTMLButtonElement>;
  /** Chips (e.g. `EditableTag`s) shown inside the field before the input. */
  tags?: React.ReactNode;
  status?: Exclude<FieldStatus, 'success'>;
  label?: React.ReactNode;
  /** Support text shown under the field. */
  description?: React.ReactNode;
  /** Error message shown when `status` is `error`. */
  message?: React.ReactNode;
}

// Figma: Input with Action (19) — field with a trailing subtle small button (e.g. "Invite").
export const InputWithAction = React.forwardRef<HTMLInputElement, InputWithActionProps>(
  (
    { className, actionLabel, onAction, tags, status = 'default', label, description, message, id, disabled, placeholder, ...props },
    ref,
  ) => (
    <Field label={label} description={description} message={message} status={status} id={id}>
      {(control) => (
        <div
          className={cn(
            'flex min-h-10 w-full items-center gap-2 rounded-md border bg-surface py-2 pr-1 pl-3 transition-colors',
            'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring',
            status === 'error' ? 'border-destructive' : 'border-input hover:border-input-accent focus-within:border-input',
            tags ? 'pl-1' : null,
            disabled && 'opacity-50',
            className,
          )}
        >
          {tags && <div className="flex shrink-0 items-center gap-1">{tags}</div>}
          <input
            ref={ref}
            disabled={disabled}
            placeholder={tags ? undefined : placeholder}
            className="min-w-0 flex-1 truncate bg-transparent text-body-small text-surface-foreground outline-none placeholder:text-muted-foreground"
            {...control}
            {...props}
          />
          <Button type="button" variant="subtle" size="sm" disabled={disabled} onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </Field>
  ),
);
InputWithAction.displayName = 'InputWithAction';

import * as React from 'react';
import { CheckCircle, WarningCircle } from '@phosphor-icons/react';

import { cn } from '../../lib/utils';
import { Label } from './Label';

export type FieldStatus = 'default' | 'success' | 'error';

/**
 * Classes for a bordered field surface (Figma: Text Input / Textarea / Select).
 * Hover and the open "select" state use `input-accent`; success and error swap
 * the border colour. Focus is handled by the global `:focus-visible` ring.
 */
export function fieldSurfaceClasses(status: FieldStatus = 'default') {
  return cn(
    'border bg-surface text-surface-foreground transition-colors',
    status === 'success' && 'border-success-foreground',
    status === 'error' && 'border-destructive',
    status === 'default' && 'border-input hover:border-input-accent',
  );
}

export interface FieldControlProps {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
}

export interface FieldProps {
  /** Label shown above the control. */
  label?: React.ReactNode;
  /** Neutral helper text shown under the control. Replaced by `message` on success/error. */
  description?: React.ReactNode;
  /** Status message shown with an icon when `status` is `success` or `error`. */
  message?: React.ReactNode;
  status?: FieldStatus;
  /** Id for the control; generated when omitted. */
  id?: string;
  className?: string;
  /** Render the control, spreading the supplied props onto it. */
  children: (control: FieldControlProps) => React.ReactNode;
}

/**
 * Label + control + helper/status message, wired together with
 * `htmlFor`/`aria-describedby`/`aria-invalid`. Shared by Text Input, Textarea,
 * Select, Numerical input and Input with action.
 */
export function Field({ label, description, message, status = 'default', id, className, children }: FieldProps) {
  const generatedId = React.useId();
  const controlId = id ?? generatedId;
  const messageId = `${controlId}-message`;
  const showStatus = status !== 'default' && message != null;
  const text = showStatus ? message : description;

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      {label != null && <Label htmlFor={controlId}>{label}</Label>}
      {children({
        id: controlId,
        'aria-describedby': text != null ? messageId : undefined,
        'aria-invalid': status === 'error' ? true : undefined,
      })}
      {text != null && (
        <p
          id={messageId}
          className={cn(
            'flex gap-2 text-ui-caption',
            status === 'default' && 'text-secondary-muted-foreground',
            status === 'success' && 'items-center text-success-foreground',
            status === 'error' && 'items-start text-destructive',
          )}
        >
          {showStatus &&
            (status === 'error' ? (
              <WarningCircle size={16} aria-hidden className="shrink-0" />
            ) : (
              <CheckCircle size={16} aria-hidden className="shrink-0" />
            ))}
          {text}
        </p>
      )}
    </div>
  );
}

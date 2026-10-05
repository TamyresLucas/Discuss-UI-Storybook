import * as React from 'react';

import { cn } from '../../lib/utils';
import { Field, fieldSurfaceClasses, type FieldStatus } from './Field';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Border/message state. `error` also sets `aria-invalid`. */
  status?: FieldStatus;
  /** Convenience: renders a Field (label + helper/status message) around the input. */
  label?: React.ReactNode;
  description?: React.ReactNode;
  message?: React.ReactNode;
}

// Figma: Text Input (19) — 40px tall, 12px inline padding, 8px radius, 16px value.
const inputClasses = (status: FieldStatus | undefined, className?: string) =>
  cn(
    'flex h-10 w-full rounded-md px-3 py-2 text-ui-input-value placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
    fieldSurfaceClasses(status),
    className,
  );

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, status = 'default', label, description, message, id, ...props }, ref) => {
    if (label == null && description == null && message == null) {
      return (
        <input
          ref={ref}
          id={id}
          aria-invalid={status === 'error' ? true : undefined}
          className={inputClasses(status, className)}
          {...props}
        />
      );
    }
    return (
      <Field label={label} description={description} message={message} status={status} id={id}>
        {(control) => <input ref={ref} className={inputClasses(status, className)} {...control} {...props} />}
      </Field>
    );
  },
);
Input.displayName = 'Input';

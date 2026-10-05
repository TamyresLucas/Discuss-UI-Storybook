import * as React from 'react';

import { cn } from '../../lib/utils';
import { Field, fieldSurfaceClasses, type FieldStatus } from './Field';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  status?: FieldStatus;
  /** Convenience: renders a Field (label + helper/status message) around the textarea. */
  label?: React.ReactNode;
  description?: React.ReactNode;
  message?: React.ReactNode;
}

// Figma: Textarea (20) — min 100px tall, 12/10px padding, 8px radius, 16/28 value.
const textareaClasses = (status: FieldStatus | undefined, className?: string) =>
  cn(
    'flex field-sizing-content min-h-25 w-full rounded-md px-3 py-2.5 text-body-base placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
    fieldSurfaceClasses(status),
    className,
  );

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, status = 'default', label, description, message, id, ...props }, ref) => {
    if (label == null && description == null && message == null) {
      return (
        <textarea
          ref={ref}
          id={id}
          aria-invalid={status === 'error' ? true : undefined}
          className={textareaClasses(status, className)}
          {...props}
        />
      );
    }
    return (
      <Field label={label} description={description} message={message} status={status} id={id}>
        {(control) => <textarea ref={ref} className={textareaClasses(status, className)} {...control} {...props} />}
      </Field>
    );
  },
);
Textarea.displayName = 'Textarea';

import * as React from 'react';

import { Textarea, type TextareaProps } from '../Forms & Data Entry/Textarea';

export interface OpenEndAnswerProps extends Omit<TextareaProps, 'label' | 'description' | 'message' | 'maxLength'> {
  /** Character limit shown in the counter. */
  maxLength?: number;
}

// Figma: Question input › Open end — a multi-line field with a live "0/1000 characters" counter.
export const OpenEndAnswer = React.forwardRef<HTMLTextAreaElement, OpenEndAnswerProps>(
  ({ value, defaultValue, onChange, maxLength = 1000, placeholder = 'Write your answer', ...props }, ref) => {
    const [internal, setInternal] = React.useState(String(defaultValue ?? ''));
    const text = value !== undefined ? String(value) : internal;
    return (
      <Textarea
        ref={ref}
        value={text}
        maxLength={maxLength}
        placeholder={placeholder}
        description={`${text.length}/${maxLength} characters`}
        onChange={(event) => {
          setInternal(event.target.value);
          onChange?.(event);
        }}
        {...props}
      />
    );
  },
);
OpenEndAnswer.displayName = 'OpenEndAnswer';

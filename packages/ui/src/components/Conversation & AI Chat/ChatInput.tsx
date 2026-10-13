import * as React from 'react';
import { ArrowUp, Plus } from '@phosphor-icons/react';

import { cn } from '../../lib/utils';
import { Button } from '../Buttons & Actions/Button';

export interface ChatInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSubmit' | 'defaultValue' | 'onChange'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called with the text when the send button (or Enter) is pressed. */
  onSubmit?: (value: string) => void;
  placeholder?: string;
  /** Accessible name for the text area. */
  'aria-label'?: string;
  /** Attached files (`FileAttachment`s) shown above the text. */
  attachments?: React.ReactNode;
  /** A `ChatChoices` block shown above the text area. */
  choices?: React.ReactNode;
  /** Slot before the send button — usually a `ProjectSelector`. */
  trailing?: React.ReactNode;
  /** Called when the add (+) button is pressed. Hides the button when omitted. */
  onAdd?: () => void;
  addLabel?: string;
  sendLabel?: string;
  disabled?: boolean;
}

// Figma: Chat Input (56) › Chat input — a rounded card: optional choices, attachments + text, then an actions row.
export const ChatInput = React.forwardRef<HTMLDivElement, ChatInputProps>(
  (
    {
      className,
      value,
      defaultValue = '',
      onValueChange,
      onSubmit,
      placeholder = 'Add context or ask for changes...',
      'aria-label': ariaLabel = 'Message',
      attachments,
      choices,
      trailing,
      onAdd,
      addLabel = 'Add',
      sendLabel = 'Send',
      disabled,
      ...props
    },
    ref,
  ) => {
    const [internal, setInternal] = React.useState(defaultValue);
    const text = value ?? internal;
    const filled = text.trim() !== '' || attachments != null;

    const submit = () => {
      if (!text.trim() && attachments == null) return;
      onSubmit?.(text);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xs',
          'focus-within:border-input-accent',
          className,
        )}
        {...props}
      >
        {choices}
        <div className="flex flex-col gap-4 p-4">
          {attachments && <div className="flex flex-wrap gap-4">{attachments}</div>}
          <textarea
            rows={1}
            aria-label={ariaLabel}
            value={text}
            disabled={disabled}
            placeholder={placeholder}
            onChange={(event) => {
              setInternal(event.target.value);
              onValueChange?.(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
            className="field-sizing-content max-h-60 min-h-7 w-full resize-none bg-transparent text-body-base text-surface-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-1.5 px-2.5 pt-2 pb-2.5">
          {onAdd && (
            <Button type="button" variant="ghost" size="icon" aria-label={addLabel} disabled={disabled} onClick={onAdd}>
              <Plus size={16} aria-hidden />
            </Button>
          )}
          <div className="flex flex-1 items-center justify-end gap-1.5">
            {trailing}
            <Button
              type="button"
              variant={filled ? 'default' : 'outline'}
              size="icon"
              aria-label={sendLabel}
              disabled={disabled || !filled}
              onClick={submit}
              className={cn('rounded-full', !filled && 'disabled:opacity-100 disabled:border-border disabled:text-muted-foreground')}
            >
              <ArrowUp size={16} aria-hidden />
            </Button>
          </div>
        </div>
      </div>
    );
  },
);
ChatInput.displayName = 'ChatInput';

export interface AskAiInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onSubmit'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  sendLabel?: string;
}

// Figma: Chat Input (56) › Ask AI — the compact one-line pill ("Ask for changes").
export const AskAiInput = React.forwardRef<HTMLInputElement, AskAiInputProps>(
  (
    { className, value, defaultValue = '', onValueChange, onSubmit, sendLabel = 'Send', placeholder = 'Ask for changes', disabled, ...props },
    ref,
  ) => {
    const [internal, setInternal] = React.useState(defaultValue);
    const text = value ?? internal;
    const filled = text.trim() !== '';
    return (
      <form
        className={cn(
          'flex min-h-10 w-full items-center gap-2 rounded-full border border-border bg-surface py-1.5 pr-1.5 pl-2 shadow-sm',
          'focus-within:border-input-accent',
          className,
        )}
        onSubmit={(event) => {
          event.preventDefault();
          if (filled) onSubmit?.(text);
        }}
      >
        <input
          ref={ref}
          value={text}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(event) => {
            setInternal(event.target.value);
            onValueChange?.(event.target.value);
          }}
          className="min-w-0 flex-1 bg-transparent text-body-small text-surface-foreground outline-none placeholder:text-muted-foreground"
          {...props}
        />
        <Button
          type="submit"
          variant={filled ? 'default' : 'outline'}
          size="icon"
          aria-label={sendLabel}
          disabled={disabled || !filled}
          className={cn(!filled && 'disabled:opacity-100 disabled:border-border disabled:text-muted-foreground')}
        >
          <ArrowUp size={16} aria-hidden />
        </Button>
      </form>
    );
  },
);
AskAiInput.displayName = 'AskAiInput';

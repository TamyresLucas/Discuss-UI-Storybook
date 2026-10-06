import * as React from 'react';
import { PencilSimple } from '@phosphor-icons/react';

import { cn } from '../../lib/utils';
import { fieldSurfaceClasses } from './Field';

export interface InlineEditProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Controlled value. Pair with `onValueChange`. */
  value?: string;
  defaultValue?: string;
  /** Called when an edit is committed (Enter, blur or the commit key for multiline) with a changed value. */
  onValueChange?: (value: string) => void;
  /** Shown in read mode, muted, while the value is empty. */
  placeholder?: string;
  /** Accessible name for the read button and the field. Required: there is no visible label. */
  'aria-label': string;
  /** Use a textarea. Enter inserts a line break; Cmd/Ctrl+Enter commits. */
  multiline?: boolean;
  maxLength?: number;
  disabled?: boolean;
  /** Called when editing starts or ends. */
  onEditingChange?: (editing: boolean) => void;
  /** Classes for the displayed/edited text, e.g. a heading text style. The field itself keeps the same box. */
  textClassName?: string;
}

// Not in Figma: shadcn has no inline-edit primitive, so this is a plain toggle between a button and a field.
// Read mode is a button (so it is keyboard- and screen-reader-reachable); editing swaps in an input that commits on
// Enter/blur and reverts on Escape.
export const InlineEdit = React.forwardRef<HTMLDivElement, InlineEditProps>(
  (
    {
      className,
      textClassName,
      value: valueProp,
      defaultValue = '',
      onValueChange,
      placeholder = 'Click to edit',
      multiline,
      maxLength,
      disabled,
      onEditingChange,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const [internal, setInternal] = React.useState(defaultValue);
    const value = valueProp ?? internal;
    const [editing, setEditing] = React.useState(false);
    const [draft, setDraft] = React.useState(value);
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

    const start = () => {
      if (disabled) return;
      setDraft(value);
      cancelled.current = false;
      setEditing(true);
      onEditingChange?.(true);
    };
    const finish = (commit: boolean, refocus: boolean) => {
      restoreFocus.current = refocus;
      if (commit && draft !== value) {
        if (valueProp === undefined) setInternal(draft);
        onValueChange?.(draft);
      }
      setEditing(false);
      onEditingChange?.(false);
    };

    const textClasses = cn('text-ui-input-value text-surface-foreground', textClassName);

    return (
      <div ref={ref} className={cn('inline-flex min-w-0 max-w-full', className)} {...props}>
        {editing ? (
          React.createElement(multiline ? 'textarea' : 'input', {
            ref: fieldRef,
            value: draft,
            maxLength,
            'aria-label': ariaLabel,
            ...(multiline ? { rows: 1 } : { type: 'text' }),
            className: cn(
              'w-full rounded-md px-3 py-1 outline-none focus-visible:border-input-accent',
              multiline && 'field-sizing-content resize-none',
              fieldSurfaceClasses('default'),
              textClasses,
            ),
            onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(event.target.value),
            onKeyDown: (event: React.KeyboardEvent) => {
              if (event.key === 'Escape') {
                cancelled.current = true;
                finish(false, true);
              } else if (event.key === 'Enter' && (!multiline || event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                finish(true, true);
              }
            },
            onBlur: () => {
              if (!cancelled.current) finish(true, false);
            },
          })
        ) : (
          <button
            ref={readRef}
            type="button"
            disabled={disabled}
            aria-label={`${ariaLabel}: ${value || placeholder}. Edit`}
            onClick={start}
            className={cn(
              'group inline-flex min-w-0 max-w-full items-center gap-2 rounded-md border border-transparent px-3 py-1 text-left outline-none',
              'enabled:hover:bg-secondary enabled:focus-visible:border-input-accent disabled:cursor-not-allowed disabled:opacity-50',
              textClasses,
            )}
          >
            <span className={cn('min-w-0 truncate', multiline && 'whitespace-pre-wrap', !value && 'text-muted-foreground')}>
              {value || placeholder}
            </span>
            <PencilSimple
              size={16}
              aria-hidden
              className="shrink-0 text-secondary-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            />
          </button>
        )}
      </div>
    );
  },
);
InlineEdit.displayName = 'InlineEdit';

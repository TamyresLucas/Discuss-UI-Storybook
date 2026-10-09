import * as React from 'react';
import { MagnifyingGlass, X } from '@phosphor-icons/react';

import { cn } from '../../lib/utils';

export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Called when the clear (×) button is pressed, after the field has been emptied. */
  onClear?: () => void;
  /** Label for the clear button. */
  clearLabel?: string;
}

// Figma: Search Bar (18) — 40px, 1px muted border; focused/filled gets a 2px accent border.
export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, value, defaultValue, onChange, onClear, clearLabel = 'Clear search', disabled, ...props }, ref) => {
    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);
    const [uncontrolled, setUncontrolled] = React.useState(String(defaultValue ?? ''));
    const current = value !== undefined ? String(value) : uncontrolled;

    const clear = () => {
      const input = innerRef.current;
      if (input) {
        // Drive the native setter so React's onChange fires for controlled consumers too.
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
        setter?.call(input, '');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.focus();
      }
      onClear?.();
    };

    return (
      <div
        className={cn(
          'flex h-10 w-full items-center gap-2 rounded-md border bg-surface px-3 py-2 transition-colors',
          'border-input-muted focus-within:border-input-accent focus-within:ring-1 focus-within:ring-input-accent',
          current !== '' && 'border-input-accent ring-1 ring-input-accent',
          disabled && 'opacity-50',
          className,
        )}
      >
        <MagnifyingGlass size={16} aria-hidden className="shrink-0 text-surface-foreground" />
        <input
          ref={innerRef}
          type="text"
          role="searchbox"
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          onChange={(event) => {
            setUncontrolled(event.target.value);
            onChange?.(event);
          }}
          className="min-w-0 flex-1 bg-transparent text-ui-input-value text-surface-foreground outline-none placeholder:text-muted-foreground"
          {...props}
        />
        {current !== '' && !disabled && (
          <button
            type="button"
            aria-label={clearLabel}
            onClick={clear}
            className="inline-flex size-4 shrink-0 items-center justify-center rounded-xs text-surface-foreground"
          >
            <X size={16} aria-hidden />
          </button>
        )}
      </div>
    );
  },
);
SearchBar.displayName = 'SearchBar';

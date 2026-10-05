import * as React from 'react';
import { Crown, Plus, X } from '@phosphor-icons/react';
import { cva } from 'class-variance-authority';

import { cn } from '../../lib/utils';

// Figma: Editable tags (41). Compact 26px chip used for removable / addable values.
const editableTagVariants = cva(
  'inline-flex h-6.5 items-center whitespace-nowrap rounded-sm py-1 text-ui-caption transition-colors',
  {
    variants: {
      type: {
        default: 'gap-1 bg-accent-muted pl-2.5 pr-1.5 text-primary',
        editable:
          'gap-1 bg-secondary bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5 pl-2.5 pr-1.5 text-surface-foreground hover:bg-accent-soft hover:bg-none hover:text-accent-soft-foreground',
        add: 'gap-1 border border-dashed border-border pl-2.5 pr-1.5 text-surface-foreground hover:bg-accent-soft hover:text-accent-soft-foreground',
        multiple:
          'bg-secondary bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5 px-2.5 text-surface-foreground hover:bg-accent-soft hover:bg-none hover:text-accent-soft-foreground',
      },
    },
    defaultVariants: { type: 'default' },
  },
);

export interface EditableTagProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  /** `default` is the highlighted (primary) value, `editable` is removable, `add` adds a value, `multiple` is the "+N more" overflow chip. */
  type?: 'default' | 'editable' | 'add' | 'multiple';
  /** Leading icon. `default` shows a crown unless you pass `null`. */
  icon?: React.ReactNode;
  /** Renders a remove button on `editable`/`default` tags. */
  onRemove?: () => void;
  /** Click handler for `add` and `multiple` (rendered as a button when set). */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}

export const EditableTag = React.forwardRef<HTMLElement, EditableTagProps>(
  ({ className, type = 'default', icon, onRemove, onClick, children, ...props }, ref) => {
    const classes = cn(editableTagVariants({ type }), className);
    const leading =
      type === 'add' ? (
        <Plus size={12} aria-hidden />
      ) : icon !== undefined ? (
        icon
      ) : type === 'default' ? (
        <Crown size={12} weight="fill" aria-hidden />
      ) : null;

    if (type === 'add' || (type === 'multiple' && onClick)) {
      return (
        <button ref={ref as React.Ref<HTMLButtonElement>} type="button" className={classes} onClick={onClick} {...props}>
          {leading}
          {children}
        </button>
      );
    }

    return (
      <span ref={ref as React.Ref<HTMLSpanElement>} className={classes} {...props}>
        {leading}
        {children}
        {onRemove && (
          <button
            type="button"
            aria-label={typeof children === 'string' ? `Remove ${children}` : 'Remove'}
            onClick={onRemove}
            className="inline-flex size-3 items-center justify-center rounded-xs"
          >
            <X size={12} aria-hidden />
          </button>
        )}
      </span>
    );
  },
);
EditableTag.displayName = 'EditableTag';

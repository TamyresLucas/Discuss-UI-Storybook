import * as React from 'react';
import { DotsSixVertical, RadioButton } from '@phosphor-icons/react';
import { cva } from 'class-variance-authority';

import { cn } from '../../lib/utils';

// Figma: Role Tag (41), now the system Badge. 24px chip; `interactable` reveals a drag handle on hover.
const roleTagVariants = cva(
  'group inline-flex h-6 items-center whitespace-nowrap rounded-sm py-1 text-ui-caption transition-colors',
  {
    variants: {
      type: {
        primary: 'bg-primary-soft px-2.5 text-primary-soft-foreground',
        secondary:
          'bg-secondary bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5 px-2.5 text-secondary-muted-foreground',
        question: 'gap-1 bg-primary-soft pl-1 pr-2.5 text-plum-500',
        interactable: 'gap-1 pl-2.5 pr-2.5 hover:pl-1',
        id: 'gap-1 bg-secondary bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5 px-2.5 tabular-nums text-surface-foreground',
        count:
          'min-w-6 justify-center rounded-full bg-secondary bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5 px-2 tabular-nums text-surface-foreground',
      },
      selected: { true: '', false: '' },
    },
    compoundVariants: [
      {
        type: 'interactable',
        selected: false,
        className:
          'bg-secondary bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5 text-surface-foreground',
      },
      { type: 'interactable', selected: true, className: 'bg-accent-soft text-accent-foreground' },
    ],
    defaultVariants: { type: 'primary', selected: false },
  },
);

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  /**
   * `id` prefixes the content with a muted "ID" label (children is the identifier); `count` is a round pill for a number.
   */
  type?: 'primary' | 'secondary' | 'question' | 'interactable' | 'id' | 'count';
  /** Pressed state for `interactable` tags. */
  selected?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLElement, BadgeProps>(
  ({ className, type = 'primary', selected = false, onClick, children, ...props }, ref) => {
    const classes = cn(roleTagVariants({ type, selected: type === 'interactable' ? selected : false }), className);

    if (type === 'interactable') {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          aria-pressed={selected}
          className={classes}
          onClick={onClick}
          {...props}
        >
          <DotsSixVertical size={16} aria-hidden className="hidden shrink-0 group-hover:block" />
          {children}
        </button>
      );
    }

    return (
      <span ref={ref as React.Ref<HTMLSpanElement>} className={classes} {...props}>
        {type === 'question' && <RadioButton size={16} weight="fill" aria-hidden />}
        {type === 'id' && <span className="text-secondary-muted-foreground">ID</span>}
        {children}
      </span>
    );
  },
);
Badge.displayName = 'Badge';

import * as React from 'react';
import { CaretRight, Check } from '@phosphor-icons/react';

import { cn } from '../../lib/utils';

export interface TopicCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Leading 24px icon (a Phosphor icon, e.g. `<FolderOpen weight="fill" />`). */
  icon?: React.ReactNode;
  title: React.ReactNode;
  /** Small tag beside the title (e.g. a language `Badge`). */
  badge?: React.ReactNode;
  description: React.ReactNode;
  /** Chips under the description (e.g. topic tags). */
  tags?: React.ReactNode;
  /** Meta line under the description (e.g. "7 Questions · 30 minutes"). */
  meta?: React.ReactNode;
}

// Figma: AI Response Container (55) › Topic — bordered 16px-radius card with a display-font title.
export const TopicCard = React.forwardRef<HTMLDivElement, TopicCardProps>(
  ({ className, icon, title, badge, description, tags, meta, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex w-full flex-col gap-4 overflow-hidden rounded-xl border border-border bg-surface p-4', className)}
      {...props}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4 text-primary">
          {icon && <span className="flex size-6 shrink-0 items-center justify-center [&>svg]:size-6">{icon}</span>}
          <h3 className="text-heading-h3 whitespace-nowrap">{title}</h3>
        </div>
        {badge}
      </div>
      <p className="text-body-base text-surface-foreground">{description}</p>
      {tags && <div className="flex flex-wrap items-center gap-2">{tags}</div>}
      {meta && <div className="flex items-center gap-2 text-ui-caption text-secondary-muted-foreground">{meta}</div>}
    </div>
  ),
);
TopicCard.displayName = 'TopicCard';

export interface TopicCardMetaItemProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon: React.ReactNode;
}

/** An icon + text item for `TopicCard`'s `meta` line. */
export function TopicCardMetaItem({ icon, children, className, ...props }: TopicCardMetaItemProps) {
  return (
    <span className={cn('flex items-center gap-1', className)} {...props}>
      <span aria-hidden="true" className="flex size-4 items-center justify-center [&>svg]:size-4">
        {icon}
      </span>
      {children}
    </span>
  );
}

/** A short chip for `TopicCard`'s `tags` row. */
export function TopicCardTag({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'rounded-sm bg-secondary bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5 px-2 py-1 text-ui-caption text-surface-foreground',
        className,
      )}
      {...props}
    />
  );
}

export interface TopicActivityRowProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  /** Status text, e.g. "New Activity Created". */
  status: React.ReactNode;
}

// Figma: Topic › Variant 5 — a divider row linking to the created item.
export const TopicActivityRow = React.forwardRef<HTMLButtonElement, TopicActivityRowProps>(
  ({ className, status, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        'flex w-full items-center gap-4 border-b border-border bg-surface p-4 text-left text-body-small text-surface-foreground',
        className,
      )}
      {...props}
    >
      <span className="flex items-center gap-2 whitespace-nowrap">
        <Check size={16} aria-hidden className="text-accent" />
        {status}
      </span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
      <CaretRight size={16} aria-hidden />
    </button>
  ),
);
TopicActivityRow.displayName = 'TopicActivityRow';

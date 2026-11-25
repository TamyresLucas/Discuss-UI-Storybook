import * as React from 'react';

import { cn } from '../../lib/utils';

export interface NavRailProps extends React.HTMLAttributes<HTMLElement> {
  /** Names the navigation for screen readers (e.g. "Builder panels"). */
  'aria-label': string;
  /** Pinned at the bottom of the rail (e.g. an account avatar). */
  footer?: React.ReactNode;
}

/**
 * A narrow vertical rail of `NavRailItem`s on the edge of the page: 64px wide with a border on its right, items stacked from the top. It switches what
 * a panel beside it shows (Figma "Design rail"). The consumer owns which item is selected.
 */
export const NavRail = React.forwardRef<HTMLElement, NavRailProps>(({ className, children, footer, ...props }, ref) => (
  <nav ref={ref} className={cn('flex h-full w-16 shrink-0 flex-col border-r border-border', className)} {...props}>
    <ul className="flex flex-col items-center gap-2 px-2 pt-3">{children}</ul>
    {footer && <div className="mt-auto flex flex-col items-center px-2 pb-3">{footer}</div>}
  </nav>
));
NavRail.displayName = 'NavRail';

export interface NavRailItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** A 16px Phosphor icon. */
  icon: React.ReactNode;
  /** The caption under the icon. */
  label: React.ReactNode;
  /** The item whose view is showing: its icon sits on a filled square and its caption is darker (`aria-current`). */
  selected?: boolean;
}

/** One item of a `NavRail`: an icon on a 36px square with its caption under it. */
export const NavRailItem = React.forwardRef<HTMLButtonElement, NavRailItemProps>(({ className, icon, label, selected = false, type = 'button', ...props }, ref) => (
  <li className="w-full">
    <button
      ref={ref}
      type={type}
      aria-current={selected ? 'page' : undefined}
      className={cn(
        'group flex w-full cursor-pointer flex-col items-center gap-1 rounded-md text-body-xxs outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
        // Hover (selected or not, Figma "Primary menu items" Hover=Yes): the caption and icon in accent-soft-foreground.
        selected ? 'text-surface-foreground' : 'text-secondary-muted-foreground',
        'hover:text-accent-soft-foreground',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex size-9 items-center justify-center rounded-md transition-colors [&>svg]:size-4',
          // Hover fills the square with accent-soft, over the selected fill too.
          selected ? 'bg-secondary' : '',
          'group-hover:bg-accent-soft',
        )}
      >
        {icon}
      </span>
      <span>{label}</span>
    </button>
  </li>
));
NavRailItem.displayName = 'NavRailItem';

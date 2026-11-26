import * as React from 'react';

import { cn } from '../../lib/utils';

/**
 * `secondary` (default) is the builder's "Design rail": 64px wide, 36px squares, 16px icons. `primary` is the org rail ("Application navigation",
 * hierarchy Primary): 72px wide, 40px squares, 24px icons, the selected square filled with primary and its caption in primary.
 */
export type NavRailHierarchy = 'secondary' | 'primary';

const NavRailContext = React.createContext<NavRailHierarchy>('secondary');

export interface NavRailProps extends React.HTMLAttributes<HTMLElement> {
  /** Names the navigation for screen readers (e.g. "Builder panels"). */
  'aria-label': string;
  /** Pinned at the bottom of the rail (e.g. an account avatar). */
  footer?: React.ReactNode;
  /** A 64px band at the top with a border under it (e.g. the organization's `OrgMonogram`). */
  header?: React.ReactNode;
  hierarchy?: NavRailHierarchy;
}

/**
 * A narrow vertical rail of `NavRailItem`s on the edge of the page, with a border on its right and items stacked from the top. The secondary rail switches
 * what a panel beside it shows (Figma "Design rail"); the primary rail is the organization's navigation (Figma "Application navigation"). The consumer owns
 * which item is selected.
 */
export const NavRail = React.forwardRef<HTMLElement, NavRailProps>(({ className, children, footer, header, hierarchy = 'secondary', ...props }, ref) => (
  <NavRailContext.Provider value={hierarchy}>
    <nav ref={ref} className={cn('flex h-full shrink-0 flex-col border-r border-border', hierarchy === 'primary' ? 'w-18' : 'w-16', className)} {...props}>
      {header && <div className="flex h-16 shrink-0 items-center justify-center border-b border-border">{header}</div>}
      <ul className="flex flex-col items-center gap-2 px-2 pt-3">{children}</ul>
      {footer && <div className={cn('mt-auto flex flex-col items-center px-2', hierarchy === 'primary' ? 'gap-3 py-4' : 'pb-3')}>{footer}</div>}
    </nav>
  </NavRailContext.Provider>
));
NavRail.displayName = 'NavRail';

export interface NavRailItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** A Phosphor icon: drawn at 16px on a secondary rail, 24px on a primary one. */
  icon: React.ReactNode;
  /** The caption under the icon. */
  label: React.ReactNode;
  /** The item whose view is showing: its icon sits on a filled square and its caption is darker (`aria-current`). */
  selected?: boolean;
}

/** One item of a `NavRail`: an icon on a square (36px, or 40px on a primary rail) with its caption under it. */
export const NavRailItem = React.forwardRef<HTMLButtonElement, NavRailItemProps>(({ className, icon, label, selected = false, type = 'button', ...props }, ref) => {
  const primary = React.useContext(NavRailContext) === 'primary';
  return (
    <li className="w-full">
      <button
        ref={ref}
        type={type}
        aria-current={selected ? 'page' : undefined}
        className={cn(
          'group flex w-full cursor-pointer flex-col items-center rounded-md text-body-xxs outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
          primary ? 'gap-2 font-medium' : 'gap-1',
          // Hover (selected or not, Figma "Primary menu items" Hover=Yes): the caption and icon in accent-soft-foreground.
          selected ? (primary ? 'text-primary' : 'text-surface-foreground') : 'text-secondary-muted-foreground',
          'hover:text-accent-soft-foreground',
          className,
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            'flex items-center justify-center rounded-md transition-colors',
            primary ? 'size-10 [&>svg]:size-6' : 'size-9 [&>svg]:size-4',
            // Selected: secondary fill, or primary with the label colour on a primary rail. Hover fills the square with accent-soft, over the selected fill too.
            selected ? (primary ? 'bg-primary text-primary-foreground' : 'bg-secondary') : '',
            'group-hover:bg-accent-soft group-hover:text-accent-soft-foreground',
          )}
        >
          {icon}
        </span>
        <span>{label}</span>
      </button>
    </li>
  );
});
NavRailItem.displayName = 'NavRailItem';

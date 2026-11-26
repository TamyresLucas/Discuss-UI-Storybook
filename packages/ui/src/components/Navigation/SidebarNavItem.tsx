import * as React from 'react';
import { CaretDown } from '@phosphor-icons/react';

import { cn } from '../../lib/utils';

export interface SidebarNavItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** A 16px Phosphor icon. */
  icon: React.ReactNode;
  label: React.ReactNode;
  /** The page that is showing: a filled row (`aria-current`). */
  selected?: boolean;
  /** The item opens a group of pages: a caret at the right edge. */
  expandable?: boolean;
  /** The group is open: the caret points up (`aria-expanded`). Only with `expandable`. */
  expanded?: boolean;
}

/** One row of a `ProjectSidebar` (Figma "Secondary menu items"): a 16px icon, the label and, for a group, a caret; 32px high. */
export const SidebarNavItem = React.forwardRef<HTMLButtonElement, SidebarNavItemProps>(
  ({ className, icon, label, selected = false, expandable = false, expanded = false, type = 'button', ...props }, ref) => (
    <li className="w-full">
      <button
        ref={ref}
        type={type}
        aria-current={selected ? 'page' : undefined}
        aria-expanded={expandable ? expanded : undefined}
        className={cn(
          'flex h-8 w-full cursor-pointer items-center gap-2 rounded-md px-2 text-left text-body-small text-surface-foreground outline-offset-2 transition-colors disabled:pointer-events-none disabled:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0',
          // Selected (Figma): the secondary fill with overlay-dark-5 over it.
          selected ? 'bg-secondary bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5' : 'hover:bg-accent-soft hover:text-accent-soft-foreground',
          className,
        )}
        {...props}
      >
        <span aria-hidden="true" className="flex size-4 shrink-0 items-center justify-center [&>svg]:size-4">
          {icon}
        </span>
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {expandable && <CaretDown aria-hidden="true" className={cn('transition-transform', expanded && 'rotate-180')} />}
      </button>
    </li>
  ),
);
SidebarNavItem.displayName = 'SidebarNavItem';

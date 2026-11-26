import * as React from 'react';

import { cn } from '../../lib/utils';

export interface ProjectSidebarProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Names the navigation for screen readers (e.g. "Project"). */
  'aria-label': string;
  /** The project's name, shown in the header. */
  project: React.ReactNode;
  /** At the right of the header, e.g. a ghost icon `Button` that collapses the sidebar. */
  action?: React.ReactNode;
  /** A section label above the items (e.g. "Project"); it also names the list for screen readers. */
  label?: React.ReactNode;
}

/**
 * The project's navigation beside the page (Figma "Project navigation"): a 240px column on the surface with a border on its right, a 64px header with
 * the project's name and an optional action (e.g. collapse), then its `SidebarNavItem`s stacked. The consumer owns which item is selected, and whether it shows.
 */
export const ProjectSidebar = React.forwardRef<HTMLElement, ProjectSidebarProps>(({ className, children, project, action, label, ...props }, ref) => {
  const labelId = React.useId();
  return (
  <nav ref={ref} className={cn('flex h-full w-60 shrink-0 flex-col border-r border-border bg-surface', className)} {...props}>
    <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-3">
      <span className="min-w-0 flex-1 truncate text-ui-label text-surface-foreground">{project}</span>
      {action}
    </div>
    <div className="flex min-h-0 flex-col gap-2 overflow-y-auto p-3">
      {label && (
        <p id={labelId} className="px-2 pt-1 text-ui-caption text-secondary-muted-foreground">
          {label}
        </p>
      )}
      <ul className="flex flex-col gap-2" aria-labelledby={label ? labelId : undefined}>
        {children}
      </ul>
    </div>
  </nav>
  );
});
ProjectSidebar.displayName = 'ProjectSidebar';

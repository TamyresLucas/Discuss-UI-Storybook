import * as React from 'react';
import { CaretDown } from '@phosphor-icons/react';

import { cn } from '../../lib/utils';

export interface ProjectSidebarProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Names the navigation for screen readers (e.g. "Project"). */
  'aria-label': string;
  /** The project's name, shown in the header. */
  project: React.ReactNode;
  /** Called by the header (the project switcher). Without it the header is plain text with no caret. */
  onProjectClick?: () => void;
}

/**
 * The project's navigation beside the page (Figma "Project navigation"): a 240px column on the surface with a border on its right, a 64px header with
 * the project's name and a caret (the project switcher), then its `SidebarNavItem`s stacked. The consumer owns which item is selected.
 */
export const ProjectSidebar = React.forwardRef<HTMLElement, ProjectSidebarProps>(({ className, children, project, onProjectClick, ...props }, ref) => (
  <nav ref={ref} className={cn('flex h-full w-60 shrink-0 flex-col border-r border-border bg-surface', className)} {...props}>
    <div className="flex h-16 shrink-0 items-center border-b border-border px-3">
      {onProjectClick ? (
        <button
          type="button"
          onClick={onProjectClick}
          className="flex w-full min-w-0 cursor-pointer items-center gap-2 rounded-md text-left text-ui-label text-surface-foreground outline-offset-2"
        >
          <span className="min-w-0 flex-1 truncate">{project}</span>
          <CaretDown aria-hidden="true" className="size-4 shrink-0" />
        </button>
      ) : (
        <span className="min-w-0 flex-1 truncate text-ui-label text-surface-foreground">{project}</span>
      )}
    </div>
    <ul className="flex flex-col gap-2 overflow-y-auto p-3">{children}</ul>
  </nav>
));
ProjectSidebar.displayName = 'ProjectSidebar';

import * as React from 'react';
import { CaretDown, FolderOpen, FolderSimple } from '@phosphor-icons/react';

import { cn } from '../../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../Overlays & Feedback/DropdownMenu';

const NEW_PROJECT = '__new__';

export interface ProjectSelectorProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'defaultValue'> {
  /** Name of the chosen project. Leave empty for "New Project". */
  project?: string;
  /**
   * Existing project names. When given, pressing the selector opens a menu with
   * "New Project" and these names; the current choice is checked.
   */
  projects?: string[];
  /** Called with the chosen project name, or `undefined` for "New Project". */
  onProjectChange?: (project: string | undefined) => void;
  /** Label of the "new project" menu item and of the pill when no project is chosen. */
  newProjectLabel?: string;
  /**
   * `selected` means the project is locked for this chat: the pill is read-only
   * (no caret, neutral border). Otherwise it is a trigger with a caret.
   */
  selected?: boolean;
}

// Figma: Chat Input (56) › Project selector — a pill showing the project folder, "New Project" until one is chosen.
export const ProjectSelector = React.forwardRef<HTMLButtonElement, ProjectSelectorProps>(
  ({ className, project, projects, onProjectChange, newProjectLabel = 'New Project', selected = false, children, ...props }, ref) => {
    const label = children ?? project ?? newProjectLabel;
    const classes = cn(
      'inline-flex h-10 items-center gap-2 rounded-full border bg-surface px-3 py-2 text-ui-label whitespace-nowrap text-surface-foreground transition-colors',
      selected
        ? 'border-border'
        : 'border-input hover:border-input hover:bg-accent-soft hover:text-accent-soft-foreground data-[state=open]:bg-accent-soft data-[state=open]:text-accent-soft-foreground',
      className,
    );
    const content = (
      <>
        {project ? (
          <FolderOpen size={16} weight="fill" aria-hidden className="shrink-0" />
        ) : (
          <FolderSimple size={16} aria-hidden className="shrink-0" />
        )}
        <span>{label}</span>
        {!selected && <CaretDown size={16} aria-hidden className="shrink-0" />}
      </>
    );
    if (selected) {
      return (
        <span className={classes} title={typeof label === 'string' ? label : undefined}>
          {content}
        </span>
      );
    }
    const trigger = (
      <button ref={ref} type="button" aria-haspopup="menu" className={classes} {...props}>
        {content}
      </button>
    );
    if (!projects) return trigger;
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="end" className="min-w-60">
          <DropdownMenuRadioGroup
            value={project ?? NEW_PROJECT}
            onValueChange={(next) => onProjectChange?.(next === NEW_PROJECT ? undefined : next)}
          >
            <DropdownMenuRadioItem value={NEW_PROJECT}>{newProjectLabel}</DropdownMenuRadioItem>
            {projects.map((name) => (
              <DropdownMenuRadioItem key={name} value={name}>
                {name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
);
ProjectSelector.displayName = 'ProjectSelector';

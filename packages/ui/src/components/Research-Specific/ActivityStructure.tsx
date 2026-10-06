import * as React from 'react';

import { cn } from '../../lib/utils';
import { StatCard, type StatCardProps } from '../Data Display/StatCard';
import { EditableTag } from '../Tags & Badges/EditableTag';

export interface ActivityStat extends Pick<StatCardProps, 'label' | 'value' | 'icon' | 'variant'> {
  id: string;
}

export interface ActivitySection {
  id: string;
  heading: React.ReactNode;
  /** Section text. May contain block elements (e.g. an `InlineEdit`), so it is rendered in a `div`. */
  body: React.ReactNode;
  /** Removable tags shown under the body. */
  tags?: string[];
}

export interface ActivityStructureProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title?: React.ReactNode;
  /** Stat tiles, laid out in a two-column grid. */
  stats: ActivityStat[];
  /** Text sections (e.g. Research Goal, Target Audience), optionally with tags. */
  sections?: ActivitySection[];
  /** Called with `(sectionId, tag)` when a tag's remove button is pressed. Omit for read-only tags. */
  onRemoveTag?: (sectionId: string, tag: string) => void;
  /** Called with the section id by the dashed "Add tag" chip. Omit to hide it. */
  onAddTag?: (sectionId: string) => void;
  addTagLabel?: string;
  /**
   * Content shown under the stats and sections. With `stats={[]}` and `children` the card is a single-purpose widget
   * (e.g. "Research Goal") with the same card, title style and colour as the full summary.
   */
  children?: React.ReactNode;
}

// Figma: Activity control (361:5214) › Activity structure — summary card with stat tiles and text sections with tags; also usable as a single-purpose widget via children.
export const ActivityStructure = React.forwardRef<HTMLElement, ActivityStructureProps>(
  ({ className, title = 'Activity Structure', stats, sections, onRemoveTag, onAddTag, addTagLabel = 'Add tag', children, ...props }, ref) => (
    <section
      ref={ref}
      className={cn('flex w-full max-w-96.5 flex-col gap-4 rounded-xl bg-surface p-4', className)}
      {...props}
    >
      <h3 className="text-heading-h3 text-primary">{title}</h3>
      {stats.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ id, ...stat }) => (
            <StatCard key={id} {...stat} />
          ))}
        </div>
      )}
      {sections?.map(({ id, heading, body, tags }) => (
        <div key={id} className="flex flex-col gap-2">
          <h4 className="text-heading-h4 text-surface-foreground">{heading}</h4>
          <div className="text-body-base text-surface-foreground">{body}</div>
          {(tags?.length || onAddTag) && (
            <div className="flex flex-wrap items-center gap-2">
              {tags?.map((tag) => (
                <EditableTag key={tag} type="editable" onRemove={onRemoveTag && (() => onRemoveTag(id, tag))}>
                  {tag}
                </EditableTag>
              ))}
              {onAddTag && (
                <EditableTag type="add" onClick={() => onAddTag(id)}>
                  {addTagLabel}
                </EditableTag>
              )}
            </div>
          )}
        </div>
      ))}
      {children}
    </section>
  ),
);
ActivityStructure.displayName = 'ActivityStructure';

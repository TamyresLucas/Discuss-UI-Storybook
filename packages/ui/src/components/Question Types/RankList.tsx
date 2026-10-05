import * as React from 'react';
import { DotsSixVertical } from '@phosphor-icons/react';

import { cn } from '../../lib/utils';

export interface RankItemData {
  id: string;
  label: React.ReactNode;
}

export interface RankListProps extends Omit<React.HTMLAttributes<HTMLOListElement>, 'onChange'> {
  items: RankItemData[];
  /** Called with the new order after a drag or a keyboard move. */
  onItemsChange: (items: RankItemData[]) => void;
}

function move<T>(list: T[], from: number, to: number): T[] {
  if (from === to || to < 0 || to >= list.length) return list;
  const next = list.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item as T);
  return next;
}

// Figma: Question input › Rank_choice — draggable rows with a numbered badge; hover turns the row and badge accent.
export const RankList = React.forwardRef<HTMLOListElement, RankListProps>(
  ({ className, items, onItemsChange, ...props }, ref) => {
    const [dragIndex, setDragIndex] = React.useState<number | null>(null);
    const [announcement, setAnnouncement] = React.useState('');
    const handles = React.useRef(new Map<string, HTMLButtonElement>());
    const refocus = React.useRef<string | null>(null);

    React.useEffect(() => {
      if (refocus.current) {
        handles.current.get(refocus.current)?.focus();
        refocus.current = null;
      }
    });

    const reorder = (from: number, to: number, id: string) => {
      const next = move(items, from, to);
      if (next === items) return;
      refocus.current = id;
      setAnnouncement(`Moved to position ${to + 1} of ${items.length}`);
      onItemsChange(next);
    };

    return (
      <>
        <ol ref={ref} className={cn('flex w-full max-w-150 flex-col gap-4', className)} {...props}>
          {items.map((item, index) => (
            <li
              key={item.id}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (dragIndex !== null) reorder(dragIndex, index, item.id);
                setDragIndex(null);
              }}
              onDragEnd={() => setDragIndex(null)}
              className={cn(
                'group/rank flex items-center gap-3 overflow-hidden rounded-sm border border-border bg-surface px-4 py-2.5 text-body-base text-surface-foreground transition-colors',
                'hover:border-accent-foreground hover:shadow-md',
                dragIndex === index && 'opacity-50',
              )}
            >
              <button
                type="button"
                ref={(el) => {
                  if (el) handles.current.set(item.id, el);
                  else handles.current.delete(item.id);
                }}
                aria-label={`Reorder, position ${index + 1} of ${items.length}. Use the up and down arrow keys to move.`}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    reorder(index, index - 1, item.id);
                  } else if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    reorder(index, index + 1, item.id);
                  }
                }}
                className="inline-flex shrink-0 cursor-grab rounded-xs text-surface-foreground"
              >
                <DotsSixVertical size={16} aria-hidden />
              </button>
              <span
                aria-hidden="true"
                className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-background bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5 text-ui-caption text-surface-foreground group-hover/rank:border-accent-foreground group-hover/rank:bg-accent-soft group-hover/rank:bg-none group-hover/rank:text-accent-soft-foreground"
              >
                {index + 1}
              </span>
              <span className="min-w-0 flex-1">{item.label}</span>
            </li>
          ))}
        </ol>
        <span role="status" aria-live="polite" className="sr-only">
          {announcement}
        </span>
      </>
    );
  },
);
RankList.displayName = 'RankList';

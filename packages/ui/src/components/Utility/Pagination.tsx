import * as React from 'react';
import { ArrowLeft, ArrowRight, DotsThree } from '@phosphor-icons/react';

import { cn } from '../../lib/utils';
import { Button } from '../Buttons & Actions/Button';

export type PaginationItemValue = number | 'ellipsis';

/** 1-based page list with ellipses, e.g. `[1, 2, 'ellipsis', 5]`. Keeps first, last and the current page ± `siblings`. */
export function getPaginationItems(page: number, pageCount: number, siblings = 1): PaginationItemValue[] {
  const keep = new Set<number>([1, pageCount]);
  for (let p = page - siblings; p <= page + siblings; p++) if (p >= 1 && p <= pageCount) keep.add(p);
  // Show a neighbouring page instead of an ellipsis that would hide just one.
  const sorted = [...keep].sort((a, b) => a - b);
  const items: PaginationItemValue[] = [];
  sorted.forEach((p, index) => {
    const previous = sorted[index - 1];
    if (previous !== undefined && p - previous === 2) items.push(previous + 1);
    else if (previous !== undefined && p - previous > 2) items.push('ellipsis');
    items.push(p);
  });
  return items;
}

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Current page, 1-based. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** `full` lists page numbers; `compact` shows `1/5` between the arrows. */
  variant?: 'full' | 'compact';
  /** How many pages to show either side of the current one (full variant). */
  siblings?: number;
}

// Figma: Pagination (71) — 32px items; the current page is `subtle`, the rest are outlined.
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ className, page, pageCount, onPageChange, variant = 'full', siblings = 1, ...props }, ref) => {
    const go = (next: number) => onPageChange(Math.min(pageCount, Math.max(1, next)));
    const previous = (
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => go(page - 1)}
      >
        <ArrowLeft size={16} aria-hidden />
      </Button>
    );
    const next = (
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label="Next page"
        disabled={page >= pageCount}
        onClick={() => go(page + 1)}
      >
        <ArrowRight size={16} aria-hidden />
      </Button>
    );

    return (
      <nav
        ref={ref}
        aria-label="Pagination"
        className={cn('flex items-center', variant === 'compact' ? 'w-35 justify-between' : 'gap-2', className)}
        {...props}
      >
        {previous}
        {variant === 'compact' ? (
          <span className="text-body-small text-surface-foreground" aria-live="polite">
            {page}/{pageCount}
          </span>
        ) : (
          <ul className="flex items-center gap-2">
            {getPaginationItems(page, pageCount, siblings).map((item, index) => (
              <li key={item === 'ellipsis' ? `ellipsis-${index}` : item}>
                {item === 'ellipsis' ? (
                  <span className="inline-flex size-8 items-center justify-center rounded-sm border border-border bg-surface text-surface-foreground">
                    <DotsThree size={16} aria-hidden />
                    <span className="sr-only">More pages</span>
                  </span>
                ) : (
                  <Button
                    type="button"
                    variant={item === page ? 'subtle' : 'outline'}
                    size="sm"
                    aria-label={`Page ${item}`}
                    aria-current={item === page ? 'page' : undefined}
                    onClick={() => go(item)}
                  >
                    {item}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
        {next}
      </nav>
    );
  },
);
Pagination.displayName = 'Pagination';

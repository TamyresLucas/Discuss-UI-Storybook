import * as React from 'react';
import { CaretDown, CaretUp } from '@phosphor-icons/react';

import { cn } from '../../lib/utils';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** Alternate row backgrounds (Figma: Stripe = Yes). */
  striped?: boolean;
  /** Class names for the bordered, rounded scroll container around the `<table>`. */
  containerClassName?: string;
  /** Ref to the scroll container around the `<table>`, e.g. for virtualization or infinite scrolling. */
  containerRef?: React.Ref<HTMLDivElement>;
}

// Figma: Tables (27) — 12px-radius bordered container; rows are separated by 1px `border` lines.
export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, containerClassName, containerRef, striped, ...props }, ref) => (
    <div ref={containerRef} className={cn('relative w-full overflow-auto rounded-lg border border-border bg-surface', containerClassName)}>
      <table
        ref={ref}
        data-striped={striped ? '' : undefined}
        className={cn('group/table w-full border-collapse text-body-small text-surface-foreground', className)}
        {...props}
      />
    </div>
  ),
);
Table.displayName = 'Table';

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={className} {...props} />,
);
TableHeader.displayName = 'TableHeader';

export const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn('border-t border-border bg-background text-ui-label', className)} {...props} />
  ),
);
TableFooter.displayName = 'TableFooter';

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tbody ref={ref} className={className} {...props} />,
);
TableBody.displayName = 'TableBody';

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Highlights the row and marks it with the accent edge (Figma: State = Selected). */
  selected?: boolean;
}

// Figma: Table Row (29) — Default / Hover (`accent-soft`) / Selected (accent left edge on the first cell).
export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected, ...props }, ref) => (
    <tr
      ref={ref}
      data-state={selected ? 'selected' : undefined}
      aria-selected={selected || undefined}
      className={cn(
        'group/row border-b border-border transition-colors last:border-b-0',
        'group-data-[striped]/table:even:bg-background hover:bg-accent-soft group-data-[striped]/table:even:hover:bg-accent-soft',
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = 'TableRow';

type Align = 'left' | 'right';

export interface TableHeadProps extends Omit<React.ThHTMLAttributes<HTMLTableCellElement>, 'align'> {
  align?: Align;
  /** Render the label as a sort button. Provide `sort` and `onSort`. */
  sortable?: boolean;
  sort?: 'none' | 'asc' | 'desc';
  onSort?: () => void;
  /** Narrow centred column for a select-all checkbox. */
  checkbox?: boolean;
  /** Drag handle rendered at the trailing edge of the header, e.g. for column resizing. Makes the cell `relative`. */
  resizer?: React.ReactNode;
}

const ariaSort = { none: 'none', asc: 'ascending', desc: 'descending' } as const;

// Figma: Table Header Row (28) › Table Header Cell — 40px, `ui/label` text; sortable cells show a caret.
export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, align = 'left', sortable, sort = 'none', onSort, checkbox, resizer, children, ...props }, ref) => {
    const caret =
      sort === 'asc' ? <CaretUp size={16} aria-hidden className="shrink-0" /> : <CaretDown size={16} aria-hidden className="shrink-0" />;
    return (
      <th
        ref={ref}
        scope="col"
        aria-sort={sortable ? ariaSort[sort] : undefined}
        className={cn(
          'h-10 border-b border-border text-ui-label whitespace-nowrap',
          checkbox ? 'w-13 px-0 text-center' : 'px-4 py-3',
          align === 'right' ? 'text-right' : 'text-left',
          resizer && 'relative',
          className,
        )}
        {...props}
      >
        {sortable ? (
          <button
            type="button"
            onClick={onSort}
            className={cn('inline-flex items-center gap-1 rounded-xs', align === 'right' && 'flex-row-reverse')}
          >
            {children}
            {caret}
          </button>
        ) : checkbox ? (
          <div className="flex items-center justify-center">{children}</div>
        ) : (
          children
        )}
        {resizer}
      </th>
    );
  },
);
TableHead.displayName = 'TableHead';

export interface TableCellProps extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  align?: Align;
  /** Secondary text colour (Figma: Type = Muted). */
  muted?: boolean;
  /** Narrow centred cell for a checkbox or radio. */
  checkbox?: boolean;
  /** Right-aligned cell for row actions; lays its children out in a row with 4px gaps. */
  actions?: boolean;
}

// Figma: Table Row (29) › Table Cell — 40px tall, 16px inline padding, 14/20 value.
export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, align = 'left', muted, checkbox, actions, children, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        'h-10 text-body-small',
        'group-data-[state=selected]/row:first:border-l-2 group-data-[state=selected]/row:first:border-l-input-accent',
        checkbox ? 'w-13 px-0 text-center' : actions ? 'px-4 py-1.5 text-right' : 'px-4 py-3',
        align === 'right' && 'text-right',
        muted ? 'text-secondary-muted-foreground' : 'text-surface-foreground',
        className,
      )}
      {...props}
    >
      {checkbox ? <div className="flex items-center justify-center">{children}</div> : actions ? <div className="flex items-start justify-end gap-1">{children}</div> : children}
    </td>
  ),
);
TableCell.displayName = 'TableCell';

export interface TableCellTwoLinesProps extends React.HTMLAttributes<HTMLDivElement> {
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  /** Leading avatar / image (Figma: Two Lines Avatar). */
  avatar?: React.ReactNode;
}

/** Primary + support text stack for a `TableCell` (Figma: Type = Two Lines / Option). Set the row/cell height to `h-14`. */
export function TableCellTwoLines({ primary, secondary, avatar, className, ...props }: TableCellTwoLinesProps) {
  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      {avatar}
      <div className="flex flex-col gap-0.5 whitespace-nowrap">
        <span className="text-ui-label text-surface-foreground">{primary}</span>
        {secondary && <span className="text-ui-caption text-secondary-muted-foreground">{secondary}</span>}
      </div>
    </div>
  );
}

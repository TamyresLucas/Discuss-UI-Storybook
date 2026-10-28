import * as React from 'react';
import { CaretDown, CaretRight, PushPin, PushPinSlash, Rows, Sliders, Stack } from '@phosphor-icons/react';
import {
  aggregationFn_count,
  aggregationFn_extent,
  aggregationFn_max,
  aggregationFn_mean,
  aggregationFn_median,
  aggregationFn_min,
  aggregationFn_sum,
  aggregationFn_unique,
  aggregationFn_uniqueCount,
  cellSelectionFeature,
  cellSpanningFeature,
  columnFacetingFeature,
  columnFilteringFeature,
  columnGroupingFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createExpandedRowModel,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_arrIncludesSome,
  filterFn_equals,
  filterFn_equalsString,
  filterFn_inNumberRange,
  filterFn_includesString,
  flexRender,
  globalFilteringFeature,
  rowAggregationFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
  type CellSelectionState,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnOrderState,
  type ColumnPinningState,
  type ColumnVisibilityState,
  type ExpandedState,
  type GroupingState,
  type PaginationState,
  type Row,
  type RowData,
  type RowPinningState,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

import { cn } from '../../lib/utils';
import { Button } from '../Buttons & Actions/Button';
import { Checkbox } from '../Forms & Data Entry/Checkbox';
import { Input } from '../Forms & Data Entry/Input';
import { SearchBar } from '../Forms & Data Entry/SearchBar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../Forms & Data Entry/Select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../Overlays & Feedback/DropdownMenu';
import { Pagination } from '../Utility/Pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  type TableProps,
} from './Table';

// Every TanStack feature DataTable can turn on. Declared once at module scope so TanStack keeps stable row models;
// a feature only does work when the matching prop (or column option) switches it on.
const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowExpandingFeature,
  rowPinningFeature,
  rowAggregationFeature,
  columnVisibilityFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnResizingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  columnFacetingFeature,
  columnGroupingFeature,
  cellSelectionFeature,
  cellSpanningFeature,
  // Row-model pipeline order: filter → group → sort → expand → paginate.
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  filteredRowModel: createFilteredRowModel(),
  groupedRowModel: createGroupedRowModel(),
  sortedRowModel: createSortedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
  filterFns: {
    arrIncludesSome: filterFn_arrIncludesSome,
    equals: filterFn_equals,
    equalsString: filterFn_equalsString,
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
  },
  aggregationFns: {
    count: aggregationFn_count,
    extent: aggregationFn_extent,
    max: aggregationFn_max,
    mean: aggregationFn_mean,
    median: aggregationFn_median,
    min: aggregationFn_min,
    sum: aggregationFn_sum,
    unique: aggregationFn_unique,
    uniqueCount: aggregationFn_uniqueCount,
  },
});

/**
 * A column definition for `DataTable`. Built with TanStack Table's `ColumnDef`, e.g. `{ accessorKey: 'name', header: 'Name' }`.
 * Besides the usual options it understands `aggregationFn` / `aggregatedCell` (grouping), `spanRows` / `spanColumns`
 * (cell spanning), `size` / `minSize` / `maxSize` (sizing and resizing), `footer`, and the `meta` below.
 */
export type DataTableColumnDef<TData extends RowData> = ColumnDef<typeof features, TData>;

/** Optional `meta` on a column that `DataTable` understands. */
export interface DataTableColumnMeta {
  /** Right-align the header and cells, for numbers and amounts. */
  align?: 'left' | 'right';
  /** Secondary text colour for the column's cells. */
  muted?: boolean;
  /** Label shown in menus and used for accessible names. Defaults to the column id. */
  label?: string;
  /** Control shown in the filter row (`enableColumnFilters`). `select` offers the values found in the data, with counts. */
  filterVariant?: 'text' | 'select' | 'range';
  /** Render the cell as an input; pair with the table's `onCellEdit`. */
  editable?: boolean;
  /** Input type of an editable cell. */
  editType?: 'text' | 'number';
}

const getMeta = (meta: unknown) => (meta ?? {}) as DataTableColumnMeta;

/** Everything `DataTable` can start with when its state is not controlled. */
export interface DataTableInitialState {
  sorting?: SortingState;
  rowSelection?: RowSelectionState;
  columnVisibility?: ColumnVisibilityState;
  columnPinning?: Partial<ColumnPinningState>;
  columnOrder?: ColumnOrderState;
  columnFilters?: ColumnFiltersState;
  globalFilter?: string;
  grouping?: GroupingState;
  expanded?: ExpandedState;
  rowPinning?: Partial<RowPinningState>;
  pagination?: PaginationState;
}

export interface DataTableProps<TData extends RowData>
  extends Omit<TableProps, 'children' | 'onSelect' | 'onChange'> {
  /** Column definitions (TanStack `ColumnDef`). Keep the array referentially stable (module scope or `useMemo`). */
  columns: DataTableColumnDef<TData>[];
  /** Row data. Keep referentially stable between renders. */
  data: TData[];
  /** Stable row id, used for selection, pinning and expansion. Defaults to the row index. */
  getRowId?: (row: TData, index: number) => string;
  /** Starting values for state the table owns. Ignored for state you control. */
  initialState?: DataTableInitialState;

  /** Let columns be sorted by clicking their header. Opt a single column out with `enableSorting: false`. */
  enableSorting?: boolean;
  /** Add a leading checkbox column with a select-all header checkbox. */
  enableRowSelection?: boolean;
  /** Show a "Columns" menu that toggles column visibility. */
  enableColumnVisibility?: boolean;
  /** Stick columns to the start or end edge. Pin with `initialState.columnPinning` or `column.pin('start' | 'end')`. */
  enableColumnPinning?: boolean;
  /** Apply each column's `size` (and `minSize` / `maxSize`) as its width. Implied by column pinning and resizing. */
  enableColumnSizing?: boolean;
  /** Drag the header edge to resize columns. Size columns with `size`, `minSize` and `maxSize` in the column definition. */
  enableColumnResizing?: boolean;
  /** `onChange` resizes live while dragging; `onEnd` applies the new width on release. */
  columnResizeMode?: 'onChange' | 'onEnd';
  /** Reorder columns by dragging their headers, or with Alt + arrow keys on a focused header. */
  enableColumnOrdering?: boolean;
  /** Show a filter row under the header. Pick each column's control with `meta.filterVariant`. */
  enableColumnFilters?: boolean;
  /** Show a search field above the table that filters across all columns. */
  enableGlobalFilter?: boolean;
  /** Placeholder of the global search field. */
  globalFilterPlaceholder?: string;
  /** Group rows by one or more columns, with a "Group by" menu. Aggregate with each column's `aggregationFn`. */
  enableGrouping?: boolean;
  /** Add a disclosure column to expand sub-rows (`getSubRows`) or a detail panel (`renderSubComponent`). */
  enableExpanding?: boolean;
  /** Add a column with a button that pins the row to the top of the table. */
  enableRowPinning?: boolean;
  /** Spreadsheet-style selection of cell ranges: drag, Shift-click, Ctrl/Cmd-click, arrow keys, Ctrl/Cmd + A. */
  enableCellSelection?: boolean;
  /** Render a footer row from each column's `footer`. */
  showFooter?: boolean;
  /** Show the row-density toggle in the toolbar. */
  enableDensityToggle?: boolean;
  /** Row density. `compact` uses shorter rows. */
  density?: 'default' | 'compact';
  onDensityChange?: (density: 'default' | 'compact') => void;

  /** Sub-rows of a row, for tree data. */
  getSubRows?: (row: TData, index: number) => TData[] | undefined;
  /** Whether a row can expand. Defaults to "has sub-rows", or "always" when `renderSubComponent` is set. */
  getRowCanExpand?: (row: Row<typeof features, TData>) => boolean;
  /** Detail panel shown under an expanded row. */
  renderSubComponent?: (row: TData) => React.ReactNode;

  /** Rows per page. The pagination bar is hidden when everything fits on one page. */
  pageSize?: number;
  /**
   * Sorting, filtering and pagination happen on your server: pass one page of already processed `data` plus the total `rowCount`,
   * and read the state through the controlled props below to build the request.
   */
  serverSide?: boolean;
  /** Total number of rows on the server. Required with `serverSide` for the page count. */
  rowCount?: number;

  /** Controlled sorting state. Pair with `onSortingChange`. */
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  /** Controlled selection state, keyed by row id. Pair with `onRowSelectionChange`. */
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (rowSelection: RowSelectionState) => void;
  /** Controlled pagination state. Pair with `onPaginationChange`. */
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  /** Controlled column visibility, keyed by column id. Pair with `onColumnVisibilityChange`. */
  columnVisibility?: ColumnVisibilityState;
  onColumnVisibilityChange?: (columnVisibility: ColumnVisibilityState) => void;
  /** Controlled column pinning. Pair with `onColumnPinningChange`. */
  columnPinning?: ColumnPinningState;
  onColumnPinningChange?: (columnPinning: ColumnPinningState) => void;
  /** Controlled column order (column ids). Pair with `onColumnOrderChange`. */
  columnOrder?: ColumnOrderState;
  onColumnOrderChange?: (columnOrder: ColumnOrderState) => void;
  /** Controlled column filters. Pair with `onColumnFiltersChange`. */
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: (columnFilters: ColumnFiltersState) => void;
  /** Controlled global search text. Pair with `onGlobalFilterChange`. */
  globalFilter?: string;
  onGlobalFilterChange?: (globalFilter: string) => void;
  /** Controlled grouping (column ids). Pair with `onGroupingChange`. */
  grouping?: GroupingState;
  onGroupingChange?: (grouping: GroupingState) => void;
  /** Controlled expansion. Pair with `onExpandedChange`. */
  expanded?: ExpandedState;
  onExpandedChange?: (expanded: ExpandedState) => void;
  /** Controlled row pinning. Pair with `onRowPinningChange`. */
  rowPinning?: RowPinningState;
  onRowPinningChange?: (rowPinning: RowPinningState) => void;
  /** Called whenever the selected cell ranges change. */
  onCellSelectionChange?: (cellSelection: CellSelectionState) => void;

  /** Called when an editable cell (`meta.editable`) is committed with Enter or blur. Update your data in response. */
  onCellEdit?: (edit: { row: TData; rowId: string; columnId: string; value: string }) => void;

  /** Render only the visible rows. Give the table a bounded height with `containerClassName`, e.g. `max-h-96`. */
  virtualized?: boolean;
  /** Row height in pixels used before a row has been measured. Match `h-10` (40) unless rows are taller. */
  estimateRowHeight?: number;
  /** Infinite scrolling: called when the end of the table scrolls into view and `hasMore` is true. Disables pagination. Bound the height with `containerClassName` to scroll inside the table. */
  onLoadMore?: () => void;
  /** Whether more rows can be loaded. */
  hasMore?: boolean;
  /** A page of rows is loading; shows placeholder rows at the end. */
  loadingMore?: boolean;

  /** Keep the header in view while the table scrolls. On by default with row pinning and virtualization. */
  stickyHeader?: boolean;
  /** Show placeholder rows instead of data. */
  loading?: boolean;
  /** Content of the empty state. Defaults to "No results." */
  emptyState?: React.ReactNode;
  /** Called when a row is clicked (not when its controls are). */
  onRowClick?: (row: TData) => void;
  /** Content for the left side of the toolbar, e.g. filter tabs. */
  toolbar?: React.ReactNode;
  /** Class names for the wrapper around the toolbar, table and pagination. */
  wrapperClassName?: string;
}

/** Controlled when `value` is defined, otherwise local state seeded with `initial`. */
function useControllable<T>(value: T | undefined, initial: T, onChange?: (next: T) => void) {
  const [internal, setInternal] = React.useState<T>(initial);
  const current = value ?? internal;
  const update = React.useCallback(
    (updater: T | ((previous: T) => T)) => {
      const next = typeof updater === 'function' ? (updater as (previous: T) => T)(current) : updater;
      if (value === undefined) setInternal(next);
      onChange?.(next);
    },
    [current, value, onChange],
  );
  return [current, update] as const;
}

const ALL = '__all__';

const labelOf = <TData extends RowData>(column: Column<typeof features, TData>) =>
  getMeta(column.columnDef.meta).label ?? (typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id);

// Sticky offsets for pinned columns. Widths come from TanStack's sizing model, so they are data, not design values.
function pinning<TData extends RowData>(column: Column<typeof features, TData>, sized: boolean, header = false) {
  const side = column.getIsPinned();
  const style: React.CSSProperties = {};
  if (sized) {
    style.width = column.getSize();
    style.minWidth = column.getSize();
    style.maxWidth = column.getSize();
  }
  if (side) {
    style.position = 'sticky';
    if (side === 'start') style.insetInlineStart = column.getStart('start');
    else style.insetInlineEnd = column.getAfter('end');
  }
  const className = side
    ? cn(
        header ? 'z-30' : 'z-10',
        'bg-surface',
        side === 'start' && column.getIsLastColumn('start') && 'border-r border-border',
        side === 'end' && column.getIsFirstColumn('end') && 'border-l border-border',
      )
    : undefined;
  return { style, className };
}

interface ColumnFilterProps<TData extends RowData> {
  column: Column<typeof features, TData>;
}

function ColumnFilter<TData extends RowData>({ column }: ColumnFilterProps<TData>) {
  const variant = getMeta(column.columnDef.meta).filterVariant ?? 'text';
  const label = labelOf(column);
  const value = column.getFilterValue();

  if (variant === 'select') {
    const options = [...column.getFacetedUniqueValues().entries()].sort((a, b) => String(a[0]).localeCompare(String(b[0])));
    return (
      <Select
        value={typeof value === 'string' ? value : ALL}
        onValueChange={(next) => column.setFilterValue(next === ALL ? undefined : next)}
      >
        <SelectTrigger aria-label={`Filter ${label}`} className="h-8 text-body-small">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All</SelectItem>
          {options.map(([option, count]) => (
            <SelectItem key={String(option)} value={String(option)}>
              {String(option)} ({count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (variant === 'range') {
    const [min, max] = column.getFacetedMinMaxValues() ?? [];
    const range = (Array.isArray(value) ? value : []) as [number | undefined, number | undefined];
    const update = (index: 0 | 1, raw: string) => {
      const next: [number | undefined, number | undefined] = [range[0], range[1]];
      next[index] = raw === '' ? undefined : Number(raw);
      column.setFilterValue(next[0] === undefined && next[1] === undefined ? undefined : next);
    };
    return (
      <div className="flex gap-1">
        <Input
          type="number"
          aria-label={`${label} minimum`}
          placeholder={min !== undefined ? String(min) : 'Min'}
          value={range[0] ?? ''}
          onChange={(event) => update(0, event.target.value)}
          className="h-8 text-body-small"
        />
        <Input
          type="number"
          aria-label={`${label} maximum`}
          placeholder={max !== undefined ? String(max) : 'Max'}
          value={range[1] ?? ''}
          onChange={(event) => update(1, event.target.value)}
          className="h-8 text-body-small"
        />
      </div>
    );
  }

  return (
    <Input
      aria-label={`Filter ${label}`}
      placeholder="Filter…"
      value={typeof value === 'string' ? value : ''}
      onChange={(event) => column.setFilterValue(event.target.value || undefined)}
      className="h-8 text-body-small"
    />
  );
}

interface EditableCellProps {
  value: unknown;
  label: string;
  type: 'text' | 'number';
  onCommit: (value: string) => void;
}

function EditableCell({ value, label, type, onCommit }: EditableCellProps) {
  const initial = value == null ? '' : String(value);
  // `null` while not editing, so the input always shows the latest value from the data.
  const [draft, setDraft] = React.useState<string | null>(null);
  const cancelled = React.useRef(false);
  return (
    <Input
      type={type}
      aria-label={label}
      value={draft ?? initial}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => {
        if (!cancelled.current && draft !== null && draft !== initial) onCommit(draft);
        cancelled.current = false;
        setDraft(null);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.currentTarget.blur();
        if (event.key === 'Escape') {
          cancelled.current = true;
          event.currentTarget.blur();
        }
      }}
      className={cn('h-8 border-transparent bg-transparent text-body-small', type === 'number' && 'text-right')}
    />
  );
}

// Figma: Tables (27) — the visual layer is `Table`; TanStack Table supplies sorting, selection, paging, filtering,
// grouping, pinning and the rest.
function DataTableInner<TData extends RowData>(
  {
    columns,
    data,
    getRowId,
    initialState,
    enableSorting = false,
    enableRowSelection = false,
    enableColumnVisibility = false,
    enableColumnPinning = false,
    enableColumnSizing = false,
    enableColumnResizing = false,
    columnResizeMode = 'onChange',
    enableColumnOrdering = false,
    enableColumnFilters = false,
    enableGlobalFilter = false,
    globalFilterPlaceholder = 'Search',
    enableGrouping = false,
    enableExpanding = false,
    enableRowPinning = false,
    enableCellSelection = false,
    showFooter = false,
    enableDensityToggle = false,
    density: densityProp,
    onDensityChange,
    getSubRows,
    getRowCanExpand,
    renderSubComponent,
    pageSize = 10,
    serverSide = false,
    rowCount,
    sorting: sortingProp,
    onSortingChange,
    rowSelection: rowSelectionProp,
    onRowSelectionChange,
    pagination: paginationProp,
    onPaginationChange,
    columnVisibility: columnVisibilityProp,
    onColumnVisibilityChange,
    columnPinning: columnPinningProp,
    onColumnPinningChange,
    columnOrder: columnOrderProp,
    onColumnOrderChange,
    columnFilters: columnFiltersProp,
    onColumnFiltersChange,
    globalFilter: globalFilterProp,
    onGlobalFilterChange,
    grouping: groupingProp,
    onGroupingChange,
    expanded: expandedProp,
    onExpandedChange,
    rowPinning: rowPinningProp,
    onRowPinningChange,
    onCellSelectionChange,
    onCellEdit,
    virtualized = false,
    estimateRowHeight = 40,
    onLoadMore,
    hasMore = false,
    loadingMore = false,
    stickyHeader,
    loading = false,
    emptyState,
    onRowClick,
    toolbar,
    wrapperClassName,
    striped,
    containerClassName,
    containerRef,
    style: tableStyle,
    ...tableProps
  }: DataTableProps<TData>,
  ref: React.ForwardedRef<HTMLTableElement>,
) {
  const [sorting, setSorting] = useControllable<SortingState>(sortingProp, initialState?.sorting ?? [], onSortingChange);
  const [rowSelection, setRowSelection] = useControllable<RowSelectionState>(
    rowSelectionProp,
    initialState?.rowSelection ?? {},
    onRowSelectionChange,
  );
  const [columnVisibility, setColumnVisibility] = useControllable<ColumnVisibilityState>(
    columnVisibilityProp,
    initialState?.columnVisibility ?? {},
    onColumnVisibilityChange,
  );
  const [columnPinning, setColumnPinning] = useControllable<ColumnPinningState>(
    columnPinningProp,
    { start: initialState?.columnPinning?.start ?? [], end: initialState?.columnPinning?.end ?? [] },
    onColumnPinningChange,
  );
  const [columnOrder, setColumnOrder] = useControllable<ColumnOrderState>(
    columnOrderProp,
    initialState?.columnOrder ?? [],
    onColumnOrderChange,
  );
  const [columnFilters, setColumnFilters] = useControllable<ColumnFiltersState>(
    columnFiltersProp,
    initialState?.columnFilters ?? [],
    onColumnFiltersChange,
  );
  const [globalFilter, setGlobalFilter] = useControllable<string>(
    globalFilterProp,
    initialState?.globalFilter ?? '',
    onGlobalFilterChange,
  );
  const [grouping, setGrouping] = useControllable<GroupingState>(groupingProp, initialState?.grouping ?? [], onGroupingChange);
  const [expanded, setExpanded] = useControllable<ExpandedState>(expandedProp, initialState?.expanded ?? {}, onExpandedChange);
  const [rowPinning, setRowPinning] = useControllable<RowPinningState>(
    rowPinningProp,
    { top: initialState?.rowPinning?.top ?? [], bottom: initialState?.rowPinning?.bottom ?? [] },
    onRowPinningChange,
  );
  const [pagination, setPagination] = useControllable<PaginationState>(
    paginationProp,
    initialState?.pagination ?? { pageIndex: 0, pageSize },
    onPaginationChange,
  );
  const [density, setDensity] = useControllable<'default' | 'compact'>(densityProp, 'default', onDensityChange);
  const [cellSelection, setCellSelection] = React.useState<CellSelectionState>([]);

  const infinite = Boolean(onLoadMore);
  const paginate = !virtualized && !infinite;
  const compact = density === 'compact';
  const sized = enableColumnSizing || enableColumnResizing || enableColumnPinning;
  const sticky = stickyHeader ?? (enableRowPinning || virtualized);

  const table = useTable({
    features,
    columns,
    data,
    getRowId,
    getSubRows,
    getRowCanExpand: getRowCanExpand ?? (renderSubComponent ? () => true : undefined),
    enableSorting,
    enableRowSelection,
    enableColumnResizing,
    enableColumnPinning,
    enableColumnFilters,
    enableGlobalFilter,
    enableGrouping,
    enableRowPinning,
    enableCellSelection,
    columnResizeMode,
    globalFilterFn: 'includesString',
    manualSorting: serverSide,
    manualFiltering: serverSide,
    manualPagination: serverSide || !paginate,
    rowCount: serverSide ? rowCount : undefined,
    autoResetPageIndex: !serverSide,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
      columnPinning,
      columnOrder,
      columnFilters,
      globalFilter,
      grouping,
      expanded,
      rowPinning,
      cellSelection,
      pagination: { ...pagination, pageSize: paginationProp ? pagination.pageSize : pageSize },
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onColumnOrderChange: setColumnOrder,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    onRowPinningChange: setRowPinning,
    onCellSelectionChange: (updater) => {
      const next = typeof updater === 'function' ? updater(cellSelection) : updater;
      setCellSelection(next);
      onCellSelectionChange?.(next);
    },
    onPaginationChange: setPagination,
  });

  const headerGroups = table.getHeaderGroups();
  const leafColumns = table.getVisibleLeafColumns();
  const hasExpander = enableExpanding;
  const leadingCount = (enableRowSelection ? 1 : 0) + (hasExpander ? 1 : 0) + (enableRowPinning ? 1 : 0);
  const columnSpan = leafColumns.length + leadingCount;
  const pageCount = table.getPageCount();
  const selectedCount = Object.values(rowSelection).filter(Boolean).length;
  const hideableColumns = table.getAllLeafColumns().filter((column) => column.getCanHide());
  const groupableColumns = table.getAllLeafColumns().filter((column) => column.getCanGroup());
  const showToolbar = Boolean(toolbar) || enableColumnVisibility || enableGlobalFilter || enableGrouping || enableDensityToggle;
  const cellDensity = compact ? 'h-8 py-1.5' : undefined;
  const allSelected = table.getIsAllPageRowsSelected();
  const someSelected = table.getIsSomePageRowsSelected();
  const dragged = React.useRef<string | null>(null);

  const topRows = enableRowPinning ? table.getTopRows() : [];
  const bottomRows = enableRowPinning ? table.getBottomRows() : [];
  const bodyRows = enableRowPinning ? table.getCenterRows() : table.getRowModel().rows;

  // Virtualization of the body rows. Disabled (and cheap) unless `virtualized`.
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const setScrollRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      scrollRef.current = node;
      if (typeof containerRef === 'function') containerRef(node);
      else if (containerRef) (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [containerRef],
  );
  const virtualizer = useVirtualizer({
    count: bodyRows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateRowHeight,
    overscan: 8,
    enabled: virtualized,
    initialRect: { width: 0, height: estimateRowHeight * 10 },
  });
  const virtualItems = virtualized ? virtualizer.getVirtualItems() : [];
  const paddingTop = virtualItems.length > 0 ? (virtualItems[0]?.start ?? 0) : 0;
  const paddingBottom = virtualItems.length > 0 ? virtualizer.getTotalSize() - (virtualItems.at(-1)?.end ?? 0) : 0;

  // Infinite scrolling: load more when the sentinel row scrolls into view.
  const sentinelRef = React.useRef<HTMLTableRowElement | null>(null);
  React.useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !onLoadMore || !hasMore || loadingMore || typeof IntersectionObserver === 'undefined') return;
    // Watch inside the scroll container once it scrolls, otherwise against the page.
    const container = scrollRef.current;
    const root = container && container.scrollHeight > container.clientHeight ? container : null;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onLoadMore();
      },
      { root, rootMargin: '0px 0px 160px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore, loadingMore, bodyRows.length]);

  const reorder = (activeId: string, overId: string) => {
    if (activeId === overId) return;
    const ids = table.getAllLeafColumns().map((column) => column.id);
    const next = ids.filter((id) => id !== activeId);
    const at = next.indexOf(overId);
    next.splice(at === -1 ? next.length : at, 0, activeId);
    table.setColumnOrder(next);
  };

  const onGridKeyDown = (event: React.KeyboardEvent) => {
    const directions: Record<string, 'up' | 'down' | 'left' | 'right'> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    };
    const direction = directions[event.key];
    if (direction) {
      event.preventDefault();
      if (event.shiftKey) table.extendCellSelection(direction);
      else table.moveCellSelection(direction);
    } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'a') {
      event.preventDefault();
      table.selectAllCells();
    } else if (event.key === 'Escape') {
      table.resetCellSelection(true);
    }
  };

  const skeletonRow = (rowKey: string) => (
    <TableRow key={rowKey} className="hover:bg-transparent">
      {Array.from({ length: columnSpan }, (_, cell) => (
        <TableCell key={cell} checkbox={enableRowSelection && cell === 0} className={cellDensity}>
          <span aria-hidden className="block h-4 w-3/4 animate-pulse rounded-xs bg-border" />
        </TableCell>
      ))}
    </TableRow>
  );

  const renderRow = (
    row: Row<typeof features, TData>,
    options: { pinned?: 'top' | 'bottom'; pinnedIndex?: number; pinnedCount?: number; virtualIndex?: number } = {},
  ) => {
    const { pinned, pinnedIndex = 0, pinnedCount = 1, virtualIndex } = options;
    const grouped = row.getIsGrouped();
    const rowUnits = compact ? 8 : 10;
    const pinStyle: React.CSSProperties | undefined = pinned
      ? pinned === 'top'
        ? { position: 'sticky', top: `calc(var(--spacing) * ${rowUnits * (pinnedIndex + 1)})` }
        : { position: 'sticky', bottom: `calc(var(--spacing) * ${rowUnits * (pinnedCount - 1 - pinnedIndex)})` }
      : undefined;
    const cells = row.getVisibleCells();

    return (
      <React.Fragment key={row.id}>
        <TableRow
          ref={virtualized && virtualIndex !== undefined ? virtualizer.measureElement : undefined}
          data-index={virtualIndex}
          selected={row.getIsSelected()}
          style={pinStyle}
          onClick={onRowClick && !grouped ? () => onRowClick(row.original) : undefined}
          className={cn(pinned && 'z-20 bg-surface', grouped && 'bg-background', onRowClick && !grouped && 'cursor-pointer')}
        >
          {enableRowSelection && (
            <TableCell checkbox className={cellDensity} onClick={(event) => event.stopPropagation()}>
              {!grouped && (
                <Checkbox
                  aria-label="Select row"
                  checked={row.getIsSelected()}
                  disabled={!row.getCanSelect()}
                  onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
                />
              )}
            </TableCell>
          )}
          {hasExpander && (
            <TableCell checkbox className={cellDensity} onClick={(event) => event.stopPropagation()}>
              {!grouped && row.getCanExpand() && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
                  aria-expanded={row.getIsExpanded()}
                  onClick={() => row.toggleExpanded()}
                >
                  {row.getIsExpanded() ? <CaretDown size={16} aria-hidden /> : <CaretRight size={16} aria-hidden />}
                </Button>
              )}
            </TableCell>
          )}
          {enableRowPinning && (
            <TableCell checkbox className={cellDensity} onClick={(event) => event.stopPropagation()}>
              {!grouped && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={row.getIsPinned() ? 'Unpin row' : 'Pin row to top'}
                  aria-pressed={Boolean(row.getIsPinned())}
                  onClick={() => row.pin(row.getIsPinned() ? false : 'top')}
                >
                  {row.getIsPinned() ? <PushPinSlash size={16} aria-hidden /> : <PushPin size={16} aria-hidden />}
                </Button>
              )}
            </TableCell>
          )}
          {cells.map((cell, index) => {
            if (cell.getIsCovered()) return null;
            const meta = getMeta(cell.column.columnDef.meta);
            const pin = pinning(cell.column, sized);
            const rowSpan = cell.getRowSpan();
            const colSpan = cell.getColSpan();
            const edges = enableCellSelection && cell.getIsSelected() ? cell.getSelectionEdges() : undefined;
            const indent = index === 0 && hasExpander && row.depth > 0 ? row.depth * 4 : 0;

            let content: React.ReactNode;
            if (cell.getIsGrouped()) {
              content = (
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-xs text-ui-label"
                  aria-expanded={row.getIsExpanded()}
                  onClick={row.getToggleExpandedHandler()}
                >
                  {row.getIsExpanded() ? <CaretDown size={16} aria-hidden /> : <CaretRight size={16} aria-hidden />}
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  <span className="text-secondary-muted-foreground">({row.subRows.length})</span>
                </button>
              );
            } else if (cell.getIsAggregated()) {
              content = flexRender(cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell, cell.getContext());
            } else if (cell.getIsPlaceholder()) {
              content = null;
            } else if (meta.editable) {
              content = (
                <EditableCell
                  value={cell.getValue()}
                  label={`${labelOf(cell.column)}, row ${row.index + 1}`}
                  type={meta.editType ?? 'text'}
                  onCommit={(value) => onCellEdit?.({ row: row.original, rowId: row.id, columnId: cell.column.id, value })}
                />
              );
            } else {
              content = flexRender(cell.column.columnDef.cell, cell.getContext());
            }

            return (
              <TableCell
                key={cell.id}
                align={meta.align}
                muted={meta.muted && !grouped}
                rowSpan={rowSpan > 1 ? rowSpan : undefined}
                colSpan={colSpan > 1 ? colSpan : undefined}
                style={{
                  ...pin.style,
                  ...(indent ? { paddingInlineStart: `calc(var(--spacing) * ${indent + 4})` } : null),
                }}
                data-selected={edges ? '' : undefined}
                onMouseDown={enableCellSelection ? cell.getSelectionStartHandler() : undefined}
                onMouseEnter={enableCellSelection ? cell.getSelectionExtendHandler() : undefined}
                className={cn(
                  cellDensity,
                  pin.className,
                  enableCellSelection && 'select-none',
                  edges && 'bg-accent-soft',
                  edges?.top && 'border-t-2 border-t-input-accent',
                  edges?.bottom && 'border-b-2 border-b-input-accent',
                  edges?.left && 'border-l-2 border-l-input-accent',
                  edges?.right && 'border-r-2 border-r-input-accent',
                  meta.editable && 'py-1',
                )}
              >
                {content}
              </TableCell>
            );
          })}
        </TableRow>
        {renderSubComponent && !grouped && row.getIsExpanded() && (
          <TableRow className="bg-background hover:bg-background">
            <TableCell colSpan={columnSpan}>{renderSubComponent(row.original)}</TableCell>
          </TableRow>
        )}
      </React.Fragment>
    );
  };

  const renderHeaderCell = (header: (typeof headerGroups)[number]['headers'][number]) => {
    const { column } = header;
    const { align } = getMeta(column.columnDef.meta);
    const leaf = header.subHeaders.length === 0;
    const sortState = column.getIsSorted();
    const pin = pinning(column, sized, true);
    const reorderable = enableColumnOrdering && leaf && !column.getIsPinned();
    const label = labelOf(column);

    return (
      <TableHead
        key={header.id}
        colSpan={header.colSpan > 1 ? header.colSpan : undefined}
        align={leaf ? align : undefined}
        sortable={leaf && column.getCanSort()}
        sort={sortState === false ? 'none' : sortState}
        onSort={() => column.toggleSorting(sortState === 'asc')}
        style={pin.style}
        draggable={reorderable || undefined}
        tabIndex={reorderable ? 0 : undefined}
        title={reorderable ? 'Drag, or press Alt + arrow keys, to reorder' : undefined}
        onDragStart={reorderable ? () => (dragged.current = column.id) : undefined}
        onDragOver={reorderable ? (event) => event.preventDefault() : undefined}
        onDrop={
          reorderable
            ? (event) => {
                event.preventDefault();
                if (dragged.current) reorder(dragged.current, column.id);
                dragged.current = null;
              }
            : undefined
        }
        onKeyDown={
          reorderable
            ? (event) => {
                if (!event.altKey || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
                event.preventDefault();
                const ids = table.getAllLeafColumns().map((item) => item.id);
                const at = ids.indexOf(column.id);
                const target = ids[at + (event.key === 'ArrowLeft' ? -1 : 2)];
                if (event.key === 'ArrowLeft' && ids[at - 1]) reorder(column.id, ids[at - 1]!);
                else if (event.key === 'ArrowRight' && at < ids.length - 1) reorder(column.id, target ?? '__end__');
              }
            : undefined
        }
        className={cn(
          pin.className,
          cellDensity,
          sticky && !column.getIsPinned() && 'sticky top-0 z-20 bg-surface',
          sticky && column.getIsPinned() && 'top-0',
          reorderable && 'cursor-grab',
          !leaf && 'text-center',
        )}
        resizer={
          enableColumnResizing && column.getCanResize() ? (
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label={`Resize ${label}`}
              onMouseDown={header.getResizeHandler()}
              onTouchStart={header.getResizeHandler()}
              onClick={(event) => event.stopPropagation()}
              className={cn(
                'absolute inset-y-0 end-0 w-1 cursor-col-resize touch-none select-none hover:bg-input-accent',
                column.getIsResizing() && 'bg-input-accent',
              )}
            />
          ) : undefined
        }
      >
        {header.isPlaceholder ? null : <table.FlexRender header={header} />}
      </TableHead>
    );
  };

  const stickyLeading = cn(cellDensity, sticky && 'sticky top-0 z-20 bg-surface');
  const leadingHeaderCells = (rowSpan: number) => (
    <>
      {enableRowSelection && (
        <TableHead checkbox rowSpan={rowSpan} className={stickyLeading}>
          <Checkbox
            aria-label="Select all rows"
            checked={allSelected ? true : someSelected ? 'indeterminate' : false}
            disabled={loading}
            onCheckedChange={(checked) => table.toggleAllPageRowsSelected(Boolean(checked))}
          />
        </TableHead>
      )}
      {hasExpander && (
        <TableHead checkbox rowSpan={rowSpan} className={stickyLeading}>
          <span className="sr-only">Expand</span>
        </TableHead>
      )}
      {enableRowPinning && (
        <TableHead checkbox rowSpan={rowSpan} className={stickyLeading}>
          <span className="sr-only">Pin</span>
        </TableHead>
      )}
    </>
  );

  const rowsToRender = virtualized ? virtualItems.map((item) => ({ row: bodyRows[item.index]!, index: item.index })) : null;
  const totalRows = topRows.length + bodyRows.length + bottomRows.length;

  return (
    <div className={cn('flex w-full flex-col gap-2', wrapperClassName)}>
      {showToolbar && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {enableGlobalFilter && (
              <SearchBar
                aria-label="Search table"
                placeholder={globalFilterPlaceholder}
                value={globalFilter}
                onChange={(event) => table.setGlobalFilter(event.target.value)}
                onClear={() => table.setGlobalFilter('')}
                className="w-64"
              />
            )}
            {toolbar}
          </div>
          <div className="flex items-center gap-2">
            {enableDensityToggle && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-pressed={compact}
                onClick={() => setDensity(compact ? 'default' : 'compact')}
              >
                <Rows size={16} aria-hidden />
                Compact
              </Button>
            )}
            {enableGrouping && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline" size="sm">
                    <Stack size={16} aria-hidden />
                    Group by
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Group rows by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {groupableColumns.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsGrouped()}
                      onCheckedChange={() => column.toggleGrouping()}
                    >
                      {labelOf(column)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {enableColumnVisibility && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline" size="sm">
                    <Sliders size={16} aria-hidden />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {hideableColumns.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(checked) => column.toggleVisibility(Boolean(checked))}
                    >
                      {labelOf(column)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      )}

      <Table
        ref={ref}
        containerRef={setScrollRef}
        containerClassName={containerClassName}
        striped={striped}
        aria-busy={loading || loadingMore || undefined}
        style={sized ? { width: table.getTotalSize(), minWidth: '100%', tableLayout: 'fixed', ...tableStyle } : tableStyle}
        onKeyDown={enableCellSelection ? onGridKeyDown : undefined}
        tabIndex={enableCellSelection ? 0 : undefined}
        {...tableProps}
      >
        <TableHeader>
          {headerGroups.map((group, groupIndex) => (
            <TableRow key={group.id} className="hover:bg-transparent">
              {groupIndex === 0 && leadingHeaderCells(headerGroups.length + (enableColumnFilters ? 1 : 0))}
              {group.headers.map(renderHeaderCell)}
            </TableRow>
          ))}
          {enableColumnFilters && (
            <TableRow className="hover:bg-transparent">
              {leafColumns.map((column) => {
                const pin = pinning(column, sized, true);
                return (
                  <TableHead
                    key={column.id}
                    style={pin.style}
                    className={cn('h-auto py-2 font-normal', pin.className, sticky && !column.getIsPinned() && 'bg-surface')}
                  >
                    {column.getCanFilter() ? <ColumnFilter column={column} /> : null}
                  </TableHead>
                );
              })}
            </TableRow>
          )}
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: pageSize }, (_, index) => skeletonRow(`loading-${index}`))
          ) : totalRows === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columnSpan} muted className="h-24 text-center">
                {emptyState ?? 'No results.'}
              </TableCell>
            </TableRow>
          ) : (
            <>
              {topRows.map((row, index) => renderRow(row, { pinned: 'top', pinnedIndex: index, pinnedCount: topRows.length }))}
              {virtualized && paddingTop > 0 && (
                <tr aria-hidden>
                  <td colSpan={columnSpan} style={{ height: paddingTop }} />
                </tr>
              )}
              {rowsToRender
                ? rowsToRender.map(({ row, index }) => renderRow(row, { virtualIndex: index }))
                : bodyRows.map((row) => renderRow(row))}
              {virtualized && paddingBottom > 0 && (
                <tr aria-hidden>
                  <td colSpan={columnSpan} style={{ height: paddingBottom }} />
                </tr>
              )}
              {bottomRows.map((row, index) =>
                renderRow(row, { pinned: 'bottom', pinnedIndex: index, pinnedCount: bottomRows.length }),
              )}
            </>
          )}
          {infinite && (
            <>
              {loadingMore && Array.from({ length: 3 }, (_, index) => skeletonRow(`more-${index}`))}
              <tr ref={sentinelRef} aria-hidden>
                <td colSpan={columnSpan} className="h-px p-0" />
              </tr>
            </>
          )}
        </TableBody>
        {showFooter && (
          <TableFooter>
            {table.getFooterGroups().map((group) => (
              <TableRow key={group.id} className="hover:bg-transparent">
                {leadingCount > 0 && <TableCell colSpan={leadingCount} className={cellDensity} />}
                {group.headers.map((header) => {
                  const { align } = getMeta(header.column.columnDef.meta);
                  const pin = pinning(header.column, sized);
                  return (
                    <TableCell
                      key={header.id}
                      align={align}
                      colSpan={header.colSpan > 1 ? header.colSpan : undefined}
                      style={pin.style}
                      className={cn('text-ui-label', pin.className, cellDensity)}
                    >
                      {header.isPlaceholder ? null : <table.FlexRender footer={header} />}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableFooter>
        )}
      </Table>

      {(enableRowSelection || (paginate && pageCount > 1)) && (
        <div className="flex items-center justify-between gap-2">
          <span className="text-body-small text-secondary-muted-foreground" aria-live="polite">
            {enableRowSelection ? `${selectedCount} of ${table.getCoreRowModel().rows.length} row(s) selected` : null}
          </span>
          {paginate && pageCount > 1 && (
            <Pagination
              page={pagination.pageIndex + 1}
              pageCount={pageCount}
              onPageChange={(page) => table.setPageIndex(page - 1)}
            />
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Data-driven table. Wraps `Table` with TanStack Table (`@tanstack/react-table`): sorting, row selection, pagination,
 * column visibility, pinning, sizing, resizing and ordering, column and global filtering with faceted options, grouping with
 * aggregation, row expansion and detail panels, row pinning, cell selection and spanning, grouped headers, footers,
 * inline editing, server-side data, virtualization and infinite scrolling. Every feature is off until its prop is set.
 * Pass `columns` and `data`; state is local unless you control it.
 */
export const DataTable = React.forwardRef(DataTableInner) as <TData extends RowData>(
  props: DataTableProps<TData> & { ref?: React.ForwardedRef<HTMLTableElement> },
) => ReturnType<typeof DataTableInner>;
(DataTable as { displayName?: string }).displayName = 'DataTable';

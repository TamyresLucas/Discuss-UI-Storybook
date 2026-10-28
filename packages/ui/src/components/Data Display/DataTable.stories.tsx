import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { SearchBar } from '../Forms & Data Entry/SearchBar';
import { Tag } from '../Tags & Badges/Tag';
import type { PaginationState, RowSelectionState, SortingState } from '@tanstack/react-table';
import { DataTable, type DataTableColumnDef } from './DataTable';

interface Project {
  id: string;
  name: string;
  role: string;
  status: 'Completed' | 'In Progress' | 'Delayed';
  date: string;
  amount: number;
}

const projects: Project[] = [
  { id: 'p1', name: 'User Onboarding Audit', role: 'Research', status: 'Completed', date: 'Sep 12, 2026', amount: 250 },
  { id: 'p2', name: 'Checkout Flow Redesign', role: 'Design', status: 'In Progress', date: 'Sep 14, 2026', amount: 1250 },
  { id: 'p3', name: 'Dashboard Usability Review', role: 'Research', status: 'Delayed', date: 'Sep 20, 2026', amount: 840 },
  { id: 'p4', name: 'Mobile App Feature Enhancement', role: 'Product', status: 'In Progress', date: 'Sep 24, 2026', amount: 3100 },
  { id: 'p5', name: 'Pricing Page Experiment', role: 'Growth', status: 'Completed', date: 'Oct 02, 2026', amount: 560 },
  { id: 'p6', name: 'Navigation Card Sort', role: 'Research', status: 'Completed', date: 'Oct 05, 2026', amount: 390 },
  { id: 'p7', name: 'Search Relevance Study', role: 'Research', status: 'Delayed', date: 'Oct 11, 2026', amount: 920 },
  { id: 'p8', name: 'Settings Page Cleanup', role: 'Design', status: 'In Progress', date: 'Oct 14, 2026', amount: 410 },
  { id: 'p9', name: 'Notification Preferences', role: 'Product', status: 'Completed', date: 'Oct 18, 2026', amount: 730 },
  { id: 'p10', name: 'Help Center Audit', role: 'Research', status: 'In Progress', date: 'Oct 21, 2026', amount: 280 },
  { id: 'p11', name: 'Empty States Review', role: 'Design', status: 'Completed', date: 'Oct 24, 2026', amount: 150 },
  { id: 'p12', name: 'Billing Flow Walkthrough', role: 'Product', status: 'Delayed', date: 'Oct 27, 2026', amount: 1980 },
];

const statusVariant = { Completed: 'success', 'In Progress': 'neutral', Delayed: 'warning' } as const;

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const columns: DataTableColumnDef<Project>[] = [
  { accessorKey: 'name', header: 'Project', meta: { label: 'Project' } },
  { accessorKey: 'role', header: 'Role', enableSorting: false, meta: { muted: true, label: 'Role' } },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: { label: 'Status' },
    cell: ({ row }) => <Tag variant={statusVariant[row.original.status]}>{row.original.status}</Tag>,
  },
  { accessorKey: 'date', header: 'Date', enableSorting: false, meta: { muted: true, label: 'Date' } },
  {
    accessorKey: 'amount',
    header: 'Amount',
    meta: { align: 'right', label: 'Amount' },
    cell: ({ row }) => currency.format(row.original.amount),
  },
];

const meta = {
  title: 'Data Display/DataTable',
  component: DataTable,
  tags: ['autodocs', 'status:review', 'source-custom'],
  parameters: {
    docs: {
      description: {
        component:
          'Data-driven table built on `Table` with [TanStack Table](https://tanstack.com/table/latest) (`@tanstack/react-table`) and TanStack Virtual. Pass `columns` (TanStack `ColumnDef`) and `data`; every feature is off until its prop is set and its state is local unless controlled. The stories below cover sorting, selection, pagination, column visibility, pinning, sizing, resizing and ordering, column and global filtering with faceting, grouping, aggregation, expanding, row pinning, cell selection and spanning, grouped headers, server-side data, virtualization, infinite scrolling, editable cells and density.',
      },
    },
  },
  args: {
    'aria-label': 'Projects',
    columns,
    data: projects,
    getRowId: (row: Project) => row.id,
    pageSize: 5,
  },
  argTypes: {
    columns: { control: false },
    data: { control: false },
    enableSorting: { control: 'boolean' },
    enableRowSelection: { control: 'boolean' },
    enableColumnVisibility: { control: 'boolean' },
    striped: { control: 'boolean' },
    loading: { control: 'boolean' },
    pageSize: { control: 'number' },
  },
  decorators: [
    (Story) => (
      <div className="w-250">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DataTable<Project>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sortable: Story = {
  args: { enableSorting: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const amount = canvas.getByRole('columnheader', { name: /amount/i });
    await userEvent.click(within(amount).getByRole('button'));
    await expect(amount).toHaveAttribute('aria-sort', 'ascending');
    await userEvent.click(within(amount).getByRole('button'));
    await expect(amount).toHaveAttribute('aria-sort', 'descending');
  },
};

export const Selectable: Story = {
  args: { enableSorting: true, enableRowSelection: true, onRowSelectionChange: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getAllByRole('checkbox', { name: 'Select row' })[0]!);
    await expect(canvas.getByText('1 of 12 row(s) selected')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select all rows' }));
    await expect(canvas.getByText('5 of 12 row(s) selected')).toBeInTheDocument();
  },
};

export const Paginated: Story = {
  args: { enableSorting: true, pageSize: 4 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('User Onboarding Audit')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }));
    await expect(canvas.queryByText('User Onboarding Audit')).not.toBeInTheDocument();
    await expect(canvas.getByText('Pricing Page Experiment')).toBeInTheDocument();
  },
};

export const Striped: Story = { args: { striped: true } };

export const ColumnVisibility: Story = {
  args: { enableSorting: true, enableColumnVisibility: true },
};

export const WithToolbar: Story = {
  args: {
    enableSorting: true,
    enableRowSelection: true,
    enableColumnVisibility: true,
    toolbar: <SearchBar aria-label="Search projects" placeholder="Search projects" />,
  },
};

export const Loading: Story = { args: { loading: true, enableRowSelection: true } };

export const Empty: Story = {
  args: { data: [], emptyState: 'No projects match your filters.' },
};

function ControlledExample(args: React.ComponentProps<typeof DataTable<Project>>) {
  const [sorting, setSorting] = React.useState([{ id: 'amount', desc: true }]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({ p2: true });
  return (
    <DataTable
      {...args}
      enableSorting
      enableRowSelection
      sorting={sorting}
      onSortingChange={setSorting}
      rowSelection={rowSelection}
      onRowSelectionChange={setRowSelection}
    />
  );
}

/** Sorting and selection controlled from outside, e.g. to persist them or drive a bulk-action bar. */
export const Controlled: Story = {
  render: (args) => <ControlledExample {...args} />,
};


// ---------------------------------------------------------------------------------------------------------------------
// Advanced TanStack features. Each is off until its prop is set.
// ---------------------------------------------------------------------------------------------------------------------

/** Wide columns with explicit sizes, for pinning, sizing and resizing. */
const sizedColumns: DataTableColumnDef<Project>[] = [
  { accessorKey: 'name', header: 'Project', size: 260, minSize: 140, meta: { label: 'Project' } },
  { accessorKey: 'role', header: 'Role', size: 160, minSize: 100, meta: { muted: true, label: 'Role' } },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 160,
    minSize: 100,
    meta: { label: 'Status' },
    cell: ({ row }) => <Tag variant={statusVariant[row.original.status]}>{row.original.status}</Tag>,
  },
  { accessorKey: 'date', header: 'Date', size: 200, minSize: 100, meta: { muted: true, label: 'Date' } },
  {
    accessorKey: 'amount',
    header: 'Amount',
    size: 180,
    minSize: 100,
    meta: { align: 'right', label: 'Amount' },
    cell: ({ row }) => currency.format(row.original.amount),
  },
];

const narrow = (Story: () => React.ReactElement) => (
  <div className="w-150">
    <Story />
  </div>
);

/** Stick columns to the start or end edge while the rest scrolls. Pin with `initialState.columnPinning` or `column.pin()`. */
export const ColumnPinning: Story = {
  name: 'Column Pinning',
  decorators: [narrow],
  args: {
    columns: sizedColumns,
    enableColumnPinning: true,
    initialState: { columnPinning: { start: ['name'], end: ['amount'] } },
    pageSize: 6,
  },
};

/** Drag a header edge to resize. Widths respect each column's `minSize` and `maxSize`. */
export const ColumnResizing: Story = {
  name: 'Column Resizing',
  args: { columns: sizedColumns, enableColumnResizing: true, pageSize: 6 },
};

/** `size`, `minSize` and `maxSize` in the column definition set fixed widths, without resizing or pinning. */
export const ColumnSizing: Story = {
  name: 'Column Sizing',
  args: { columns: sizedColumns, enableColumnSizing: true, pageSize: 6 },
};

/** Drag a header to reorder columns, or focus it and press Alt + arrow keys. `columnOrder` can be controlled. */
export const ColumnOrdering: Story = {
  name: 'Column Ordering',
  args: {
    enableColumnOrdering: true,
    initialState: { columnOrder: ['name', 'amount', 'status', 'role', 'date'] },
    pageSize: 6,
  },
};

const filterColumns: DataTableColumnDef<Project>[] = [
  { accessorKey: 'name', header: 'Project', meta: { label: 'Project', filterVariant: 'text' } },
  { accessorKey: 'role', header: 'Role', meta: { muted: true, label: 'Role', filterVariant: 'select' } },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: { label: 'Status', filterVariant: 'select' },
    cell: ({ row }) => <Tag variant={statusVariant[row.original.status]}>{row.original.status}</Tag>,
  },
  { accessorKey: 'date', header: 'Date', enableColumnFilter: false, meta: { muted: true, label: 'Date' } },
  {
    accessorKey: 'amount',
    header: 'Amount',
    filterFn: 'inNumberRange',
    meta: { align: 'right', label: 'Amount', filterVariant: 'range' },
    cell: ({ row }) => currency.format(row.original.amount),
  },
];

/** A filter row under the header. Choose each column's control with `meta.filterVariant`: `text`, `select` or `range`. */
export const ColumnFiltering: Story = {
  name: 'Column Filtering',
  args: {
    columns: filterColumns,
    enableSorting: true,
    enableColumnFilters: true,
    initialState: { columnFilters: [{ id: 'name', value: 'audit' }] },
    pageSize: 6,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox', { name: 'Filter Project' })).toHaveValue('audit');
    await expect(canvas.getByText('User Onboarding Audit')).toBeInTheDocument();
    await expect(canvas.queryByText('Checkout Flow Redesign')).not.toBeInTheDocument();
  },
};

/** One search field that filters across every column. */
export const GlobalFiltering: Story = {
  name: 'Global Filtering',
  args: {
    enableSorting: true,
    enableGlobalFilter: true,
    globalFilterPlaceholder: 'Search projects',
    initialState: { globalFilter: 'research' },
    pageSize: 6,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('searchbox', { name: 'Search table' })).toHaveValue('research');
    await expect(canvas.getByText('Dashboard Usability Review')).toBeInTheDocument();
    await expect(canvas.queryByText('Checkout Flow Redesign')).not.toBeInTheDocument();
  },
};

/** `select` filters list the values found in the data with a count, and the counts follow the other active filters. */
export const ColumnFaceting: Story = {
  name: 'Column Faceting',
  args: {
    columns: filterColumns,
    enableColumnFilters: true,
    initialState: { columnFilters: [{ id: 'role', value: 'Research' }] },
    pageSize: 6,
  },
};

const groupColumns: DataTableColumnDef<Project>[] = [
  { accessorKey: 'name', header: 'Project', meta: { label: 'Project' } },
  { accessorKey: 'role', header: 'Role', meta: { label: 'Role' } },
  { accessorKey: 'status', header: 'Status', meta: { label: 'Status' } },
  {
    accessorKey: 'amount',
    header: 'Amount',
    aggregationFn: 'sum',
    aggregatedCell: ({ getValue }) => currency.format(getValue<number>()),
    meta: { align: 'right', label: 'Amount' },
    cell: ({ row }) => currency.format(row.original.amount),
  },
];

/** Rows grouped by a column with collapsible group rows. Use the "Group by" menu to change the grouping. */
export const Grouping: Story = {
  name: 'Grouping',
  args: {
    columns: groupColumns,
    enableGrouping: true,
    initialState: { grouping: ['role'], expanded: true },
    pageSize: 20,
  },
};

/** Group rows and the footer show aggregates from each column's `aggregationFn` (`sum`, `mean`, `count`, `extent`, …). */
export const Aggregation: Story = {
  name: 'Aggregation',
  args: {
    columns: [
      ...groupColumns.slice(0, 3),
      {
        ...groupColumns[3]!,
        footer: ({ table }) => currency.format(table.getCoreRowModel().rows.reduce((sum, row) => sum + row.original.amount, 0)),
      },
    ],
    enableGrouping: true,
    showFooter: true,
    initialState: { grouping: ['status'], expanded: true },
    pageSize: 20,
  },
};

interface Folder {
  id: string;
  name: string;
  kind: string;
  size: string;
  children?: Folder[];
}

const folders: Folder[] = [
  {
    id: 'f1',
    name: 'Research',
    kind: 'Folder',
    size: '—',
    children: [
      { id: 'f1a', name: 'Interview guide.pdf', kind: 'PDF', size: '240 KB' },
      {
        id: 'f1b',
        name: 'Sessions',
        kind: 'Folder',
        size: '—',
        children: [
          { id: 'f1b1', name: 'Session 01.mp4', kind: 'Video', size: '412 MB' },
          { id: 'f1b2', name: 'Session 02.mp4', kind: 'Video', size: '388 MB' },
        ],
      },
    ],
  },
  { id: 'f2', name: 'Design', kind: 'Folder', size: '—', children: [{ id: 'f2a', name: 'Checkout flow.fig', kind: 'Figma', size: '18 MB' }] },
  { id: 'f3', name: 'Readme.md', kind: 'Markdown', size: '4 KB' },
];

const folderColumns: DataTableColumnDef<Folder>[] = [
  { accessorKey: 'name', header: 'Name', meta: { label: 'Name' } },
  { accessorKey: 'kind', header: 'Kind', meta: { muted: true, label: 'Kind' } },
  { accessorKey: 'size', header: 'Size', meta: { align: 'right', muted: true, label: 'Size' } },
];

/** Tree data: pass `getSubRows` and turn on `enableExpanding`. Sub-rows are indented by depth. */
export const Expanding: Story = {
  name: 'Expanding Rows',
  args: {
    columns: folderColumns as unknown as DataTableColumnDef<Project>[],
    data: folders as unknown as Project[],
    getSubRows: (row: Project) => (row as unknown as Folder).children as unknown as Project[] | undefined,
    getRowId: (row: Project) => (row as unknown as Folder).id,
    enableExpanding: true,
    initialState: { expanded: { f1: true } },
    pageSize: 20,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Interview guide.pdf')).toBeInTheDocument();
    await userEvent.click(canvas.getAllByRole('button', { name: 'Collapse row' })[0]!);
    await expect(canvas.queryByText('Interview guide.pdf')).not.toBeInTheDocument();
  },
};

/** A detail panel under an expanded row, from `renderSubComponent`. */
export const DetailPanel: Story = {
  name: 'Expanding Rows: Detail Panel',
  args: {
    enableExpanding: true,
    pageSize: 6,
    renderSubComponent: (project: Project) => (
      <p className="text-body-small text-surface-foreground">
        {project.name} is run by the {project.role} team and was last updated on {project.date}.
      </p>
    ),
  },
};

/** Pin rows to the top with the pin button; pinned rows stay in view while the rest scrolls. */
export const RowPinning: Story = {
  name: 'Row Pinning',
  args: {
    enableRowPinning: true,
    containerClassName: 'max-h-80',
    initialState: { rowPinning: { top: ['p2'] } },
    pageSize: 12,
  },
};

/** Select ranges of cells: drag, Shift-click to extend, Ctrl/Cmd-click to add, arrow keys to move, Ctrl/Cmd + A for all. */
export const CellSelection: Story = {
  name: 'Cell Selection',
  args: { enableCellSelection: true, onCellSelectionChange: fn(), 'aria-label': 'Projects, cells selectable', pageSize: 6 },
};

/** `spanRows: true` merges adjacent rows with the same value; `spanColumns` stretches a cell across columns. */
export const CellSpanning: Story = {
  name: 'Cell Spanning',
  args: {
    columns: [
      { accessorKey: 'role', header: 'Role', spanRows: true, meta: { label: 'Role' } },
      ...columns.filter((column) => 'accessorKey' in column && column.accessorKey !== 'role'),
    ],
    initialState: { sorting: [{ id: 'role', desc: false }] },
    enableSorting: true,
    pageSize: 12,
  },
};

const groupedHeaderColumns: DataTableColumnDef<Project>[] = [
  { accessorKey: 'name', header: 'Project', meta: { label: 'Project' } },
  {
    id: 'details',
    header: 'Details',
    columns: [
      { accessorKey: 'role', header: 'Role', meta: { muted: true, label: 'Role' } },
      {
        accessorKey: 'status',
        header: 'Status',
        meta: { label: 'Status' },
        cell: ({ row }) => <Tag variant={statusVariant[row.original.status]}>{row.original.status}</Tag>,
      },
    ],
  },
  {
    id: 'billing',
    header: 'Billing',
    columns: [
      { accessorKey: 'date', header: 'Date', meta: { muted: true, label: 'Date' } },
      {
        accessorKey: 'amount',
        header: 'Amount',
        meta: { align: 'right', label: 'Amount' },
        cell: ({ row }) => currency.format(row.original.amount),
      },
    ],
  },
];

/** Multi-level headers: nest `columns` inside a group column definition. */
export const GroupedHeaders: Story = {
  name: 'Grouped Headers',
  args: { columns: groupedHeaderColumns, enableSorting: true, pageSize: 6 },
};

function ServerSideExample(args: React.ComponentProps<typeof DataTable<Project>>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 4 });
  // Stands in for a server: sorts all rows, then returns one page and the total count.
  const { page, total } = React.useMemo(() => {
    const sorted = [...projects];
    const sort = sorting[0];
    if (sort) {
      const key = sort.id as keyof Project;
      sorted.sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * (sort.desc ? -1 : 1));
    }
    const start = pagination.pageIndex * pagination.pageSize;
    return { page: sorted.slice(start, start + pagination.pageSize), total: sorted.length };
  }, [sorting, pagination]);
  return (
    <DataTable
      {...args}
      data={page}
      enableSorting
      serverSide
      rowCount={total}
      sorting={sorting}
      onSortingChange={setSorting}
      pagination={pagination}
      onPaginationChange={setPagination}
    />
  );
}

/** Sorting, filtering and paging happen on your server: pass one page as `data`, the total as `rowCount`, and control the state. */
export const ServerSideData: Story = {
  name: 'Server-side Sorting, Filtering and Pagination',
  render: (args) => <ServerSideExample {...args} />,
};

interface Row10k {
  id: string;
  name: string;
  role: string;
  status: Project['status'];
  date: string;
  amount: number;
}

const manyRows = (count: number, offset = 0): Row10k[] =>
  Array.from({ length: count }, (_, index) => {
    const n = index + offset;
    return {
      id: `r${n}`,
      name: `Study ${n + 1}`,
      role: ['Research', 'Design', 'Product', 'Growth'][n % 4]!,
      status: (['Completed', 'In Progress', 'Delayed'] as const)[n % 3]!,
      date: `Oct ${(n % 28) + 1}, 2026`,
      amount: 100 + ((n * 37) % 900),
    };
  });

const bigData = manyRows(10000);

/** 10,000 rows rendered with only the visible ones in the DOM. Give the table a bounded height. */
export const Virtualization: Story = {
  name: 'Virtualized Rows and Columns',
  args: {
    data: bigData,
    getRowId: (row: Project) => row.id,
    virtualized: true,
    enableSorting: true,
    containerClassName: 'max-h-96',
    'aria-label': '10,000 studies',
  },
};

function InfiniteExample(args: React.ComponentProps<typeof DataTable<Project>>) {
  const [rows, setRows] = React.useState(() => manyRows(20));
  const [loading, setLoading] = React.useState(false);
  const load = React.useCallback(() => {
    setLoading(true);
    // Stands in for a request: the next page arrives after a short delay.
    setTimeout(() => {
      setRows((previous) => [...previous, ...manyRows(20, previous.length)]);
      setLoading(false);
    }, 600);
  }, []);
  return (
    <DataTable
      {...args}
      data={rows}
      getRowId={(row) => row.id}
      onLoadMore={load}
      hasMore={rows.length < 100}
      loadingMore={loading}
      containerClassName="max-h-96"
    />
  );
}

/** More rows load as the end of the table scrolls into view: `onLoadMore`, `hasMore` and `loadingMore`. */
export const InfiniteScrolling: Story = {
  name: 'Infinite Scrolling',
  render: (args) => <InfiniteExample {...args} />,
};

function EditableExample(args: React.ComponentProps<typeof DataTable<Project>>) {
  const [rows, setRows] = React.useState(projects);
  return (
    <DataTable
      {...args}
      data={rows}
      onCellEdit={({ rowId, columnId, value }) =>
        setRows((previous) =>
          previous.map((row) =>
            row.id === rowId ? { ...row, [columnId]: columnId === 'amount' ? Number(value) : value } : row,
          ),
        )
      }
    />
  );
}

const editableColumns: DataTableColumnDef<Project>[] = [
  { accessorKey: 'name', header: 'Project', meta: { label: 'Project', editable: true } },
  { accessorKey: 'role', header: 'Role', meta: { muted: true, label: 'Role', editable: true } },
  { accessorKey: 'date', header: 'Date', meta: { muted: true, label: 'Date' } },
  {
    accessorKey: 'amount',
    header: 'Amount',
    meta: { align: 'right', label: 'Amount', editable: true, editType: 'number' },
  },
];

/** Cells with `meta.editable` render an input; Enter or blur commits through `onCellEdit`, Escape reverts. */
export const EditableCells: Story = {
  name: 'Editable Cells',
  args: { columns: editableColumns, pageSize: 6 },
  render: (args) => <EditableExample {...args} />,
};

/** Table-level options of our own on top of TanStack, here a row density toggle (`density`, `enableDensityToggle`). */
export const CustomFeatures: Story = {
  name: 'Custom Features: Density',
  args: { enableSorting: true, enableDensityToggle: true, enableRowSelection: true, pageSize: 6 },
};

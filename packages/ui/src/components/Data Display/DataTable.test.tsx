import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { DataTable, type DataTableColumnDef } from './DataTable';

interface Person {
  id: string;
  name: string;
  age: number;
}

const data: Person[] = [
  { id: 'a', name: 'Ada', age: 36 },
  { id: 'b', name: 'Grace', age: 85 },
  { id: 'c', name: 'Linus', age: 54 },
];

const columns: DataTableColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name', meta: { label: 'Name' } },
  { accessorKey: 'age', header: 'Age', meta: { align: 'right', label: 'Age' } },
];

const rowNames = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell').at(-1)?.textContent ?? '');

describe('DataTable', () => {
  it('renders a header and one row per item', () => {
    render(<DataTable aria-label="People" columns={columns} data={data} />);
    expect(screen.getByRole('table', { name: 'People' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['Name', 'Age']);
    expect(screen.getByText('Grace')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(4);
  });

  it('sorts by a column and reflects it in aria-sort', async () => {
    const user = userEvent.setup();
    render(<DataTable aria-label="People" columns={columns} data={data} enableSorting />);
    const age = screen.getByRole('columnheader', { name: 'Age' });
    expect(age).toHaveAttribute('aria-sort', 'none');
    await user.click(within(age).getByRole('button'));
    expect(age).toHaveAttribute('aria-sort', 'ascending');
    expect(rowNames()).toEqual(['36', '54', '85']);
    await user.click(within(age).getByRole('button'));
    expect(age).toHaveAttribute('aria-sort', 'descending');
    expect(rowNames()).toEqual(['85', '54', '36']);
  });

  it('does not make columns sortable unless sorting is enabled', () => {
    render(<DataTable aria-label="People" columns={columns} data={data} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('selects rows and supports select-all with an indeterminate header', async () => {
    const user = userEvent.setup();
    const onRowSelectionChange = vi.fn();
    render(
      <DataTable
        aria-label="People"
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        enableRowSelection
        onRowSelectionChange={onRowSelectionChange}
      />,
    );
    const all = screen.getByRole('checkbox', { name: 'Select all rows' });
    await user.click(screen.getAllByRole('checkbox', { name: 'Select row' })[0]!);
    expect(onRowSelectionChange).toHaveBeenLastCalledWith({ a: true });
    expect(all).toHaveAttribute('aria-checked', 'mixed');
    expect(screen.getByText('1 of 3 row(s) selected')).toBeInTheDocument();
    await user.click(all);
    expect(screen.getByText('3 of 3 row(s) selected')).toBeInTheDocument();
    await user.click(all);
    expect(screen.getByText('0 of 3 row(s) selected')).toBeInTheDocument();
  });

  it('paginates and hides the pagination bar when everything fits', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<DataTable aria-label="People" columns={columns} data={data} pageSize={2} />);
    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.queryByText('Linus')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByText('Linus')).toBeInTheDocument();
    rerender(<DataTable aria-label="People" columns={columns} data={data} pageSize={10} />);
    expect(screen.queryByRole('navigation', { name: 'Pagination' })).not.toBeInTheDocument();
  });

  it('toggles column visibility from the Columns menu', async () => {
    const user = userEvent.setup();
    render(<DataTable aria-label="People" columns={columns} data={data} enableColumnVisibility />);
    await user.click(screen.getByRole('button', { name: /columns/i }));
    await user.click(await screen.findByRole('menuitemcheckbox', { name: 'Age' }));
    expect(screen.queryByRole('columnheader', { name: 'Age' })).not.toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
  });

  it('shows the empty state and the loading state', () => {
    const { rerender } = render(<DataTable aria-label="People" columns={columns} data={[]} emptyState="Nobody here" />);
    expect(screen.getByText('Nobody here')).toBeInTheDocument();
    rerender(<DataTable aria-label="People" columns={columns} data={data} loading pageSize={3} />);
    expect(screen.getByRole('table', { name: 'People' })).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByText('Ada')).not.toBeInTheDocument();
  });

  it('calls onRowClick with the row data but not when the checkbox is used', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(<DataTable aria-label="People" columns={columns} data={data} enableRowSelection onRowClick={onRowClick} />);
    await user.click(screen.getByText('Grace'));
    expect(onRowClick).toHaveBeenCalledWith(data[1]);
    onRowClick.mockClear();
    await user.click(screen.getAllByRole('checkbox', { name: 'Select row' })[0]!);
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <DataTable aria-label="People" columns={columns} data={data} enableSorting enableRowSelection />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

interface Employee {
  id: string;
  name: string;
  team: string;
  salary: number;
  reports?: Employee[];
}

const employees: Employee[] = [
  { id: 'e1', name: 'Ada', team: 'Eng', salary: 100 },
  { id: 'e2', name: 'Grace', team: 'Eng', salary: 200 },
  { id: 'e3', name: 'Linus', team: 'Ops', salary: 300 },
  { id: 'e4', name: 'Margaret', team: 'Ops', salary: 400 },
  { id: 'e5', name: 'Alan', team: 'Sales', salary: 50 },
];

const employeeColumns: DataTableColumnDef<Employee>[] = [
  { accessorKey: 'name', header: 'Name', size: 120, meta: { label: 'Name', filterVariant: 'text' } },
  { accessorKey: 'team', header: 'Team', size: 100, meta: { label: 'Team', filterVariant: 'select' } },
  {
    accessorKey: 'salary',
    header: 'Salary',
    size: 100,
    filterFn: 'inNumberRange',
    aggregationFn: 'sum',
    aggregatedCell: ({ getValue }) => `Σ ${getValue<number>()}`,
    footer: ({ table }) => `Total ${table.getCoreRowModel().rows.reduce((sum, row) => sum + row.original.salary, 0)}`,
    meta: { label: 'Salary', filterVariant: 'range', align: 'right' },
  },
];

const bodyRowCount = () => screen.getAllByRole('row').length;

describe('DataTable features', () => {
  it('pins columns with sticky offsets', () => {
    render(
      <DataTable
        aria-label="Staff"
        columns={employeeColumns}
        data={employees}
        enableColumnPinning
        initialState={{ columnPinning: { start: ['name'], end: ['salary'] } }}
      />,
    );
    const name = screen.getByRole('columnheader', { name: 'Name' });
    const salary = screen.getByRole('columnheader', { name: 'Salary' });
    expect(name).toHaveStyle({ position: 'sticky', insetInlineStart: '0px' });
    expect(salary).toHaveStyle({ position: 'sticky', insetInlineEnd: '0px' });
    expect(screen.getByRole('columnheader', { name: 'Team' })).not.toHaveStyle({ position: 'sticky' });
  });

  it('applies column sizes and offers resize handles', () => {
    render(<DataTable aria-label="Staff" columns={employeeColumns} data={employees} enableColumnResizing />);
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveStyle({ width: '120px' });
    expect(screen.getByRole('separator', { name: 'Resize Name' })).toBeInTheDocument();
  });

  it('reorders columns with Alt + arrow keys', async () => {
    const user = userEvent.setup();
    render(<DataTable aria-label="Staff" columns={employeeColumns} data={employees} enableColumnOrdering />);
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['Name', 'Team', 'Salary']);
    screen.getByRole('columnheader', { name: 'Name' }).focus();
    await user.keyboard('{Alt>}{ArrowRight}{/Alt}');
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['Team', 'Name', 'Salary']);
  });

  it('filters by column text, select (with counts) and number range', async () => {
    const user = userEvent.setup();
    render(<DataTable aria-label="Staff" columns={employeeColumns} data={employees} enableColumnFilters pageSize={20} />);
    await user.type(screen.getByRole('textbox', { name: 'Filter Name' }), 'a');
    expect(screen.queryByText('Linus')).not.toBeInTheDocument();
    expect(screen.getByText('Ada')).toBeInTheDocument();
    await user.clear(screen.getByRole('textbox', { name: 'Filter Name' }));

    await user.click(screen.getByRole('combobox', { name: 'Filter Team' }));
    expect(await screen.findByRole('option', { name: 'Eng (2)' })).toBeInTheDocument();
    await user.click(screen.getByRole('option', { name: 'Ops (2)' }));
    expect(screen.queryByText('Ada')).not.toBeInTheDocument();
    expect(screen.getByText('Margaret')).toBeInTheDocument();

    await user.type(screen.getByRole('spinbutton', { name: 'Salary minimum' }), '350');
    expect(screen.queryByText('Linus')).not.toBeInTheDocument();
    expect(screen.getByText('Margaret')).toBeInTheDocument();
  });

  it('filters across all columns with the global search', async () => {
    const user = userEvent.setup();
    render(<DataTable aria-label="Staff" columns={employeeColumns} data={employees} enableGlobalFilter pageSize={20} />);
    await user.type(screen.getByRole('searchbox', { name: 'Search table' }), 'sales');
    expect(screen.getByText('Alan')).toBeInTheDocument();
    expect(screen.queryByText('Ada')).not.toBeInTheDocument();
  });

  it('groups rows, aggregates, and expands groups', async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        aria-label="Staff"
        columns={employeeColumns}
        data={employees}
        enableGrouping
        showFooter
        pageSize={20}
        initialState={{ grouping: ['team'] }}
      />,
    );
    expect(screen.getByRole('button', { name: /Eng.*\(2\)/ })).toBeInTheDocument();
    expect(screen.getByText('Σ 300')).toBeInTheDocument();
    expect(screen.getByText('Σ 700')).toBeInTheDocument();
    expect(screen.getByText('Total 1050')).toBeInTheDocument();
    expect(screen.queryByText('Ada')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Eng.*\(2\)/ }));
    expect(screen.getByText('Ada')).toBeInTheDocument();
  });

  it('expands tree rows and detail panels', async () => {
    const user = userEvent.setup();
    const tree: Employee[] = [{ ...employees[0]!, reports: [{ id: 'e1a', name: 'Report One', team: 'Eng', salary: 10 }] }];
    const { rerender } = render(
      <DataTable
        aria-label="Staff"
        columns={employeeColumns}
        data={tree}
        getRowId={(row) => row.id}
        getSubRows={(row) => row.reports}
        enableExpanding
      />,
    );
    expect(screen.queryByText('Report One')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Expand row' }));
    expect(screen.getByText('Report One')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Collapse row' })).toHaveAttribute('aria-expanded', 'true');

    rerender(
      <DataTable
        aria-label="Staff"
        columns={employeeColumns}
        data={employees}
        enableExpanding
        renderSubComponent={(row) => <p>Details for {row.name}</p>}
      />,
    );
    await user.click(screen.getAllByRole('button', { name: 'Expand row' })[1]!);
    expect(screen.getByText('Details for Grace')).toBeInTheDocument();
  });

  it('pins a row to the top', async () => {
    const user = userEvent.setup();
    render(<DataTable aria-label="Staff" columns={employeeColumns} data={employees} getRowId={(r) => r.id} enableRowPinning />);
    const firstCell = () => within(screen.getAllByRole('row')[1]!).getAllByRole('cell')[1]!.textContent;
    expect(firstCell()).toBe('Ada');
    await user.click(screen.getAllByRole('button', { name: 'Pin row to top' })[3]!);
    expect(firstCell()).toBe('Margaret');
    expect(screen.getByRole('button', { name: 'Unpin row' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('selects ranges of cells', async () => {
    const onCellSelectionChange = vi.fn();
    render(
      <DataTable
        aria-label="Staff"
        columns={employeeColumns}
        data={employees}
        getRowId={(r) => r.id}
        enableCellSelection
        onCellSelectionChange={onCellSelectionChange}
      />,
    );
    const ada = screen.getByText('Ada').closest('td')!;
    const eng = screen.getAllByText('Eng')[0]!.closest('td')!;
    fireEvent.mouseDown(ada);
    fireEvent.mouseEnter(eng);
    fireEvent.mouseUp(document);
    expect(onCellSelectionChange).toHaveBeenCalled();
    expect(ada).toHaveAttribute('data-selected');
    expect(eng).toHaveAttribute('data-selected');
    expect(screen.getByText('Linus').closest('td')).not.toHaveAttribute('data-selected');
  });

  it('merges adjacent cells with spanRows', () => {
    const spanning: DataTableColumnDef<Employee>[] = [{ ...employeeColumns[1]!, spanRows: true }, employeeColumns[0]!];
    render(<DataTable aria-label="Staff" columns={spanning} data={employees} pageSize={20} />);
    const eng = screen.getAllByText('Eng');
    expect(eng).toHaveLength(1);
    expect(eng[0]!.closest('td')).toHaveAttribute('rowspan', '2');
  });

  it('renders grouped headers with colSpan', () => {
    const grouped: DataTableColumnDef<Employee>[] = [
      { id: 'who', header: 'Who', columns: [employeeColumns[0]!, employeeColumns[1]!] },
      employeeColumns[2]!,
    ];
    render(<DataTable aria-label="Staff" columns={grouped} data={employees} />);
    expect(screen.getByRole('columnheader', { name: 'Who' })).toHaveAttribute('colspan', '2');
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
  });

  it('leaves sorting, filtering and paging to the server', async () => {
    const user = userEvent.setup();
    const onSortingChange = vi.fn();
    render(
      <DataTable
        aria-label="Staff"
        columns={employeeColumns}
        data={[employees[2]!, employees[0]!]}
        enableSorting
        serverSide
        rowCount={50}
        pageSize={2}
        onSortingChange={onSortingChange}
      />,
    );
    await user.click(within(screen.getByRole('columnheader', { name: 'Name' })).getByRole('button'));
    expect(onSortingChange).toHaveBeenCalledWith([{ id: 'name', desc: false }]);
    // Rows stay in the order the server returned them.
    expect(within(screen.getAllByRole('row')[1]!).getAllByRole('cell')[0]!.textContent).toBe('Linus');
    expect(screen.getByRole('button', { name: 'Page 25' })).toBeInTheDocument();
  });

  it('renders only the visible rows when virtualized', () => {
    // jsdom has no layout, so give the scroll container a height for the virtualizer to measure.
    const height = vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(400);
    const width = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(800);
    const rowHeight = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(40);
    const many = Array.from({ length: 1000 }, (_, i) => ({ id: `r${i}`, name: `Person ${i}`, team: 'Eng', salary: i }));
    render(<DataTable aria-label="Staff" columns={employeeColumns} data={many} virtualized />);
    expect(bodyRowCount()).toBeLessThan(60);
    expect(screen.getByText('Person 0')).toBeInTheDocument();
    expect(screen.queryByText('Person 900')).not.toBeInTheDocument();
    height.mockRestore();
    width.mockRestore();
    rowHeight.mockRestore();
  });

  it('loads more when the end scrolls into view', () => {
    let trigger: (() => void) | undefined;
    class IntersectionObserverStub {
      constructor(callback: IntersectionObserverCallback) {
        trigger = () => callback([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);
    const onLoadMore = vi.fn();
    const { rerender } = render(
      <DataTable aria-label="Staff" columns={employeeColumns} data={employees} onLoadMore={onLoadMore} hasMore />,
    );
    trigger?.();
    expect(onLoadMore).toHaveBeenCalledTimes(1);
    rerender(<DataTable aria-label="Staff" columns={employeeColumns} data={employees} onLoadMore={onLoadMore} hasMore loadingMore />);
    expect(screen.getByRole('table', { name: 'Staff' })).toHaveAttribute('aria-busy', 'true');
    vi.unstubAllGlobals();
  });

  it('edits cells and commits with Enter, reverting with Escape', async () => {
    const user = userEvent.setup();
    const onCellEdit = vi.fn();
    const editable: DataTableColumnDef<Employee>[] = [
      { accessorKey: 'name', header: 'Name', meta: { label: 'Name', editable: true } },
    ];
    render(<DataTable aria-label="Staff" columns={editable} data={employees} getRowId={(r) => r.id} onCellEdit={onCellEdit} />);
    const first = screen.getByRole('textbox', { name: 'Name, row 1' });
    await user.clear(first);
    await user.type(first, 'Ada L.{Enter}');
    expect(onCellEdit).toHaveBeenCalledWith({ row: employees[0], rowId: 'e1', columnId: 'name', value: 'Ada L.' });
    onCellEdit.mockClear();
    await user.type(screen.getByRole('textbox', { name: 'Name, row 2' }), 'x{Escape}');
    expect(onCellEdit).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox', { name: 'Name, row 2' })).toHaveValue('Grace');
  });

  it('switches row density', async () => {
    const user = userEvent.setup();
    render(<DataTable aria-label="Staff" columns={employeeColumns} data={employees} enableDensityToggle />);
    const cell = () => screen.getByText('Ada').closest('td')!;
    expect(cell()).not.toHaveClass('h-8');
    await user.click(screen.getByRole('button', { name: 'Compact' }));
    expect(cell()).toHaveClass('h-8');
  });

  it('has no axe violations with the feature-rich configuration', async () => {
    const { container } = render(
      <DataTable
        aria-label="Staff"
        columns={employeeColumns}
        data={employees}
        enableSorting
        enableRowSelection
        enableColumnFilters
        enableGlobalFilter
        enableExpanding
        enableRowPinning
        enableColumnVisibility
        showFooter
        renderSubComponent={(row) => <p>{row.name}</p>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

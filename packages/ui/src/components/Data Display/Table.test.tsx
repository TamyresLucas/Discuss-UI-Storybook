import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Table, TableBody, TableCell, TableCellTwoLines, TableHead, TableHeader, TableRow } from './Table';

const Example = ({ onSort = vi.fn(), sort = 'none' as const, selected = false, striped = false }) => (
  <Table aria-label="Projects" striped={striped}>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead sortable sort={sort} onSort={onSort}>
          Amount
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow selected={selected}>
        <TableCell>Onboarding Audit</TableCell>
        <TableCell align="right">$250.00</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

describe('Table', () => {
  it('renders a semantic table with column headers', () => {
    render(<Example />);
    expect(screen.getByRole('table', { name: 'Projects' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    expect(screen.getByRole('cell', { name: 'Onboarding Audit' })).toBeInTheDocument();
  });

  it('exposes sort state with aria-sort and fires onSort', async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(<Example sort="asc" onSort={onSort} />);

    expect(screen.getByRole('columnheader', { name: 'Amount' })).toHaveAttribute('aria-sort', 'ascending');
    await user.click(screen.getByRole('button', { name: 'Amount' }));
    expect(onSort).toHaveBeenCalledTimes(1);
  });

  it('marks a selected row', () => {
    render(<Example selected />);
    expect(screen.getByRole('row', { name: /Onboarding Audit/ })).toHaveAttribute('aria-selected', 'true');
  });

  it('flags striped tables', () => {
    render(<Example striped />);
    expect(screen.getByRole('table')).toHaveAttribute('data-striped');
  });

  it('renders two-line cell content', () => {
    render(<TableCellTwoLines primary="Primary text" secondary="Support text" />);
    expect(screen.getByText('Primary text')).toBeInTheDocument();
    expect(screen.getByText('Support text')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Example />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

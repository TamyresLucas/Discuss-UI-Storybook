import { DotsThree, ShareNetwork, Sliders, Trash } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { expect, userEvent, within } from 'storybook/test';

import { Button } from '../Buttons & Actions/Button';
import { SearchBar } from '../Forms & Data Entry/SearchBar';
import { Checkbox } from '../Forms & Data Entry/Checkbox';
import { TabItem } from '../Navigation/TabItem';
import { TabNavigation, Tabs } from '../Navigation/TabNavigation';
import { RoleTag } from '../Tags & Badges/RoleTag';
import { Tag } from '../Tags & Badges/Tag';
import { Pagination } from '../Utility/Pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './Table';

const projects = [
  { id: 1, name: 'User Onboarding Audit', role: 'Research', status: 'Completed', date: 'Sep 12, 2026', amount: 250 },
  { id: 2, name: 'Checkout Flow Redesign', role: 'Design', status: 'In Progress', date: 'Sep 14, 2026', amount: 1250 },
  { id: 3, name: 'Dashboard Usability Review', role: 'Research', status: 'Delayed', date: 'Sep 20, 2026', amount: 840 },
  { id: 4, name: 'Mobile App Feature Enhancement', role: 'Product', status: 'In Progress', date: 'Sep 24, 2026', amount: 3100 },
];

const statusVariant = { Completed: 'success', 'In Progress': 'neutral', Delayed: 'warning' } as const;

function ProjectsTable() {
  const [filter, setFilter] = React.useState('all');
  const [selected, setSelected] = React.useState<number[]>([]);
  const [sort, setSort] = React.useState<'none' | 'asc' | 'desc'>('none');
  const [page, setPage] = React.useState(1);

  const rows = projects
    .filter((p) => filter === 'all' || p.status.toLowerCase().replace(' ', '-') === filter)
    .sort((a, b) => (sort === 'none' ? 0 : (sort === 'asc' ? 1 : -1) * a.amount - (sort === 'asc' ? 1 : -1) * b.amount));
  const allSelected = rows.length > 0 && rows.every((r) => selected.includes(r.id));

  return (
    <div className="flex w-250 flex-col items-end gap-2">
      <div className="flex w-full items-center justify-between">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabNavigation aria-label="Filter projects">
            <TabItem value="all">All</TabItem>
            <TabItem value="completed">Completed</TabItem>
            <TabItem value="in-progress">In Progress</TabItem>
            <TabItem value="delayed">Delayed</TabItem>
          </TabNavigation>
        </Tabs>
        <div className="flex gap-2">
          <SearchBar aria-label="Search projects" placeholder="Search..." className="w-90" />
          <Button variant="outline" size="icon" aria-label="Filters">
            <Sliders size={16} aria-hidden />
          </Button>
        </div>
      </div>
      <Table aria-label="Projects" striped>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead checkbox>
              <Checkbox
                aria-label="Select all"
                checked={allSelected ? true : selected.length ? 'indeterminate' : false}
                onCheckedChange={(checked) => setSelected(checked ? rows.map((r) => r.id) : [])}
              />
            </TableHead>
            <TableHead>Project Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due</TableHead>
            <TableHead
              align="right"
              sortable
              sort={sort}
              onSort={() => setSort((s) => (s === 'none' ? 'asc' : s === 'asc' ? 'desc' : 'none'))}
            >
              Amount
            </TableHead>
            <TableHead className="w-34">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} selected={selected.includes(row.id)}>
              <TableCell checkbox>
                <Checkbox
                  aria-label={`Select ${row.name}`}
                  checked={selected.includes(row.id)}
                  onCheckedChange={(checked) =>
                    setSelected((s) => (checked ? [...s, row.id] : s.filter((id) => id !== row.id)))
                  }
                />
              </TableCell>
              <TableCell className="max-w-50 truncate">{row.name}</TableCell>
              <TableCell>
                <RoleTag>{row.role}</RoleTag>
              </TableCell>
              <TableCell>
                <Tag variant={statusVariant[row.status as keyof typeof statusVariant]}>{row.status}</Tag>
              </TableCell>
              <TableCell muted>{row.date}</TableCell>
              <TableCell align="right">${row.amount.toFixed(2)}</TableCell>
              <TableCell actions>
                <Button variant="ghost" size="icon-sm" aria-label={`Share ${row.name}`}>
                  <ShareNetwork size={16} aria-hidden />
                </Button>
                <Button variant="destructive" size="icon-sm" aria-label={`Delete ${row.name}`}>
                  <Trash size={16} aria-hidden />
                </Button>
                <Button variant="ghost" size="icon-sm" aria-label={`More actions for ${row.name}`}>
                  <DotsThree size={16} aria-hidden />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination page={page} pageCount={5} onPageChange={setPage} />
    </div>
  );
}

const meta = {
  title: 'Data Display/Table',
  component: Table,
  subcomponents: { TableHeader, TableBody, TableRow, TableHead, TableCell },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Semantic table built from `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead` and `TableCell`, with sorting, selection, striping and a filter / search toolbar. Source: shadcn. Figma: Tables (27).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ProjectsTable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select User Onboarding Audit' }));
    await expect(canvas.getByRole('checkbox', { name: 'Select all' })).toBePartiallyChecked();
    await userEvent.click(canvas.getByRole('tab', { name: 'Delayed' }));
    await expect(canvas.queryByText('User Onboarding Audit')).not.toBeInTheDocument();
  },
};

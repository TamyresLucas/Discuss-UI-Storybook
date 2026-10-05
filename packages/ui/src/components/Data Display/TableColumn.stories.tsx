import { DotsThree, ShareNetwork, Trash, User } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Buttons & Actions/Button';
import { Checkbox } from '../Forms & Data Entry/Checkbox';
import { RadioGroup, RadioGroupItem } from '../Forms & Data Entry/RadioGroup';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../Forms & Data Entry/Select';
import { RoleTag } from '../Tags & Badges/RoleTag';
import { Tag } from '../Tags & Badges/Tag';
import { Table, TableBody, TableCell, TableCellTwoLines, TableHead, TableHeader, TableRow } from './Table';

const Avatar = () => (
  <div className="flex size-10 items-center justify-center rounded-md border border-secondary bg-oat-200 text-secondary-muted-foreground">
    <User size={20} aria-hidden />
  </div>
);

interface Column {
  name: string;
  head: React.ReactNode;
  cell: React.ReactNode;
  headProps?: React.ComponentProps<typeof TableHead>;
  cellProps?: React.ComponentProps<typeof TableCell>;
}

const columns: Column[] = [
  { name: 'Text', head: 'Header', cell: 'Cell value' },
  { name: 'Text (right)', head: 'Amount', cell: '$250.00', headProps: { align: 'right' }, cellProps: { align: 'right' } },
  { name: 'Muted', head: 'Header', cell: 'Secondary', cellProps: { muted: true } },
  { name: 'Sortable', head: 'Status', cell: 'Cell value', headProps: { sortable: true } },
  {
    name: 'Checkbox',
    head: <Checkbox aria-label="Select all" />,
    cell: <Checkbox aria-label="Select row" />,
    headProps: { checkbox: true },
    cellProps: { checkbox: true },
  },
  { name: 'Role Tag', head: 'Role', cell: <RoleTag>Role</RoleTag> },
  { name: 'Status Tag', head: 'Status', cell: <Tag variant="success">Active</Tag> },
  {
    name: 'Two Lines',
    head: 'Name',
    cell: <TableCellTwoLines primary="Primary text" secondary="Support text" />,
    cellProps: { className: 'h-14' },
  },
  {
    name: 'Two Lines Avatar',
    head: 'Name',
    cell: <TableCellTwoLines avatar={<Avatar />} primary="Primary text" secondary="Support text" />,
    cellProps: { className: 'h-14' },
  },
  {
    name: 'Option',
    head: 'Option',
    cell: <TableCellTwoLines primary="Option label" secondary="Sep 17, 2026 · 3:00 PM" />,
    cellProps: { className: 'h-14' },
  },
  {
    name: 'Actions',
    head: <span className="sr-only">Actions</span>,
    cell: (
      <>
        <Button variant="ghost" size="icon-sm" aria-label="Share">
          <ShareNetwork size={16} aria-hidden />
        </Button>
        <Button variant="destructive" size="icon-sm" aria-label="Delete">
          <Trash size={16} aria-hidden />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="More actions">
          <DotsThree size={16} aria-hidden />
        </Button>
      </>
    ),
    cellProps: { actions: true },
  },
  {
    name: 'Select',
    head: 'Assignee',
    cell: (
      <Select>
        <SelectTrigger aria-label="Assignee" className="h-8 rounded-sm px-2 py-1.5 text-body-small">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Tamyres</SelectItem>
          <SelectItem value="b">Murilo</SelectItem>
        </SelectContent>
      </Select>
    ),
    cellProps: { className: 'h-12 py-1' },
  },
  {
    name: 'Radio Button',
    head: 'Primary',
    cell: (
      <RadioGroup aria-label="Primary row">
        <RadioGroupItem value="a" aria-label="Make primary" />
      </RadioGroup>
    ),
    headProps: { checkbox: true },
    cellProps: { checkbox: true },
  },
];

function ColumnExample({ column }: { column: Column }) {
  return (
    <Table aria-label={column.name} className="w-50" striped>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead {...column.headProps}>{column.head}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[0, 1, 2].map((row) => (
          <TableRow key={row}>
            <TableCell {...column.cellProps}>{column.cell}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function Columns() {
  return (
    <div className="flex max-w-300 flex-wrap items-start gap-4">
      {columns.map((column) => (
        <div key={column.name} className="flex flex-col gap-2">
          <span className="text-ui-caption text-secondary-muted-foreground">{column.name}</span>
          <ColumnExample column={column} />
        </div>
      ))}
    </div>
  );
}

const meta = {
  title: 'Data Display/Table Column',
  component: Columns,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The cell types a table column can hold: text, muted, sortable, checkbox, role / status tags, two-line (with avatar), option, actions, select and radio. Source: shadcn. Figma: Table column.',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
} satisfies Meta<typeof Columns>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllColumnTypes: Story = {};

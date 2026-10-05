import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Checkbox } from '../Forms & Data Entry/Checkbox';
import { Table, TableHead, TableHeader, TableRow } from './Table';

interface HeaderRowProps {
  checkbox?: boolean;
  sortable?: boolean;
  /** Sort direction of the "Status" column. */
  sort?: 'none' | 'asc' | 'desc';
  onSort?: () => void;
}

function HeaderRow({ checkbox, sortable, sort = 'none', onSort }: HeaderRowProps) {
  return (
    <Table aria-label="Header row example" className="w-240">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {checkbox && (
            <TableHead checkbox>
              <Checkbox aria-label="Select all" />
            </TableHead>
          )}
          <TableHead>Header</TableHead>
          <TableHead sortable={sortable} sort={sort} onSort={onSort}>
            Status
          </TableHead>
          <TableHead sortable={sortable} onSort={onSort}>
            Status
          </TableHead>
          <TableHead align="right">Amount</TableHead>
        </TableRow>
      </TableHeader>
    </Table>
  );
}

const meta = {
  title: 'Data Display/Table Header Row',
  component: HeaderRow,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Header row of a table: plain, with a select-all checkbox, and sortable columns with `aria-sort`. Source: shadcn. Figma: Table Header Row (28).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
  argTypes: { sort: { control: 'inline-radio', options: ['none', 'asc', 'desc'] } },
  args: { onSort: fn() },
} satisfies Meta<typeof HeaderRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithCheckbox: Story = { args: { checkbox: true } };
export const Sortable: Story = {
  args: { sortable: true },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getAllByRole('button', { name: 'Status' })[0]!);
    await expect(args.onSort).toHaveBeenCalledTimes(1);
  },
};
export const SortableWithCheckbox: Story = { args: { checkbox: true, sortable: true, sort: 'asc' } };

import { DotsThree, ShareNetwork, Trash } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Buttons & Actions/Button';
import { Checkbox } from '../Forms & Data Entry/Checkbox';
import { Table, TableBody, TableCell, TableRow, type TableRowProps } from './Table';

interface RowExampleProps extends Pick<TableRowProps, 'selected' | 'className'> {
  withCheckbox?: boolean;
  striped?: boolean;
}

function RowExample({ withCheckbox, striped, selected, className }: RowExampleProps) {
  return (
    <Table aria-label="Row example" className="w-240" striped={striped}>
      <TableBody>
        {/* Striping targets even rows, so a throwaway first row keeps the example row striped. */}
        {striped && <TableRow aria-hidden="true" className="h-0 border-0" />}
        <TableRow selected={selected} className={className}>
          {withCheckbox && (
            <TableCell checkbox>
              <Checkbox aria-label="Select row" defaultChecked={selected} />
            </TableCell>
          )}
          <TableCell>Cell value</TableCell>
          <TableCell>Cell value</TableCell>
          <TableCell muted>Secondary</TableCell>
          <TableCell align="right">$250.00</TableCell>
          <TableCell actions>
            <Button variant="ghost" size="icon-sm" aria-label="Share">
              <ShareNetwork size={16} aria-hidden />
            </Button>
            <Button variant="destructive" size="icon-sm" aria-label="Delete">
              <Trash size={16} aria-hidden />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="More actions">
              <DotsThree size={16} aria-hidden />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

const meta = {
  title: 'Data Display/Table Row',
  component: RowExample,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A table row with default, hover (`accent-soft`), selected (accent left edge) and striped states. Source: shadcn. Figma: Table Row (29).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
} satisfies Meta<typeof RowExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hover: Story = { args: { className: 'bg-accent-soft' } };
export const Selected: Story = { args: { selected: true } };
export const WithCheckbox: Story = { args: { withCheckbox: true } };
export const WithCheckboxSelected: Story = { args: { withCheckbox: true, selected: true } };
export const Striped: Story = { args: { striped: true, withCheckbox: true } };

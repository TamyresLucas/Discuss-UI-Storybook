import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { expect, userEvent, within } from 'storybook/test';

import { Pagination } from './Pagination';

function Controlled(props: Partial<React.ComponentProps<typeof Pagination>>) {
  const [page, setPage] = React.useState(1);
  return <Pagination page={page} pageCount={5} onPageChange={setPage} {...props} />;
}

const meta = {
  title: 'Utility/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Page navigation for table data exceeding the visible rows. `full` lists page numbers with ellipses; `compact` shows `1/5`. Source: shadcn. Figma: Pagination (71).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
  argTypes: { variant: { control: 'inline-radio', options: ['full', 'compact'] } },
  args: { page: 1, pageCount: 5, onPageChange: () => {} },
  render: (args) => <Controlled variant={args.variant} pageCount={args.pageCount} />,
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Full: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }));
    await expect(canvas.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  },
};
export const Compact: Story = { args: { variant: 'compact' } };
export const ManyPages: Story = { args: { pageCount: 20 } };

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { EditableTag } from './EditableTag';

const meta = {
  title: 'Tags & Badges/Removable Tag (Chip)',
  component: EditableTag,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Compact chip for removable / addable values (Feedlot Operator ×, + Recommendation, +3 more). Source: Custom. Figma: Editable tags (41).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  argTypes: { type: { control: 'select', options: ['default', 'editable', 'add', 'multiple'] } },
  args: { children: 'Label', onRemove: fn(), onClick: fn() },
} satisfies Meta<typeof EditableTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { type: 'default', onRemove: undefined } };
export const Editable: Story = {
  args: { type: 'editable', children: 'Feedlot Operator' },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Remove Feedlot Operator' }));
    await expect(args.onRemove).toHaveBeenCalledTimes(1);
  },
};
export const Add: Story = { args: { type: 'add', children: 'Recommendation' } };
export const Multiple: Story = { args: { type: 'multiple', children: '+3 more' } };

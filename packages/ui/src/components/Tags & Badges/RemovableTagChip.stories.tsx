import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Tags & Badges/Removable Tag (Chip)',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Tag with × dismiss (Feedlot Operator ×). Source: Custom. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-custom'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="Removable Tag / Chip" />,
};

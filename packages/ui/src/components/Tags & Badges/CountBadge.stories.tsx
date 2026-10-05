import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Tags & Badges/Count Badge',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Pill showing a count (3 sessions). Source: Custom. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-custom'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="Count Badge" />,
};

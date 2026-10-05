import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Research-Specific/Activity Card',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Activity with type badge, description, overflow menu. Source: Custom. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-custom'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="Activity Card" />,
};

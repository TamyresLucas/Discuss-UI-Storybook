import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Tags & Badges/Tag (Status Badge)',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Status labels (Live Interview, Self-paced, AI Interview). Source: Custom. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-custom'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="Tag / Status Badge" />,
};

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Tags & Badges/ID Badge',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Inline badge showing an ID (ID 721347). Source: Custom. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-custom'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="ID Badge" />,
};

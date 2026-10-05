import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Identity & People/Avatar Group',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Overlapping row of avatars (Project Members). Source: Custom. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-custom'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="Avatar Group" />,
};

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Conversation & AI Chat/Timestamp',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Inline relative time text (5 minutes ago). Source: Custom. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-custom'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="Timestamp" />,
};

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Conversation & AI Chat/User Message Bubble',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Colored chat bubble for user messages. Source: Custom. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-custom'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="User Message Bubble" />,
};

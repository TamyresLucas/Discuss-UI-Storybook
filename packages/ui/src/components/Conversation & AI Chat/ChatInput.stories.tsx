import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Conversation & AI Chat/Chat Input',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Text input with + button, New project action, send. Source: Custom. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-custom'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="Chat Input" />,
};

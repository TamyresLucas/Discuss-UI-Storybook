import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Conversation & AI Chat/AI Mini Avatar',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Small AI assistant icon alongside responses. Source: Custom. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-custom'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="AI Mini Avatar" />,
};

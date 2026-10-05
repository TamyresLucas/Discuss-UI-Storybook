import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Conversation & AI Chat/AI Response Container',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Response block with text, embedded cards, action bar. Source: Custom. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-custom'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="AI Response Container" />,
};

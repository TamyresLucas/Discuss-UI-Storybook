import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Utility/Context Menu',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Right-click menus on table rows, file items, cards. Source: shadcn. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-shadcn'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="Context Menu" />,
};

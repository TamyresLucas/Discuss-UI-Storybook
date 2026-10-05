import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Navigation/Sidebar Nav Item',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Row with icon + label + optional chevron/expand. Source: Custom. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-custom'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="Sidebar Nav Item" />,
};

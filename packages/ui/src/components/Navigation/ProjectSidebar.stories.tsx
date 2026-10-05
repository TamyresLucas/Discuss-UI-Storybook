import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Navigation/Project Sidebar',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Collapsible sidebar with header, section labels, nav items. Source: Custom. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-custom'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="Project Sidebar" />,
};

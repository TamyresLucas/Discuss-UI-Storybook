import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Navigation/Org Rail (App Sidebar)',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Vertical icon-based nav with monogram, icons, labels, avatar. Source: Custom. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-custom'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="Org Rail / App Sidebar" />,
};

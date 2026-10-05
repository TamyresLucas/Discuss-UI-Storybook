import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Utility/More Menu (…)',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Three-dot overflow menu trigger. Source: Custom. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-custom'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="More Menu (…)" />,
};
